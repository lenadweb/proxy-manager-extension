import { useEffect, useState } from 'react';
import { readProxyControl } from 'src/shared/proxyControl';
import { ProxyControl } from 'src/shared/types';

export const useProxyControl = (): ProxyControl | null => {
    const [control, setControl] = useState<ProxyControl | null>(null);

    useEffect(() => {
        const syncControl = () => {
            readProxyControl().then(setControl).catch(console.error);
        };

        syncControl();
        chrome.proxy.settings.onChange.addListener(syncControl);
        return () => chrome.proxy.settings.onChange.removeListener(syncControl);
    }, []);

    return control;
};
