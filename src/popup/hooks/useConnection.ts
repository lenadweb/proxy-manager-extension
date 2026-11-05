import { useEffect, useState } from 'react';
import {
    CONNECTION_KEY,
    ConnectionState,
    ConnectionStatus,
    EMPTY_CONNECTION,
    getRoutingFingerprint,
    getRoutingSignature,
    isConnectionFresh,
    loadConnection,
} from 'src/shared/connection';
import { getAppliedProxy } from 'src/shared/proxy';
import { MessageType } from 'src/shared/proxyTest';
import { ProxyControl, ProxyState } from 'src/shared/types';

export const useConnection = (
    state: ProxyState | null,
    control: ProxyControl | null
): ConnectionState => {
    const proxy = state && getAppliedProxy(state);
    const signature = getRoutingSignature(proxy);
    const [snapshot, setSnapshot] = useState({
        signature: '',
        connection: EMPTY_CONNECTION,
    });
    useEffect(() => {
        let disposed = false;
        let request = 0;
        const sync = async () => {
            const current = ++request;
            const connection = await loadConnection();
            const fingerprint = proxy
                ? await getRoutingFingerprint(proxy)
                : null;
            if (disposed || current !== request) return;
            setSnapshot({
                signature,
                connection:
                    proxy &&
                    connection.proxyId === proxy.id &&
                    connection.fingerprint === fingerprint
                        ? connection
                        : {
                              ...EMPTY_CONNECTION,
                              status: proxy
                                  ? ConnectionStatus.Connecting
                                  : ConnectionStatus.Disconnected,
                          },
            });
        };
        const listener = (
            changes: Record<string, chrome.storage.StorageChange>,
            area: string
        ) => {
            if (area === 'session' && changes[CONNECTION_KEY])
                sync().catch(console.error);
        };
        chrome.storage.onChanged.addListener(listener);
        sync().catch(console.error);
        chrome.runtime
            .sendMessage({ type: MessageType.CheckConnection })
            .catch(console.error);
        // Expire a stale green state even when the worker/alarms cannot run.
        const interval = setInterval(() => sync().catch(console.error), 5_000);
        return () => {
            disposed = true;
            clearInterval(interval);
            chrome.storage.onChanged.removeListener(listener);
        };
        // signature covers all routing fields without resubscribing on every storage update.
    }, [signature]);

    if (!proxy) return EMPTY_CONNECTION;
    if (control !== ProxyControl.ControlledByThisExtension) {
        return {
            ...EMPTY_CONNECTION,
            status:
                control === ProxyControl.ControlledByOtherExtensions ||
                control === ProxyControl.NotControllable
                    ? ConnectionStatus.Conflict
                    : ConnectionStatus.Connecting,
        };
    }
    if (snapshot.signature !== signature)
        return { ...EMPTY_CONNECTION, status: ConnectionStatus.Connecting };
    const connection = snapshot.connection;
    if (
        connection.status === ConnectionStatus.Connected &&
        !isConnectionFresh(connection)
    ) {
        return { ...connection, status: ConnectionStatus.Connecting };
    }
    return connection;
};
