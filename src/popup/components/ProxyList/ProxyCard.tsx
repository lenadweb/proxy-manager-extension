import { FC, useState } from 'react';
import cn from 'classnames';
import { formatAddress, hasCredentials } from 'src/shared/proxy';
import { ProxyProfile } from 'src/shared/types';
import { t } from 'src/shared/i18n';
import Icon from 'src/popup/components/Icon';
import IconButton from 'src/popup/components/IconButton';
import DeleteConfirmation from './DeleteConfirmation';
import SelectionIndicator from './SelectionIndicator';

type Props = {
    proxy: ProxyProfile;
    isSelected: boolean;
    isEnabled: boolean;
    onSelect: () => void;
    onEdit: () => void;
    onDelete: () => void;
};

const ProxyCard: FC<Props> = ({
    proxy,
    isSelected,
    isEnabled,
    onSelect,
    onEdit,
    onDelete,
}) => {
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const isActive = isSelected && isEnabled;

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
                'group flex items-center gap-2 rounded-3xl bg-black-700 p-2 pl-4 ring-1 ring-inset transition',
                isActive ? 'ring-blue-accent/70' : 'ring-transparent'
            )}
        >
            <button
                type="button"
                onClick={onSelect}
                aria-pressed={isActive}
                title={t('use_proxy')}
                className="flex min-w-0 flex-1 cursor-pointer items-center gap-3.5 rounded-2xl py-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
                <SelectionIndicator
                    isSelected={isSelected}
                    isActive={isActive}
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
                        <span className="truncate">{formatAddress(proxy)}</span>
                        {hasCredentials(proxy) && (
                            <span title={t('with_auth')}>
                                <Icon name="lock" className="size-3" />
                            </span>
                        )}
                    </span>
                </span>
            </button>
            <div className="flex shrink-0 opacity-60 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
                <IconButton icon="edit" label={t('edit')} onClick={onEdit} />
                <IconButton
                    icon="trash"
                    label={t('delete')}
                    isDanger
                    onClick={() => setIsConfirmingDelete(true)}
                />
            </div>
        </div>
    );
};

export default ProxyCard;
