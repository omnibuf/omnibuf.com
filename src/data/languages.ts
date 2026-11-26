export type LanguageKey =
  'go' | 'es' | 'rs' | 'py' | 'cpp' | 'nano' | 'java' | 'cs' | 'swift' | 'dart' | 'php' | 'elixir';

export type ToolingPageKey =
  'tooling' | 'tooling-cli' | 'tooling-editors' | 'tooling-devtools' | 'tooling-traffic';

export type PageKey =
  | 'home'
  | 'how-it-works'
  | 'benchmarks'
  | 'spec'
  | 'languages'
  | ToolingPageKey
  | LanguageKey
  | 'none';

export interface LanguageEntry {
  key: LanguageKey;
  label: string;
  shortLabel: string;
  href: string;
  repoUrl: string;
  packageLabel: string;
  shortPackage: string;
  summary: string;
  status: 'stable' | 'experimental';
}

export const languages: LanguageEntry[] = [
  {
    key: 'go',
    label: 'Go',
    shortLabel: 'Go',
    href: '/go',
    repoUrl: 'https://github.com/omnibuf/omnibuf-go',
    packageLabel: 'github.com/omnibuf/omnibuf-go',
    shortPackage: 'omnibuf-go',
    summary: 'Zero-alloc codecs, struct tags, protobuf-go reflection, Opaque views, gRPC/Connect.',
    status: 'experimental',
  },
  {
    key: 'es',
    label: 'TypeScript / JS',
    shortLabel: 'TS / JS',
    href: '/es',
    repoUrl: 'https://github.com/omnibuf/omnibuf-es',
    packageLabel: '@omnibuf/core',
    shortPackage: '@omnibuf/core',
    summary:
      'defineMessage schemas, protobuf-es reflection, and buf codegen for Node and browsers.',
    status: 'experimental',
  },
  {
    key: 'rs',
    label: 'Rust',
    shortLabel: 'Rust',
    href: '/rs',
    repoUrl: 'https://github.com/omnibuf/omnibuf-rs',
    packageLabel: 'omnibuf',
    shortPackage: 'omnibuf crate',
    summary: '#[derive(OmniBuf)], buffa and prost bridges, zero-copy views, and buf codegen.',
    status: 'experimental',
  },
  {
    key: 'py',
    label: 'Python',
    shortLabel: 'Python',
    href: '/py',
    repoUrl: 'https://github.com/omnibuf/omnibuf-py',
    packageLabel: 'omnibuf',
    shortPackage: 'omnibuf (PyPI)',
    summary:
      'Prebuilt Rust-backed wheels, annotated dataclasses, protobuf-py support, and buf codegen.',
    status: 'experimental',
  },
  {
    key: 'cpp',
    label: 'C++',
    shortLabel: 'C++',
    href: '/cpp',
    repoUrl: 'https://github.com/omnibuf/omnibuf-cpp',
    packageLabel: 'omnibuf/omnibuf.hpp',
    shortPackage: 'C++20 headers',
    summary:
      'Header-only C++20 runtime, compile-time StructTraits, descriptor sets, and buf codegen.',
    status: 'experimental',
  },
  {
    key: 'nano',
    label: 'C (Nano)',
    shortLabel: 'C99',
    href: '/nano',
    repoUrl: 'https://github.com/omnibuf/omnibuf-nano',
    packageLabel: 'omnibuf-nano',
    shortPackage: 'C99 embedded',
    summary:
      'Static-bounds C99 runtime with zero heap allocation for microcontrollers and firmware.',
    status: 'experimental',
  },
  {
    key: 'java',
    label: 'Java',
    shortLabel: 'Java',
    href: '/java',
    repoUrl: 'https://github.com/omnibuf/omnibuf-java',
    packageLabel: 'com.omnibuf:omnibuf-java',
    shortPackage: 'com.omnibuf',
    summary: 'Annotated Java 21 records and POJOs, protobuf-java interop, and generated codecs.',
    status: 'experimental',
  },
  {
    key: 'cs',
    label: 'C# / .NET',
    shortLabel: 'C#',
    href: '/cs',
    repoUrl: 'https://github.com/omnibuf/omnibuf-cs',
    packageLabel: 'OmniBuf',
    shortPackage: 'OmniBuf (.NET 8)',
    summary: 'Attribute-annotated records and classes, Google.Protobuf interop, and Span views.',
    status: 'experimental',
  },
  {
    key: 'swift',
    label: 'Swift',
    shortLabel: 'Swift',
    href: '/swift',
    repoUrl: 'https://github.com/omnibuf/omnibuf-swift',
    packageLabel: 'omnibuf-swift',
    shortPackage: 'SwiftPM (Swift 6)',
    summary: 'Declarative Swift structs with key paths, SwiftProtobuf interop, and Opaque views.',
    status: 'experimental',
  },
  {
    key: 'dart',
    label: 'Dart',
    shortLabel: 'Dart',
    href: '/dart',
    repoUrl: 'https://github.com/omnibuf/omnibuf-dart',
    packageLabel: 'omnibuf',
    shortPackage: 'omnibuf (pub.dev)',
    summary: 'Declarative OmniBufSchema codecs, package:protobuf support, and Dart 3 AOT codegen.',
    status: 'experimental',
  },
  {
    key: 'php',
    label: 'PHP',
    shortLabel: 'PHP',
    href: '/php',
    repoUrl: 'https://github.com/omnibuf/omnibuf-php',
    packageLabel: 'omnibuf/omnibuf',
    shortPackage: 'Packagist (PHP 8.3+)',
    summary: 'PHP 8 attribute classes, google/protobuf interop, and optional native extension.',
    status: 'experimental',
  },
  {
    key: 'elixir',
    label: 'Elixir',
    shortLabel: 'Elixir',
    href: '/elixir',
    repoUrl: 'https://github.com/omnibuf/omnibuf-elixir',
    packageLabel: 'omnibuf',
    shortPackage: 'omnibuf (Hex.pm)',
    summary:
      'Compile-time OmniBuf.Schema DSL, elixir-protobuf support, and Rustler NIF acceleration.',
    status: 'experimental',
  },
];

