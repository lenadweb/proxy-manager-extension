# Proxy Manager

A Chrome extension for switching between HTTP, HTTPS and SOCKS proxies from a
compact popup.

- One-click switching between saved proxies and a power toggle
- Authentication for HTTP(S) proxies
- Per-proxy bypass list
- Paste `user:pass@host:port`, `host:port:user:pass` or a full URL to fill the form
- Status card with proxy errors and a warning when another extension controls the proxy

_Manifest V3 · React 19 · TypeScript · Tailwind CSS_

## Getting started

Requires [Node.js](https://nodejs.org) >= 22.12 (see `.nvmrc`).

```bash
nvm use
npm install
npm run dev            # rebuild ./dist on every change
```

Then open `chrome://extensions`, enable **Developer mode**, click **Load unpacked**
and select the `dist` folder.

## Scripts

```bash
npm run build          # production build into ./dist
npm run build:chrome   # bump version and pack release/build-chrome-<version>.zip
npm run lint
npm run typecheck
npm run format
```

## Permissions

| Permission                                           | Why                                    |
| ---------------------------------------------------- | -------------------------------------- |
| `proxy`                                              | Apply the selected proxy               |
| `storage`                                            | Keep the proxy list                    |
| `webRequest`, `webRequestAuthProvider`, `<all_urls>` | Answer proxy authentication challenges |

## Structure

| Path         | Role                                                         |
| ------------ | ------------------------------------------------------------ |
| `src/popup`  | Popup UI: proxy list, status and the add/edit form           |
| `src/worker` | Applies the active proxy, answers auth, reports proxy errors |
| `src/shared` | Types, storage, parsing and validation used by both          |

The popup only writes to `chrome.storage.local`; the service worker listens for
changes and applies them through `chrome.proxy.settings`.
