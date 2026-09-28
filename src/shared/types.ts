export enum ProxyScheme {
    Http = 'http',
    Https = 'https',
    Socks4 = 'socks4',
    Socks5 = 'socks5',
}

export enum ProxyErrorCode {
    AuthFailed = 'AUTH_FAILED',
}

export enum ProxyControl {
    NotControllable = 'not_controllable',
    ControlledByOtherExtensions = 'controlled_by_other_extensions',
    ControllableByThisExtension = 'controllable_by_this_extension',
    ControlledByThisExtension = 'controlled_by_this_extension',
}

export enum ProxyIconKind {
    Symbol = 'symbol',
    Country = 'country',
}

export enum SymbolIcon {
    Globe = 'globe',
    Shield = 'shield',
    Briefcase = 'briefcase',
    House = 'house',
    Server = 'server',
    Cloud = 'cloud',
    Zap = 'zap',
    Rocket = 'rocket',
    Gamepad = 'gamepad',
    Tv = 'tv',
}

export type ProxyIcon =
    | { kind: ProxyIconKind.Symbol; symbol: SymbolIcon }
    | { kind: ProxyIconKind.Country; code: string };

export type ProxyProfile = {
    id: string;
    name: string;
    scheme: ProxyScheme;
    host: string;
    port: number;
    username: string;
    password: string;
    bypassList: string[];
    icon: ProxyIcon | null;
};

export type ProxyState = {
    proxies: ProxyProfile[];
    activeId: string | null;
    isEnabled: boolean;
    lastError: string | null;
};
