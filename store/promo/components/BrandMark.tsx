import { FC } from 'react';
import Logo from 'src/assets/icons/logo.svg?react';
import { BRAND } from '../copy';

type Props = {
    logoSize: number;
    textSize: number;
};

const BrandMark: FC<Props> = ({ logoSize, textSize }) => (
    <div className="flex items-center gap-3.5">
        <Logo aria-hidden style={{ width: logoSize, height: logoSize }} />
        <span
            className="font-bold leading-none tracking-[-0.03em]"
            style={{ fontSize: textSize }}
        >
            {BRAND}
        </span>
    </div>
);

export default BrandMark;
