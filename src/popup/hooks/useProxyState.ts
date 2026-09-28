import { useEffect, useState } from 'react';
import { loadState, onStateChange } from 'src/shared/storage';
import { ProxyState } from 'src/shared/types';

export const useProxyState = (): ProxyState | null => {
    const [state, setState] = useState<ProxyState | null>(null);

    useEffect(() => {
        const syncState = () => {
            loadState().then(setState).catch(console.error);
        };

        syncState();
        return onStateChange(syncState);
    }, []);

    return state;
};
