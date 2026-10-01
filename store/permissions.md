# Permissions

Answers for the Privacy practices tab of the Chrome Web Store dashboard.

## Single purpose

Let the user save their own proxy servers and switch Chrome's proxy between them from the toolbar popup, including proxy authentication, bypass rules and a connection check before saving.

## proxy

Applies the proxy the user connects to through `chrome.proxy.settings`, using the protocol, host, port and bypass list the user entered, and clears the setting when the user turns the proxy off. During a proxy check the extension applies a temporary PAC script that routes only requests to the four check hosts through the proxy being tested; all other traffic keeps the current setting, which is restored as soon as the check finishes.

## storage

Keeps the proxy list (name, protocol, host, port, optional username and password, bypass rules and icon), the selected proxy, the on/off state, the last proxy error, the unsaved form draft and the rendered toolbar icons in `chrome.storage.local`. Nothing is synced between devices or sent to the developer.

## webRequest

Used only to handle proxy authentication. `onAuthRequired` receives proxy login challenges, and `onCompleted` and `onErrorOccurred` let the extension forget a challenge once its request ends. `onErrorOccurred` also reads the network error code of a failed proxy check so the popup can explain what went wrong. The extension never reads or modifies page content, request headers or request bodies.

## webRequestAuthProvider

Required in Manifest V3 to answer `onAuthRequired` asynchronously. The extension answers only when `details.isProxy` is true and the challenging host and port match the connected proxy or the proxy being tested, supplying the username and password the user saved for it. Every other challenge, including website logins, is left to Chrome. If the proxy rejects the saved credentials, the extension stops retrying and shows the error instead of looping.

## Host permission: `<all_urls>`

Chrome only delivers proxy authentication challenges for URLs the extension has host access to, and a proxy authenticates requests to every site the user opens. The same access lets the proxy check reach its four check hosts. The extension has no content scripts and never reads or changes any web page.

## Network requests

The extension contacts the network on its own in two cases.

When the user connects to a proxy that has a username and password, the extension sends one request through that proxy to `https://www.gstatic.com/generate_204`, an empty response from Google. The proxy asks for its credentials on this request, the extension answers, and Chrome remembers them for the proxy. Pages then sign in right away, even if another installed extension cancels proxy sign-in prompts.

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
