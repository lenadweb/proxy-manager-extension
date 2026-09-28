import { FC } from 'react';

const iconPaths = {
    plus: 'M12 5v14M5 12h14',
    edit: 'M16.86 4.49a2.1 2.1 0 1 1 2.97 2.97L8.5 18.79 4 20l1.21-4.5L16.86 4.49Z',
    trash: 'M4 7h16M10 11v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4h6v3',
    back: 'm15 18-6-6 6-6',
    lock: 'M8 11V8a4 4 0 1 1 8 0v3M6 11h12v9H6z',
    alert: 'M12 8v5m0 3h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
    close: 'm6 6 12 12M6 18 18 6',
    eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    eyeOff: 'm3 3 18 18M10.6 5.1Q11.3 5 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.6C3.8 8.4 2 12 2 12s3.5 7 10 7a9.6 9.6 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2',
    globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3Z',
    check: 'm5 12 4 4L19 6',
    loader: 'M21 12a9 9 0 1 1-6.22-8.56',
    info: 'M12 8h.01M12 11v5m9-4a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
};

export type IconName = keyof typeof iconPaths;

type Props = {
    name: IconName;
    className?: string;
};

const Icon: FC<Props> = ({ name, className = 'size-4' }) => (
    <svg
        className={`${className} shrink-0`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={iconPaths[name]}
        />
    </svg>
);

export default Icon;
