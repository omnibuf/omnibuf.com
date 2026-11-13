import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function readRepoFile(relPath) {
  return readFileSync(resolve(rootDir, relPath), 'utf8');
}

test('/es defineMessage snippet and prose match @omnibuf/core FieldSpec', () => {
  const esPage = readRepoFile('src/pages/es.astro');
  assert.doesNotMatch(esPage, /repeated:\s*true/);
  assert.match(esPage, /prefixes:\s*\{\s*fieldNum:\s*4,\s*type:\s*'uint32\[\]'\s*\}/);
  assert.match(esPage, /1\.\.536,870,911/);
  assert.match(esPage, /<code>submsg<\/code>/);
  assert.doesNotMatch(esPage, /<code>message<\/code>/);
});
