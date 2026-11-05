import { useEffect, useState } from 'react';
import { loadState, onStateChange } from 'src/shared/storage';
import { ProxyState } from 'src/shared/types';

export const useProxyState = (): ProxyState | null => {
    const [state, setState] = useState<ProxyState | null>(null);

    useEffect(() => {
        let disposed = false;
        let revision = 0;
        const syncState = () => {
            const request = ++revision;
            loadState()
                .then((state) => {
                    if (!disposed && request === revision) setState(state);
                })
                .catch(console.error);
        };
        const unsubscribe = onStateChange(syncState);
        syncState();
        return () => {
            disposed = true;
            unsubscribe();
        };
    }, []);

    return state;
};
