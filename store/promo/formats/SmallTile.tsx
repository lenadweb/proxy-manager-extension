import { FC } from 'react';
import { PROXY_SCHEMES } from 'src/shared/constants';
import BrandMark from '../components/BrandMark';
import Chips, { ChipSize } from '../components/Chips';
import Frame from '../components/Frame';
import Headline from '../components/Headline';
import OpenSourceBadge, { BadgeSize } from '../components/OpenSourceBadge';
import { MARQUEE_COPY } from '../copy';
import { Tone } from '../shots';

const WIDTH = 440;
const HEIGHT = 280;

const SmallTile: FC = () => (
    <Frame width={WIDTH} height={HEIGHT} tone={Tone.Deep}>
        <div className="relative z-10 h-full px-8 py-7">
            <div className="flex items-center justify-between">
                <BrandMark logoSize={34} textSize={22} />
                <OpenSourceBadge size={BadgeSize.Small} />
            </div>

            <div className="absolute top-[92px] left-8 w-[376px]">
                <Headline lines={MARQUEE_COPY.title} size={46} />
            </div>

            <div className="absolute bottom-7 left-8">
                <Chips labels={PROXY_SCHEMES} size={ChipSize.Small} />
            </div>
        </div>
    </Frame>
);

export default SmallTile;
