import { FC } from 'react';
import cn from 'classnames';

type Props = {
    isSelected: boolean;
    isActive: boolean;
};

const SelectionIndicator: FC<Props> = ({ isSelected, isActive }) => (
    <span
        className={cn(
            'flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
            {
                'border-blue-accent': isActive,
                'border-black-500': isSelected && !isActive,
                'border-black-600 group-hover:border-black-500': !isSelected,
            }
        )}
    >
        <span
            className={cn(
                'size-2 rounded-full transition',
                isSelected ? 'scale-100' : 'scale-0',
                isActive ? 'bg-blue-light' : 'bg-black-500'
            )}
        />
    </span>
);

export default SelectionIndicator;
