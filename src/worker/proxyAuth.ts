import { getAppliedProxy, hasCredentials } from 'src/shared/proxy';
import { loadState, saveState } from 'src/shared/storage';
import { ProxyErrorCode, ProxyProfile } from 'src/shared/types';
import { getTestSession, recordTestAuthRejected } from './testSession';

type AuthDetails = chrome.webRequest.OnAuthRequiredDetails;
type AuthResponse = chrome.webRequest.BlockingResponse;

const ALL_URLS = { urls: ['<all_urls>'] };
const DEFER_TO_BROWSER: AuthResponse = {};

const requestsWithSentCredentials = new Set<string>();

const isChallengeFrom = (proxy: ProxyProfile, details: AuthDetails): boolean =>
    details.challenger?.host.toLowerCase() === proxy.host.toLowerCase() &&
    details.challenger.port === proxy.port;

const findChallengedProxy = async (
    details: AuthDetails
): Promise<ProxyProfile | null> => {
    const testedProxy = getTestSession()?.proxy ?? null;
    const appliedProxy = getAppliedProxy(await loadState());

    return (
        [testedProxy, appliedProxy].find(
            (proxy): proxy is ProxyProfile =>
                proxy !== null &&
                hasCredentials(proxy) &&
                isChallengeFrom(proxy, details)
        ) ?? null
    );
};

const reportRejectedCredentials = async (
    proxy: ProxyProfile
): Promise<void> => {
    if (getTestSession()?.proxy === proxy) {
        recordTestAuthRejected();
        return;
    }
    await saveState({ lastError: ProxyErrorCode.AuthFailed });
};

const resolveCredentials = async (
    details: AuthDetails
): Promise<AuthResponse> => {
    const proxy = await findChallengedProxy(details);
    if (!proxy) return DEFER_TO_BROWSER;

    if (requestsWithSentCredentials.has(details.requestId)) {
        requestsWithSentCredentials.delete(details.requestId);
        await reportRejectedCredentials(proxy);
        return DEFER_TO_BROWSER;
    }

    requestsWithSentCredentials.add(details.requestId);
    return {
        authCredentials: {
            username: proxy.username,
            password: proxy.password,
        },
    };
};

const forgetRequest = ({ requestId }: { requestId: string }): void => {
    requestsWithSentCredentials.delete(requestId);
};

export const registerProxyAuth = (): void => {
    chrome.webRequest.onAuthRequired.addListener(
        (details, respond) => {
            if (!respond) return;
            if (!details.isProxy) {
                respond(DEFER_TO_BROWSER);
                return;
            }

            resolveCredentials(details)
                .then(respond)
                .catch((error) => {
                    console.error(error);
                    respond(DEFER_TO_BROWSER);
                });
        },
        ALL_URLS,
        ['asyncBlocking']
    );

    chrome.webRequest.onCompleted.addListener(forgetRequest, ALL_URLS);
    chrome.webRequest.onErrorOccurred.addListener(forgetRequest, ALL_URLS);
};
