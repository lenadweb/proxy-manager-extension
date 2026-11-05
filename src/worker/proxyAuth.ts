import {
    getAppliedProxy,
    hasCredentials,
    matchesProxyConfig,
    normalizeProxyHost,
} from 'src/shared/proxy';
import { loadState, saveState } from 'src/shared/storage';
import { ProxyControl, ProxyErrorCode, ProxyProfile } from 'src/shared/types';
import { markConnectionError } from './connectionState';
import { getTestSession, recordTestAuthRejected } from './testSession';
import { TEST_HOSTS } from './testEndpoints';

type AuthDetails = chrome.webRequest.OnAuthRequiredDetails;
type AuthResponse = chrome.webRequest.BlockingResponse;
const ALL_URLS = { urls: ['<all_urls>'] };
const DEFER_TO_BROWSER: AuthResponse = {};
// Keep the rejected entry until completion: deleting it on the second challenge
// lets the third challenge resend the same rejected password forever.
const attempts = new Map<string, Set<string>>();
const MAX_PENDING_REQUESTS = 2048;

const isChallengeFrom = (proxy: ProxyProfile, details: AuthDetails): boolean =>
    normalizeProxyHost(details.challenger?.host ?? '') ===
        normalizeProxyHost(proxy.host) &&
    details.challenger.port === proxy.port;

const findChallengedProxy = async (
    details: AuthDetails
): Promise<ProxyProfile | null> => {
    const settings = await chrome.proxy.settings.get({ incognito: false });
    if (settings.levelOfControl !== ProxyControl.ControlledByThisExtension)
        return null;
    const session = getTestSession();
    const host = new URL(details.url).hostname;
    if (session && TEST_HOSTS.includes(host)) {
        return hasCredentials(session.proxy) &&
            isChallengeFrom(session.proxy, details)
            ? session.proxy
            : null;
    }
    const applied = getAppliedProxy(await loadState());
    if (
        !applied ||
        !hasCredentials(applied) ||
        !isChallengeFrom(applied, details)
    )
        return null;
    if (!session && !matchesProxyConfig(settings.value, applied)) return null;
    return applied;
};

export const resolveCredentials = async (
    details: AuthDetails
): Promise<AuthResponse> => {
    if (!details.isProxy) return DEFER_TO_BROWSER;
    const proxy = await findChallengedProxy(details);
    if (!proxy) return DEFER_TO_BROWSER;
    const key = `${normalizeProxyHost(proxy.host)}:${proxy.port}`;
    const sent = attempts.get(details.requestId) ?? new Set<string>();
    if (sent.has(key)) {
        if (getTestSession()?.proxy === proxy) {
            recordTestAuthRejected();
        } else {
            await saveState({ lastError: ProxyErrorCode.AuthFailed });
            await markConnectionError(ProxyErrorCode.AuthFailed);
        }
        return { cancel: true };
    }
    // Never evict a live rejection and thereby permit another auth loop.
    if (
        attempts.size >= MAX_PENDING_REQUESTS &&
        !attempts.has(details.requestId)
    ) {
        return { cancel: true };
    }
    sent.add(key);
    attempts.set(details.requestId, sent);
    return {
        authCredentials: { username: proxy.username, password: proxy.password },
    };
};

const forgetRequest = ({ requestId }: { requestId: string }): void => {
    attempts.delete(requestId);
};

export const registerProxyAuth = (): void => {
    chrome.webRequest.onAuthRequired.addListener(
        (details, respond) => {
            if (!respond) return;
            resolveCredentials(details)
                .then(respond)
                .catch((error) => {
                    console.error('Proxy authentication failed', error);
                    respond(DEFER_TO_BROWSER);
                });
        },
        ALL_URLS,
        ['asyncBlocking']
    );
    chrome.webRequest.onCompleted.addListener(forgetRequest, ALL_URLS);
    chrome.webRequest.onErrorOccurred.addListener(forgetRequest, ALL_URLS);
};
