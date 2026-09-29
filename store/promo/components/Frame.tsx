import { FC, ReactNode } from 'react';
import cn from 'classnames';
import { Tone } from '../shots';

type Skin = {
    background: string;
    glow: string;
    arc: string;
    text: string;
};

export const SKINS: Record<Tone, Skin> = {
    [Tone.Dark]: {
        background: '#131316',
        glow: 'radial-gradient(circle, rgba(37, 99, 235, 0.32), transparent 66%)',
        arc: 'rgba(255, 255, 255, 0.025)',
        text: 'text-white-100',
    },
    [Tone.Deep]: {
        background: 'linear-gradient(135deg, #0b1430 0%, #122457 100%)',
        glow: 'radial-gradient(circle, rgba(79, 139, 255, 0.4), transparent 64%)',
        arc: 'rgba(255, 255, 255, 0.04)',
        text: 'text-white',
    },
};

type Props = {
    width: number;
    height: number;
    tone: Tone;
    children: ReactNode;
};

const Frame: FC<Props> = ({ width, height, tone, children }) => {
    const skin = SKINS[tone];

    return (
        <div
            className={cn('relative overflow-hidden', skin.text)}
            style={{ width, height, background: skin.background }}
        >
            <div
                aria-hidden
                className="pointer-events-none absolute rounded-full"
                style={{
                    left: -width * 0.34,
                    top: -height * 0.3,
                    width: width * 1.02,
                    height: width * 1.02,
                    background: skin.arc,
                }}
            />
            <div
                aria-hidden
                className="pointer-events-none absolute rounded-full"
                style={{
                    right: -width * 0.14,
                    top: -height * 0.44,
                    width: width * 0.84,
                    height: width * 0.84,
                    background: skin.glow,
                }}
            />
            {children}
        </div>
    );
};

export default Frame;
