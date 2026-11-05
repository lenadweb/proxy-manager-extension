import { formatAddress } from 'src/shared/proxy';
import { ProxyProfile, ProxyScheme } from 'src/shared/types';
import { bypassCondition, UnsupportedRoutingError } from './bypass';

const PAC_PROXY_TYPES: Record<ProxyScheme, string> = {
    [ProxyScheme.Http]: 'PROXY',
    [ProxyScheme.Https]: 'HTTPS',
    [ProxyScheme.Socks4]: 'SOCKS',
    [ProxyScheme.Socks5]: 'SOCKS5',
};

const DIRECT = 'DIRECT';

const quote = (value: string): string => JSON.stringify(value);

export const toPacProxy = (proxy: ProxyProfile): string =>
    `${PAC_PROXY_TYPES[proxy.scheme]} ${formatAddress(proxy)}`;

const buildFallbackRules = (fallback: chrome.proxy.ProxyConfig): string[] => {
    if (fallback.mode === 'direct') return [`return ${quote(DIRECT)};`];
    // System/WPAD/remote PAC routing cannot be reproduced inside another PAC.
    // Refuse the diagnostic instead of replacing unrelated traffic with DIRECT.
    if (fallback.mode !== 'fixed_servers' || !fallback.rules?.singleProxy) {
        throw new UnsupportedRoutingError(fallback.mode);
    }
    const server = fallback.rules.singleProxy;
    const proxy = toPacProxy({
        scheme: (server.scheme ?? 'http') as ProxyScheme,
        host: server.host,
        port: server.port ?? (server.scheme === 'https' ? 443 : 80),
    } as ProxyProfile);
    const bypassConditions = (fallback.rules.bypassList ?? []).map(
        bypassCondition
    );
    const bypassRule = bypassConditions.length
        ? [`if (${bypassConditions.join(' || ')}) return ${quote(DIRECT)};`]
        : [];

    return [...bypassRule, `return ${quote(proxy)};`];
};

const toHostCondition = (testHosts: string[]): string =>
    testHosts.map((testHost) => `host === ${quote(testHost)}`).join(' || ');

export const buildTestPacScript = (
    candidate: ProxyProfile,
    fallback: chrome.proxy.ProxyConfig,
    testHosts: string[]
): string =>
    [
        'function FindProxyForURL(url, host) {',
        `if (${toHostCondition(testHosts)}) return ${quote(toPacProxy(candidate))};`,
        ...buildFallbackRules(fallback),
        '}',
    ].join('\n');
