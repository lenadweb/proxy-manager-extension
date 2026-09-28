import { FC } from 'react';
import { t } from 'src/shared/i18n';
import {
    FailedProxyTest,
    PassedProxyTest,
    ProxyTestResult,
    ProxyTestStatus,
} from 'src/shared/proxyTest';
import { describeTestFailure } from 'src/popup/errorText';
import Button, { ButtonSize } from 'src/popup/components/Button';
import Icon from 'src/popup/components/Icon';

type Props = {
    result: ProxyTestResult;
    onSaveAnyway: () => void;
};

const PassedTest: FC<{ result: PassedProxyTest }> = ({ result }) => {
    const details = [result.ip, result.country, `${result.latencyMs} ms`]
        .filter(Boolean)
        .join(' · ');

    return (
        <div
            role="status"
            className="flex items-center gap-3 rounded-2xl bg-black-700 p-3"
        >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-accent/15 text-blue-light">
                <Icon name="check" className="size-3.5" />
            </span>
            <div className="min-w-0">
                <p className="text-[13px] font-medium text-white-100">
                    {t('test_passed')}
                </p>
                <p className="truncate text-[11px] text-black-400 tabular-nums">
                    {details}
                </p>
            </div>
        </div>
    );
};

const FailedTest: FC<{
    result: FailedProxyTest;
    onSaveAnyway: () => void;
}> = ({ result, onSaveAnyway }) => {
    const { message, detail } = describeTestFailure(result);

    return (
        <div
            role="alert"
            className="flex items-start gap-3 rounded-2xl bg-black-700 p-3"
        >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-danger/15 text-danger">
                <Icon name="alert" className="size-3.5" />
            </span>
            <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-white-100">
                    {t('test_failed')}
                </p>
                <p className="text-[11px] leading-relaxed text-black-200">
                    {message}
                </p>
                {detail && (
                    <p className="break-all text-[11px] text-black-400">
                        {detail}
                    </p>
                )}
                <Button
                    size={ButtonSize.Small}
                    onClick={onSaveAnyway}
                    className="mt-2.5"
                >
                    {t('save_anyway')}
                </Button>
            </div>
        </div>
    );
};

const TestResult: FC<Props> = ({ result, onSaveAnyway }) =>
    result.status === ProxyTestStatus.Passed ? (
        <PassedTest result={result} />
    ) : (
        <FailedTest result={result} onSaveAnyway={onSaveAnyway} />
    );

export default TestResult;
