import { ButtonHTMLAttributes, FC } from 'react';
import cn from 'classnames';
import { LoaderCircle, LucideIcon } from 'lucide-react';

export enum ButtonVariant {
    Primary = 'primary',
    Secondary = 'secondary',
    Danger = 'danger',
}

export enum ButtonSize {
    Regular = 'regular',
    Small = 'small',
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: LucideIcon;
    isLoading?: boolean;
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
    [ButtonVariant.Primary]:
        'bg-blue-accent text-white enabled:hover:bg-blue-hover',
    [ButtonVariant.Secondary]:
        'bg-black-600 text-white-100 enabled:hover:bg-black-500',
    [ButtonVariant.Danger]: 'bg-danger text-white enabled:hover:opacity-90',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
    [ButtonSize.Regular]: 'h-11 px-5 text-sm',
    [ButtonSize.Small]: 'gap-1.5 px-3.5 py-1.5 text-[12px]',
};

const ICON_CLASSES: Record<ButtonSize, string> = {
    [ButtonSize.Regular]: 'size-4',
    [ButtonSize.Small]: 'size-3.5',
};

const Button: FC<Props> = ({
    variant = ButtonVariant.Secondary,
    size = ButtonSize.Regular,
    icon,
    isLoading = false,
    type = 'button',
    disabled,
    className,
    children,
    ...props
}) => {
    const LeadingIcon = isLoading ? LoaderCircle : icon;

    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            className={cn(
                'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white enabled:active:scale-[0.98] disabled:cursor-default',
                VARIANT_CLASSES[variant],
                SIZE_CLASSES[size],
                className
            )}
            {...props}
        >
            {LeadingIcon && (
                <LeadingIcon
                    aria-hidden
                    className={cn(
                        'shrink-0',
                        ICON_CLASSES[size],
                        isLoading && 'animate-spin'
                    )}
                />
            )}
            {children}
        </button>
    );
};

export default Button;
