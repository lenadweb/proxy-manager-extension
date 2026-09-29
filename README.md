# Proxy Manager

A Chrome extension for switching between HTTP, HTTPS and SOCKS proxies from a
compact popup.

- One-click switching between saved proxies and a power toggle
- Authentication for HTTP(S) proxies
- Per-proxy bypass list
- Optional icon or country flag for every proxy
- Connection test before saving, checked in parallel via Cloudflare, AWS, ipinfo and ipify
- Paste `user:pass@host:port`, `host:port:user:pass` or a full URL to fill the form
- Readable proxy errors and a warning when another extension controls the proxy

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

## Releases

GitHub Actions run two workflows:

- **CI** (`.github/workflows/ci.yml`) lints, type-checks, checks formatting and
  builds on every push to `main` and every pull request.
- **Release** (`.github/workflows/release.yml`) runs when `public/manifest.json`
  changes on `main`. If there is no `v<version>` release yet, it builds the
  extension and publishes a GitHub release with `build-chrome-<version>.zip`.

To ship a new version, bump it, commit and push:

```bash
npm run bump
git commit -am "update version"
git push
```

## Store listing

Everything for the Chrome Web Store lives in `store/`:

| Path                   | Content                                                  |
| ---------------------- | -------------------------------------------------------- |
| `store/description.md` | Name, summary, category and full description             |
| `store/permissions.md` | Single purpose, permission justifications and data usage |
| `store/assets/`        | Two screenshots, marquee and small promo tile            |
| `store/promo/`         | Generator that renders the real popup into the store art |

```bash
npm run promo              # render every asset into store/assets
npm run promo screenshot-2 # render one asset
npm run promo:dev          # open http://localhost:5199/?shot=1 to tweak copy live
```

Query parameters: `?shot=1`, `?shot=2`, `?format=marquee`, `?format=tile`.
Set `CHROME_PATH` if Chrome is not installed in the default location.

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
