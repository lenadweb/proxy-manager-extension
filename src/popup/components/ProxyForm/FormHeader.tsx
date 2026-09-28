import { FC } from 'react';
import { ArrowLeft } from 'lucide-react';
import { t } from 'src/shared/i18n';
import IconButton, { IconButtonTone } from 'src/popup/components/IconButton';
import { TooltipAlign, TooltipPlacement } from 'src/popup/components/Tooltip';

type Props = {
    isNew: boolean;
    onBack: () => void;
};

const FormHeader: FC<Props> = ({ isNew, onBack }) => (
    <div className="sticky top-0 z-10 -mx-3 -mt-5 mb-3 flex items-center gap-3 bg-background px-3 pt-5 pb-3">
        <IconButton
            icon={ArrowLeft}
            label={t('back')}
            tone={IconButtonTone.Filled}
            tooltipPlacement={TooltipPlacement.Bottom}
            tooltipAlign={TooltipAlign.Start}
            onClick={onBack}
        />
        <h1 className="text-[20px] font-medium">
            {t(isNew ? 'add_proxy' : 'edit_proxy')}
        </h1>
    </div>
);

export default FormHeader;
