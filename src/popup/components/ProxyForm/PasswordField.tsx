import { FC, useState } from 'react';
import { t } from 'src/shared/i18n';
import Icon from 'src/popup/components/Icon';
import TextField from './TextField';

type Props = {
    value: string;
    isDisabled: boolean;
    onChange: (value: string) => void;
};

const PasswordField: FC<Props> = ({ value, isDisabled, onChange }) => {
    const [isVisible, setIsVisible] = useState(false);
    const toggleLabel = t(isVisible ? 'hide_password' : 'show_password');

    return (
        <TextField
            label={t('field_password')}
            type={isVisible ? 'text' : 'password'}
            autoComplete="new-password"
            value={value}
            disabled={isDisabled}
            onChange={(event) => onChange(event.target.value)}
            trailing={
                <button
                    type="button"
                    disabled={isDisabled}
                    onClick={() => setIsVisible((visible) => !visible)}
                    aria-label={toggleLabel}
                    title={toggleLabel}
                    className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-black-400 transition-colors hover:text-white disabled:cursor-default disabled:opacity-40"
                >
                    <Icon name={isVisible ? 'eyeOff' : 'eye'} />
                </button>
            }
        />
    );
};

export default PasswordField;
