import { ProxyControl } from 'src/shared/types';

const LOCKED_CONTROLS = [
    ProxyControl.NotControllable,
    ProxyControl.ControlledByOtherExtensions,
];

export const readProxyControl = async (): Promise<ProxyControl> => {
    const { levelOfControl } = await chrome.proxy.settings.get({});
    return levelOfControl as ProxyControl;
};

export const isProxyLocked = (control: ProxyControl): boolean =>
    LOCKED_CONTROLS.includes(control);
