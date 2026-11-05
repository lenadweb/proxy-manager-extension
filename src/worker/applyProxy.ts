import { onActionIconsChange } from 'src/shared/actionIcons';
import {
    ConnectionStatus,
    getRoutingFingerprint,
    getRoutingSignature,
    isConnectionFresh,
    loadConnection,
} from 'src/shared/connection';
import { getAppliedProxy, matchesProxyConfig } from 'src/shared/proxy';
import { isProxyLocked } from 'src/shared/proxyControl';
import { MessageType, ProxyTestStatus } from 'src/shared/proxyTest';
import { buildProxyConfig } from 'src/shared/proxy';
import { loadState, onStateChange, saveState } from 'src/shared/storage';
import { ProxyControl, ProxyErrorCode, ProxyState } from 'src/shared/types';
import { updateActionIcon } from './actionIcon';
import { mayBypassProbe } from './bypass';
import {
    beginProbe,
    getRevision,
    invalidateConnection,
    publishConnection,
} from './connectionState';
import { checkAnyEndpoint } from './probe';
import { recoverInterruptedTest } from './testRecovery';
import { getTestSession } from './testSession';
import { TEST_ENDPOINTS } from './testEndpoints';
import { runExclusive } from './taskQueue';

const HEALTH_ALARM = 'proxy-health';
const KEYS_AFFECTING_PROXY: (keyof ProxyState)[] = [
    'proxies',
    'activeId',
    'isEnabled',
];

// Call inside runExclusive. All config writes and diagnostic sessions share it.
export const applyProxy = async (forceCheck = false): Promise<void> => {
    const revision = getRevision();
    const state = await loadState();
    const proxy = getAppliedProxy(state);
    const settings = await chrome.proxy.settings.get({ incognito: false });
    const control = settings.levelOfControl as ProxyControl;
    if (!proxy) {
        // Clear our own stored preference even if currently masked by another
        // extension; it must not unexpectedly reactivate when that one stops.
        await chrome.proxy.settings.clear({ scope: 'regular' });
        await saveState({ lastError: null });
        await publishConnection(
            { status: ConnectionStatus.Disconnected, control },
            revision
        );
        return;
    }

    const fingerprint = await getRoutingFingerprint(proxy);
    const base = { proxyId: proxy.id, fingerprint, control };
    if (isProxyLocked(control)) {
        await publishConnection(
            {
                ...base,
                status: ConnectionStatus.Conflict,
                error: ProxyErrorCode.SettingsLocked,
            },
            revision
        );
        return;
    }

    const previous = await loadConnection();
    if (previous.fingerprint !== fingerprint)
        await saveState({ lastError: null });
    const alreadyApplied =
        control === ProxyControl.ControlledByThisExtension &&
        matchesProxyConfig(settings.value, proxy);
    if (
        !forceCheck &&
        alreadyApplied &&
        previous.status === ConnectionStatus.Connected &&
        previous.fingerprint === fingerprint &&
        isConnectionFresh(previous)
    ) {
        await updateActionIcon(proxy, previous.status);
        return;
    }

    // Never advertise ON on the strength of settings.set() alone.
    if (
        previous.status !== ConnectionStatus.Connected ||
        previous.fingerprint !== fingerprint ||
        !alreadyApplied ||
        !isConnectionFresh(previous)
    ) {
        await publishConnection(
            { ...base, status: ConnectionStatus.Connecting },
            revision
        );
    }
    if (revision !== getRevision()) return;
    if (!alreadyApplied) {
        await chrome.proxy.settings.set({
            value: buildProxyConfig(proxy),
            scope: 'regular',
        });
    }
    const applied = await chrome.proxy.settings.get({ incognito: false });
    if (
        applied.levelOfControl !== ProxyControl.ControlledByThisExtension ||
        !matchesProxyConfig(applied.value, proxy)
    ) {
        await publishConnection(
            {
                ...base,
                status: ConnectionStatus.Conflict,
                error: ProxyErrorCode.SettingsLocked,
            },
            revision
        );
        return;
    }

    const endpoints = TEST_ENDPOINTS.filter(
        ({ host }) => !mayBypassProbe(host, proxy.bypassList)
    );
    const controller = beginProbe();
    const result = endpoints.length
        ? await checkAnyEndpoint(controller.signal, endpoints)
        : null;
    const current = getAppliedProxy(await loadState());
    if (
        revision !== getRevision() ||
        controller.signal.aborted ||
        getRoutingSignature(current) !== getRoutingSignature(proxy)
    ) {
        return;
    }
    const finalSettings = await chrome.proxy.settings.get({ incognito: false });
    if (
        finalSettings.levelOfControl !==
            ProxyControl.ControlledByThisExtension ||
        !matchesProxyConfig(finalSettings.value, proxy)
    ) {
        await publishConnection(
            {
                ...base,
                status: ConnectionStatus.Conflict,
                error: ProxyErrorCode.SettingsLocked,
            },
            revision
        );
        return;
    }

    const passed = result?.status === ProxyTestStatus.Passed;
    const error = passed
        ? null
        : !endpoints.length
          ? ProxyErrorCode.NoProbeRoute
          : result?.errorCode || ProxyErrorCode.VerificationFailed;
    await saveState({ lastError: error });
    await publishConnection(
        {
            ...base,
            control: ProxyControl.ControlledByThisExtension,
            status: passed
                ? ConnectionStatus.Connected
                : ConnectionStatus.Error,
            checkedAt: Date.now(),
            ip: passed ? result.ip : null,
            latencyMs: passed ? result.latencyMs : null,
            error,
        },
        revision
    );
};

