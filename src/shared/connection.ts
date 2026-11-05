import { getConnectionSignature } from './proxy';
import { ProxyControl, ProxyProfile } from './types';

export enum ConnectionStatus {
    Disconnected = 'disconnected',
    Connecting = 'connecting',
    Connected = 'connected',
    Error = 'error',
    Conflict = 'conflict',
}

export type ConnectionState = {
    status: ConnectionStatus;
    proxyId: string | null;
    fingerprint: string | null;
    control: ProxyControl | null;
    checkedAt: number | null;
    ip: string | null;
    latencyMs: number | null;
    error: string | null;
};

export const CONNECTION_KEY = 'connection';
export const CONNECTION_MAX_AGE_MS = 90_000;
export const EMPTY_CONNECTION: ConnectionState = {
    status: ConnectionStatus.Disconnected,
    proxyId: null,
    fingerprint: null,
    control: null,
    checkedAt: null,
    ip: null,
    latencyMs: null,
    error: null,
};

export const getRoutingSignature = (proxy: ProxyProfile | null): string =>
    proxy
        ? JSON.stringify([getConnectionSignature(proxy), proxy.bypassList])
        : 'off';

// Do not put credentials (or the raw routing signature) in runtime diagnostics.
export const getRoutingFingerprint = async (
    proxy: ProxyProfile
): Promise<string> => {
    const digest = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(getRoutingSignature(proxy))
    );
    return Array.from(new Uint8Array(digest), (byte) =>
        byte.toString(16).padStart(2, '0')
    ).join('');
};

export const loadConnection = async (): Promise<ConnectionState> => {
    const stored = await chrome.storage.session.get(CONNECTION_KEY);
    return (stored[CONNECTION_KEY] as ConnectionState) ?? EMPTY_CONNECTION;
};

export const isConnectionFresh = (connection: ConnectionState): boolean =>
    connection.checkedAt !== null &&
    Date.now() - connection.checkedAt < CONNECTION_MAX_AGE_MS;
