import { getAppliedProxy } from 'src/shared/proxy';
import { isProxyLocked, readProxyControl } from 'src/shared/proxyControl';
import {
    failedTest,
    isTestProxyMessage,
    PassedProxyTest,
    ProxyTestFailure,
    ProxyTestResult,
    ProxyTestStatus,
} from 'src/shared/proxyTest';
import { loadState } from 'src/shared/storage';
import { ProxyProfile } from 'src/shared/types';
import { applyProxy } from './applyProxy';
import { buildTestPacScript } from './pacScript';
import { runExclusive } from './taskQueue';
import { TEST_ENDPOINTS, TEST_HOSTS, TestEndpoint } from './testEndpoints';
import {
    endTestSession,
    getTestSession,
    recordTestError,
    startTestSession,
} from './testSession';

const TEST_TIMEOUT_MS = 10_000;

const toFailure = (isTimedOut: boolean): ProxyTestResult => {
    const session = getTestSession();

    if (session?.isAuthRejected) {
        return failedTest(ProxyTestFailure.AuthRejected);
    }
    if (isTimedOut) return failedTest(ProxyTestFailure.Timeout);
    return failedTest(ProxyTestFailure.Network, session?.errorCode ?? null);
};

const checkEndpoint = async (
    { host, path, parse }: TestEndpoint,
    signal: AbortSignal
): Promise<PassedProxyTest> => {
    const startedAt = performance.now();
    const separator = path.includes('?') ? '&' : '?';
    const response = await fetch(
        `https://${host}${path}${separator}t=${Date.now()}`,
        { cache: 'no-store', credentials: 'omit', signal }
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const exitInfo = parse(await response.text());
    if (!exitInfo) throw new Error(`Unexpected response from ${host}`);

    return {
        status: ProxyTestStatus.Passed,
        ...exitInfo,
        latencyMs: Math.round(performance.now() - startedAt),
    };
};

const checkAnyEndpoint = async (): Promise<ProxyTestResult> => {
    const controller = new AbortController();
    let isTimedOut = false;
    const timeout = setTimeout(() => {
        isTimedOut = true;
        controller.abort();
    }, TEST_TIMEOUT_MS);

    try {
        return await Promise.any(
            TEST_ENDPOINTS.map((endpoint) =>
                checkEndpoint(endpoint, controller.signal)
            )
        );
    } catch {
        return toFailure(isTimedOut);
    } finally {
        clearTimeout(timeout);
        controller.abort();
    }
};

const routeTestTrafficThrough = async (proxy: ProxyProfile): Promise<void> => {
    const fallback = getAppliedProxy(await loadState());

    await chrome.proxy.settings.set({
        value: {
            mode: 'pac_script',
            pacScript: {
                data: buildTestPacScript(proxy, fallback, TEST_HOSTS),
            },
        },
        scope: 'regular',
    });
};

const testProxy = (proxy: ProxyProfile): Promise<ProxyTestResult> =>
    runExclusive(async () => {
        if (isProxyLocked(await readProxyControl())) {
            return failedTest(ProxyTestFailure.SettingsLocked);
        }

        startTestSession(proxy);
        try {
            await routeTestTrafficThrough(proxy);
            return await checkAnyEndpoint();
        } finally {
            endTestSession();
            await applyProxy();
        }
    });

export const registerProxyTester = (): void => {
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
        if (!isTestProxyMessage(message)) return false;

        testProxy(message.proxy)
            .then(sendResponse)
            .catch((error) => {
                console.error(error);
                sendResponse(failedTest(ProxyTestFailure.Network));
            });
        return true;
    });

    chrome.webRequest.onErrorOccurred.addListener(
        ({ error }) => recordTestError(error),
        { urls: TEST_HOSTS.map((host) => `https://${host}/*`) }
    );
};
