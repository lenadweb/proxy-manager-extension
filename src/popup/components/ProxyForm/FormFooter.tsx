import { FC } from 'react';
import { Activity, Check } from 'lucide-react';
import { t } from 'src/shared/i18n';
import { ProxyTestResult } from 'src/shared/proxyTest';
import Button, { ButtonVariant } from 'src/popup/components/Button';
import TestResult from './TestResult';

export enum PendingAction {
    Test = 'test',
    Save = 'save',
}

type Props = {
    pendingAction: PendingAction | null;
    testResult: ProxyTestResult | null;
    onTest: () => void;
    onSaveAnyway: () => void;
    canSuggestCountry: (countryCode: string) => boolean;
    onUseCountry: (countryCode: string) => void;
};

const FormFooter: FC<Props> = ({
    pendingAction,
    testResult,
    onTest,
    onSaveAnyway,
    canSuggestCountry,
    onUseCountry,
}) => {
    const isBusy = pendingAction !== null;
    const isTesting = pendingAction === PendingAction.Test;
    const isSaving = pendingAction === PendingAction.Save;

    return (
        <div className="sticky bottom-0 -mx-3 mt-auto space-y-2.5 bg-linear-to-t from-background from-70% to-background/0 px-3 pt-6 pb-3">
            {testResult && !isBusy && (
                <TestResult
                    result={testResult}
                    onSaveAnyway={onSaveAnyway}
                    canSuggestCountry={canSuggestCountry}
                    onUseCountry={onUseCountry}
                />
            )}
            <div className="flex gap-2">
                <Button
                    icon={Activity}
                    isLoading={isTesting}
                    disabled={isBusy}
                    onClick={onTest}
                >
                    {t(isTesting ? 'testing' : 'test')}
                </Button>
                <Button
                    type="submit"
                    variant={ButtonVariant.Primary}
                    icon={Check}
                    isLoading={isSaving}
                    disabled={isBusy}
                    className="flex-1"
                >
                    {t(isSaving ? 'checking' : 'save')}
                </Button>
            </div>
        </div>
    );
};

export default FormFooter;
