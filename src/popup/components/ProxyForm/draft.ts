import { DEFAULT_BYPASS_LIST, DEFAULT_PORTS } from 'src/shared/constants';
import { ParsedProxy } from 'src/shared/parseProxyString';
import { parseBypassList, supportsAuth } from 'src/shared/proxy';
import { ProxyProfile, ProxyScheme } from 'src/shared/types';

export type ProxyDraft = {
    name: string;
    scheme: ProxyScheme;
    host: string;
    port: string;
    username: string;
    password: string;
    bypass: string;
};

export const createDraft = (proxy: ProxyProfile | null): ProxyDraft => ({
    name: proxy?.name ?? '',
    scheme: proxy?.scheme ?? ProxyScheme.Http,
    host: proxy?.host ?? '',
    port: proxy ? String(proxy.port) : '',
    username: proxy?.username ?? '',
    password: proxy?.password ?? '',
    bypass: (proxy?.bypassList ?? DEFAULT_BYPASS_LIST).join('\n'),
});

export const getSchemePatch = (
    draft: ProxyDraft,
    scheme: ProxyScheme
): Partial<ProxyDraft> => {
    const isDefaultPort =
        !draft.port || draft.port === String(DEFAULT_PORTS[draft.scheme]);

    return isDefaultPort
        ? { scheme, port: String(DEFAULT_PORTS[scheme]) }
        : { scheme };
};

export const getParsedProxyPatch = ({
    scheme,
    host,
    port,
    username,
    password,
}: ParsedProxy): Partial<ProxyDraft> => ({
    ...(host && { host }),
    ...(scheme && { scheme }),
    ...(port && { port: String(port) }),
    ...(username !== undefined && { username, password: password ?? '' }),
});

export const draftToProfile = (draft: ProxyDraft, id: string): ProxyProfile => {
    const host = draft.host.trim();
    const canAuthenticate = supportsAuth(draft.scheme);

    return {
        id,
        name: draft.name.trim() || host,
        scheme: draft.scheme,
        host,
        port: Number(draft.port),
        username: canAuthenticate ? draft.username.trim() : '',
        password: canAuthenticate ? draft.password : '',
        bypassList: parseBypassList(draft.bypass),
    };
};
