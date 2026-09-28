import { MAX_PORT, MIN_PORT } from 'src/shared/constants';
import { ProxyProfile, ProxyScheme, ProxyState } from 'src/shared/types';

const SCHEMES_WITH_AUTH = [ProxyScheme.Http, ProxyScheme.Https];

export const supportsAuth = (scheme: ProxyScheme): boolean =>
    SCHEMES_WITH_AUTH.includes(scheme);

export const hasCredentials = (proxy: ProxyProfile): boolean =>
    supportsAuth(proxy.scheme) && Boolean(proxy.username);

export const isValidPort = (port: number): boolean =>
    Number.isInteger(port) && port >= MIN_PORT && port <= MAX_PORT;

export const getActiveProxy = (state: ProxyState): ProxyProfile | null =>
    state.proxies.find((proxy) => proxy.id === state.activeId) ?? null;

export const getAppliedProxy = (state: ProxyState): ProxyProfile | null =>
    state.isEnabled ? getActiveProxy(state) : null;

export const formatAddress = ({
    host,
    port,
}: Pick<ProxyProfile, 'host' | 'port'>): string => {
    const isIpv6 = host.includes(':');
    return `${isIpv6 ? `[${host}]` : host}:${port}`;
};

export const getConnectionSignature = ({
    scheme,
    host,
    port,
    username,
    password,
}: ProxyProfile): string =>
    JSON.stringify([scheme, host, port, username, password]);

export const parseBypassList = (value: string): string[] =>
    value
        .split(/[\n,;]+/)
        .map((item) => item.trim())
        .filter(Boolean);

export const buildProxyConfig = (
    proxy: ProxyProfile
): chrome.proxy.ProxyConfig => ({
    mode: 'fixed_servers',
    rules: {
        singleProxy: {
            scheme: proxy.scheme,
            host: proxy.host,
            port: proxy.port,
        },
        bypassList: proxy.bypassList,
    },
});
