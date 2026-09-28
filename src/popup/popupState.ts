import { ProxyProfile } from 'src/shared/types';
import { createDraft, ProxyDraft } from 'src/popup/components/ProxyForm/draft';

export enum Screen {
    List = 'list',
    Form = 'form',
}

export enum FormSection {
    Icon = 'icon',
    Auth = 'auth',
    Bypass = 'bypass',
}

export type FormState = {
    editingId: string | null;
    draft: ProxyDraft;
    openSections: FormSection[];
};

export type PopupState =
    { screen: Screen.List } | { screen: Screen.Form; form: FormState };

const STORAGE_KEY = 'popupState';

export const LIST_STATE: PopupState = { screen: Screen.List };

export const createFormState = (proxy: ProxyProfile | null): PopupState => ({
    screen: Screen.Form,
    form: {
        editingId: proxy?.id ?? null,
        draft: createDraft(proxy),
        openSections: proxy?.username ? [FormSection.Auth] : [],
    },
});

export const loadPopupState = async (): Promise<PopupState> => {
    const stored = await chrome.storage.local.get({
        [STORAGE_KEY]: LIST_STATE,
    });
    return stored[STORAGE_KEY] as PopupState;
};

export const savePopupState = (state: PopupState): Promise<void> =>
    chrome.storage.local.set({ [STORAGE_KEY]: state });
