import {
    ActionIconCache,
    getIconKey,
    loadActionIcons,
    RenderedActionIcon,
    saveActionIcons,
} from 'src/shared/actionIcons';
import { ProxyIcon, ProxyProfile } from 'src/shared/types';
import { renderActionIcon } from './renderActionIcon';

type RenderedEntry = [string, RenderedActionIcon | null];

const collectIcons = (proxies: ProxyProfile[]): Map<string, ProxyIcon> =>
    new Map(
        proxies.flatMap(({ icon }) =>
            icon ? [[getIconKey(icon), icon] as const] : []
        )
    );

const renderMissing = (
    icons: Map<string, ProxyIcon>,
    cache: ActionIconCache
): Promise<RenderedEntry[]> =>
    Promise.all(
        [...icons]
            .filter(([key]) => !cache[key])
            .map(async ([key, icon]): Promise<RenderedEntry> => [
                key,
                await renderActionIcon(icon),
            ])
    );

export const syncActionIcons = async (
    proxies: ProxyProfile[]
): Promise<void> => {
    const icons = collectIcons(proxies);
    const cache = await loadActionIcons();
    const hasStaleEntries = Object.keys(cache).some((key) => !icons.has(key));
    const rendered = await renderMissing(icons, cache);

    if (!rendered.length && !hasStaleEntries) return;

    const keptEntries = Object.entries(cache).filter(([key]) => icons.has(key));
    const newEntries = rendered.filter(
        (entry): entry is [string, RenderedActionIcon] => entry[1] !== null
    );

    await saveActionIcons(Object.fromEntries([...keptEntries, ...newEntries]));
};
