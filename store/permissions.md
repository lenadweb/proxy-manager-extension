# Permissions

Answers for the Privacy practices tab of the Chrome Web Store dashboard.

## Single purpose

Let the user save their own proxy servers and switch Chrome's proxy between them from the toolbar popup, including proxy authentication, bypass rules and a connection check before saving.

## proxy

Applies the proxy the user connects to through `chrome.proxy.settings`, using the protocol, host, port and bypass list the user entered, and clears the setting when the user turns the proxy off. During a proxy check the extension applies a temporary PAC script that routes only requests to the four check hosts through the proxy being tested; all other traffic preserves supported direct/fixed routing. The original setting is restored after the check, with a recovery journal for interrupted tests. External system/WPAD/PAC or unsupported complex routes are rejected without modification.

## storage

Keeps the proxy list (name, protocol, host, port, optional username and password, bypass rules and icon), the selected proxy, the on/off state, the last proxy error, the unsaved form draft and the rendered toolbar icons in `chrome.storage.local`. A temporary diagnostic recovery journal contains routing configurations without credentials. Observed connection state, an SHA-256 routing fingerprint, exit IP and latency are kept in `chrome.storage.session`. Nothing is synced between devices or sent to the developer.

## alarms

Schedules a health check of the selected enabled proxy every minute, including
recovery after network interruptions and service worker restarts. It does not
run page content scripts or collect browsing history.

## management (optional)

Requested only when the user clicks Resolve extension conflict. Lists enabled
extensions with proxy permission so the user can individually choose a competitor
to disable. Chrome does not reveal the exact proxy controller ID; the list is
explicitly described as candidates. The extension never disables candidates
automatically. The worker rechecks permission, conflict, proxy permission and
mayDisable before changing the selected extension. Disabled extensions remain
disabled until the user re-enables them in Chrome.

## webRequest

Answers proxy authentication challenges and forgets per-request attempts on
completion/failure. Observes proxy-specific network error codes to invalidate an
unverified connection and request another check, without reading page content,
request headers or bodies. Destination-specific failures are not treated as proof
that every route is broken.

## webRequestAuthProvider

Required in Manifest V3 to answer `onAuthRequired` asynchronously. The extension answers only when `details.isProxy` is true and the challenging host and port match the connected proxy or the proxy being tested, supplying the username and password the user saved for it. Every other challenge, including website logins, is left to Chrome. If the proxy rejects the saved credentials, the extension stops retrying and shows the error instead of looping.

## Host permission: `<all_urls>`

Chrome only delivers proxy authentication challenges for URLs the extension has host access to, and a proxy authenticates requests to every site the user opens. The same access lets the proxy check reach its four check hosts. The extension has no content scripts and never reads or changes any web page.

## Network requests

The extension checks connectivity when a proxy is enabled, when the service
worker starts, every minute while enabled, after certain proxy errors, and when
the user requests a recheck. These checks use the actual fixed proxy settings and
exclude endpoints covered by bypass rules. The response proves connectivity and
reports exit IP/latency. The old Google credential-primer request has been removed;
the health check also triggers authentication when needed.

When the user starts a proxy check (the Test button, or Save for a proxy that has not passed a check yet), the request goes through the proxy being tested to these services, and the first one that answers is used to show the exit IP address, country and latency:

- `https://one.one.one.one/cdn-cgi/trace` (Cloudflare)
- `https://checkip.amazonaws.com/` (Amazon Web Services)
- `https://ipinfo.io/json` (ipinfo)
- `https://api.ipify.org/?format=json` (ipify)

## Remote code

No. All code ships inside the extension package.

## Data usage

- Proxy credentials the user enters are stored locally and sent only to the proxy server they belong to, as the answer to its authentication challenge.
- No personal data, browsing history or website content is collected, and nothing is sent to the developer.
- No data is sold, shared with third parties or used for advertising, creditworthiness or lending.
