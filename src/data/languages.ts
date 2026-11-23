export type LanguageKey =
  'go' | 'es' | 'rs' | 'py' | 'cpp' | 'nano' | 'java' | 'cs' | 'swift' | 'dart' | 'php' | 'elixir';

export type PageKey =
  'home' | 'how-it-works' | 'benchmarks' | 'spec' | 'cli' | LanguageKey | 'none';

export interface LanguageEntry {
  key: LanguageKey;
  label: string;
  shortLabel: string;
  href: string;
  repoUrl: string;
  packageLabel: string;
  shortPackage: string;
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
    status: 'experimental',
  },
];

export const primaryNavPages = [
  { href: '/', key: 'home', label: 'Overview' },
  { href: '/how-it-works', key: 'how-it-works', label: 'How It Works' },
] as const;

export const benchmarksNavPage = {
  href: '/benchmarks',
  key: 'benchmarks',
  label: 'Benchmarks',
} as const;

export const cliNavPage = {
  href: '/cli',
  key: 'cli',
  label: 'CLI',
  repoUrl: 'https://github.com/omnibuf/omnibuf-cli',
} as const;

export const specNavPage = {
  href: '/spec',
  key: 'spec',
  label: 'Specification',
} as const;

export const totalSitePages =
  primaryNavPages.length + languages.length + 3; /* Benchmarks + CLI + Specification */

export function getGitHubUrlForPage(currentPage: PageKey): string {
  const lang = languages.find((l) => l.key === currentPage);
  if (lang) return lang.repoUrl;
  if (currentPage === 'cli') return cliNavPage.repoUrl;
  return 'https://github.com/omnibuf';
}
