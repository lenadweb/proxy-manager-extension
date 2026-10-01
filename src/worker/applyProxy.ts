import { onActionIconsChange } from 'src/shared/actionIcons';
import { buildProxyConfig, getAppliedProxy } from 'src/shared/proxy';
import { loadState, onStateChange, saveState } from 'src/shared/storage';
import { ProxyState } from 'src/shared/types';
import { updateActionIcon } from './actionIcon';
import { primeProxyCredentials } from './proxyAuthPrimer';
import { runExclusive } from './taskQueue';

const KEYS_AFFECTING_PROXY: (keyof ProxyState)[] = [
    'proxies',
    'activeId',
    'isEnabled',
];

export const applyProxy = async (): Promise<void> => {
    const proxy = getAppliedProxy(await loadState());

    if (proxy) {
        await chrome.proxy.settings.set({
            value: buildProxyConfig(proxy),
            scope: 'regular',
        });
        primeProxyCredentials(proxy);
    } else {
        await chrome.proxy.settings.clear({ scope: 'regular' });
    }

    await updateActionIcon(proxy);
};

const refreshActionIcon = async (): Promise<void> => {
    await updateActionIcon(getAppliedProxy(await loadState()));
};

const enqueue = (task: () => Promise<void>): void => {
    runExclusive(task).catch(console.error);
};

const reapplyWithCleanError = async (): Promise<void> => {
    await saveState({ lastError: null });
    await applyProxy();
};

export const registerProxySync = (): void => {
    onStateChange((changedKeys) => {
        const affectsProxy = changedKeys.some((key) =>
            KEYS_AFFECTING_PROXY.includes(key)
        );
        if (affectsProxy) enqueue(reapplyWithCleanError);
    });

    onActionIconsChange(() => enqueue(refreshActionIcon));

    chrome.runtime.onStartup.addListener(() => enqueue(applyProxy));
    chrome.runtime.onInstalled.addListener(() => enqueue(applyProxy));
};
