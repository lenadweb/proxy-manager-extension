import { getAppliedProxy, matchesProxyConfig } from 'src/shared/proxy';
import { loadState, saveState } from 'src/shared/storage';
import { ProxyControl, ProxyErrorCode } from 'src/shared/types';
import { ConnectionStatus, loadConnection } from 'src/shared/connection';
import { scheduleProxySync } from './applyProxy';
import { markConnectionError } from './connectionState';
import { getTestSession, recordTestError } from './testSession';

export const reportProxyError = async (error: string): Promise<void> => {
    const state = await loadState();
    const proxy = getAppliedProxy(state);
    if (!proxy) return;
    const settings = await chrome.proxy.settings.get({ incognito: false });
    if (
        settings.levelOfControl !== ProxyControl.ControlledByThisExtension ||
        !matchesProxyConfig(settings.value, proxy)
    )
        return;
    const reported =
        state.lastError === ProxyErrorCode.AuthFailed
            ? ProxyErrorCode.AuthFailed
            : error;
    if (
        state.lastError === reported &&
        (await loadConnection()).status === ConnectionStatus.Error
    )
        return;
    await saveState({ lastError: reported });
    await markConnectionError(reported);
};

export const registerProxyErrorListener = (): void => {
    let lastTunnelCheck = 0;
    chrome.proxy.onProxyError.addListener(({ error }) => {
        if (getTestSession()) {
            recordTestError(error);
            return;
        }
        reportProxyError(error).catch(console.error);
    });
    // onProxyError alone misses ordinary proxy connection/CONNECT failures.
    // Destination-specific failures/timeouts must not mark the entire proxy down.
    chrome.webRequest.onErrorOccurred.addListener(
        ({ error, url }) => {
            if (getTestSession() || url.includes('pm_probe=')) return;
            if (
                /^net::ERR_(?:PROXY_|SOCKS_|NO_SUPPORTED_PROXIES)/.test(error)
            ) {
                reportProxyError(error).catch(console.error);
            } else if (
                error === 'net::ERR_TUNNEL_CONNECTION_FAILED' &&
                Date.now() - lastTunnelCheck > 5_000
            ) {
                lastTunnelCheck = Date.now();
                scheduleProxySync(true);
            }
        },
        { urls: ['<all_urls>'] }
    );
};
