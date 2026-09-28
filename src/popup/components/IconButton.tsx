import { FC } from 'react';
import cn from 'classnames';
import { LucideIcon } from 'lucide-react';
import Tooltip, {
    TooltipAlign,
    TooltipPlacement,
} from 'src/popup/components/Tooltip';

export enum IconButtonTone {
    Plain = 'plain',
    Filled = 'filled',
    Danger = 'danger',
}

type Props = {
    icon: LucideIcon;
    label: string;
    tone?: IconButtonTone;
    tooltipPlacement?: TooltipPlacement;
    tooltipAlign?: TooltipAlign;
    onClick: () => void;
};

const TONE_CLASSES: Record<IconButtonTone, string> = {
    [IconButtonTone.Plain]:
        'text-black-200 hover:bg-black-600 hover:text-white',
    [IconButtonTone.Filled]:
        'bg-black-700 text-black-200 hover:bg-black-600 hover:text-white',
    [IconButtonTone.Danger]:
        'text-black-200 hover:bg-black-600 hover:text-danger',
};

const IconButton: FC<Props> = ({
    icon: IconComponent,
    label,
    tone = IconButtonTone.Plain,
    tooltipPlacement,
    tooltipAlign,
    onClick,
}) => (
    <Tooltip label={label} placement={tooltipPlacement} align={tooltipAlign}>
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className={cn(
                'flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-white active:scale-95',
                TONE_CLASSES[tone]
            )}
        >
            <IconComponent aria-hidden className="size-4" />
        </button>
    </Tooltip>
);

export default IconButton;
