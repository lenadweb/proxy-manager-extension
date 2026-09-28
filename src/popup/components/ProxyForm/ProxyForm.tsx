import { FC, FormEvent, useState } from 'react';
import { t } from 'src/shared/i18n';
import { ProxyTestStatus } from 'src/shared/proxyTest';
import { ProxyProfile } from 'src/shared/types';
import { FormSection, FormState } from 'src/popup/popupState';
import Icon from 'src/popup/components/Icon';
import AuthSection from './AuthSection';
import BypassSection from './BypassSection';
import ConnectionSection from './ConnectionSection';
import FormFooter, { PendingAction } from './FormFooter';
import { useProxyForm } from './useProxyForm';
import { useProxyTest } from './useProxyTest';

type Props = {
    form: FormState;
    onFormChange: (form: FormState) => void;
    onSave: (proxy: ProxyProfile) => void;
    onCancel: () => void;
};

const ProxyForm: FC<Props> = ({ form, onFormChange, onSave, onCancel }) => {
    const {
        draft,
        errors,
        connectionSignature,
        updateDraft,
        changeScheme,
        fillFromProxyString,
        isSectionOpen,
        toggleFormSection,
        buildProfile,
    } = useProxyForm(form, onFormChange);
    const { result: testResult, runTest } = useProxyTest(connectionSignature);
    const [pendingAction, setPendingAction] = useState<PendingAction | null>(
        null
    );
    const isNew = form.editingId === null;

    const runPending = async (
        action: PendingAction,
        task: () => Promise<void>
    ) => {
        setPendingAction(action);
        try {
            await task();
        } finally {
            setPendingAction(null);
        }
    };

    const saveIfWorking = async (profile: ProxyProfile) => {
        const result = await runTest(profile);
        if (result.status === ProxyTestStatus.Passed) onSave(profile);
    };

    const handleTest = () => {
        const profile = buildProfile();
        if (!profile) return;

        runPending(PendingAction.Test, async () => {
            await runTest(profile);
        }).catch(console.error);
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        const profile = buildProfile();
        if (!profile) return;

        if (testResult?.status === ProxyTestStatus.Passed) {
            onSave(profile);
            return;
        }
        runPending(PendingAction.Save, () => saveIfWorking(profile)).catch(
            console.error
        );
    };

    const handleSaveAnyway = () => {
        const profile = buildProfile();
        if (profile) onSave(profile);
    };

    return (
        <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-1 flex-col"
        >
            <div className="mb-5 flex items-center gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    aria-label={t('back')}
                    className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-black-700 text-black-200 transition-colors hover:bg-black-600 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-95"
                >
                    <Icon name="back" />
                </button>
                <h1 className="text-[20px] font-medium">
                    {t(isNew ? 'add_proxy' : 'edit_proxy')}
                </h1>
            </div>

            <div className="space-y-2.5">
                <ConnectionSection
                    draft={draft}
                    errors={errors}
                    isNew={isNew}
                    onChange={updateDraft}
                    onSchemeChange={changeScheme}
                    onProxyString={fillFromProxyString}
                />
                <AuthSection
                    draft={draft}
                    isOpen={isSectionOpen(FormSection.Auth)}
                    onToggle={() => toggleFormSection(FormSection.Auth)}
                    onChange={updateDraft}
                />
                <BypassSection
                    value={draft.bypass}
                    isOpen={isSectionOpen(FormSection.Bypass)}
                    onToggle={() => toggleFormSection(FormSection.Bypass)}
                    onChange={(bypass) => updateDraft({ bypass })}
                />
            </div>

            <FormFooter
                pendingAction={pendingAction}
                testResult={testResult}
                onCancel={onCancel}
                onTest={handleTest}
                onSaveAnyway={handleSaveAnyway}
            />
        </form>
    );
};

export default ProxyForm;
