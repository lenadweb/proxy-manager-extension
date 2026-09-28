import { FC } from 'react';
import cn from 'classnames';
import { getFlagUrl } from './countries';

type Props = {
    code: string;
    className?: string;
};

const CountryFlag: FC<Props> = ({ code, className }) => {
    const url = getFlagUrl(code);
    if (!url) return null;

    return (
        <img
            src={url}
            alt=""
            loading="lazy"
            className={cn(
                'shrink-0 rounded-[3px] object-cover ring-1 ring-white/10',
                className
            )}
        />
    );
};

export default CountryFlag;
