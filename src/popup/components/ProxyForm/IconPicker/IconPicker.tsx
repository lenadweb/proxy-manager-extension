import { FC, useState } from 'react';
import cn from 'classnames';
import { Flag, LucideIcon, Shapes, X } from 'lucide-react';
import { I18nKey, t } from 'src/shared/i18n';
import { ProxyIcon, ProxyIconKind } from 'src/shared/types';
import CountryList from './CountryList';
import SymbolGrid from './SymbolGrid';

enum PickerTab {
    Symbols = 'symbols',
    Countries = 'countries',
}

type TabConfig = {
    icon: LucideIcon;
    label: I18nKey;
};

const TABS: Record<PickerTab, TabConfig> = {
    [PickerTab.Symbols]: { icon: Shapes, label: 'icons_tab' },
    [PickerTab.Countries]: { icon: Flag, label: 'countries_tab' },
};

type Props = {
    selected: ProxyIcon | null;
    onSelect: (icon: ProxyIcon | null) => void;
};

const getInitialTab = (selected: ProxyIcon | null): PickerTab =>
    selected?.kind === ProxyIconKind.Country
        ? PickerTab.Countries
        : PickerTab.Symbols;

const IconPicker: FC<Props> = ({ selected, onSelect }) => {
    const [activeTab, setActiveTab] = useState(() => getInitialTab(selected));

    return (
        <div className="space-y-3 rounded-2xl bg-background p-2.5">
            <div
                role="tablist"
                className="grid grid-cols-2 gap-1 rounded-xl bg-black-700 p-1"
            >
                {Object.values(PickerTab).map((tab) => {
                    const { icon: TabIcon, label } = TABS[tab];
                    const isActive = tab === activeTab;

                    return (
                        <button
                            key={tab}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                'flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg text-[12px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-white',
                                isActive
                                    ? 'bg-black-600 text-white'
                                    : 'text-black-400 hover:text-white'
                            )}
                        >
                            <TabIcon aria-hidden className="size-3.5" />
                            {t(label)}
                        </button>
                    );
                })}
            </div>

            {activeTab === PickerTab.Symbols ? (
                <SymbolGrid selected={selected} onSelect={onSelect} />
            ) : (
                <CountryList selected={selected} onSelect={onSelect} />
            )}

            {selected && (
                <button
                    type="button"
                    onClick={() => onSelect(null)}
                    className="flex cursor-pointer items-center gap-1.5 rounded px-1 text-[12px] font-medium text-black-400 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-white"
                >
                    <X aria-hidden className="size-3.5" />
                    {t('remove_icon')}
                </button>
            )}
        </div>
    );
};

export default IconPicker;
