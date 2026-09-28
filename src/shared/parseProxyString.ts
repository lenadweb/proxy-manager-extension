import { PROXY_SCHEMES } from 'src/shared/constants';
import { isValidPort } from 'src/shared/proxy';
import { ProxyProfile, ProxyScheme } from 'src/shared/types';

export type ParsedProxy = Partial<
    Pick<ProxyProfile, 'scheme' | 'host' | 'port' | 'username' | 'password'>
>;

type HostAndPort = {
    host: string;
    port?: string;
};

type Credentials = Pick<ProxyProfile, 'username' | 'password'>;

const SCHEME_ALIASES: Record<string, ProxyScheme> = {
    socks: ProxyScheme.Socks5,
    socks5h: ProxyScheme.Socks5,
    socks4a: ProxyScheme.Socks4,
};

const SCHEME_PREFIX = /^([a-z0-9]+):\/\//i;
const BRACKETED_IPV6 = /^\[([^\]]+)\](?::(\d*))?$/;
const FORBIDDEN_HOST_CHARS = /[/@\s]/;
const DIGITS_ONLY = /^\d+$/;

const toScheme = (raw: string): ProxyScheme | null => {
    const name = raw.toLowerCase();
    const scheme = SCHEME_ALIASES[name] ?? name;
    return PROXY_SCHEMES.find((item) => item === scheme) ?? null;
};

const splitHostAndPort = (value: string): HostAndPort => {
    const ipv6 = value.match(BRACKETED_IPV6);
    if (ipv6) return { host: ipv6[1], port: ipv6[2] };

    const lastColon = value.lastIndexOf(':');
    const hasSingleColon = lastColon !== -1 && value.indexOf(':') === lastColon;
    if (!hasSingleColon) return { host: value };

    return {
        host: value.slice(0, lastColon),
        port: value.slice(lastColon + 1),
    };
};

const parseUserInfo = (userInfo: string): Credentials => {
    const [username, ...passwordParts] = userInfo.split(':');
    return {
        username: decodeURIComponent(username),
        password: decodeURIComponent(passwordParts.join(':')),
    };
};

const splitColonSeparatedCredentials = (
    value: string
): { address: string; credentials?: Credentials } => {
    const parts = value.split(':');
    const [host, port, username, password] = parts;
    const isHostPortUserPass = parts.length === 4 && DIGITS_ONLY.test(port);

    if (!isHostPortUserPass) return { address: value };
    return { address: `${host}:${port}`, credentials: { username, password } };
};

export const parseProxyString = (input: string): ParsedProxy | null => {
    let rest = input.trim();
    if (!rest || /\s/.test(rest)) return null;

    const result: ParsedProxy = {};

    const schemeMatch = rest.match(SCHEME_PREFIX);
    if (schemeMatch) {
        const scheme = toScheme(schemeMatch[1]);
        if (!scheme) return null;
        result.scheme = scheme;
        rest = rest.slice(schemeMatch[0].length);
    }
    rest = rest.replace(/\/+$/, '');

    const atIndex = rest.lastIndexOf('@');
    if (atIndex !== -1) {
        Object.assign(result, parseUserInfo(rest.slice(0, atIndex)));
        rest = rest.slice(atIndex + 1);
    } else if (!rest.startsWith('[')) {
        const { address, credentials } = splitColonSeparatedCredentials(rest);
        Object.assign(result, credentials);
        rest = address;
    }

    const { host, port } = splitHostAndPort(rest);
    if (!host || FORBIDDEN_HOST_CHARS.test(host)) return null;
    result.host = host;

    if (port) {
        const portNumber = Number(port);
        if (!isValidPort(portNumber)) return null;
        result.port = portNumber;
    }

    return result;
};

export const isFullProxyString = (
    parsed: ParsedProxy | null
): parsed is ParsedProxy =>
    Boolean(parsed && (parsed.port || parsed.scheme || parsed.username));
