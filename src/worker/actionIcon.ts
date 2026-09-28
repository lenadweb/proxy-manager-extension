import {
    ACTION_ICON_SIZES,
    ActionIconSize,
    getIconKey,
    loadActionIcons,
    RenderedActionIcon,
} from 'src/shared/actionIcons';
import { ProxyProfile } from 'src/shared/types';

const DEFAULT_ICON_PATHS: Record<ActionIconSize, string> = {
    16: 'icons/16.png',
    32: 'icons/32.png',
};
const BADGE_TEXT_ON = 'ON';
const BADGE_BACKGROUND = '#2563EB';
const BADGE_TEXT_COLOR = '#FFFFFF';

const decodeImage = async (
    dataUrl: string,
    size: ActionIconSize
): Promise<ImageData> => {
    const blob = await (await fetch(dataUrl)).blob();
    const bitmap = await createImageBitmap(blob);
    const canvas = new OffscreenCanvas(size, size);
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D context is unavailable');

    context.drawImage(bitmap, 0, 0, size, size);
    return context.getImageData(0, 0, size, size);
};

const toImageData = async (
    rendered: RenderedActionIcon
): Promise<Record<ActionIconSize, ImageData>> =>
    Object.fromEntries(
        await Promise.all(
            ACTION_ICON_SIZES.map(async (size) => [
                size,
                await decodeImage(rendered[size], size),
            ])
        )
    ) as Record<ActionIconSize, ImageData>;

const findRenderedIcon = async (
    proxy: ProxyProfile | null
): Promise<RenderedActionIcon | null> => {
    if (!proxy?.icon) return null;

    const cache = await loadActionIcons();
    return cache[getIconKey(proxy.icon)] ?? null;
};

const setBadge = async (text: string): Promise<void> => {
    await chrome.action.setBadgeBackgroundColor({ color: BADGE_BACKGROUND });
    await chrome.action.setBadgeTextColor({ color: BADGE_TEXT_COLOR });
    await chrome.action.setBadgeText({ text });
};

export const updateActionIcon = async (
    proxy: ProxyProfile | null
): Promise<void> => {
    const rendered = await findRenderedIcon(proxy);

    if (rendered) {
        await chrome.action.setIcon({ imageData: await toImageData(rendered) });
        await setBadge('');
        return;
    }

    await chrome.action.setIcon({ path: DEFAULT_ICON_PATHS });
    await setBadge(proxy ? BADGE_TEXT_ON : '');
};