let syncPending = false;
let forcePending = false;
export const scheduleProxySync = (forceCheck = false): void => {
    forcePending ||= forceCheck;
    if (syncPending) return;
    syncPending = true;
    runExclusive(async () => {
        syncPending = false;
        const force = forcePending;
        forcePending = false;
        try {
            await applyProxy(force);
        } catch (error) {
            console.error('Proxy synchronization failed', error);
            await saveState({ lastError: ProxyErrorCode.ApplyFailed });
            await publishConnection({
                status: ConnectionStatus.Error,
                error: ProxyErrorCode.ApplyFailed,
            });
        }
    }).catch(console.error);
};

export const registerProxySync = (): void => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (
            sender.id !== chrome.runtime.id ||
            message?.type !== MessageType.CheckConnection
        )
            return false;
        scheduleProxySync(message.force === true);
        sendResponse({ queued: true });
        return false;
    });
    onStateChange((keys) => {
        if (!keys.some((key) => KEYS_AFFECTING_PROXY.includes(key))) return;
        invalidateConnection();
        scheduleProxySync();
    });
    onActionIconsChange(() => {
        runExclusive(async () => {
            const state = await loadState();
            const connection = await loadConnection();
            await updateActionIcon(getAppliedProxy(state), connection.status);
        }).catch(console.error);
    });

    chrome.proxy.settings.onChange.addListener((details) => {
        if (details.incognitoSpecific) return;
        if (getTestSession()) {
            if (isProxyLocked(details.levelOfControl as ProxyControl)) {
                invalidateConnection();
                publishConnection({
                    status: ConnectionStatus.Conflict,
                    error: ProxyErrorCode.SettingsLocked,
                }).catch(console.error);
            }
            return;
        }
        // Re-read after queued writes settle. Our own onChange is expected and
        // must not cancel its health check or start an endless set/get loop.
        loadState()
            .then(async (state) => {
                const proxy = getAppliedProxy(state);
                if (!proxy) return;
                if (
                    details.levelOfControl ===
                        ProxyControl.ControlledByThisExtension &&
                    matchesProxyConfig(details.value, proxy)
                ) {
                    // Releasing a competing extension reveals our existing
                    // preference without another write. Re-verify it anyway.
                    if (
                        (await loadConnection()).status ===
                        ConnectionStatus.Conflict
                    )
                        scheduleProxySync(true);
                    return;
                }
                invalidateConnection();
                await publishConnection({
                    status: ConnectionStatus.Conflict,
                    error: ProxyErrorCode.SettingsLocked,
                });
                scheduleProxySync();
            })
            .catch(console.error);
    });

    chrome.alarms.onAlarm.addListener(({ name }) => {
        if (name === HEALTH_ALARM) scheduleProxySync(true);
    });
    const initialize = async () => {
        if (!(await chrome.alarms.get(HEALTH_ALARM))) {
            await chrome.alarms.create(HEALTH_ALARM, { periodInMinutes: 1 });
        }
        await runExclusive(recoverInterruptedTest);
        scheduleProxySync(true);
    };
    chrome.runtime.onStartup.addListener(() =>
        initialize().catch(console.error)
    );
    chrome.runtime.onInstalled.addListener(() =>
        initialize().catch(console.error)
    );
    // MV3 workers can restart independently of browser startup/install events.
    initialize().catch(console.error);
};
