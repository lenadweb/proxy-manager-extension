import { useState } from 'react';
import {
    isFullProxyString,
    parseProxyString,
} from 'src/shared/parseProxyString';
import { getConnectionSignature } from 'src/shared/proxy';
import { ProxyIcon, ProxyProfile, ProxyScheme } from 'src/shared/types';
import { FieldErrors, hasErrors, validateAddress } from 'src/shared/validation';
import { FormSection, FormState } from 'src/popup/popupState';
import {
    draftToProfile,
    getParsedProxyPatch,
    getSchemePatch,
    ProxyDraft,
} from './draft';

const withoutErrorsFor = (
    errors: FieldErrors,
    patch: Partial<ProxyDraft>
): FieldErrors =>
    Object.fromEntries(
        Object.entries(errors).filter(([field]) => !(field in patch))
    );

const withSection = (
    sections: FormSection[],
    section: FormSection
): FormSection[] =>
    sections.includes(section) ? sections : [...sections, section];

const toggleSection = (
    sections: FormSection[],
    section: FormSection
): FormSection[] =>
    sections.includes(section)
        ? sections.filter((item) => item !== section)
        : [...sections, section];

export const useProxyForm = (
    form: FormState,
    onFormChange: (form: FormState) => void
) => {
    const [errors, setErrors] = useState<FieldErrors>({});
    const { draft, openSections } = form;
    const connectionSignature = getConnectionSignature(
        draftToProfile(draft, '')
    );

    const applyDraftPatch = (
        patch: Partial<ProxyDraft>,
        sections: FormSection[] = openSections
    ) => {
        onFormChange({
            ...form,
            draft: { ...draft, ...patch },
            openSections: sections,
        });
        setErrors((current) => withoutErrorsFor(current, patch));
    };

    const updateDraft = (patch: Partial<ProxyDraft>) => {
        applyDraftPatch(patch);
    };

    const changeScheme = (scheme: ProxyScheme) => {
        applyDraftPatch(getSchemePatch(draft, scheme));
    };

    const fillFromProxyString = (value: string): boolean => {
        const parsed = parseProxyString(value);
        if (!isFullProxyString(parsed)) return false;

        const sections = parsed.username
            ? withSection(openSections, FormSection.Auth)
            : openSections;
        applyDraftPatch(getParsedProxyPatch(parsed), sections);
        return true;
    };

    const isSectionOpen = (section: FormSection): boolean =>
        openSections.includes(section);

    const toggleFormSection = (section: FormSection) => {
        onFormChange({
            ...form,
            openSections: toggleSection(openSections, section),
        });
    };

    const selectIcon = (icon: ProxyIcon | null) => {
        onFormChange({
            ...form,
            draft: { ...draft, icon },
            openSections: openSections.filter(
                (section) => section !== FormSection.Icon
            ),
        });
    };

    const buildProfile = (): ProxyProfile | null => {
        const validationErrors = validateAddress(draft);
        setErrors(validationErrors);
        if (hasErrors(validationErrors)) return null;

        return draftToProfile(draft, form.editingId ?? crypto.randomUUID());
    };

    return {
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
    };
};
