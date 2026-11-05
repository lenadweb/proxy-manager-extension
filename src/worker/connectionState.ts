import {
    CONNECTION_KEY,
    ConnectionState,
    ConnectionStatus,
    EMPTY_CONNECTION,
    getRoutingFingerprint,
} from 'src/shared/connection';
import { getAppliedProxy } from 'src/shared/proxy';
import { loadState } from 'src/shared/storage';
import { updateActionIcon } from './actionIcon';

let revision = 0;
let pending: AbortController | null = null;

export const getRevision = (): number => revision;

export const invalidateConnection = (): void => {
    revision++;
    pending?.abort();
};

export const beginProbe = (): AbortController => {
    pending?.abort();
    pending = new AbortController();
    return pending;
};

export const publishConnection = async (
    patch: Partial<ConnectionState>,
    expectedRevision = revision
): Promise<void> => {
    if (expectedRevision !== revision) return;
    const proxy = getAppliedProxy(await loadState());
    const connection = {
        ...EMPTY_CONNECTION,
        proxyId: proxy?.id ?? null,
        fingerprint: proxy ? await getRoutingFingerprint(proxy) : null,
        ...patch,
    };
    if (expectedRevision !== revision) return;
    await chrome.storage.session.set({ [CONNECTION_KEY]: connection });
    if (expectedRevision !== revision) return;
    await updateActionIcon(proxy, connection.status);
};

export const markConnectionError = async (error: string): Promise<void> => {
    invalidateConnection();
    await publishConnection({ status: ConnectionStatus.Error, error });
};
