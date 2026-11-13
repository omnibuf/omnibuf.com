import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import process from 'node:process';
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

test('Hero and Comparisons scope butterfly widget scripts and ARIA tab linkage', () => {
  const hero = readRepoFile('src/components/Hero.astro');
  const comparisons = readRepoFile('src/components/Comparisons.astro');

  assert.match(hero, /\[data-butterfly-widget="hero"\]/);
  assert.doesNotMatch(hero, /querySelectorAll<HTMLElement>\('\[data-butterfly-widget\]'\)/);
  assert.match(hero, /hover:bg-\[#E5E0D5\]/);
  assert.match(hero, /aria-controls=/);
  assert.match(hero, /aria-labelledby=/);
  assert.match(hero, /tabindex=/);

  assert.match(comparisons, /\[data-butterfly-widget="comparisons"\]/);
  assert.doesNotMatch(comparisons, /querySelectorAll<HTMLElement>\('\[data-butterfly-widget\]'\)/);
  assert.match(comparisons, /aria-controls=/);
  assert.match(comparisons, /aria-labelledby=/);
  assert.match(comparisons, /tabindex=/);
});

test('public/install.sh enforces checksum presence and creates custom BIN_DIR', () => {
  const workDir = mkdtempSync(join(tmpdir(), 'omnibuf-install-test-'));
  try {
    const fakeBin = join(workDir, 'fakebin');
    const payloadDir = join(workDir, 'payload');
    mkdirSync(fakeBin, { recursive: true });
    mkdirSync(payloadDir, { recursive: true });

    const dummyOmnibuf = join(payloadDir, 'omnibuf');
    writeFileSync(dummyOmnibuf, '#!/bin/sh\necho ok\n');
    chmodSync(dummyOmnibuf, 0o755);

    const archivePath = join(workDir, 'archive.tar.gz');
    const tarRes = spawnSync('tar', ['-czf', archivePath, '-C', payloadDir, 'omnibuf']);
    assert.equal(tarRes.status, 0);

    const emptyChecksums = join(workDir, 'empty_checksums.txt');
    writeFileSync(emptyChecksums, 'deadbeef  unrelated.tar.gz\n');

    const stubCurl = join(fakeBin, 'curl');
    writeFileSync(
      stubCurl,
      `#!/bin/sh
out=""
url=""
while [ $# -gt 0 ]; do
  case "$1" in
    -o) out="$2"; shift 2 ;;
    -*) shift ;;
    *) url="$1"; shift ;;
  esac
done
case "$url" in
  *checksums.txt) cp "${emptyChecksums}" "$out" ;;
  *.tar.gz) cp "${archivePath}" "$out" ;;
esac
`,
    );
    chmodSync(stubCurl, 0o755);

    const installScript = resolve(rootDir, 'public/install.sh');
    const missingShaBinDir = join(workDir, 'out-missing-sha');
    mkdirSync(missingShaBinDir, { recursive: true });
    const missingShaRes = spawnSync('/bin/sh', [installScript], {
      env: {
        ...process.env,
        PATH: `${fakeBin}:${process.env.PATH}`,
        VERSION: 'v0.1.0',
        BIN_DIR: missingShaBinDir,
      },
      encoding: 'utf8',
    });
    assert.notEqual(
      missingShaRes.status,
      0,
      'install.sh must fail when archive checksum is missing from checksums.txt',
    );
    assert.equal(existsSync(join(missingShaBinDir, 'omnibuf')), false);

    // Ensure literal filename match (dots in .tar.gz must not match arbitrary chars)
    const osName = process.platform === 'darwin' ? 'darwin' : 'linux';
    const archName = process.arch === 'arm64' ? 'arm64' : 'amd64';
    const shaRes = spawnSync('shasum', ['-a', '256', archivePath], { encoding: 'utf8' });
    const realSha = shaRes.stdout.trim().split(/\s+/)[0];
    writeFileSync(emptyChecksums, `${realSha}  omnibuf-${osName}-${archName}_tar_gz\n`);
    const wildcardBypassDir = join(workDir, 'out-wildcard-bypass');
    mkdirSync(wildcardBypassDir, { recursive: true });
    const wildcardRes = spawnSync('/bin/sh', [installScript], {
      env: {
        ...process.env,
        PATH: `${fakeBin}:${process.env.PATH}`,
        VERSION: 'v0.1.0',
        BIN_DIR: wildcardBypassDir,
      },
      encoding: 'utf8',
    });
    assert.notEqual(wildcardRes.status, 0, 'install.sh must match archive filename literally');
    assert.equal(existsSync(join(wildcardBypassDir, 'omnibuf')), false);

    // Verify valid checksum and automatic creation of non-existent nested BIN_DIR
    writeFileSync(emptyChecksums, `${realSha}  omnibuf-${osName}-${archName}.tar.gz\n`);

    const nestedBinDir = join(workDir, 'nested', 'custom', 'bin');
    const okRes = spawnSync('/bin/sh', [installScript], {
      env: {
        ...process.env,
        PATH: `${fakeBin}:${process.env.PATH}`,
        VERSION: 'v0.1.0',
        BIN_DIR: nestedBinDir,
      },
      encoding: 'utf8',
    });
    assert.equal(okRes.status, 0, `install.sh failed on valid checksum: ${okRes.stderr}`);
    assert.equal(existsSync(join(nestedBinDir, 'omnibuf')), true);
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }
});

test('search-index.json decodes HTML entities and Navbar listbox options manage aria-selected', () => {
  const searchIndexPath = resolve(rootDir, 'dist/search-index.json');
  assert.equal(existsSync(searchIndexPath), true, 'dist/search-index.json must exist after build');
  const entries = JSON.parse(readFileSync(searchIndexPath, 'utf8'));
  assert.ok(Array.isArray(entries) && entries.length > 0);

  const entityRe = /&(?:#\d+|#x[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]+);/;
  for (const entry of entries) {
    for (const field of ['page', 'section', 'title', 'text']) {
      assert.doesNotMatch(
        String(entry[field] ?? ''),
        entityRe,
        `undecoded HTML entity in ${entry.url} (${field})`,
      );
    }
  }

  const navbar = readRepoFile('src/components/Navbar.astro');
  assert.match(navbar, /role="listbox"/);
  const searchItemAttrs = navbar.match(/^\s+data-search-item$/gm) || [];
  const optionRoleAttrs = navbar.match(/role="option"/g) || [];
  assert.equal(
    optionRoleAttrs.length,
    searchItemAttrs.length,
    'every static and dynamic [data-search-item] anchor must carry role="option"',
  );
  assert.match(navbar, /setAttribute\('aria-selected',\s*isSelected\s*\?\s*'true'\s*:\s*'false'\)/);
});

test('CSS, 404 routes, FAQ deterministic wording, HowItWorks KiB units, and PRODUCT.md paths stay consistent', () => {
  const globalCss = readRepoFile('src/styles/global.css');
  const darkGreenSelectorMatches = globalCss.match(/html\.dark svg text\[fill='#00805A'\]/g) || [];
  assert.equal(
    darkGreenSelectorMatches.length,
    1,
    'global.css must not contain duplicate dark-mode #00805A SVG text rules',
  );

  const notFoundPage = readRepoFile('src/pages/404.astro');
  for (const route of ['/', '/how-it-works', '/spec', '/go', '/es', '/cli']) {
    assert.match(notFoundPage, new RegExp(`href="${route}"`));
  }

  const faq = readRepoFile('src/components/FAQ.astro');
  assert.doesNotMatch(faq, /sorts fields and map keys/);
  assert.match(faq, /MarshalDeterministic[\s\S]*?sorts map keys/);

  const howItWorks = readRepoFile('src/components/HowItWorks.astro');
  assert.doesNotMatch(howItWorks, /16 KB/);
  assert.match(howItWorks, /16 KiB/);

  const productMd = readRepoFile('PRODUCT.md');
  assert.doesNotMatch(productMd, /web\/src\//);
  assert.match(productMd, /\/cli/);
});
