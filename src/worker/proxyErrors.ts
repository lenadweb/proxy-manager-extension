import { loadState, saveState } from 'src/shared/storage';
import { ProxyErrorCode } from 'src/shared/types';
import { getTestSession, recordTestError } from './testSession';

const ERROR_THROTTLE_MS = 2000;

let lastReportedAt = 0;

const reportError = async (error: string): Promise<void> => {
    const state = await loadState();
    const isAlreadyReported = state.lastError === error;
    const isExplainedByAuth = state.lastError === ProxyErrorCode.AuthFailed;

    if (state.isEnabled && !isAlreadyReported && !isExplainedByAuth) {
        await saveState({ lastError: error });
    }
};

export const registerProxyErrorListener = (): void => {
    chrome.proxy.onProxyError.addListener(({ error }) => {
        if (getTestSession()) {
            recordTestError(error);
            return;
        }

        const now = Date.now();
        if (now - lastReportedAt < ERROR_THROTTLE_MS) return;

        lastReportedAt = now;
        reportError(error).catch(console.error);
    });
};
