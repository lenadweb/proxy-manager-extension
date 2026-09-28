import { I18nKey, t } from 'src/shared/i18n';
import { ProxyControl, ProxyState } from 'src/shared/types';
import { describeProxyError } from 'src/popup/errorText';

export enum NoticeKind {
    SettingsLocked = 'settings_locked',
    ProxyError = 'proxy_error',
}

export type Notice = {
    kind: NoticeKind;
    message: string;
    detail: string | null;
};

type LockedMessages = {
    message: I18nKey;
    detail: I18nKey;
};

const LOCKED_MESSAGES: Partial<Record<ProxyControl, LockedMessages>> = {
    [ProxyControl.ControlledByOtherExtensions]: {
        message: 'status_controlled_other',
        detail: 'status_controlled_other_hint',
    },
    [ProxyControl.NotControllable]: {
        message: 'status_not_controllable',
        detail: 'status_not_controllable_hint',
    },
};

export const getNotice = (
    state: ProxyState,
    control: ProxyControl | null
): Notice | null => {
    const locked = control && LOCKED_MESSAGES[control];
    if (locked) {
        return {
            kind: NoticeKind.SettingsLocked,
            message: t(locked.message),
            detail: t(locked.detail),
        };
    }

    if (state.isEnabled && state.lastError) {
        return {
            kind: NoticeKind.ProxyError,
            ...describeProxyError(state.lastError),
        };
    }

    return null;
};
