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

test('schema-less omnibuf -c and DecodeBlind examples use field_<N> keys', () => {
  for (const file of ['src/pages/cli.astro', 'src/components/Motivation.astro']) {
    const src = readRepoFile(file);
    assert.match(src, /"field_1"/);
    assert.match(src, /"field_2"/);
    assert.match(src, /"field_3"/);
    assert.match(src, /"field_4"/);
    assert.doesNotMatch(src, />"1"</);
  }
  const caps = readRepoFile('src/components/Capabilities.astro');
  assert.match(caps, /"field_3":/);
  assert.match(caps, /"field_9":/);
  assert.doesNotMatch(caps, />"3":</);

  const goPage = readRepoFile('src/pages/go.astro');
  const esPage = readRepoFile('src/pages/es.astro');
  assert.match(goPage, /field_1/);
  assert.match(esPage, /field_1/);
});
