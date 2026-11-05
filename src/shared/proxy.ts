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

export const isProxySelected = (state: ProxyState, id: string): boolean =>
    state.isEnabled && state.activeId === id;

export const normalizeProxyHost = (host: string): string =>
    host
        .toLowerCase()
        .replace(/^\[|\]$/g, '')
        .replace(/\.$/, '');

export const matchesProxyConfig = (
    config: chrome.proxy.ProxyConfig,
    proxy: ProxyProfile
): boolean => {
    const server = config.rules?.singleProxy;
    const bypass = config.rules?.bypassList ?? [];
    return (
        config.mode === 'fixed_servers' &&
        !!server &&
        (server.scheme ?? 'http') === proxy.scheme &&
        normalizeProxyHost(server.host) === normalizeProxyHost(proxy.host) &&
        server.port === proxy.port &&
        bypass.length === proxy.bypassList.length &&
        bypass.every((rule, index) => rule === proxy.bypassList[index])
    );
};

export const getAppliedProxy = (state: ProxyState): ProxyProfile | null =>
    state.isEnabled ? getActiveProxy(state) : null;

export const formatAddress = ({
    host,
    port,
}: Pick<ProxyProfile, 'host' | 'port'>): string => {
    const isIpv6 = host.includes(':') && !host.startsWith('[');
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
