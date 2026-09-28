import { FC } from 'react';
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

const AuthSection: FC<Props> = ({ draft, isOpen, onToggle, onChange }) => {
    const isAuthSupported = supportsAuth(draft.scheme);

    return (
        <Accordion
            title={t('auth_section')}
            isOpen={isOpen}
            onToggle={onToggle}
        >
            {!isAuthSupported && (
                <p className="rounded-xl bg-black-600 p-3 text-[12px] leading-relaxed text-black-200">
                    {t('socks_auth_unsupported')}
                </p>
            )}
            <TextField
                label={t('field_username')}
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
