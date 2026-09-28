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
};

const describeNetError = (errorCode: string | null): ErrorText => ({
    message: t(
        (errorCode && NET_ERROR_MESSAGES[errorCode]) || 'error_proxy_generic'
    ),
    detail: errorCode,
});

export const describeProxyError = (errorCode: string): ErrorText =>
    errorCode === ProxyErrorCode.AuthFailed
        ? { message: t('auth_failed'), detail: null }
        : describeNetError(errorCode);

export const describeTestFailure = ({
    failure,
    errorCode,
}: FailedProxyTest): ErrorText =>
    failure === ProxyTestFailure.Network
        ? describeNetError(errorCode)
        : { message: t(TEST_FAILURE_MESSAGES[failure]), detail: null };
