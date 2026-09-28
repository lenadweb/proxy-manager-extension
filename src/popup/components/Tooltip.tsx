import { FC, ReactNode } from 'react';
import cn from 'classnames';

export enum TooltipPlacement {
    Top = 'top',
    Bottom = 'bottom',
}

export enum TooltipAlign {
    Start = 'start',
    Center = 'center',
    End = 'end',
}

export enum TooltipSize {
    Small = 'small',
    Large = 'large',
}

type Props = {
    label: string;
    placement?: TooltipPlacement;
    align?: TooltipAlign;
    size?: TooltipSize;
    className?: string;
    children: ReactNode;
};

const PLACEMENT_CLASSES: Record<TooltipPlacement, string> = {
    [TooltipPlacement.Top]: 'bottom-full mb-1.5 translate-y-1',
    [TooltipPlacement.Bottom]: 'top-full mt-1.5 -translate-y-1',
};

const ALIGN_CLASSES: Record<TooltipAlign, string> = {
    [TooltipAlign.Start]: 'left-0',
    [TooltipAlign.Center]: 'left-1/2 -translate-x-1/2',
    [TooltipAlign.End]: 'right-0',
};

const SIZE_CLASSES: Record<TooltipSize, string> = {
    [TooltipSize.Small]: 'rounded-lg px-2 py-1 text-[10px] leading-4',
    [TooltipSize.Large]: 'rounded-xl px-3 py-1.5 text-[12px] leading-5',
};

const Tooltip: FC<Props> = ({
    label,
    placement = TooltipPlacement.Top,
    align = TooltipAlign.Center,
    size = TooltipSize.Small,
    className,
    children,
}) => (
    <span className={cn('group/tooltip relative inline-flex', className)}>
        {children}
        <span
            role="tooltip"
            className={cn(
                'pointer-events-none absolute z-20 whitespace-nowrap bg-black-600 font-medium text-white-100 opacity-0 shadow-3xl transition duration-150 group-focus-within/tooltip:translate-y-0 group-focus-within/tooltip:opacity-100 group-hover/tooltip:translate-y-0 group-hover/tooltip:opacity-100',
                PLACEMENT_CLASSES[placement],
                ALIGN_CLASSES[align],
                SIZE_CLASSES[size]
            )}
        >
            {label}
        </span>
    </span>
);

export default Tooltip;
