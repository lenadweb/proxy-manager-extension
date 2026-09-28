import {
    Briefcase,
    Cloud,
    Gamepad2,
    Globe,
    House,
    LucideIcon,
    Rocket,
    Server,
    Shield,
    Tv,
    Zap,
} from 'lucide-react';
import { SymbolIcon } from 'src/shared/types';

export const SYMBOL_ICONS: Record<SymbolIcon, LucideIcon> = {
    [SymbolIcon.Globe]: Globe,
    [SymbolIcon.Shield]: Shield,
    [SymbolIcon.Briefcase]: Briefcase,
    [SymbolIcon.House]: House,
    [SymbolIcon.Server]: Server,
    [SymbolIcon.Cloud]: Cloud,
    [SymbolIcon.Zap]: Zap,
    [SymbolIcon.Rocket]: Rocket,
    [SymbolIcon.Gamepad]: Gamepad2,
    [SymbolIcon.Tv]: Tv,
};

export const SYMBOLS = Object.values(SymbolIcon);
