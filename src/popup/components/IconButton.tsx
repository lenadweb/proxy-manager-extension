import { FC } from 'react';
import cn from 'classnames';
import Icon, { IconName } from 'src/popup/components/Icon';

type Props = {
    icon: IconName;
    label: string;
    isDanger?: boolean;
    onClick: () => void;
};

const IconButton: FC<Props> = ({ icon, label, isDanger, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        aria-label={label}
        title={label}
        className={cn(
            'flex size-8 cursor-pointer items-center justify-center rounded-full text-black-200 transition-colors hover:bg-black-600 focus-visible:outline-2 focus-visible:outline-white active:scale-95',
            isDanger ? 'hover:text-danger' : 'hover:text-white'
        )}
    >
        <Icon name={icon} />
    </button>
);

export default IconButton;
