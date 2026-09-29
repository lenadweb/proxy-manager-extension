import { EyeOff, HardDrive, LucideIcon, UserX } from 'lucide-react';
import { PROXY_SCHEMES } from 'src/shared/constants';
import { ShotId } from './shots';

export type HeadlineLines = [string, string];

export type ShotCopy = {
    eyebrow: string;
    title: HeadlineLines;
    sub: string;
    chips: string[];
};

export type Stat = {
    value: string;
    label: string;
};

export type PrivacyPoint = {
    icon: LucideIcon;
    label: string;
};

export const BRAND = 'Proxy Manager';

export const OPEN_SOURCE_LABEL = 'Open source';

export const SHOT_COPY: Record<ShotId, ShotCopy> = {
    [ShotId.Configurable]: {
        eyebrow: 'Fully configurable',
        title: ['Set it up', 'your way.'],
        sub: 'HTTP, HTTPS, SOCKS4 and SOCKS5 proxies with a login, bypass rules, flags and icons.',
        chips: PROXY_SCHEMES,
    },
    [ShotId.Private]: {
        eyebrow: 'Private by design',
        title: ['Your data stays', 'on your device.'],
        sub: 'Proxies and passwords are stored only in your browser. No account, no analytics, no tracking.',
        chips: ['No account', 'No ads', 'No tracking'],
    },
};

export const PRIVACY_CARD = {
    title: 'Private by design',
    summary: 'Everything stays in your browser',
    points: [
        { icon: HardDrive, label: 'Stored only in this browser' },
        { icon: UserX, label: 'No account or sign-up' },
        { icon: EyeOff, label: 'No analytics or tracking' },
    ] satisfies PrivacyPoint[],
};

export const MARQUEE_COPY = {
    title: ['Switch proxies.', 'One click.'] as HeadlineLines,
    sub: 'The HTTP, HTTPS and SOCKS5 proxy manager for Chrome.',
};

export const STATS: Stat[] = [
    { value: '4', label: 'proxy protocols' },
    { value: '1', label: 'click to switch' },
    { value: '0', label: 'accounts or ads' },
];
