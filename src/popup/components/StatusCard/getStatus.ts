import { formatAddress, getAppliedProxy } from 'src/shared/proxy';
import { I18nKey, t } from 'src/shared/i18n';
import { ProxyControl, ProxyState } from 'src/shared/types';
import { describeProxyError, ErrorText } from 'src/popup/errorText';

export enum StatusTone {
    Active = 'active',
    Idle = 'idle',
    Warning = 'warning',
}

export type Status = {
    tone: StatusTone;
    title: string;
    subtitle: string;
};

type LockedMessages = {
    title: I18nKey;
    subtitle: I18nKey;
};

const LOCKED_MESSAGES: Partial<Record<ProxyControl, LockedMessages>> = {
    [ProxyControl.ControlledByOtherExtensions]: {
        title: 'status_controlled_other',
        subtitle: 'status_controlled_other_hint',
    },
    [ProxyControl.NotControllable]: {
        title: 'status_not_controllable',
        subtitle: 'status_not_controllable_hint',
    },
};

export const getStatus = (
    state: ProxyState,
    control: ProxyControl | null
): Status => {
    const locked = control && LOCKED_MESSAGES[control];
    if (locked) {
        return {
            tone: StatusTone.Warning,
            title: t(locked.title),
            subtitle: t(locked.subtitle),
        };
    }

    const proxy = getAppliedProxy(state);
    if (proxy) {
        return {
            tone: StatusTone.Active,
            title: t('status_active'),
            subtitle: [
                proxy.name,
                proxy.scheme.toUpperCase(),
                formatAddress(proxy),
            ].join(' · '),
        };
    }

    return {
        tone: StatusTone.Idle,
        title: t('status_direct'),
        subtitle: t(
            state.proxies.length ? 'status_direct_hint' : 'status_empty_hint'
        ),
    };
};

export const getErrorText = (state: ProxyState): ErrorText | null =>
    state.isEnabled && state.lastError
        ? describeProxyError(state.lastError)
        : null;
