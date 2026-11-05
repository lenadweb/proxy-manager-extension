import { ProxyProfile } from 'src/shared/types';
import { isValidProfile } from './validation';

export enum ProxyTestStatus {
    Passed = 'passed',
    Failed = 'failed',
}

export enum ProxyTestFailure {
    Timeout = 'timeout',
    AuthRejected = 'auth_rejected',
    SettingsLocked = 'settings_locked',
    Network = 'network',
    Busy = 'busy',
    Cancelled = 'cancelled',
    UnsupportedRouting = 'unsupported_routing',
}

export type PassedProxyTest = {
    status: ProxyTestStatus.Passed;
    ip: string;
    country: string | null;
    latencyMs: number;
};

export type FailedProxyTest = {
    status: ProxyTestStatus.Failed;
    failure: ProxyTestFailure;
    errorCode: string | null;
};

export type ProxyTestResult = PassedProxyTest | FailedProxyTest;

export enum MessageType {
    TestProxy = 'test-proxy',
    CheckConnection = 'check-connection',
    ListProxyExtensions = 'list-proxy-extensions',
    TakeProxyControl = 'take-proxy-control',
}

export type TestProxyMessage = {
    type: MessageType.TestProxy;
    proxy: ProxyProfile;
};

export const failedTest = (
    failure: ProxyTestFailure,
    errorCode: string | null = null
): FailedProxyTest => ({
    status: ProxyTestStatus.Failed,
    failure,
    errorCode,
});

export const isTestProxyMessage = (
    message: unknown
): message is TestProxyMessage =>
    typeof message === 'object' &&
    message !== null &&
    'type' in message &&
    message.type === MessageType.TestProxy &&
    'proxy' in message &&
    isValidProfile(message.proxy);

export const requestProxyTest = async (
    proxy: ProxyProfile
): Promise<ProxyTestResult> => {
    const message: TestProxyMessage = { type: MessageType.TestProxy, proxy };

    try {
        const result = await chrome.runtime.sendMessage<
            TestProxyMessage,
            ProxyTestResult
        >(message);
        return result?.status === ProxyTestStatus.Passed ||
            result?.status === ProxyTestStatus.Failed
            ? result
            : failedTest(ProxyTestFailure.Network);
    } catch {
        return failedTest(ProxyTestFailure.Network);
    }
};
