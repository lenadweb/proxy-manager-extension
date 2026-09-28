import { FC } from 'react';
import { ArrowRight, CircleAlert, CircleCheck } from 'lucide-react';
import { t } from 'src/shared/i18n';
import {
    FailedProxyTest,
    PassedProxyTest,
    ProxyTestResult,
    ProxyTestStatus,
} from 'src/shared/proxyTest';
import { describeTestFailure } from 'src/popup/errorText';
import CountryFlag from 'src/popup/components/ProxyIcon/CountryFlag';

type Props = {
    result: ProxyTestResult;
    onSaveAnyway: () => void;
    canSuggestCountry: (countryCode: string) => boolean;
    onUseCountry: (countryCode: string) => void;
};

const linkClass =
    'inline-flex cursor-pointer items-center gap-1 rounded text-[12px] font-medium text-blue-light transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-white';

const PassedTest: FC<{
    result: PassedProxyTest;
    canSuggestCountry: Props['canSuggestCountry'];
    onUseCountry: Props['onUseCountry'];
}> = ({ result, canSuggestCountry, onUseCountry }) => {
    const details = [result.ip, result.country, `${result.latencyMs} ms`]
        .filter(Boolean)
        .join(' · ');
    const country = result.country;

    return (
        <div
            role="status"
            className="flex items-center gap-3 rounded-2xl bg-black-700 px-3.5 py-3"
        >
            <CircleCheck
                aria-hidden
                className="size-5 shrink-0 text-blue-light"
            />
            <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-white-100">
                    {t('test_passed')}
                </p>
                <p className="truncate text-[11px] text-black-400 tabular-nums">
                    {details}
                </p>
            </div>
            {country && canSuggestCountry(country) && (
                <button
                    type="button"
                    onClick={() => onUseCountry(country)}
                    className={`${linkClass} shrink-0`}
                >
                    <CountryFlag code={country} className="h-3 w-4.5" />
                    {t('use_flag')}
                </button>
            )}
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
            className="flex items-start gap-3 rounded-2xl bg-black-700 px-3.5 py-3"
        >
            <CircleAlert aria-hidden className="size-5 shrink-0 text-danger" />
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
                <button
                    type="button"
                    onClick={onSaveAnyway}
                    className={`${linkClass} mt-2`}
                >
                    {t('save_anyway')}
                    <ArrowRight aria-hidden className="size-3.5" />
                </button>
            </div>
        </div>
    );
};

const TestResult: FC<Props> = ({
    result,
    onSaveAnyway,
    canSuggestCountry,
    onUseCountry,
}) =>
    result.status === ProxyTestStatus.Passed ? (
        <PassedTest
            result={result}
            canSuggestCountry={canSuggestCountry}
            onUseCountry={onUseCountry}
        />
    ) : (
        <FailedTest result={result} onSaveAnyway={onSaveAnyway} />
    );

export default TestResult;
