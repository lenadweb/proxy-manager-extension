import { createElement } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import {
    ACTION_ICON_SIZES,
    ActionIconSize,
    RenderedActionIcon,
} from 'src/shared/actionIcons';
import { ProxyIcon, ProxyIconKind, SymbolIcon } from 'src/shared/types';
import { getFlagUrl } from 'src/popup/components/ProxyIcon/countries';
import { SYMBOL_ICONS } from 'src/popup/components/ProxyIcon/symbolIcons';

const SYMBOL_BACKGROUND = '#2563EB';
const SYMBOL_COLOR = '#FFFFFF';
const SYMBOL_STROKE_WIDTH = 2.5;
const SYMBOL_INSET_RATIO = 0.2;
const SYMBOL_RADIUS_RATIO = 0.25;
const FLAG_ASPECT_RATIO = 2 / 3;
const FLAG_RADIUS_RATIO = 0.12;

type Draw = (
    context: CanvasRenderingContext2D,
    image: HTMLImageElement,
    size: number
) => void;

const renderSymbolMarkup = (symbol: SymbolIcon): string => {
    const container = document.createElement('div');
    const root = createRoot(container);

    flushSync(() =>
        root.render(
            createElement(SYMBOL_ICONS[symbol], {
                color: SYMBOL_COLOR,
                strokeWidth: SYMBOL_STROKE_WIDTH,
            })
        )
    );
    const markup = container.innerHTML;
    root.unmount();

    return markup;
};

const toSvgDataUrl = (markup: string): string =>
    `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;

const loadImage = (source: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error(`Cannot load ${source}`));
        image.src = source;
    });

const drawFlag: Draw = (context, image, size) => {
    const height = Math.round(size * FLAG_ASPECT_RATIO);
    const top = Math.round((size - height) / 2);

    context.beginPath();
    context.roundRect(0, top, size, height, size * FLAG_RADIUS_RATIO);
    context.clip();
    context.drawImage(image, 0, top, size, height);
};

const drawSymbol: Draw = (context, image, size) => {
    const inset = Math.round(size * SYMBOL_INSET_RATIO);

    context.fillStyle = SYMBOL_BACKGROUND;
    context.beginPath();
    context.roundRect(0, 0, size, size, size * SYMBOL_RADIUS_RATIO);
    context.fill();
    context.drawImage(image, inset, inset, size - inset * 2, size - inset * 2);
};

const toPngDataUrl = (
    image: HTMLImageElement,
    draw: Draw,
    size: ActionIconSize
): string => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D context is unavailable');

    draw(context, image, size);
    return canvas.toDataURL('image/png');
};

const getSourceAndDraw = (
    icon: ProxyIcon
): { source: string; draw: Draw } | null => {
    if (icon.kind === ProxyIconKind.Symbol) {
        return {
            source: toSvgDataUrl(renderSymbolMarkup(icon.symbol)),
            draw: drawSymbol,
        };
    }

    const flagUrl = getFlagUrl(icon.code);
    return flagUrl ? { source: flagUrl, draw: drawFlag } : null;
};

export const renderActionIcon = async (
    icon: ProxyIcon
): Promise<RenderedActionIcon | null> => {
    const recipe = getSourceAndDraw(icon);
    if (!recipe) return null;

    const image = await loadImage(recipe.source);

    return Object.fromEntries(
        ACTION_ICON_SIZES.map((size) => [
            size,
            toPngDataUrl(image, recipe.draw, size),
        ])
    ) as RenderedActionIcon;
};
