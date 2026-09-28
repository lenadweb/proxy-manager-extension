import { FC } from 'react';
import { Trash2 } from 'lucide-react';
import { t } from 'src/shared/i18n';
import Button, { ButtonSize, ButtonVariant } from 'src/popup/components/Button';

type Props = {
    onConfirm: () => void;
    onCancel: () => void;
};

const DeleteConfirmation: FC<Props> = ({ onConfirm, onCancel }) => (
    <div className="flex items-center justify-between gap-3 rounded-3xl bg-black-700 p-2 pl-3">
        <span className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-danger/15 text-danger">
                <Trash2 aria-hidden className="size-4" />
            </span>
            <span className="truncate text-sm text-white-100">
                {t('delete_confirm')}
            </span>
        </span>
        <span className="flex shrink-0 gap-1.5 pr-1">
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
        </span>
    </div>
);

export default DeleteConfirmation;
