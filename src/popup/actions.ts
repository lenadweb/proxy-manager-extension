import { getActiveProxy } from 'src/shared/proxy';
import { saveState } from 'src/shared/storage';
import { ProxyProfile, ProxyState } from 'src/shared/types';

export const selectProxy = (id: string): Promise<void> =>
    saveState({ activeId: id, isEnabled: true });

export const toggleEnabled = (state: ProxyState): Promise<void> => {
    const activeId = getActiveProxy(state)?.id ?? state.proxies[0]?.id ?? null;
    const isEnabled = !state.isEnabled && activeId !== null;

    return saveState({ activeId, isEnabled });
};

export const saveProxy = (
    state: ProxyState,
    proxy: ProxyProfile
): Promise<void> => {
    const isExisting = state.proxies.some(({ id }) => id === proxy.id);
    const proxies = isExisting
        ? state.proxies.map((item) => (item.id === proxy.id ? proxy : item))
        : [...state.proxies, proxy];

    return saveState({ proxies, activeId: state.activeId ?? proxy.id });
};

export const deleteProxy = (state: ProxyState, id: string): Promise<void> => {
    const proxies = state.proxies.filter((proxy) => proxy.id !== id);
    const isDeletingActive = state.activeId === id;

    if (!isDeletingActive) return saveState({ proxies });

    return saveState({
        proxies,
        activeId: proxies[0]?.id ?? null,
        isEnabled: false,
    });
};

export const dismissError = (): Promise<void> => saveState({ lastError: null });
