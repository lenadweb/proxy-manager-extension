import { FC } from 'react';
import {
    ConnectionState,
    ConnectionStatus as Status,
} from 'src/shared/connection';
import { I18nKey, t } from 'src/shared/i18n';
import { MessageType } from 'src/shared/proxyTest';

const LABELS: Record<Status, I18nKey> = {
    [Status.Disconnected]: 'connection_off',
    [Status.Connecting]: 'checking',
    [Status.Connected]: 'connection_verified',
    [Status.Error]: 'connection_unverified',
    [Status.Conflict]: 'connection_conflict',
};

const ConnectionStatus: FC<{
    connection: ConnectionState;
    isEnabled: boolean;
}> = ({ connection, isEnabled }) => {
    if (!isEnabled) return null;
    return (
        <div
            role="status"
            aria-live="polite"
            className="mb-4 flex items-center justify-between gap-2 px-1 text-xs text-black-300"
        >
            <div className="min-w-0">
                <p>{t(LABELS[connection.status])}</p>
                {connection.status === Status.Connected && (
                    <p className="mt-1 truncate text-[11px] text-black-400 tabular-nums">
                        {connection.ip} · {connection.latencyMs} ms
                    </p>
                )}
            </div>
            <button
                type="button"
                className="shrink-0 rounded px-2 py-1 text-blue-light focus-visible:outline-2 focus-visible:outline-white disabled:opacity-50"
                disabled={connection.status === Status.Connecting}
                onClick={() => {
                    chrome.runtime
                        .sendMessage({
                            type: MessageType.CheckConnection,
                            force: true,
                        })
                        .catch(console.error);
                }}
            >
                {t('recheck')}
            </button>
        </div>
    );
};
export default ConnectionStatus;
