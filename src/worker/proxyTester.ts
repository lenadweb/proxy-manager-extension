import { isProxyLocked } from 'src/shared/proxyControl';
import {
    failedTest,
    isTestProxyMessage,
    ProxyTestFailure,
    ProxyTestResult,
} from 'src/shared/proxyTest';
import { ProxyControl, ProxyErrorCode, ProxyProfile } from 'src/shared/types';
import { ConnectionStatus } from 'src/shared/connection';
import { applyProxy } from './applyProxy';
import { UnsupportedRoutingError } from './bypass';
import {
    beginProbe,
    invalidateConnection,
    markConnectionError,
    publishConnection,
} from './connectionState';
import { buildTestPacScript } from './pacScript';
import { checkAnyEndpoint } from './probe';
import { runExclusive } from './taskQueue';
import { TEST_HOSTS } from './testEndpoints';
import {
    desiredRouting,
    recoverInterruptedTest,
    rememberTest,
} from './testRecovery';
import {
    endTestSession,
    recordTestError,
    startTestSession,
} from './testSession';

let testPending = false;

export const testProxy = async (
    proxy: ProxyProfile
): Promise<ProxyTestResult> => {
    if (testPending) return failedTest(ProxyTestFailure.Busy);
    testPending = true;
    try {
        return await runExclusive(async () => {
            const original = await chrome.proxy.settings.get({
                incognito: false,
            });
            if (isProxyLocked(original.levelOfControl as ProxyControl)) {
                return failedTest(ProxyTestFailure.SettingsLocked);
            }
            let temporary: chrome.proxy.ProxyConfig;
            try {
                temporary = {
                    mode: 'pac_script',
                    pacScript: {
                        mandatory: true,
                        data: buildTestPacScript(
                            proxy,
                            original.value,
                            TEST_HOSTS
                        ),
                    },
                };
            } catch (error) {
                if (error instanceof UnsupportedRoutingError) {
                    return failedTest(ProxyTestFailure.UnsupportedRouting);
                }
                throw error;
            }

            invalidateConnection();
            await publishConnection({ status: ConnectionStatus.Connecting });
            const controller = beginProbe();
            const desired = await desiredRouting();
            // Persist before modifying routing, so a killed MV3 worker or browser
            // restart cannot strand the browser on a diagnostic PAC script.
            await rememberTest({
                original: original.value,
                owned:
                    original.levelOfControl ===
                    ProxyControl.ControlledByThisExtension,
                temporary,
            });
            startTestSession(proxy);
            const runDiagnostic = async (): Promise<ProxyTestResult> => {
                await chrome.proxy.settings.set({
                    value: temporary,
                    scope: 'regular',
                });
                const applied = await chrome.proxy.settings.get({
                    incognito: false,
                });
                if (
                    applied.levelOfControl !==
                        ProxyControl.ControlledByThisExtension ||
                    applied.value.pacScript?.data !== temporary.pacScript?.data
                ) {
                    return failedTest(ProxyTestFailure.SettingsLocked);
                }
                const result = await checkAnyEndpoint(controller.signal);
                const final = await chrome.proxy.settings.get({
                    incognito: false,
                });
                if (
                    controller.signal.aborted ||
                    (await desiredRouting()) !== desired
                ) {
                    return failedTest(ProxyTestFailure.Cancelled);
                }
                if (
                    final.levelOfControl !==
                        ProxyControl.ControlledByThisExtension ||
                    final.value.pacScript?.data !== temporary.pacScript?.data
                ) {
                    return failedTest(ProxyTestFailure.SettingsLocked);
                }
                return result;
            };
            return runDiagnostic().finally(async () => {
                controller.abort();
                try {
                    await recoverInterruptedTest();
                } catch (error) {
                    await markConnectionError(ProxyErrorCode.ApplyFailed);
                    // A failed restore overrides a passed diagnostic. Keep the
                    // recovery journal so startup can retry it.
                    throw error;
                } finally {
                    endTestSession();
                }
                // Desired state may have changed while the test was in flight.
                await applyProxy(true);
            });
        });
    } finally {
        testPending = false;
    }
};

export const registerProxyTester = (): void => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (sender.id !== chrome.runtime.id || !isTestProxyMessage(message))
            return false;
        testProxy(message.proxy)
            .then(sendResponse)
            .catch((error) => {
                console.error('Proxy test failed', error);
                sendResponse(failedTest(ProxyTestFailure.Network));
            });
        return true;
    });
    chrome.webRequest.onErrorOccurred.addListener(
        ({ error, url, initiator }) => {
            if (
                initiator === chrome.runtime.getURL('').replace(/\/$/, '') &&
                new URL(url).searchParams.has('pm_probe') &&
                error !== 'net::ERR_ABORTED'
            )
                recordTestError(error);
        },
        { urls: TEST_HOSTS.map((host) => `https://${host}/*`) }
    );
};
