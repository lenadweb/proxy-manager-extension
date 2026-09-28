import { ProxyIcon, ProxyIconKind } from 'src/shared/types';

export const ACTION_ICON_SIZES = [16, 32] as const;

export type ActionIconSize = (typeof ACTION_ICON_SIZES)[number];

export type RenderedActionIcon = Record<ActionIconSize, string>;

export type ActionIconCache = Record<string, RenderedActionIcon>;

const STORAGE_KEY = 'actionIcons';

export const getIconKey = (icon: ProxyIcon): string =>
    icon.kind === ProxyIconKind.Country
        ? `${icon.kind}:${icon.code}`
        : `${icon.kind}:${icon.symbol}`;

export const loadActionIcons = async (): Promise<ActionIconCache> => {
    const stored = await chrome.storage.local.get({ [STORAGE_KEY]: {} });
    return stored[STORAGE_KEY] as ActionIconCache;
};

export const saveActionIcons = (cache: ActionIconCache): Promise<void> =>
    chrome.storage.local.set({ [STORAGE_KEY]: cache });

export const onActionIconsChange = (listener: () => void): void => {
    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'local' && STORAGE_KEY in changes) listener();
    });
};
