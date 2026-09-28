import { FC } from 'react';
import { t } from 'src/shared/i18n';
import { ProxyTestResult } from 'src/shared/proxyTest';
import Button, { ButtonVariant } from 'src/popup/components/Button';
import Icon from 'src/popup/components/Icon';
import TestResult from './TestResult';

export enum PendingAction {
    Test = 'test',
    Save = 'save',
}

type Props = {
    pendingAction: PendingAction | null;
    testResult: ProxyTestResult | null;
    onCancel: () => void;
    onTest: () => void;
    onSaveAnyway: () => void;
};

const Spinner: FC = () => (
    <Icon name="loader" className="size-4 animate-spin" />
);

const FormFooter: FC<Props> = ({
    pendingAction,
    testResult,
    onCancel,
    onTest,
    onSaveAnyway,
}) => {
    const isBusy = pendingAction !== null;
    const isTesting = pendingAction === PendingAction.Test;
    const isSaving = pendingAction === PendingAction.Save;

    return (
        <div className="sticky bottom-0 -mx-3 mt-auto space-y-3 bg-background px-3 pt-4 pb-3">
            {testResult && !isBusy && (
                <TestResult result={testResult} onSaveAnyway={onSaveAnyway} />
            )}
            <div className="grid grid-cols-3 gap-2">
                <Button onClick={onCancel}>{t('cancel')}</Button>
                <Button
                    onClick={onTest}
                    disabled={isBusy}
                    className="disabled:cursor-default disabled:opacity-60"
                >
                    {isTesting && <Spinner />}
                    {t(isTesting ? 'testing' : 'test')}
                </Button>
                <Button
                    type="submit"
                    variant={ButtonVariant.Primary}
                    disabled={isBusy}
                    className="disabled:cursor-default disabled:opacity-60"
                >
                    {isSaving && <Spinner />}
                    {t(isSaving ? 'checking' : 'save')}
                </Button>
            </div>
        </div>
    );
};

export default FormFooter;
