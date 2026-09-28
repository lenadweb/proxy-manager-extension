import { FC } from 'react';
import { ProxyProfile } from 'src/shared/types';
import {
    deleteProxy,
    saveProxy,
    toggleProxy,
    toggleEnabled,
} from 'src/popup/actions';
import { usePopupState } from 'src/popup/hooks/usePopupState';
import { useProxyControl } from 'src/popup/hooks/useProxyControl';
import { useProxyState } from 'src/popup/hooks/useProxyState';
import { createFormState, LIST_STATE, Screen } from 'src/popup/popupState';
import Header from 'src/popup/components/Header';
import ProxyForm from 'src/popup/components/ProxyForm/ProxyForm';
import ProxyList from 'src/popup/components/ProxyList/ProxyList';
import Notice from 'src/popup/components/Notice/Notice';

const runAction = (action: Promise<void>): void => {
    action.catch(console.error);
};

const App: FC = () => {
    const state = useProxyState();
    const control = useProxyControl();
    const [popupState, setPopupState] = usePopupState();

    if (!state || !popupState) return null;

    const openForm = (proxy: ProxyProfile | null) =>
        setPopupState(createFormState(proxy));
    const openList = () => setPopupState(LIST_STATE);

    const handleSave = (proxy: ProxyProfile) => {
        runAction(saveProxy(state, proxy));
        openList();
    };

    return (
        <main className="flex min-h-[480px] w-full flex-col bg-background p-3 pt-5 text-white">
            {popupState.screen === Screen.Form ? (
                <ProxyForm
                    form={popupState.form}
                    onFormChange={(form) =>
                        setPopupState({ screen: Screen.Form, form })
                    }
                    onSave={handleSave}
                    onCancel={openList}
                />
            ) : (
                <>
                    <Header
                        isEnabled={state.isEnabled}
                        canToggle={state.proxies.length > 0}
                        onToggle={() => runAction(toggleEnabled(state))}
                    />
                    <Notice state={state} control={control} />
                    <ProxyList
                        state={state}
                        onAdd={() => openForm(null)}
                        onToggle={(proxy) =>
                            runAction(toggleProxy(state, proxy.id))
                        }
                        onEdit={openForm}
                        onDelete={(proxy) =>
                            runAction(deleteProxy(state, proxy.id))
                        }
                    />
                </>
            )}
        </main>
    );
};

export default App;
