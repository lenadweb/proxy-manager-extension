import { FC } from 'react';

export const POPUP_ROOT_ID = 'popup-root';
const POPUP_WIDTH = 360;

type Props = {
    scale: number;
    height: number;
    top: number;
    right: number;
};

const PopupPanel: FC<Props> = ({ scale, height, top, right }) => (
    <div
        className="absolute overflow-hidden rounded-[26px] bg-background ring-1 ring-white/10 shadow-[0_40px_90px_rgba(0,0,0,0.55),0_12px_28px_rgba(0,0,0,0.4)]"
        style={{
            top,
            right,
            transform: `scale(${scale})`,
            transformOrigin: 'top right',
        }}
    >
        <div
            id={POPUP_ROOT_ID}
            className="overflow-hidden"
            style={{ width: POPUP_WIDTH, height }}
        />
    </div>
);

export default PopupPanel;
