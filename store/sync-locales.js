import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const check = process.argv.includes('--check');
const sources = [
    ['en', resolve(root, 'store/description.md')],
    ...readdirSync(resolve(root, 'store/locales'))
        .filter((file) => file.endsWith('.md'))
        .sort()
        .map((file) => [
            file.slice(0, -3),
            resolve(root, 'store/locales', file),
        ]),
];

const section = (text, heading) => {
    const value = text
        .match(
            new RegExp(
                `^## ${heading}\\n\\n([\\s\\S]*?)(?=\\n## |(?![\\s\\S]))`,
                'm'
            )
        )?.[1]
        ?.trim();
    if (!value) throw new Error(`Missing ${heading} section`);
    return value;
};

let stale = false;
for (const [locale, source] of sources) {
    const text = readFileSync(source, 'utf8');
    const name = section(text, 'Name');
    const summary = section(text, 'Summary');
    const description = section(text, 'Description');
    for (const [label, value, limit] of [
        ['name', name, 75],
        ['summary', summary, 132],
        ['description', description, 16000],
    ]) {
        if (value.length > limit) {
            throw new Error(`${locale}: ${label} exceeds ${limit} characters`);
        }
    }
    const directory = resolve(root, 'public/_locales', locale);
    const target = resolve(directory, 'messages.json');
    let current = '';
    try {
        current = readFileSync(target, 'utf8');
    } catch (error) {
        if (error.code !== 'ENOENT') throw error;
    }
    // Only listing metadata is translated. Missing UI keys fall back to en.
    const messages = locale === 'en' ? JSON.parse(current) : {};
    messages.appName = { message: name };
    messages.appDescription = { message: summary };
    const output = `${JSON.stringify(messages, null, 4)}\n`;
    // Compare parsed values to preserve existing English file formatting.
    if (
        current &&
        JSON.stringify(JSON.parse(current)) === JSON.stringify(messages)
    ) {
        continue;
    }
    if (check) {
        console.error(`${locale}: run npm run store:sync`);
        stale = true;
    } else {
        mkdirSync(directory, { recursive: true });
        writeFileSync(target, output);
    }
}
if (stale) process.exitCode = 1;
else
    console.log(
        `${sources.length} store locales ${check ? 'checked' : 'synced'}.`
    );
