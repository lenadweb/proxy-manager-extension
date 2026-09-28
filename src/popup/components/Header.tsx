import { FC } from 'react';
import cn from 'classnames';
import { t } from 'src/shared/i18n';
import Logo from 'src/assets/icons/logo.svg?react';
import PowerOnIcon from 'src/assets/icons/power-on.svg?react';
import PowerOffIcon from 'src/assets/icons/power-off.svg?react';
import Tooltip, {
    TooltipAlign,
    TooltipPlacement,
} from 'src/popup/components/Tooltip';

type Props = {
    isEnabled: boolean;
    canToggle: boolean;
    onToggle: () => void;
};

const Header: FC<Props> = ({ isEnabled, canToggle, onToggle }) => {
    const label = t(isEnabled ? 'disable_proxy' : 'enable_proxy');

    return (
        <div className="mb-[26px] ml-2 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Logo
                    className={cn(
                        'size-8 transition duration-150',
                        !isEnabled && 'grayscale'
                    )}
                />
                <h1 className="text-[20px] font-medium">
                    {t('proxy_manager')}
                </h1>
            </div>
            {canToggle && (
                <Tooltip
                    label={label}
                    placement={TooltipPlacement.Bottom}
                    align={TooltipAlign.End}
                >
                    <button
                        type="button"
                        onClick={onToggle}
                        aria-label={label}
                        aria-pressed={isEnabled}
                        className="flex cursor-pointer items-center justify-center rounded-full transition duration-150 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-95 [&_rect]:transition-colors [&_rect]:duration-150 hover:[&_rect]:fill-black-600"
                    >
                        {isEnabled ? <PowerOnIcon /> : <PowerOffIcon />}
                    </button>
                </Tooltip>
            )}
        </div>
    );
};

export default Header;
