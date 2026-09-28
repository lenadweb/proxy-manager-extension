import { FC } from 'react';
import { t } from 'src/shared/i18n';

const ConnectionStatus: FC = () => (
    <span className="flex shrink-0 items-center gap-1.5 font-medium text-blue-light">
        <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-blue-light opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-blue-light" />
        </span>
        {t('connected')}
    </span>
);

export default ConnectionStatus;
