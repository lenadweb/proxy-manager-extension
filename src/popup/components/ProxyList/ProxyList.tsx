import { FC } from 'react';
import { t } from 'src/shared/i18n';
import { ProxyProfile, ProxyState } from 'src/shared/types';
import { Plus } from 'lucide-react';
import EmptyState from './EmptyState';
import ProxyCard from './ProxyCard';

type Props = {
    state: ProxyState;
    onAdd: () => void;
    onSelect: (proxy: ProxyProfile) => void;
    onEdit: (proxy: ProxyProfile) => void;
    onDelete: (proxy: ProxyProfile) => void;
};

const ProxyList: FC<Props> = ({ state, onAdd, onSelect, onEdit, onDelete }) => {
    const hasProxies = state.proxies.length > 0;

    return (
        <section>
            <div className="mb-2 ml-1 flex items-center justify-between">
                <h2 className="text-xs font-medium uppercase tracking-wide text-black-400">
                    {t('proxies')}
                </h2>
                {hasProxies && (
                    <button
                        type="button"
                        onClick={onAdd}
                        className="-my-1 flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-medium text-blue-light transition-colors hover:bg-black-700 focus-visible:outline-2 focus-visible:outline-white active:scale-95"
                    >
                        <Plus aria-hidden className="size-3.5" />
                        {t('add')}
                    </button>
                )}
            </div>
            {hasProxies ? (
                <div className="space-y-2.5 pb-2">
                    {state.proxies.map((proxy) => (
                        <ProxyCard
                            key={proxy.id}
                            proxy={proxy}
                            isSelected={proxy.id === state.activeId}
                            isEnabled={state.isEnabled}
                            onSelect={() => onSelect(proxy)}
                            onEdit={() => onEdit(proxy)}
                            onDelete={() => onDelete(proxy)}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState onAdd={onAdd} />
            )}
        </section>
    );
};

export default ProxyList;
