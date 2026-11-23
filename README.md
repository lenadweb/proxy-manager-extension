# Proxy Manager

A Chrome extension for switching between HTTP, HTTPS and SOCKS proxies from a
compact popup.

- One-click switching between saved proxies and a power toggle
- Authentication for HTTP(S) proxies
- Per-proxy bypass list
- Optional icon or country flag for every proxy
- Verified connection status with exit IP and latency, checked on activation and every minute
- Isolated candidate tests via Cloudflare, AWS, ipinfo and ipify where the current route can be preserved
- Paste `user:pass@host:port`, `host:port:user:pass` or a full URL to fill the form
- Readable proxy errors, automatic rechecks and recovery after worker/browser restarts
- Conflict resolution with individually selected proxy extensions (optional management permission)

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

The store listing supports 20 locales (including the English default): `en`,
`ar`, `de`, `es`, `fr`, `hi`, `id`, `it`, `ja`, `ko`, `nl`, `pl`, `pt_BR`, `ru`,
`th`, `tr`, `uk`, `vi`, `zh_CN` and `zh_TW`.

English copy is maintained in `store/description.md`; translated names, summaries
and full descriptions live in `store/locales/<locale>.md`. After editing them,
run `npm run store:sync` to update `appName` and `appDescription` in
`public/_locales/<locale>/messages.json`. Run `npm run store:check` to validate
field lengths and catch metadata that is out of sync; CI runs the same check.

Only the store metadata is localized. The popup and toolbar tooltip remain in
English through Chrome's default-locale fallback. Each listing makes this clear.
Existing screenshots and promo assets remain in English. Permission explanations
in `store/permissions.md` are developer-dashboard answers, not localized listing
copy.

Upload the built ZIP to the Chrome Web Store to make the packaged locales
available, then select each language in the Store listing tab and paste its
`Description` section from the corresponding Markdown file. Full descriptions
are not uploaded automatically with the extension package. Follow
[Chrome's listing localization instructions](https://developer.chrome.com/docs/webstore/cws-dashboard-listing#localize-your-listing).

```bash
npm run promo              # render every asset into store/assets
npm run promo screenshot-2 # render one asset
npm run promo:dev          # open http://localhost:5199/?shot=1 to tweak copy live
```

Query parameters: `?shot=1`, `?shot=2`, `?format=marquee`, `?format=tile`.
Set `CHROME_PATH` if Chrome is not installed in the default location.

## Permissions

| Permission                                           | Why                                                                       |
| ---------------------------------------------------- | ------------------------------------------------------------------------- |
| `proxy`                                              | Apply the selected proxy                                                  |
| `storage`                                            | Keep profiles and observed connection state                               |
| `alarms`                                             | Recheck the active connection every minute                                |
| `management` (optional)                              | List proxy-capable extensions and disable only a user-selected competitor |
| `webRequest`, `webRequestAuthProvider`, `<all_urls>` | Answer proxy authentication challenges                                    |

## Structure

| Path         | Role                                                         |
| ------------ | ------------------------------------------------------------ |
| `src/popup`  | Popup UI: proxy list, status and the add/edit form           |
| `src/worker` | Applies the active proxy, answers auth, reports proxy errors |
| `src/shared` | Types, storage, parsing and validation used by both          |

The popup saves profiles to `chrome.storage.local` and sends diagnostic/control
commands to the service worker. The worker serializes proxy-setting writes,
verifies connectivity and publishes observed state to `chrome.storage.session`.

## Connection reliability

The power switch records the requested mode. A connected indicator requires
verified ownership of Chrome's actual proxy settings and a successful network
check through a non-bypassed endpoint. Stale results expire in the popup after
90 seconds. Failed checks keep the requested proxy configured and retry every
minute; the extension does not silently switch to DIRECT.

Temporary candidate tests use a mandatory PAC and persist a recovery journal
before changing settings. Unsupported external system/WPAD/PAC routes are not
approximated: save the profile and enable it to verify its actual route instead.
Chrome policy and extension priority cannot be overridden by repeated writes.
Conflict resolution requests optional `management` access and lets the user
choose an individual extension to disable; it stays disabled until manually
re-enabled in Chrome.

See [the detailed audit and limitations](docs/STABILITY.md).