export const primaryNavPages = [
  { href: '/', key: 'home', label: 'Overview' },
  { href: '/how-it-works', key: 'how-it-works', label: 'How It Works' },
] as const;

export const languagesNavPage = {
  href: '/languages',
  key: 'languages',
  label: 'Languages',
} as const;

export const benchmarksNavPage = {
  href: '/benchmarks',
  key: 'benchmarks',
  label: 'Benchmarks',
} as const;

export interface ToolingEntry {
  key: Exclude<ToolingPageKey, 'tooling'>;
  href: string;
  label: string;
  desc: string;
  repoUrl: string;
}

export const toolingPages: ToolingEntry[] = [
  {
    key: 'tooling-cli',
    href: '/tooling/cli',
    label: 'CLI',
    desc: 'Decode, encode, and jq-query .obuf files',
    repoUrl: 'https://github.com/omnibuf/omnibuf-cli',
  },
  {
    key: 'tooling-editors',
    href: '/tooling/editors',
    label: 'Editor Plugins',
    desc: 'VS Code and Neovim extensions',
    repoUrl: 'https://github.com/omnibuf/omnibuf-vscode',
  },
  {
    key: 'tooling-devtools',
    href: '/tooling/devtools',
    label: 'DevTools',
    desc: 'Chrome and Chromium network inspector',
    repoUrl: 'https://github.com/omnibuf/omnibuf-devtools',
  },
  {
    key: 'tooling-traffic',
    href: '/tooling/traffic',
    label: 'Traffic Inspection',
    desc: 'Wireshark, tshark, and mitmproxy',
    repoUrl: 'https://github.com/omnibuf/omnibuf-wireshark',
  },
];

export const cliNavPage = {
  href: '/tooling',
  key: 'tooling',
  label: 'Tooling',
  repoUrl: 'https://github.com/omnibuf',
} as const;

export const specNavPage = {
  href: '/spec',
  key: 'spec',
  label: 'Specification',
} as const;

export const totalSitePages =
  primaryNavPages.length +
  languages.length +
  toolingPages.length +
  4; /* Benchmarks + Languages + Tooling + Specification */

export function getGitHubUrlForPage(currentPage: PageKey): string {
  const lang = languages.find((l) => l.key === currentPage);
  if (lang) return lang.repoUrl;
  const tool = toolingPages.find((t) => t.key === currentPage);
  if (tool) return tool.repoUrl;
  if (currentPage === 'tooling') return cliNavPage.repoUrl;
  return 'https://github.com/omnibuf';
}
