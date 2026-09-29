import {
    ProxyControl,
    ProxyIconKind,
    ProxyProfile,
    ProxyScheme,
    ProxyState,
    SymbolIcon,
} from 'src/shared/types';
import { PopupState } from 'src/popup/popupState';

type LocaleMessage = {
    message: string;
    placeholders?: Record<string, { content: string }>;
};

type LocaleMessages = Record<string, LocaleMessage>;

type StubOptions = {
    state: ProxyState;
    popupState: PopupState;
    messages: LocaleMessages;
};

const PLACEHOLDER = /\$(\w+)\$/g;

const createProxy = (
    proxy: Omit<ProxyProfile, 'username' | 'password' | 'bypassList'> &
        Partial<ProxyProfile>
): ProxyProfile => ({
    username: '',
    password: '',
    bypassList: ['localhost', '127.0.0.1', '<local>'],
    ...proxy,
});

export const GERMANY = createProxy({
    id: 'germany',
    name: 'Germany',
    scheme: ProxyScheme.Socks5,
    host: '198.51.100.24',
    port: 1080,
    icon: { kind: ProxyIconKind.Country, code: 'DE' },
});

export const NETHERLANDS = createProxy({
    id: 'netherlands',
    name: 'Netherlands',
    scheme: ProxyScheme.Http,
    host: '203.0.113.58',
    port: 8080,
    username: 'alex',
    password: 'promo-password',
    icon: { kind: ProxyIconKind.Country, code: 'NL' },
});

export const JAPAN = createProxy({
    id: 'japan',
    name: 'Japan',
    scheme: ProxyScheme.Https,
    host: '192.0.2.77',
    port: 443,
    username: 'alex',
    password: 'promo-password',
    icon: { kind: ProxyIconKind.Country, code: 'JP' },
});

export const WORK = createProxy({
    id: 'work',
    name: 'Work',
    scheme: ProxyScheme.Http,
    host: 'proxy.corp.example',
    port: 3128,
    username: 'alex.m',
    password: 'promo-password',
    icon: { kind: ProxyIconKind.Symbol, symbol: SymbolIcon.Briefcase },
});

export const HOME_LAB = createProxy({
    id: 'home-lab',
    name: 'Home lab',
    scheme: ProxyScheme.Socks4,
    host: '192.0.2.10',
    port: 1080,
    icon: { kind: ProxyIconKind.Symbol, symbol: SymbolIcon.House },
});

export const PROXIES = [GERMANY, NETHERLANDS, JAPAN, WORK, HOME_LAB];

export const createProxyState = (connectedId: string | null): ProxyState => ({
    proxies: PROXIES,
    activeId: connectedId,
    isEnabled: connectedId !== null,
    lastError: null,
});

const formatMessage = (
    { message, placeholders }: LocaleMessage,
    substitutions: string[]
): string =>
    message.replace(PLACEHOLDER, (match, name: string) => {
        const content = placeholders?.[name.toLowerCase()]?.content;
        if (!content) return match;
        return substitutions[Number(content.slice(1)) - 1] ?? '';
    });

export const loadMessages = async (): Promise<LocaleMessages> => {
    const response = await fetch('/_locales/en/messages.json');
    return (await response.json()) as LocaleMessages;
};

export const disableAutofocus = (): void => {
    HTMLElement.prototype.focus = () => undefined;
};

export const installChromeStub = ({
    state,
    popupState,
    messages,
}: StubOptions): void => {
    const store: Record<string, unknown> = { ...state, popupState };

    const readStore = (defaults: Record<string, unknown>) =>
        Object.fromEntries(
            Object.entries(defaults).map(([key, fallback]) => [
                key,
                key in store ? store[key] : fallback,
            ])
        );

    const noopEvent = {
        addListener: () => undefined,
        removeListener: () => undefined,
    };

    (globalThis as { chrome?: unknown }).chrome = {
        i18n: {
            getMessage: (key: string, substitutions: string[] = []) => {
                const entry = messages[key];
                return entry ? formatMessage(entry, substitutions) : '';
            },
        },
        storage: {
            local: {
                get: (defaults: Record<string, unknown>) =>
                    Promise.resolve(readStore(defaults)),
                set: (patch: Record<string, unknown>) => {
                    Object.assign(store, patch);
                    return Promise.resolve();
                },
            },
            onChanged: noopEvent,
        },
        proxy: {
            settings: {
                get: () =>
                    Promise.resolve({
                        levelOfControl: ProxyControl.ControlledByThisExtension,
                    }),
                onChange: noopEvent,
            },
        },
    };
};
