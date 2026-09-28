import { FC } from 'react';
import cn from 'classnames';
import { ProxyControl, ProxyState } from 'src/shared/types';
import { dismissError } from 'src/popup/actions';
import ErrorBanner from './ErrorBanner';
import { getErrorText, getStatus, StatusTone } from './getStatus';

type Props = {
    state: ProxyState;
    control: ProxyControl | null;
};

const DOT_CLASSES: Record<StatusTone, string> = {
    [StatusTone.Active]:
        'bg-blue-light shadow-[0_0_0_4px_rgba(79,139,255,0.18)]',
    [StatusTone.Idle]: 'bg-black-500',
    [StatusTone.Warning]: 'bg-danger shadow-[0_0_0_4px_rgba(242,85,90,0.16)]',
};

const StatusCard: FC<Props> = ({ state, control }) => {
    const { tone, title, subtitle } = getStatus(state, control);
    const errorText = getErrorText(state);

    return (
        <div className="mb-5 rounded-3xl bg-black-700 p-5">
            <div className="flex items-center gap-3.5">
                <span
                    className={cn(
                        'size-2.5 shrink-0 rounded-full transition-colors',
                        DOT_CLASSES[tone]
                    )}
                />
                <div className="min-w-0">
                    <p className="text-base font-medium leading-snug text-white-100">
                        {title}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-black-400 tabular-nums">
                        {subtitle}
                    </p>
                </div>
            </div>
            {errorText && (
                <ErrorBanner
                    error={errorText}
                    onDismiss={() => {
                        dismissError().catch(console.error);
                    }}
                />
            )}
        </div>
    );
};

export default StatusCard;
