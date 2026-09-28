import { FC } from 'react';
import { t } from 'src/shared/i18n';
import { ErrorText } from 'src/popup/errorText';
import Icon from 'src/popup/components/Icon';

type Props = {
    error: ErrorText;
    onDismiss: () => void;
};

const ErrorBanner: FC<Props> = ({ error, onDismiss }) => (
    <div
        role="alert"
        className="mt-4 flex items-start gap-2 rounded-xl bg-black-600 p-3 text-[12px] leading-relaxed text-white-100"
    >
        <Icon name="alert" className="mt-0.5 size-3.5 text-danger" />
        <div className="min-w-0 flex-1">
            <p>{error.message}</p>
            {error.detail && (
                <p className="mt-0.5 break-all text-[11px] text-black-400">
                    {error.detail}
                </p>
            )}
        </div>
        <button
            type="button"
            onClick={onDismiss}
            aria-label={t('dismiss')}
            title={t('dismiss')}
            className="-m-1 flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-black-200 transition-colors hover:bg-black-500 hover:text-white"
        >
            <Icon name="close" className="size-3.5" />
        </button>
    </div>
);

export default ErrorBanner;
