import { ProxyProfile, ProxyState } from 'src/shared/types';

type StateKey = keyof ProxyState;

type StoredProxy = Omit<ProxyProfile, 'icon'> & Partial<ProxyProfile>;

export const DEFAULT_STATE: ProxyState = {
    proxies: [],
    activeId: null,
    isEnabled: false,
    lastError: null,
};

const STATE_KEYS = Object.keys(DEFAULT_STATE) as StateKey[];

const isStateKey = (key: string): key is StateKey =>
    STATE_KEYS.some((stateKey) => stateKey === key);

const normalizeProxy = (proxy: StoredProxy): ProxyProfile => ({
    ...proxy,
    icon: proxy.icon ?? null,
});

export const loadState = async (): Promise<ProxyState> => {
    const state = (await chrome.storage.local.get(DEFAULT_STATE)) as Omit<
        ProxyState,
        'proxies'
    > & { proxies: StoredProxy[] };

    return { ...state, proxies: state.proxies.map(normalizeProxy) };
};

export const saveState = (patch: Partial<ProxyState>): Promise<void> =>
    chrome.storage.local.set(patch);

export const onStateChange = (
    listener: (changedKeys: StateKey[]) => void
): (() => void) => {
    const handleChange = (
        changes: Record<string, chrome.storage.StorageChange>,
        areaName: string
    ) => {
        if (areaName !== 'local') return;

        const changedKeys = Object.keys(changes).filter(isStateKey);
        if (changedKeys.length) listener(changedKeys);
    };

    chrome.storage.onChanged.addListener(handleChange);
    return () => chrome.storage.onChanged.removeListener(handleChange);
};
