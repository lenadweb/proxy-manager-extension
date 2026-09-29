import { FC } from 'react';
import { HeadlineLines } from '../copy';

type EyebrowProps = {
    children: string;
};

export const Eyebrow: FC<EyebrowProps> = ({ children }) => (
    <p className="m-0 flex items-center gap-4 text-[16px] font-bold uppercase leading-none tracking-[0.2em] text-blue-light">
        <span
            aria-hidden
            className="h-[3px] w-12 rounded-full bg-blue-accent"
        />
        {children}
    </p>
);

type HeadlineProps = {
    lines: HeadlineLines;
    size: number;
};

const Headline: FC<HeadlineProps> = ({ lines, size }) => (
    <h1
        data-fit={size}
        className="m-0 font-extrabold leading-[0.98] tracking-[-0.045em]"
        style={{ fontSize: size }}
    >
        {lines.map((line, index) => (
            <span
                key={line}
                className={`block whitespace-nowrap ${index === 1 ? 'text-blue-light' : ''}`}
            >
                {line}
            </span>
        ))}
    </h1>
);

export const fitHeadlines = (): void => {
    document.querySelectorAll<HTMLElement>('[data-fit]').forEach((heading) => {
        const baseSize = Number(heading.dataset.fit);
        heading.style.fontSize = `${baseSize}px`;

        const widestLine = Math.max(
            ...Array.from(heading.children).map((line) => line.scrollWidth)
        );
        if (widestLine > heading.clientWidth) {
            const fittedSize = Math.floor(
                baseSize * (heading.clientWidth / widestLine)
            );
            heading.style.fontSize = `${fittedSize}px`;
        }
    });
};

export default Headline;
