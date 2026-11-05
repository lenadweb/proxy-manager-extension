import { MessageType } from './proxyTest';

export type ProxyExtension = {
    id: string;
    name: string;
    mayDisable: boolean;
};

export type ExtensionResult = {
    extensions: ProxyExtension[];
    error: string | null;
};

export const requestProxyExtensions = async (): Promise<ExtensionResult> => {
    // Must run directly from a user gesture so Chrome can show its own optional
    // permission prompt. Merely installing/updating never disables extensions.
    const granted = await chrome.permissions.request({
        permissions: ['management'],
    });
    if (!granted) return { extensions: [], error: 'permission_denied' };
    return chrome.runtime.sendMessage({
        type: MessageType.ListProxyExtensions,
    });
};

export const takeProxyControl = (
    extensionId: string
): Promise<ExtensionResult> =>
    chrome.runtime.sendMessage({
        type: MessageType.TakeProxyControl,
        extensionId,
    });
