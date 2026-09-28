import { FC, useState } from 'react';
import { Eye, EyeOff, KeyRound } from 'lucide-react';
import { t } from 'src/shared/i18n';
import IconButton from 'src/popup/components/IconButton';
import { TooltipAlign } from 'src/popup/components/Tooltip';
import TextField from './TextField';

type Props = {
    value: string;
    isDisabled: boolean;
    onChange: (value: string) => void;
};

const PasswordField: FC<Props> = ({ value, isDisabled, onChange }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <TextField
            label={t('field_password')}
            icon={KeyRound}
            type={isVisible ? 'text' : 'password'}
            autoComplete="new-password"
            value={value}
            disabled={isDisabled}
            onChange={(event) => onChange(event.target.value)}
            trailing={
                !isDisabled && (
                    <IconButton
                        icon={isVisible ? EyeOff : Eye}
                        label={t(isVisible ? 'hide_password' : 'show_password')}
                        tooltipAlign={TooltipAlign.End}
                        onClick={() => setIsVisible((visible) => !visible)}
                    />
                )
            }
        />
    );
};

export default PasswordField;
