import { I18nKey, t } from 'src/shared/i18n';
import { FailedProxyTest, ProxyTestFailure } from 'src/shared/proxyTest';
import { ProxyErrorCode } from 'src/shared/types';

export type ErrorText = {
    message: string;
    detail: string | null;
};

const NET_ERROR_MESSAGES: Record<string, I18nKey> = {
    'net::ERR_TUNNEL_CONNECTION_FAILED': 'error_tunnel_failed',
    'net::ERR_PROXY_CONNECTION_FAILED': 'error_proxy_unreachable',
    'net::ERR_SOCKS_CONNECTION_FAILED': 'error_proxy_unreachable',
    'net::ERR_SOCKS_CONNECTION_HOST_UNREACHABLE': 'error_tunnel_failed',
    'net::ERR_PROXY_AUTH_UNSUPPORTED': 'auth_failed',
    'net::ERR_PROXY_AUTH_REQUESTED': 'auth_failed',
    'net::ERR_PROXY_CERTIFICATE_INVALID': 'error_proxy_certificate',
    'net::ERR_TIMED_OUT': 'error_timeout',
    'net::ERR_CONNECTION_TIMED_OUT': 'error_timeout',
};

const TEST_FAILURE_MESSAGES: Record<
    Exclude<ProxyTestFailure, ProxyTestFailure.Network>,
    I18nKey
> = {
    [ProxyTestFailure.Timeout]: 'error_timeout',
    [ProxyTestFailure.AuthRejected]: 'auth_failed',
    [ProxyTestFailure.SettingsLocked]: 'error_settings_locked',
    [ProxyTestFailure.Busy]: 'error_test_busy',
    [ProxyTestFailure.Cancelled]: 'error_test_cancelled',
    [ProxyTestFailure.UnsupportedRouting]: 'error_test_routing',
};

const describeNetError = (errorCode: string | null): ErrorText => ({
    message: t(
        (errorCode && NET_ERROR_MESSAGES[errorCode]) || 'error_proxy_generic'
    ),
    detail: errorCode,
});

const ERROR_MESSAGES: Partial<Record<ProxyErrorCode, I18nKey>> = {
    [ProxyErrorCode.AuthFailed]: 'auth_failed',
    [ProxyErrorCode.ApplyFailed]: 'error_apply_failed',
    [ProxyErrorCode.SettingsLocked]: 'error_settings_locked',
    [ProxyErrorCode.VerificationFailed]: 'error_verification_failed',
    [ProxyErrorCode.NoProbeRoute]: 'error_no_probe_route',
};

export const describeProxyError = (errorCode: string): ErrorText => {
    const message = ERROR_MESSAGES[errorCode as ProxyErrorCode];
    return message
        ? { message: t(message), detail: null }
        : describeNetError(errorCode);
};

export const describeTestFailure = ({
    failure,
    errorCode,
}: FailedProxyTest): ErrorText =>
    failure === ProxyTestFailure.Network
        ? describeNetError(errorCode)
        : { message: t(TEST_FAILURE_MESSAGES[failure]), detail: null };
