import { readFileSync, writeFileSync } from 'node:fs';

const targets = ['package.json', 'public/manifest.json'];

const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));

const { version } = readJson(targets[0]);
const [major, minor, patch] = version.split('.').map(Number);
const nextVersion = `${major}.${minor}.${patch + 1}`;

for (const file of targets) {
    const json = readJson(file);
    json.version = nextVersion;
    writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`, 'utf8');
}

console.log(`Bumped version: ${version} -> ${nextVersion}`);
