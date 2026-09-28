import { formatAddress } from 'src/shared/proxy';
import { ProxyProfile, ProxyScheme } from 'src/shared/types';

const PAC_PROXY_TYPES: Record<ProxyScheme, string> = {
    [ProxyScheme.Http]: 'PROXY',
    [ProxyScheme.Https]: 'HTTPS',
    [ProxyScheme.Socks4]: 'SOCKS',
    [ProxyScheme.Socks5]: 'SOCKS5',
};

const LOCAL_HOSTS_PATTERN = '<local>';
const DIRECT = 'DIRECT';

const quote = (value: string): string => JSON.stringify(value);

export const toPacProxy = (proxy: ProxyProfile): string =>
    `${PAC_PROXY_TYPES[proxy.scheme]} ${formatAddress(proxy)}`;

const toBypassCondition = (pattern: string): string =>
    pattern === LOCAL_HOSTS_PATTERN
        ? 'isPlainHostName(host)'
        : `shExpMatch(host, ${quote(pattern)})`;

const buildFallbackRules = (fallback: ProxyProfile | null): string[] => {
    if (!fallback) return [`return ${quote(DIRECT)};`];

    const bypassConditions = fallback.bypassList.map(toBypassCondition);
    const bypassRule = bypassConditions.length
        ? [`if (${bypassConditions.join(' || ')}) return ${quote(DIRECT)};`]
        : [];

    return [...bypassRule, `return ${quote(toPacProxy(fallback))};`];
};

const toHostCondition = (testHosts: string[]): string =>
    testHosts.map((testHost) => `host === ${quote(testHost)}`).join(' || ');

export const buildTestPacScript = (
    candidate: ProxyProfile,
    fallback: ProxyProfile | null,
    testHosts: string[]
): string =>
    [
        'function FindProxyForURL(url, host) {',
        `if (${toHostCondition(testHosts)}) return ${quote(toPacProxy(candidate))};`,
        ...buildFallbackRules(fallback),
        '}',
    ].join('\n');
