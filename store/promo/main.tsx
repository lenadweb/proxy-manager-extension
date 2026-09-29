import { FC } from 'react';
import { createRoot } from 'react-dom/client';
import App from 'src/popup/App';
import { fitHeadlines } from './components/Headline';
import { POPUP_ROOT_ID } from './components/PopupPanel';
import { disableAutofocus, installChromeStub, loadMessages } from './fixtures';
import Marquee from './formats/Marquee';
import Screenshot from './formats/Screenshot';
import SmallTile from './formats/SmallTile';
import { SHOTS, ShotId } from './shots';
import './promo.css';

enum Format {
    Screenshot = 'screenshot',
    Marquee = 'marquee',
    Tile = 'tile',
}

const HEADLINE_FIT_DELAY_MS = 60;

const params = new URLSearchParams(window.location.search);

const format =
    Object.values(Format).find((value) => value === params.get('format')) ??
    Format.Screenshot;

const shotId =
    Object.values(ShotId).find((value) => value === params.get('shot')) ??
    ShotId.Configurable;

const shot = SHOTS[format === Format.Screenshot ? shotId : ShotId.Private];

const FORMAT_VIEWS: Record<Format, FC> = {
    [Format.Screenshot]: () => <Screenshot shotId={shotId} />,
    [Format.Marquee]: Marquee,
    [Format.Tile]: SmallTile,
};

const mountPopup = (): void => {
    const host = document.getElementById(POPUP_ROOT_ID);
    if (host) createRoot(host).render(<App />);
};

disableAutofocus();
installChromeStub({
    state: shot.state,
    popupState: shot.popupState,
    messages: await loadMessages(),
});

const View = FORMAT_VIEWS[format];
const container = document.getElementById('promo');
if (container) createRoot(container).render(<View />);

window.setTimeout(() => {
    document.fonts.ready
        .then(fitHeadlines)
        .then(mountPopup)
        .catch(console.error);
}, HEADLINE_FIT_DELAY_MS);
