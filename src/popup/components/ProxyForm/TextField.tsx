import { FC, InputHTMLAttributes, ReactNode, useId } from 'react';
import cn from 'classnames';

type Props = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
    trailing?: ReactNode;
    containerClassName?: string;
};

const TextField: FC<Props> = ({
    label,
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
            <div className="relative">
                <input
                    id={id}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? errorId : undefined}
                    spellCheck={false}
                    autoCapitalize="off"
                    autoComplete="off"
                    className={cn(
                        'block h-10 w-full rounded-xl border bg-background px-3.5 text-sm text-white caret-blue-light transition-colors placeholder:text-black-500 hover:border-black-500 focus:border-blue-accent focus:outline-none disabled:cursor-default disabled:opacity-40',
                        error ? 'border-danger' : 'border-black-600',
                        hasTrailing && 'pr-11',
                        className
                    )}
                    {...inputProps}
                />
                {hasTrailing && (
                    <div className="absolute top-1 right-1">{trailing}</div>
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
