import { FC } from 'react';
import cn from 'classnames';
import { ImagePlus, Tag } from 'lucide-react';
import { t } from 'src/shared/i18n';
import { ProxyIcon } from 'src/shared/types';
import ProxyIconView from 'src/popup/components/ProxyIcon/ProxyIconView';
import Tooltip, { TooltipAlign } from 'src/popup/components/Tooltip';
import IconPicker from './IconPicker/IconPicker';
import TextField from './TextField';

type Props = {
    name: string;
    icon: ProxyIcon | null;
    isPickerOpen: boolean;
    onNameChange: (name: string) => void;
    onIconSelect: (icon: ProxyIcon | null) => void;
    onTogglePicker: () => void;
};

const NameField: FC<Props> = ({
    name,
    icon,
    isPickerOpen,
    onNameChange,
    onIconSelect,
    onTogglePicker,
}) => (
    <div className="space-y-2.5">
        <div className="flex items-end gap-2">
            <Tooltip label={t('choose_icon')} align={TooltipAlign.Start}>
                <button
                    type="button"
                    onClick={onTogglePicker}
                    aria-label={t('choose_icon')}
                    aria-expanded={isPickerOpen}
                    className={cn(
                        'flex size-11 cursor-pointer items-center justify-center rounded-xl border transition-colors focus-visible:outline-2 focus-visible:outline-white',
                        isPickerOpen
                            ? 'border-blue-accent bg-background'
                            : 'border-dashed border-black-500 bg-background hover:border-black-400'
                    )}
                >
                    {icon ? (
                        <ProxyIconView
                            icon={icon}
                            fallbackText={name}
                            className="size-9 bg-transparent"
                        />
                    ) : (
                        <ImagePlus
                            aria-hidden
                            className="size-4 text-black-400"
                        />
                    )}
                </button>
            </Tooltip>
            <TextField
                label={t('field_name')}
                icon={Tag}
                placeholder={t('field_name_placeholder')}
                value={name}
                onChange={(event) => onNameChange(event.target.value)}
                containerClassName="min-w-0 flex-1"
            />
        </div>
        {isPickerOpen && <IconPicker selected={icon} onSelect={onIconSelect} />}
    </div>
);

export default NameField;
