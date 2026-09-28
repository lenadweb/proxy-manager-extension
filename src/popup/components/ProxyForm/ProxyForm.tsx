import { FC, FormEvent, useState } from 'react';
import { ProxyTestStatus } from 'src/shared/proxyTest';
import { ProxyIconKind, ProxyProfile } from 'src/shared/types';
import { FormSection, FormState } from 'src/popup/popupState';
import { getFlagUrl } from 'src/popup/components/ProxyIcon/countries';
import AuthSection from './AuthSection';
import BypassSection from './BypassSection';
import ConnectionSection from './ConnectionSection';
import FormFooter, { PendingAction } from './FormFooter';
import FormHeader from './FormHeader';
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
        selectIcon,
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

    const applyCountryIcon = (code: string) =>
        selectIcon({ kind: ProxyIconKind.Country, code });

    const canSuggestCountry = (code: string) =>
        !draft.icon && getFlagUrl(code) !== null;

    return (
        <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-1 flex-col"
        >
            <FormHeader isNew={isNew} onBack={onCancel} />

            <div className="space-y-2.5">
                <ConnectionSection
                    draft={draft}
                    errors={errors}
                    isNew={isNew}
                    isIconPickerOpen={isSectionOpen(FormSection.Icon)}
                    onToggleIconPicker={() =>
                        toggleFormSection(FormSection.Icon)
                    }
                    onIconSelect={selectIcon}
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
                onTest={handleTest}
                onSaveAnyway={handleSaveAnyway}
                canSuggestCountry={canSuggestCountry}
                onUseCountry={applyCountryIcon}
            />
        </form>
    );
};

export default ProxyForm;
