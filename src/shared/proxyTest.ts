import { ProxyProfile } from 'src/shared/types';

export enum ProxyTestStatus {
    Passed = 'passed',
    Failed = 'failed',
}

export enum ProxyTestFailure {
    Timeout = 'timeout',
    AuthRejected = 'auth_rejected',
    SettingsLocked = 'settings_locked',
    Network = 'network',
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
    message.type === MessageType.TestProxy;

export const requestProxyTest = async (
    proxy: ProxyProfile
): Promise<ProxyTestResult> => {
    const message: TestProxyMessage = { type: MessageType.TestProxy, proxy };

    try {
        return await chrome.runtime.sendMessage<
            TestProxyMessage,
            ProxyTestResult
        >(message);
    } catch {
        return failedTest(ProxyTestFailure.Network);
    }
};
