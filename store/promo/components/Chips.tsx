import { FC } from 'react';
import cn from 'classnames';

export enum ChipSize {
    Regular = 'regular',
    Small = 'small',
}

type Props = {
    labels: string[];
    size?: ChipSize;
};

const ROW_CLASSES: Record<ChipSize, string> = {
    [ChipSize.Regular]: 'gap-3',
    [ChipSize.Small]: 'gap-2',
};

const CHIP_CLASSES: Record<ChipSize, string> = {
    [ChipSize.Regular]: 'px-5 py-2.5 text-[18px]',
    [ChipSize.Small]: 'px-3 py-1.5 text-[11px]',
};

const Chips: FC<Props> = ({ labels, size = ChipSize.Regular }) => (
    <div className={cn('flex', ROW_CLASSES[size])}>
        {labels.map((label) => (
            <span
                key={label}
                className={cn(
                    'rounded-full bg-white/[0.07] font-bold uppercase tracking-wide text-white-100 ring-1 ring-inset ring-white/10',
                    CHIP_CLASSES[size]
                )}
            >
                {label}
            </span>
        ))}
    </div>
);

export default Chips;
