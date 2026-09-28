import { FC } from 'react';
import { t } from 'src/shared/i18n';
import Button, { ButtonVariant } from 'src/popup/components/Button';
import Icon from 'src/popup/components/Icon';

type Props = {
    onAdd: () => void;
};

const EmptyState: FC<Props> = ({ onAdd }) => (
    <div className="flex flex-col items-center rounded-3xl bg-black-700 px-6 py-8 text-center">
        <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-black-600 text-blue-light">
            <Icon name="globe" className="size-6" />
        </span>
        <p className="mb-1.5 text-base font-medium text-white-100">
            {t('empty_title')}
        </p>
        <p className="mb-5 text-sm font-light leading-snug text-black-400">
            {t('empty_text')}
        </p>
        <Button variant={ButtonVariant.Primary} onClick={onAdd}>
            <Icon name="plus" />
            {t('add_proxy')}
        </Button>
    </div>
);

export default EmptyState;
