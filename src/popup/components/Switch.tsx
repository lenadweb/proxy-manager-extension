import { FC } from 'react';
import cn from 'classnames';

type Props = {
    isOn: boolean;
    label: string;
    onToggle: () => void;
};

const Switch: FC<Props> = ({ isOn, label, onToggle }) => (
    <button
        type="button"
        role="switch"
        aria-checked={isOn}
        aria-label={label}
        onClick={onToggle}
        className={cn(
            'relative inline-flex h-4 w-[30px] shrink-0 cursor-pointer items-center rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
            isOn ? 'bg-blue-accent' : 'bg-black-600'
        )}
    >
        <span
            className={cn(
                'inline-block size-3 rounded-full bg-white-100 transition',
                isOn ? 'translate-x-4' : 'translate-x-0.5'
            )}
        />
    </button>
);

export default Switch;
