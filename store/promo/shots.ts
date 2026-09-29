import { ProxyState } from 'src/shared/types';
import { createDraft } from 'src/popup/components/ProxyForm/draft';
import { LIST_STATE, PopupState, Screen } from 'src/popup/popupState';
import { createProxyState, GERMANY, JAPAN } from './fixtures';

export enum ShotId {
    Configurable = '1',
    Private = '2',
}

export enum Tone {
    Dark = 'dark',
    Deep = 'deep',
}

export enum CalloutKind {
    Credentials = 'credentials',
    Privacy = 'privacy',
}

export type Callout = {
    kind: CalloutKind;
    top: number;
};

export type Shot = {
    tone: Tone;
    state: ProxyState;
    popupState: PopupState;
    panelHeight: number;
    callout: Callout;
};

const NEW_JAPAN_PROXY_FORM: PopupState = {
    screen: Screen.Form,
    form: { editingId: null, draft: createDraft(JAPAN), openSections: [] },
};

export const SHOTS: Record<ShotId, Shot> = {
    [ShotId.Configurable]: {
        tone: Tone.Deep,
        state: createProxyState(GERMANY.id),
        popupState: NEW_JAPAN_PROXY_FORM,
        panelHeight: 540,
        callout: { kind: CalloutKind.Credentials, top: 390 },
    },
    [ShotId.Private]: {
        tone: Tone.Dark,
        state: createProxyState(GERMANY.id),
        popupState: LIST_STATE,
        panelHeight: 490,
        callout: { kind: CalloutKind.Privacy, top: 400 },
    },
};
