import { FC, useState } from 'react';
import { t } from 'src/shared/i18n';
import {
    ExtensionResult,
    requestProxyExtensions,
    takeProxyControl,
} from 'src/shared/proxyExtensions';

const ProxyConflict: FC = () => {
    const [result, setResult] = useState<ExtensionResult | null>(null);
    const [busy, setBusy] = useState(false);
    const run = async (task: Promise<ExtensionResult>) => {
        setBusy(true);
        try {
            setResult(await task);
        } catch {
            setResult({ extensions: [], error: 'control_failed' });
        } finally {
            setBusy(false);
        }
    };
    return (
        <div className="mt-2 space-y-2">
            <button
                type="button"
                disabled={busy}
                className="rounded text-xs text-blue-light focus-visible:outline-2 focus-visible:outline-white disabled:opacity-50"
                onClick={() => {
                    run(requestProxyExtensions());
                }}
            >
                {t('resolve_conflict')}
            </button>
            {result && (
                <>
                    <p className="text-[11px] text-black-400">
                        {t(
                            result.error
                                ? 'conflict_action_failed'
                                : result.extensions.length
                                  ? 'conflict_candidates_hint'
                                  : 'conflict_no_candidates'
                        )}
                    </p>
                    {result.extensions.map((extension) => (
                        <button
                            key={extension.id}
                            type="button"
                            disabled={busy || !extension.mayDisable}
                            className="block max-w-full rounded text-left text-xs text-blue-light focus-visible:outline-2 focus-visible:outline-white disabled:opacity-50"
                            onClick={() => {
                                run(takeProxyControl(extension.id));
                            }}
                        >
                            {t('disable_extension', [extension.name])}
                        </button>
                    ))}
                </>
            )}
        </div>
    );
};
export default ProxyConflict;
