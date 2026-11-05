import { useEffect, useState } from 'react';
import { readProxyControl } from 'src/shared/proxyControl';
import { ProxyControl } from 'src/shared/types';

export const useProxyControl = (): ProxyControl | null => {
    const [control, setControl] = useState<ProxyControl | null>(null);

    useEffect(() => {
        let disposed = false;
        let revision = 0;
        const syncControl = () => {
            const request = ++revision;
            readProxyControl()
                .then((value) => {
                    if (!disposed && request === revision) setControl(value);
                })
                .catch((error) => {
                    if (!disposed && request === revision) setControl(null);
                    console.error(error);
                });
        };

        chrome.proxy.settings.onChange.addListener(syncControl);
        syncControl();
        return () => {
            disposed = true;
            chrome.proxy.settings.onChange.removeListener(syncControl);
        };
    }, []);

    return control;
};
