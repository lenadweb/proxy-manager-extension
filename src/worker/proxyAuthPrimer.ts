import { hasCredentials } from 'src/shared/proxy';
import { ProxyProfile } from 'src/shared/types';

const PRIMER_URL = 'https://www.gstatic.com/generate_204';
const PRIMER_TIMEOUT_MS = 10_000;

const requestThroughProxy = (): Promise<Response> =>
    fetch(`${PRIMER_URL}?t=${Date.now()}`, {
        cache: 'no-store',
        credentials: 'omit',
        signal: AbortSignal.timeout(PRIMER_TIMEOUT_MS),
    });

export const primeProxyCredentials = (proxy: ProxyProfile | null): void => {
    if (!proxy || !hasCredentials(proxy)) return;

    requestThroughProxy().catch((error) =>
        console.warn('Proxy sign-in request failed', error)
    );
};
