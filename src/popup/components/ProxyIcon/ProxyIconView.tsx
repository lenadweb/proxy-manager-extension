import { FC } from 'react';
import cn from 'classnames';
import { ProxyIcon, ProxyIconKind } from 'src/shared/types';
import CountryFlag from './CountryFlag';
import { SYMBOL_ICONS } from './symbolIcons';

type Props = {
    icon: ProxyIcon | null;
    fallbackText: string;
    isMuted?: boolean;
    className?: string;
};

const ProxyIconView: FC<Props> = ({
    icon,
    fallbackText,
    isMuted = false,
    className,
}) => {
    const renderContent = () => {
        if (icon?.kind === ProxyIconKind.Country) {
            return <CountryFlag code={icon.code} className="h-3.5 w-5" />;
        }
        if (icon?.kind === ProxyIconKind.Symbol) {
            const SymbolComponent = SYMBOL_ICONS[icon.symbol];
            return <SymbolComponent aria-hidden className="size-4" />;
        }
        return (
            <span className="text-sm font-semibold uppercase">
                {fallbackText.charAt(0)}
            </span>
        );
    };

    return (
        <span
            className={cn(
                'flex shrink-0 items-center justify-center rounded-xl bg-black-600 transition',
                isMuted ? 'text-black-200' : 'text-blue-light',
                className
            )}
        >
            {renderContent()}
        </span>
    );
};

export default ProxyIconView;
