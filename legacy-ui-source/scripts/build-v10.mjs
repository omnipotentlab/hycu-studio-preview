import { readFileSync, writeFileSync } from 'node:fs';
import { gzipSync, gunzipSync } from 'node:zlib';

const root = new URL('../', import.meta.url);
const target = new URL('work/HYCU_AI_Studio_v2.html', root);
const sources = new Map([
  ['9e01f5aa-7cd3-4b8e-b21f-3a6d84c0f2e7', new URL('work/source-v10/outline-screen.jsx', root)],
  ['965bdddd-6a1a-44f9-b8e8-b0258d42e053', new URL('work/source-v10/export-screen.jsx', root)],
  ['77d5ed68-3b02-4c0f-96bb-141df225935a', new URL('work/source-v10/shell.jsx', root)],
  ['224df85d-9212-415b-8535-1b3c8c7bec6c', new URL('work/source-v10/app.jsx', root)],
]);

const html = readFileSync(target, 'utf8');
const match = html.match(/<script type="__bundler\/manifest">([\s\S]*?)<\/script>/);
if (!match) throw new Error('Bundler manifest not found');

const manifest = JSON.parse(match[1]);
const before = JSON.stringify(manifest).replaceAll('</', '<\\u002F');
if (before !== match[1]) throw new Error('Manifest encoding round-trip changed');

for (const [id, path] of sources) {
  if (!manifest[id]) throw new Error(`Module ${id} not found`);
  const source = readFileSync(path, 'utf8');
  manifest[id].data = gzipSync(source, { level: 9 }).toString('base64');
  manifest[id].compressed = true;
  const decoded = gunzipSync(Buffer.from(manifest[id].data, 'base64')).toString('utf8');
  if (decoded !== source) throw new Error(`Module ${id} verification failed`);
}

const encoded = JSON.stringify(manifest).replaceAll('</', '<\\u002F');
const output = html.slice(0, match.index + match[0].indexOf(match[1])) + encoded + html.slice(match.index + match[0].indexOf(match[1]) + match[1].length);
writeFileSync(target, output);
console.log(`Updated ${sources.size} modules in ${target.pathname}`);
