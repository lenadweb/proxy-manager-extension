import { FC } from 'react';
import BrandMark from '../components/BrandMark';
import Frame from '../components/Frame';
import Headline from '../components/Headline';
import OpenSourceBadge from '../components/OpenSourceBadge';
import PopupPanel from '../components/PopupPanel';
import { MARQUEE_COPY, STATS } from '../copy';
import { Tone } from '../shots';

const WIDTH = 1400;
const HEIGHT = 560;
const MARGIN = 76;

const Marquee: FC = () => (
    <Frame width={WIDTH} height={HEIGHT} tone={Tone.Deep}>
        <PopupPanel scale={0.98} height={500} top={40} right={64} />

        <div
            className="absolute z-10"
            style={{ left: MARGIN, top: 88, width: 540 }}
        >
            <div className="flex items-center gap-5">
                <BrandMark logoSize={52} textSize={28} />
                <OpenSourceBadge />
            </div>
            <div className="mt-8">
                <Headline lines={MARQUEE_COPY.title} size={72} />
            </div>
            <p className="m-0 mt-6 text-[21px] leading-[1.45] text-white/65">
                {MARQUEE_COPY.sub}
            </p>
        </div>

        <div
            className="absolute z-10"
            style={{ left: 668, top: 118, width: 280 }}
        >
            {STATS.map(({ value, label }) => (
                <p
                    key={label}
                    className="m-0 flex items-baseline gap-3 border-b border-white/[0.13] py-[18px] first:pt-0"
                >
                    <span className="text-[52px] font-extrabold leading-none tracking-[-0.05em] tabular-nums">
                        {value}
                    </span>
                    <span className="text-[18px] font-semibold leading-none text-white/70">
                        {label}
                    </span>
                </p>
            ))}
        </div>
    </Frame>
);

export default Marquee;
