import { FC, InputHTMLAttributes, ReactNode, useId } from 'react';
import cn from 'classnames';
import { LucideIcon } from 'lucide-react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    icon?: LucideIcon;
    error?: string;
    trailing?: ReactNode;
    containerClassName?: string;
};

const TextField: FC<Props> = ({
    label,
    icon: LeadingIcon,
    error,
    trailing,
    containerClassName,
    className,
    ...inputProps
}) => {
    const id = useId();
    const errorId = `${id}-error`;
    const hasTrailing = Boolean(trailing);

    return (
        <div className={containerClassName}>
            <label
                htmlFor={id}
                className="mb-1.5 block text-[12px] font-medium text-black-200"
            >
                {label}
            </label>
            <div className="group/field relative">
                {LeadingIcon && (
                    <LeadingIcon
                        aria-hidden
                        className={cn(
                            'pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 transition-colors',
                            error
                                ? 'text-danger'
                                : 'text-black-500 group-focus-within/field:text-blue-light'
                        )}
                    />
                )}
                <input
                    id={id}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? errorId : undefined}
                    spellCheck={false}
                    autoCapitalize="off"
                    autoComplete="off"
                    className={cn(
                        'block h-11 w-full rounded-xl border bg-background px-3.5 text-sm text-white caret-blue-light transition-colors placeholder:text-black-500 hover:border-black-500 focus:border-blue-accent focus:outline-none disabled:cursor-default disabled:opacity-40',
                        error ? 'border-danger' : 'border-black-600',
                        LeadingIcon && 'pl-10',
                        hasTrailing && 'pr-11',
                        className
                    )}
                    {...inputProps}
                />
                {hasTrailing && (
                    <div className="absolute top-1/2 right-1.5 -translate-y-1/2">
                        {trailing}
                    </div>
                )}
            </div>
            {error && (
                <p id={errorId} className="mt-1 text-[11px] text-danger">
                    {error}
                </p>
            )}
        </div>
    );
};

export default TextField;
