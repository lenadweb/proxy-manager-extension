import { FC } from 'react';
import { t } from 'src/shared/i18n';
import Button, { ButtonSize, ButtonVariant } from 'src/popup/components/Button';

type Props = {
    onConfirm: () => void;
    onCancel: () => void;
};

const DeleteConfirmation: FC<Props> = ({ onConfirm, onCancel }) => (
    <div className="flex items-center justify-between gap-3 rounded-3xl bg-black-700 p-4 pl-5">
        <p className="min-w-0 truncate text-sm text-white-100">
            {t('delete_confirm')}
        </p>
        <div className="flex shrink-0 gap-1.5">
            <Button autoFocus size={ButtonSize.Small} onClick={onCancel}>
                {t('cancel')}
            </Button>
            <Button
                size={ButtonSize.Small}
                variant={ButtonVariant.Danger}
                onClick={onConfirm}
            >
                {t('delete')}
            </Button>
        </div>
    </div>
);

export default DeleteConfirmation;
