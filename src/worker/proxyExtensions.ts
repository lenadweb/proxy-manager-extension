import { MessageType } from 'src/shared/proxyTest';
import { ExtensionResult, ProxyExtension } from 'src/shared/proxyExtensions';
import { ProxyControl } from 'src/shared/types';
import { invalidateConnection } from './connectionState';
import { scheduleProxySync } from './applyProxy';
import { runExclusive } from './taskQueue';

const hasPermission = (): Promise<boolean> =>
    chrome.permissions.contains({ permissions: ['management'] });

export const listProxyExtensions = async (): Promise<ProxyExtension[]> => {
    if (!(await hasPermission())) throw new Error('permission_denied');
    return (await chrome.management.getAll())
        .filter(
            (extension) =>
                extension.id !== chrome.runtime.id &&
                extension.enabled &&
                extension.permissions.includes('proxy')
        )
        .map(({ id, name, mayDisable }) => ({ id, name, mayDisable }));
};

export const disableProxyExtension = (extensionId: string): Promise<void> =>
    runExclusive(async () => {
        if (!(await hasPermission())) throw new Error('permission_denied');
        const settings = await chrome.proxy.settings.get({ incognito: false });
        if (
            settings.levelOfControl !== ProxyControl.ControlledByOtherExtensions
        ) {
            throw new Error('conflict_changed');
        }
        const extension = (await listProxyExtensions()).find(
            ({ id }) => id === extensionId
        );
        if (!extension?.mayDisable) throw new Error('extension_not_available');
        await chrome.management.setEnabled(extension.id, false);
        invalidateConnection();
        scheduleProxySync(true);
    });

export const registerProxyExtensionControl = (): void => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        // Only the extension's popup may invoke a management mutation.
        if (
            sender.id !== chrome.runtime.id ||
            sender.url !== chrome.runtime.getURL('popup.html') ||
            !message ||
            typeof message !== 'object'
        )
            return false;
        if (
            message.type !== MessageType.ListProxyExtensions &&
            message.type !== MessageType.TakeProxyControl
        )
            return false;
        const execute = async (): Promise<ExtensionResult> => {
            try {
                if (message.type === MessageType.TakeProxyControl) {
                    if (typeof message.extensionId !== 'string')
                        throw new Error('invalid_request');
                    await disableProxyExtension(message.extensionId);
                }
                return { extensions: await listProxyExtensions(), error: null };
            } catch (error) {
                return {
                    extensions: [],
                    error:
                        error instanceof Error
                            ? error.message
                            : 'control_failed',
                };
            }
        };
        execute().then(sendResponse);
        return true;
    });
};
