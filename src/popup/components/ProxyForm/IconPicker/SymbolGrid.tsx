import { FC } from 'react';
import cn from 'classnames';
import { ProxyIcon, ProxyIconKind, SymbolIcon } from 'src/shared/types';
import {
    SYMBOL_ICONS,
    SYMBOLS,
} from 'src/popup/components/ProxyIcon/symbolIcons';

type Props = {
    selected: ProxyIcon | null;
    onSelect: (icon: ProxyIcon) => void;
};

const isSelectedSymbol = (selected: ProxyIcon | null, symbol: SymbolIcon) =>
    selected?.kind === ProxyIconKind.Symbol && selected.symbol === symbol;

const SymbolGrid: FC<Props> = ({ selected, onSelect }) => (
    <div className="grid grid-cols-5 gap-1.5">
        {SYMBOLS.map((symbol) => {
            const SymbolComponent = SYMBOL_ICONS[symbol];
            const isSelected = isSelectedSymbol(selected, symbol);

            return (
                <button
                    key={symbol}
                    type="button"
                    aria-label={symbol}
                    aria-pressed={isSelected}
                    onClick={() =>
                        onSelect({ kind: ProxyIconKind.Symbol, symbol })
                    }
                    className={cn(
                        'flex h-11 cursor-pointer items-center justify-center rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-white active:scale-95',
                        isSelected
                            ? 'bg-blue-accent text-white'
                            : 'bg-black-700 text-black-200 hover:bg-black-600 hover:text-white'
                    )}
                >
                    <SymbolComponent aria-hidden className="size-5" />
                </button>
            );
        })}
    </div>
);

export default SymbolGrid;
