import { execFile } from 'node:child_process';
import { accessSync, constants, mkdirSync, rmSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { promisify } from 'node:util';
import { createServer } from 'vite';

const run = promisify(execFile);

const PROMO_ROOT = import.meta.dirname;
const OUTPUT_DIR = resolve(PROMO_ROOT, '../assets');
const MIN_BYTES = 20 * 1024;
const CAPTURE_TIMEOUT_MS = 90_000;
const CAPTURE_ATTEMPTS = 3;

const SCREENSHOT = { width: 1280, height: 800 };

const TARGETS = [
    { file: 'screenshot-1.png', query: 'shot=1', ...SCREENSHOT },
    { file: 'screenshot-2.png', query: 'shot=2', ...SCREENSHOT },
    { file: 'marquee.png', query: 'format=marquee', width: 1400, height: 560 },
    { file: 'small-tile.png', query: 'format=tile', width: 440, height: 280 },
];

const CHROME_CANDIDATES = {
    darwin: [
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/Applications/Chromium.app/Contents/MacOS/Chromium',
    ],
    linux: [
        '/usr/bin/google-chrome',
        '/usr/bin/google-chrome-stable',
        '/usr/bin/chromium',
        '/usr/bin/chromium-browser',
    ],
    win32: [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    ],
};

const isExecutable = (path) => {
    try {
        accessSync(path, constants.X_OK);
        return true;
    } catch {
        return false;
    }
};

const findChrome = () => {
    const candidates = [
        process.env.CHROME_PATH,
        ...(CHROME_CANDIDATES[process.platform] ?? []),
    ].filter(Boolean);
    const chrome = candidates.find(isExecutable);
    if (!chrome) {
        throw new Error(
            'Chrome not found. Set CHROME_PATH to a Chrome or Chromium binary.'
        );
    }
    return chrome;
};

const shoot = async (chrome, baseUrl, target, output) => {
    await run(
        chrome,
        [
            '--headless=new',
            '--disable-gpu',
            '--hide-scrollbars',
            '--force-device-scale-factor=1',
            `--window-size=${target.width},${target.height}`,
            '--virtual-time-budget=5000',
            `--screenshot=${output}`,
            `${baseUrl}?${target.query}`,
        ],
        { timeout: CAPTURE_TIMEOUT_MS, killSignal: 'SIGKILL' }
    );

    const { size } = statSync(output);
    if (size < MIN_BYTES) {
        throw new Error(`rendered blank (${Math.round(size / 1024)} KB)`);
    }
    return size;
};

const capture = async (chrome, baseUrl, target) => {
    const output = resolve(OUTPUT_DIR, target.file);
    let lastError = '';

    for (let attempt = 1; attempt <= CAPTURE_ATTEMPTS; attempt += 1) {
        rmSync(output, { force: true });
        try {
            return await shoot(chrome, baseUrl, target, output);
        } catch (error) {
            lastError = error instanceof Error ? error.message : String(error);
        }
    }

    throw new Error(`${target.file}: ${lastError}`);
};

const selectTargets = (filter) => {
    const targets = filter
        ? TARGETS.filter(({ file }) => file.includes(filter))
        : TARGETS;
    if (!targets.length) {
        const known = TARGETS.map(({ file }) => file).join(', ');
        throw new Error(`No asset matches "${filter}". Known: ${known}`);
    }
    return targets;
};

const main = async () => {
    const chrome = findChrome();
    const targets = selectTargets(process.argv[2]);

    const server = await createServer({
        configFile: resolve(PROMO_ROOT, 'vite.config.ts'),
        server: { port: 0, strictPort: false },
    });
    await server.listen();

    const baseUrl = server.resolvedUrls?.local?.[0];
    if (!baseUrl) throw new Error('Vite did not report a local URL');

    mkdirSync(OUTPUT_DIR, { recursive: true });
    const failures = [];

    try {
        for (const target of targets) {
            try {
                const size = await capture(chrome, baseUrl, target);
                console.log(
                    `  ${target.file.padEnd(18)} ${Math.round(size / 1024)} KB`
                );
            } catch (error) {
                failures.push(error.message);
            }
        }
    } finally {
        await server.close();
    }

    if (failures.length) {
        console.error(`\n${failures.length} capture(s) failed:`);
        failures.forEach((failure) => console.error(`  ${failure}`));
        process.exitCode = 1;
    }
};

main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});
