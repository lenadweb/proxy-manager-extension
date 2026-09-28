import { FC, useState } from 'react';
import cn from 'classnames';
import { Lock, Pencil, Trash2 } from 'lucide-react';
import { formatAddress, hasCredentials } from 'src/shared/proxy';
import { ProxyProfile } from 'src/shared/types';
import { t } from 'src/shared/i18n';
import IconButton, { IconButtonTone } from 'src/popup/components/IconButton';
import ProxyIconView from 'src/popup/components/ProxyIcon/ProxyIconView';
import Switch from 'src/popup/components/Switch';
import Tooltip, {
    TooltipAlign,
    TooltipPlacement,
    TooltipSize,
} from 'src/popup/components/Tooltip';
import ConnectionStatus from './ConnectionStatus';
import DeleteConfirmation from './DeleteConfirmation';

type Props = {
    proxy: ProxyProfile;
    isConnected: boolean;
    onToggle: () => void;
    onEdit: () => void;
    onDelete: () => void;
};

const ProxyCard: FC<Props> = ({
    proxy,
    isConnected,
    onToggle,
    onEdit,
    onDelete,
}) => {
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const toggleLabel = t(isConnected ? 'disconnect' : 'connect');

    if (isConfirmingDelete) {
        return (
            <DeleteConfirmation
                onConfirm={onDelete}
                onCancel={() => setIsConfirmingDelete(false)}
            />
        );
    }

    return (
        <div
            className={cn(
                'group flex items-center gap-1 rounded-3xl p-2 pl-3 ring-1 ring-inset transition',
                isConnected
                    ? 'bg-blue-accent/10 ring-blue-accent/70'
                    : 'bg-black-700 ring-transparent hover:bg-black-600/60'
            )}
        >
            <Tooltip
                label={toggleLabel}
                placement={TooltipPlacement.Bottom}
                size={TooltipSize.Large}
                className="min-w-0 flex-1"
            >
                <button
                    type="button"
                    onClick={onToggle}
                    aria-pressed={isConnected}
                    aria-label={`${toggleLabel} ${proxy.name}`}
                    className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-2xl py-1 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                    <ProxyIconView
                        icon={proxy.icon}
                        fallbackText={proxy.name}
                        isMuted={!isConnected}
                        className="size-10"
                    />
                    <span className="min-w-0">
                        <span className="flex items-center gap-2">
                            <span className="truncate text-sm font-medium leading-snug text-white-100">
                                {proxy.name}
                            </span>
                            <span className="shrink-0 rounded-full bg-black-600 px-2 py-0.5 text-[10px] font-medium uppercase leading-none tracking-wide text-black-200">
                                {proxy.scheme}
                            </span>
                        </span>
                        <span className="mt-0.5 flex items-center gap-1.5 text-[12px] leading-snug text-black-400 tabular-nums">
                            {isConnected && <ConnectionStatus />}
                            <span className="truncate">
                                {formatAddress(proxy)}
                            </span>
                            {hasCredentials(proxy) && (
                                <Lock
                                    aria-label={t('with_auth')}
                                    className="size-3 shrink-0"
                                />
                            )}
                        </span>
                    </span>
                </button>
            </Tooltip>
            <div className="flex shrink-0 items-center">
                <div className="flex w-0 overflow-hidden opacity-0 transition-all group-focus-within:w-16 group-focus-within:overflow-visible group-focus-within:opacity-100 group-hover:w-16 group-hover:overflow-visible group-hover:opacity-100">
                    <IconButton
                        icon={Pencil}
                        label={t('edit')}
                        onClick={onEdit}
                    />
                    <IconButton
                        icon={Trash2}
                        label={t('delete')}
                        tone={IconButtonTone.Danger}
                        tooltipAlign={TooltipAlign.End}
                        onClick={() => setIsConfirmingDelete(true)}
                    />
                </div>
                <span className="px-2">
                    <Switch
                        isOn={isConnected}
                        label={toggleLabel}
                        onToggle={onToggle}
                    />
                </span>
            </div>
        </div>
    );
};

export default ProxyCard;
