import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
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
  for (const file of ['src/pages/tooling/cli.astro', 'src/components/Motivation.astro']) {
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

  for (const langFile of [
    'src/pages/go.astro',
    'src/pages/es.astro',
    'src/pages/rs.astro',
    'src/pages/py.astro',
    'src/pages/cpp.astro',
    'src/pages/java.astro',
    'src/pages/cs.astro',
    'src/pages/swift.astro',
    'src/pages/dart.astro',
    'src/pages/php.astro',
    'src/pages/elixir.astro',
  ]) {
    const page = readRepoFile(langFile);
    assert.match(page, /field_1/);
    assert.doesNotMatch(page, /—|&mdash;/);
    assert.doesNotMatch(page, /paying for|paying the price|pay the cost/i);
  }
  const pyPage = readRepoFile('src/pages/py.astro');
  assert.match(pyPage, /protobuf-py/);
  assert.match(pyPage, /buf generate/);
});

test('Hero and Comparisons scope benchmark widgets, ARIA tab linkage, and clean copy', () => {
  const hero = readRepoFile('src/components/Hero.astro');
  const motivation = readRepoFile('src/components/Motivation.astro');
  const comparisons = readRepoFile('src/components/Comparisons.astro');
  const benchmarksData = readRepoFile('src/data/benchmarks.ts');

  assert.match(motivation, /\[data-home-bench\]/);
  assert.match(motivation, /href=\{suite\.href\}/);
  assert.match(motivation, /data-home-bench-tab=/);
  assert.match(motivation, /data-home-bench-panel=/);
  assert.doesNotMatch(motivation, /data-autorotate=/);
  assert.doesNotMatch(motivation, /CYCLE_MS/);
  assert.match(hero, /peer\.proto/);
  assert.match(hero, /Plain structs/);
  assert.match(hero, /366 B/);
  assert.match(hero, /341 B/);
  assert.match(hero, /803 B/);
  assert.match(motivation, /bench-matrix-cell/);
  assert.doesNotMatch(motivation, /ns \/ op/);
  assert.match(motivation, /stat\.multiple\} faster/);
  assert.doesNotMatch(hero, /Encode and decode benchmarks/);
  assert.doesNotMatch(hero, /bg-\[#E5E0D5\]|text-\[#FF4F18\]/);
  assert.doesNotMatch(motivation, /bg-\[#E5E0D5\]|text-\[#FF4F18\]/);

  for (const homeFile of [hero, motivation]) {
    assert.doesNotMatch(homeFile, /—|&mdash;/);
    assert.doesNotMatch(homeFile, /paying for|paying the price|pay the cost/i);
  }

  assert.doesNotMatch(benchmarksData, /canonical 11-field/);
  const summaryMatches = [...benchmarksData.matchAll(/heroSummaryHtml:\s*'([^']+)'/g)];
  assert.equal(summaryMatches.length, 12);
  for (const [, html] of summaryMatches) {
    assert.doesNotMatch(html, /[0-9]+\.[0-9]+x/);
    assert.doesNotMatch(html, /encoded_len/);
  }

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
  assert.match(navbar, /id="docs-nav-menu"[^>]*>\s*<a\s+href="\/"/);
  assert.match(navbar, /id="lang-nav-menu"[^>]*>\s*<a\s+href=\{languagesNavPage\.href\}/);
  assert.match(navbar, /id="tooling-nav-menu"[^>]*>\s*<a\s+href=\{cliNavPage\.href\}/);
  assert.match(navbar, /data-dropdown-toggle/);
  assert.doesNotMatch(navbar, /menu\.addEventListener\('focusin'/);

  for (const entry of entries) {
    assert.doesNotMatch(
      entry.url,
      /^\/benchmarks#(?:lang-panel|bench-panel)-/,
      `benchmark search entry must link to canonical query URL, got ${entry.url}`,
    );
  }
});

test('CSS, 404 routes, FAQ deterministic wording, HowItWorks KiB units, and PRODUCT.md paths stay consistent', () => {
  const globalCss = readRepoFile('src/styles/global.css');
  const darkGreenSelectorMatches = globalCss.match(/html\.dark svg text\[fill='#00805A'\]/g) || [];
  assert.equal(
    darkGreenSelectorMatches.length,
    1,
    'global.css must not contain duplicate dark-mode #00805A SVG text rules',
  );
  const builtCss = readdirSync(resolve(rootDir, 'dist/_astro'))
    .filter((name) => name.endsWith('.css'))
    .map((name) => readFileSync(resolve(rootDir, 'dist/_astro', name), 'utf8'))
    .join('\n');
  assert.match(builtCss, /hover\\:text-accent/);
  assert.match(builtCss, /group-hover\\:text-accent/);

  const notFoundPage = readFileSync(resolve(rootDir, 'dist/404.html'), 'utf8');
  for (const route of [
    '/',
    '/how-it-works',
    '/benchmarks',
    '/spec',
    '/languages',
    '/go',
    '/es',
    '/rs',
    '/py',
    '/cpp',
    '/nano',
    '/java',
    '/cs',
    '/swift',
    '/dart',
    '/php',
    '/elixir',
    '/tooling',
    '/tooling/cli',
    '/tooling/editors',
    '/tooling/devtools',
    '/tooling/traffic',
  ]) {
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

test('Breadcrumbs and BreadcrumbList JSON-LD render everywhere except the root page', () => {
  const rootHtml = readFileSync(resolve(rootDir, 'dist/index.html'), 'utf8');
  assert.doesNotMatch(rootHtml, /aria-label="Breadcrumb"/);
  assert.doesNotMatch(rootHtml, /"BreadcrumbList"/);

  const subPages = [
    ['dist/how-it-works/index.html', ['Home', 'How It Works']],
    ['dist/benchmarks/index.html', ['Home', 'Benchmarks']],
    ['dist/spec/index.html', ['Home', 'Wire Specification']],
    ['dist/languages/index.html', ['Home', 'Languages']],
    ['dist/go/index.html', ['Home', 'Languages', 'Go']],
    ['dist/tooling/index.html', ['Home', 'Tooling']],
    ['dist/tooling/cli/index.html', ['Home', 'Tooling', 'CLI']],
    ['dist/tooling/editors/index.html', ['Home', 'Tooling', 'Editor Plugins']],
    ['dist/tooling/devtools/index.html', ['Home', 'Tooling', 'DevTools']],
    ['dist/tooling/traffic/index.html', ['Home', 'Tooling', 'Traffic Inspection']],
  ];

  for (const [relPath, expectedNames] of subPages) {
    const html = readFileSync(resolve(rootDir, relPath), 'utf8');
    assert.match(html, /aria-label="Breadcrumb"/, `${relPath} must render breadcrumb nav`);
    const match = html.match(
      /<script type="application\/ld\+json">(\{"@context":"https:\/\/schema\.org","@type":"BreadcrumbList"[^<]+)<\/script>/,
    );
    assert.ok(match, `${relPath} must embed BreadcrumbList JSON-LD`);
    const jsonLd = JSON.parse(match[1]);
    assert.deepEqual(
      jsonLd.itemListElement.map((e) => e.name),
      expectedNames,
      `${relPath} BreadcrumbList names must match expected hierarchy`,
    );
  }
});
