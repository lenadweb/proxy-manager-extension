import { FC } from 'react';
import { ProxyProfile } from 'src/shared/types';
import { ConnectionStatus as Status } from 'src/shared/connection';
import { useConnection } from 'src/popup/hooks/useConnection';
import ConnectionStatus from 'src/popup/components/ConnectionStatus';
import {
    deleteProxy,
    saveProxy,
    toggleProxy,
    toggleEnabled,
} from 'src/popup/actions';
import { useActionIconSync } from 'src/popup/hooks/useActionIconSync';
import { usePopupState } from 'src/popup/hooks/usePopupState';
import { useProxyControl } from 'src/popup/hooks/useProxyControl';
import { useProxyState } from 'src/popup/hooks/useProxyState';
import { createFormState, LIST_STATE, Screen } from 'src/popup/popupState';
import Footer from 'src/popup/components/Footer';
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
    const connection = useConnection(state, control);
    const [popupState, setPopupState] = usePopupState();
    useActionIconSync(state?.proxies);

    if (!state || !popupState) return null;

    const openForm = (proxy: ProxyProfile | null) =>
        setPopupState(createFormState(proxy));
    const openList = () => setPopupState(LIST_STATE);

    const handleSave = (proxy: ProxyProfile) => {
        runAction(saveProxy(state, proxy));
        openList();
    };

    return (
        <main className="flex min-h-[480px] w-[360px] flex-col bg-background p-3 pt-5 text-white">
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
                        isConnected={connection.status === Status.Connected}
                        canToggle={state.proxies.length > 0}
                        onToggle={() => runAction(toggleEnabled(state))}
                    />
                    <Notice state={state} control={control} />
                    <ConnectionStatus
                        connection={connection}
                        isEnabled={state.isEnabled}
                    />
                    <ProxyList
                        state={state}
                        connection={connection}
                        onAdd={() => openForm(null)}
                        onToggle={(proxy) =>
                            runAction(toggleProxy(state, proxy.id))
                        }
                        onEdit={openForm}
                        onDelete={(proxy) =>
                            runAction(deleteProxy(state, proxy.id))
                        }
                    />
                    <Footer />
                </>
            )}
        </main>
    );
};

export default App;
