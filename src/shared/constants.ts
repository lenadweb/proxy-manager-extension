import { ProxyScheme } from 'src/shared/types';

export const PROXY_SCHEMES = Object.values(ProxyScheme);

export const DEFAULT_BYPASS_LIST = ['localhost', '127.0.0.1', '<local>'];

export const DEFAULT_PORTS: Record<ProxyScheme, number> = {
    [ProxyScheme.Http]: 8080,
    [ProxyScheme.Https]: 443,
    [ProxyScheme.Socks4]: 1080,
    [ProxyScheme.Socks5]: 1080,
};

export const MIN_PORT = 1;
export const MAX_PORT = 65535;
