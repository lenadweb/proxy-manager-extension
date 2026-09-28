import { buildProxyConfig, getAppliedProxy } from 'src/shared/proxy';
import { loadState, onStateChange, saveState } from 'src/shared/storage';
import { ProxyState } from 'src/shared/types';
import { runExclusive } from './taskQueue';

const BADGE_TEXT_ON = 'ON';
const BADGE_BACKGROUND = '#2563EB';
const BADGE_TEXT_COLOR = '#FFFFFF';
const KEYS_AFFECTING_PROXY: (keyof ProxyState)[] = [
    'proxies',
    'activeId',
    'isEnabled',
];

const updateBadge = async (isProxyOn: boolean): Promise<void> => {
    await chrome.action.setBadgeBackgroundColor({ color: BADGE_BACKGROUND });
    await chrome.action.setBadgeTextColor({ color: BADGE_TEXT_COLOR });
    await chrome.action.setBadgeText({ text: isProxyOn ? BADGE_TEXT_ON : '' });
};

export const applyProxy = async (): Promise<void> => {
    const proxy = getAppliedProxy(await loadState());

    if (proxy) {
        await chrome.proxy.settings.set({
            value: buildProxyConfig(proxy),
            scope: 'regular',
        });
    } else {
        await chrome.proxy.settings.clear({ scope: 'regular' });
    }

    await updateBadge(Boolean(proxy));
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

    chrome.runtime.onStartup.addListener(() => enqueue(applyProxy));
    chrome.runtime.onInstalled.addListener(() => enqueue(applyProxy));
};
