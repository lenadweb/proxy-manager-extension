import {
    failedTest,
    PassedProxyTest,
    ProxyTestFailure,
    ProxyTestResult,
    ProxyTestStatus,
} from 'src/shared/proxyTest';
import { TestEndpoint, TEST_ENDPOINTS } from './testEndpoints';
import { getTestSession } from './testSession';

const TEST_TIMEOUT_MS = 10_000;

const checkEndpoint = async (
    { host, path, parse }: TestEndpoint,
    signal: AbortSignal
): Promise<PassedProxyTest> => {
    const startedAt = performance.now();
    const separator = path.includes('?') ? '&' : '?';
    const response = await fetch(
        `https://${host}${path}${separator}pm_probe=${crypto.randomUUID()}`,
        {
            cache: 'no-store',
            credentials: 'omit',
            redirect: 'error',
            signal,
        }
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const exitInfo = parse(await response.text());
    if (!exitInfo) throw new Error('Invalid exit-IP response');
    return {
        status: ProxyTestStatus.Passed,
        ...exitInfo,
        latencyMs: Math.round(performance.now() - startedAt),
    };
};

export const checkAnyEndpoint = async (
    signal?: AbortSignal,
    endpoints = TEST_ENDPOINTS
): Promise<ProxyTestResult> => {
    const controller = new AbortController();
    const cancel = () => controller.abort();
    signal?.addEventListener('abort', cancel, { once: true });
    if (signal?.aborted) controller.abort();
    let timedOut = false;
    const timeout = setTimeout(() => {
        timedOut = true;
        controller.abort();
    }, TEST_TIMEOUT_MS);

    try {
        return await Promise.any(
            endpoints.map((endpoint) =>
                checkEndpoint(endpoint, controller.signal)
            )
        );
    } catch {
        const session = getTestSession();
        return failedTest(
            session?.isAuthRejected
                ? ProxyTestFailure.AuthRejected
                : timedOut
                  ? ProxyTestFailure.Timeout
                  : ProxyTestFailure.Network,
            session?.errorCode ?? null
        );
    } finally {
        clearTimeout(timeout);
        signal?.removeEventListener('abort', cancel);
        controller.abort();
    }
};
