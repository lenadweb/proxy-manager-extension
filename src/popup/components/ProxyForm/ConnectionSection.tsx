import { ClipboardEvent, FC } from 'react';
import { DEFAULT_PORTS } from 'src/shared/constants';
import { I18nKey, t } from 'src/shared/i18n';
import { ProxyIcon, ProxyScheme } from 'src/shared/types';
import { FieldError, FieldErrors, ValidatedField } from 'src/shared/validation';
import { ClipboardPaste, Hash, Server } from 'lucide-react';
import SectionTitle from 'src/popup/components/SectionTitle';
import { ProxyDraft } from './draft';
import NameField from './NameField';
import SchemeSelector from './SchemeSelector';
import TextField from './TextField';

type Props = {
    draft: ProxyDraft;
    errors: FieldErrors;
    isNew: boolean;
    isIconPickerOpen: boolean;
    onToggleIconPicker: () => void;
    onIconSelect: (icon: ProxyIcon | null) => void;
    onChange: (patch: Partial<ProxyDraft>) => void;
    onSchemeChange: (scheme: ProxyScheme) => void;
    onProxyString: (value: string) => boolean;
};

const ERROR_MESSAGES: Record<ValidatedField, Record<FieldError, I18nKey>> = {
    [ValidatedField.Host]: {
        [FieldError.Required]: 'error_required',
        [FieldError.Invalid]: 'error_invalid_host',
    },
    [ValidatedField.Port]: {
        [FieldError.Required]: 'error_required',
        [FieldError.Invalid]: 'error_invalid_port',
    },
};

const NON_DIGITS = /\D/g;

const ConnectionSection: FC<Props> = ({
    draft,
    errors,
    isNew,
    isIconPickerOpen,
    onToggleIconPicker,
    onIconSelect,
    onChange,
    onSchemeChange,
    onProxyString,
}) => {
    const getErrorMessage = (field: ValidatedField) => {
        const error = errors[field];
        return error && t(ERROR_MESSAGES[field][error]);
    };

    const handleHostPaste = (event: ClipboardEvent<HTMLInputElement>) => {
        const isHandled = onProxyString(event.clipboardData.getData('text'));
        if (isHandled) event.preventDefault();
    };

    return (
        <div className="space-y-4 rounded-3xl bg-black-700 p-4">
            <SectionTitle icon={Server} title={t('connection_section')} />
            <NameField
                name={draft.name}
                icon={draft.icon}
                isPickerOpen={isIconPickerOpen}
                onNameChange={(name) => onChange({ name })}
                onIconSelect={onIconSelect}
                onTogglePicker={onToggleIconPicker}
            />
            <SchemeSelector value={draft.scheme} onChange={onSchemeChange} />
            <div className="flex gap-2">
                <TextField
                    label={t('field_host')}
                    icon={Server}
                    placeholder="127.0.0.1"
                    autoFocus={isNew}
                    value={draft.host}
                    error={getErrorMessage(ValidatedField.Host)}
                    onChange={(event) => onChange({ host: event.target.value })}
                    onPaste={handleHostPaste}
                    onBlur={() => onProxyString(draft.host)}
                    containerClassName="min-w-0 flex-1"
                />
                <TextField
                    label={t('field_port')}
                    icon={Hash}
                    placeholder={String(DEFAULT_PORTS[draft.scheme])}
                    inputMode="numeric"
                    maxLength={5}
                    value={draft.port}
                    error={getErrorMessage(ValidatedField.Port)}
                    onChange={(event) =>
                        onChange({
                            port: event.target.value.replace(NON_DIGITS, ''),
                        })
                    }
                    containerClassName="w-28 shrink-0"
                    className="tabular-nums"
                />
            </div>
            <div className="flex items-start gap-2.5 rounded-xl bg-background/60 px-3 py-2.5 text-black-400">
                <ClipboardPaste
                    aria-hidden
                    className="mt-px size-3.5 shrink-0 text-blue-light"
                />
                <p className="text-[11px] leading-relaxed">{t('paste_hint')}</p>
            </div>
        </div>
    );
};

export default ConnectionSection;
