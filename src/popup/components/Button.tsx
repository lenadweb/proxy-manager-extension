import { ButtonHTMLAttributes, FC } from 'react';
import cn from 'classnames';

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
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
    [ButtonVariant.Primary]: 'bg-blue-accent text-white hover:bg-blue-hover',
    [ButtonVariant.Secondary]: 'bg-black-600 text-white-100 hover:bg-black-500',
    [ButtonVariant.Danger]: 'bg-danger text-white hover:opacity-90',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
    [ButtonSize.Regular]: 'min-h-10 px-5 py-2 text-sm',
    [ButtonSize.Small]: 'px-3.5 py-1.5 text-[12px]',
};

const Button: FC<Props> = ({
    variant = ButtonVariant.Secondary,
    size = ButtonSize.Regular,
    type = 'button',
    className,
    ...props
}) => (
    <button
        type={type}
        className={cn(
            'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98]',
            VARIANT_CLASSES[variant],
            SIZE_CLASSES[size],
            className
        )}
        {...props}
    />
);

export default Button;
