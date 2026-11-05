import { getRoutingFingerprint } from 'src/shared/connection';
import { getAppliedProxy } from 'src/shared/proxy';
import { loadState } from 'src/shared/storage';
import { ProxyControl } from 'src/shared/types';

const RECOVERY_KEY = 'proxyTestRecovery';
export type TestRecovery = {
    original: chrome.proxy.ProxyConfig;
    owned: boolean;
    temporary: chrome.proxy.ProxyConfig;
};

export const rememberTest = (journal: TestRecovery): Promise<void> =>
    chrome.storage.local.set({ [RECOVERY_KEY]: journal });

export const forgetTest = (): Promise<void> =>
    chrome.storage.local.remove(RECOVERY_KEY);

export const recoverInterruptedTest = async (): Promise<void> => {
    const stored = await chrome.storage.local.get(RECOVERY_KEY);
    const journal = stored[RECOVERY_KEY] as TestRecovery | undefined;
    if (!journal) return;
    const settings = await chrome.proxy.settings.get({ incognito: false });
    // A controller that took over while a test ran must not be overwritten.
    if (
        settings.levelOfControl === ProxyControl.ControlledByThisExtension &&
        settings.value.mode === 'pac_script' &&
        settings.value.pacScript?.data === journal.temporary.pacScript?.data
    ) {
        if (journal.owned) {
            await chrome.proxy.settings.set({
                value: journal.original,
                scope: 'regular',
            });
        } else {
            await chrome.proxy.settings.clear({ scope: 'regular' });
        }
    } else if (
        settings.levelOfControl !== ProxyControl.ControlledByThisExtension
    ) {
        // Clear our masked temporary preference so it cannot surface later.
        await chrome.proxy.settings.clear({ scope: 'regular' });
    }
    await forgetTest();
};

export const desiredRouting = async (): Promise<string> => {
    const proxy = getAppliedProxy(await loadState());
    return proxy ? `${proxy.id}:${await getRoutingFingerprint(proxy)}` : 'off';
};
