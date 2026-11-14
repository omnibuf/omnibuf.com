export type LanguageKey = 'go' | 'es' | 'rs' | 'py' | 'cpp' | 'java' | 'cs';

export type PageKey = 'home' | 'how-it-works' | 'spec' | 'cli' | LanguageKey | 'none';

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
    repoUrl: 'https://github.com/omnibuf',
    packageLabel: 'omnibuf',
    shortPackage: 'omnibuf crate',
    status: 'experimental',
  },
  {
    key: 'py',
    label: 'Python',
    shortLabel: 'Python',
    href: '/py',
    repoUrl: 'https://github.com/omnibuf',
    packageLabel: 'omnibuf',
    shortPackage: 'omnibuf (PyPI)',
    status: 'experimental',
  },
  {
    key: 'cpp',
    label: 'C++',
    shortLabel: 'C++',
    href: '/cpp',
    repoUrl: 'https://github.com/omnibuf',
    packageLabel: 'omnibuf/omnibuf.hpp',
    shortPackage: 'C++20 headers',
    status: 'experimental',
  },
  {
    key: 'java',
    label: 'Java',
    shortLabel: 'Java',
    href: '/java',
    repoUrl: 'https://github.com/omnibuf',
    packageLabel: 'com.omnibuf:omnibuf-java',
    shortPackage: 'com.omnibuf',
    status: 'experimental',
  },
  {
    key: 'cs',
    label: 'C# / .NET',
    shortLabel: 'C#',
    href: '/cs',
    repoUrl: 'https://github.com/omnibuf',
    packageLabel: 'OmniBuf',
    shortPackage: 'OmniBuf (.NET 8)',
    status: 'experimental',
  },
];

export const primaryNavPages = [
  { href: '/', key: 'home', label: 'Overview' },
  { href: '/how-it-works', key: 'how-it-works', label: 'How It Works' },
] as const;

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
  primaryNavPages.length + languages.length + 2; /* CLI + Specification */

export function getGitHubUrlForPage(currentPage: PageKey): string {
  const lang = languages.find((l) => l.key === currentPage);
  if (lang) return lang.repoUrl;
  if (currentPage === 'cli') return cliNavPage.repoUrl;
  return 'https://github.com/omnibuf';
}
