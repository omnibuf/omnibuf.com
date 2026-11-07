export type LanguageKey = 'go' | 'es';

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
