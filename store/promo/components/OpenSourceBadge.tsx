import { FC } from 'react';
import cn from 'classnames';
import GithubMark from '../assets/github.svg?react';
import { OPEN_SOURCE_LABEL } from '../copy';

export enum BadgeSize {
    Regular = 'regular',
    Small = 'small',
}

type Props = {
    size?: BadgeSize;
};

const BADGE_CLASSES: Record<BadgeSize, string> = {
    [BadgeSize.Regular]: 'gap-2.5 px-5 py-2.5 text-[17px]',
    [BadgeSize.Small]: 'gap-1.5 px-3 py-1.5 text-[11px]',
};

const MARK_CLASSES: Record<BadgeSize, string> = {
    [BadgeSize.Regular]: 'size-5',
    [BadgeSize.Small]: 'size-3.5',
};

const OpenSourceBadge: FC<Props> = ({ size = BadgeSize.Regular }) => (
    <span
        className={cn(
            'inline-flex items-center rounded-full bg-blue-accent font-bold text-white shadow-[0_10px_24px_rgba(37,99,235,0.35)]',
            BADGE_CLASSES[size]
        )}
    >
        <GithubMark aria-hidden className={MARK_CLASSES[size]} />
        {OPEN_SOURCE_LABEL}
    </span>
);

export default OpenSourceBadge;
