import { useEffect } from 'react';
import { ProxyProfile } from 'src/shared/types';
import { syncActionIcons } from 'src/popup/actionIcons/syncActionIcons';

export const useActionIconSync = (proxies: ProxyProfile[] | undefined) => {
    useEffect(() => {
        if (proxies) syncActionIcons(proxies).catch(console.error);
    }, [proxies]);
};
