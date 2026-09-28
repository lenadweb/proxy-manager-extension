import { useCallback, useEffect, useState } from 'react';
import {
    loadPopupState,
    PopupState,
    savePopupState,
} from 'src/popup/popupState';

export const usePopupState = (): [
    PopupState | null,
    (state: PopupState) => void,
] => {
    const [popupState, setPopupState] = useState<PopupState | null>(null);

    useEffect(() => {
        loadPopupState().then(setPopupState).catch(console.error);
    }, []);

    const updatePopupState = useCallback((state: PopupState) => {
        setPopupState(state);
        savePopupState(state).catch(console.error);
    }, []);

    return [popupState, updatePopupState];
};
