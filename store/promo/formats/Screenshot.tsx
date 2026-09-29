import { FC } from 'react';
import Callout from '../components/Callout';
import Chips from '../components/Chips';
import Frame from '../components/Frame';
import Headline, { Eyebrow } from '../components/Headline';
import OpenSourceBadge from '../components/OpenSourceBadge';
import PopupPanel from '../components/PopupPanel';
import { SHOT_COPY } from '../copy';
import { SHOTS, ShotId } from '../shots';

const WIDTH = 1280;
const HEIGHT = 800;
const MARGIN = 76;

type Props = {
    shotId: ShotId;
};

const Screenshot: FC<Props> = ({ shotId }) => {
    const shot = SHOTS[shotId];
    const copy = SHOT_COPY[shotId];

    return (
        <Frame width={WIDTH} height={HEIGHT} tone={shot.tone}>
            <PopupPanel
                scale={1.3}
                height={shot.panelHeight}
                top={70}
                right={108}
            />

            <div className="absolute z-10" style={{ left: MARGIN, top: 70 }}>
                <OpenSourceBadge />
            </div>

            <div
                className="absolute z-10"
                style={{ left: MARGIN, top: 188, width: 510 }}
            >
                <Eyebrow>{copy.eyebrow}</Eyebrow>
                <div className="mt-9">
                    <Headline lines={copy.title} size={84} />
                </div>
                <p className="m-0 mt-8 text-[24px] leading-[1.45] text-black-200">
                    {copy.sub}
                </p>
            </div>

            <div className="absolute z-10" style={{ left: MARGIN, bottom: 92 }}>
                <Chips labels={copy.chips} />
            </div>

            <Callout callout={shot.callout} />
        </Frame>
    );
};

export default Screenshot;
