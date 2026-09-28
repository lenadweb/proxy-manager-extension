import { FC } from 'react';
import { Info, KeyRound, User } from 'lucide-react';
import { t } from 'src/shared/i18n';
import { supportsAuth } from 'src/shared/proxy';
import Accordion from 'src/popup/components/Accordion';
import { ProxyDraft } from './draft';
import PasswordField from './PasswordField';
import TextField from './TextField';

type Props = {
    draft: ProxyDraft;
    isOpen: boolean;
    onToggle: () => void;
    onChange: (patch: Partial<ProxyDraft>) => void;
};

const getSummary = (draft: ProxyDraft, isAuthSupported: boolean): string => {
    if (!isAuthSupported) return t('auth_unsupported_summary');
    return draft.username || t('auth_empty_summary');
};

const AuthSection: FC<Props> = ({ draft, isOpen, onToggle, onChange }) => {
    const isAuthSupported = supportsAuth(draft.scheme);

    return (
        <Accordion
            icon={KeyRound}
            title={t('auth_section')}
            summary={getSummary(draft, isAuthSupported)}
            isOpen={isOpen}
            onToggle={onToggle}
        >
            {!isAuthSupported && (
                <p className="flex items-start gap-2 rounded-xl bg-black-600 p-3 text-[12px] leading-relaxed text-black-200">
                    <Info aria-hidden className="mt-0.5 size-3.5 shrink-0" />
                    {t('socks_auth_unsupported')}
                </p>
            )}
            <TextField
                label={t('field_username')}
                icon={User}
                value={draft.username}
                disabled={!isAuthSupported}
                onChange={(event) => onChange({ username: event.target.value })}
            />
            <PasswordField
                value={draft.password}
                isDisabled={!isAuthSupported}
                onChange={(password) => onChange({ password })}
            />
        </Accordion>
    );
};

export default AuthSection;
