import { languages, toolingPages, type LanguageKey } from './languages';

const SITE_ORIGIN = 'https://omnibuf.com';

const PUBLISHER = {
  '@type': 'Organization',
  name: 'OmniBuf',
  url: `${SITE_ORIGIN}/`,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_ORIGIN}/logo.png`,
  },
  sameAs: ['https://github.com/omnibuf', 'https://buf.build/omnibuf'],
};

const DEFAULT_KEYWORDS = [
  'OmniBuf',
  'binary wire format',
  'serialization',
  'Protocol Buffers',
  'Protobuf',
  'self-describing binary format',
  'Prefix-Varint',
  'gRPC',
  'ConnectRPC',
];

interface LanguageSeoMeta {
  programmingLanguage: string | string[];
  runtimePlatform?: string;
  keywords: string[];
}

const LANGUAGE_SEO: Record<LanguageKey, LanguageSeoMeta> = {
  go: {
    programmingLanguage: 'Go',
    runtimePlatform: 'Go',
    keywords: [
      'OmniBuf Go',
      'omnibuf-go',
      'Go binary serialization',
      'Golang Protobuf',
      'protoc-gen-omnibuf-go',
      'Go struct tags',
      'gRPC Go',
      'ConnectRPC Go',
    ],
  },
  es: {
    programmingLanguage: ['TypeScript', 'JavaScript'],
    runtimePlatform: 'Node.js, Browser',
    keywords: [
      'OmniBuf TypeScript',
      'omnibuf-es',
      '@omnibuf/core',
      'JavaScript binary serialization',
      'protobuf-es',
      'protoc-gen-omnibuf-es',
      'ConnectRPC',
      'gRPC-Web',
    ],
  },
  rs: {
    programmingLanguage: 'Rust',
    runtimePlatform: 'Rust',
    keywords: [
      'OmniBuf Rust',
      'omnibuf-rs',
      'Rust binary serialization',
      'Rust Protobuf',
      'prost',
      'buffa',
      'protoc-gen-omnibuf-rs',
      'zero-copy Rust',
    ],
  },
  py: {
    programmingLanguage: ['Python', 'Rust'],
    runtimePlatform: 'Python 3.11+',
    keywords: [
      'OmniBuf Python',
      'omnibuf-py',
      'Python binary serialization',
      'PyO3',
      'protobuf-py',
      'Python dataclasses',
      'protoc-gen-omnibuf-py',
      'Protobuf Python',
    ],
  },
  cpp: {
    programmingLanguage: 'C++',
    runtimePlatform: 'C++20',
    keywords: [
      'OmniBuf C++',
      'omnibuf-cpp',
      'C++20 header-only library',
      'C++ binary serialization',
      'C++ Protobuf',
      'protoc-gen-omnibuf-cpp',
      'StructTraits',
      'CMake',
    ],
  },
  nano: {
    programmingLanguage: 'C',
    runtimePlatform: 'C99 Embedded',
    keywords: [
      'OmniBuf Nano',
      'omnibuf-nano',
      'C99 serialization',
      'embedded Protobuf',
      'zero-malloc C',
      'microcontroller wire format',
      'protoc-gen-omnibuf-nano',
      'nanopb alternative',
    ],
  },
  java: {
    programmingLanguage: ['Java', 'Kotlin'],
    runtimePlatform: 'Java 21 / JVM',
    keywords: [
      'OmniBuf Java',
      'omnibuf-java',
      'Java 21 serialization',
      'protobuf-java',
      'Java records',
      'protoc-gen-omnibuf-java',
      'JVM binary format',
      'gRPC Java',
    ],
  },
  cs: {
    programmingLanguage: 'C#',
    runtimePlatform: '.NET 8',
    keywords: [
      'OmniBuf C#',
      'omnibuf-cs',
      '.NET 8 serialization',
      'Google.Protobuf',
      'C# Span serialization',
      'protoc-gen-omnibuf-cs',
      'NuGet OmniBuf',
      'gRPC .NET',
    ],
  },
  swift: {
    programmingLanguage: 'Swift',
    runtimePlatform: 'Swift 6 / SwiftPM',
    keywords: [
      'OmniBuf Swift',
      'omnibuf-swift',
      'Swift 6 serialization',
      'SwiftProtobuf',
      'SwiftPM',
      'protoc-gen-omnibuf-swift',
      'gRPC-Swift',
      'Connect-Swift',
    ],
  },
  dart: {
    programmingLanguage: 'Dart',
    runtimePlatform: 'Dart 3 / Flutter',
    keywords: [
      'OmniBuf Dart',
      'omnibuf-dart',
      'Dart 3 serialization',
      'Flutter binary format',
      'package:protobuf',
      'protoc-gen-omnibuf-dart',
      'pub.dev omnibuf',
      'gRPC Dart',
    ],
  },
  php: {
    programmingLanguage: 'PHP',
    runtimePlatform: 'PHP 8.3+',
    keywords: [
      'OmniBuf PHP',
      'omnibuf-php',
      'PHP 8.3 serialization',
      'google/protobuf PHP',
      'PHP attributes',
      'protoc-gen-omnibuf-php',
      'Packagist omnibuf',
      'binary wire format PHP',
    ],
  },
  elixir: {
    programmingLanguage: 'Elixir',
    runtimePlatform: 'Elixir / BEAM / OTP 27+',
    keywords: [
      'OmniBuf Elixir',
      'omnibuf-elixir',
      'Elixir binary serialization',
      'BEAM wire format',
      'elixir-protobuf',
      'Rustler NIF',
      'protoc-gen-omnibuf-elixir',
      'Hex.pm omnibuf',
    ],
  },
};

const ROUTE_KEYWORDS: Record<string, string[]> = {
  '/': DEFAULT_KEYWORDS,
  '/how-it-works': [
    'OmniBuf wire format',
    'Prefix-Varint',
    '4-bit wire types',
    'binary serialization architecture',
    'Protobuf comparison',
    'CBOR comparison',
    'MessagePack comparison',
    'single-pass encoding',
  ],
  '/benchmarks': [
    'OmniBuf benchmarks',
    'serialization benchmarks',
    'Protobuf benchmark',
    'JSON vs Protobuf vs OmniBuf',
    'Go serialization benchmark',
    'Rust serialization benchmark',
    'cross-language benchmarks',
  ],
  '/spec': [
    'OmniBuf specification',
    'wire format specification',
    'Prefix-Varint specification',
    'Protobuf Editions',
    'binary encoding spec',
    'Field #0 schema metadata',
    'self-describing binary format',
  ],
  '/languages': [
    'OmniBuf languages',
    'OmniBuf runtimes',
    'protoc-gen-omnibuf',
    'cross-language serialization',
    'Protobuf code generator',
    'conformance suite',
    'multi-language wire format',
  ],
  '/tooling': [
    'OmniBuf tooling',
    'omnibuf CLI',
    'OmniBuf VS Code',
    'OmniBuf Neovim',
    'OmniBuf DevTools',
    'OmniBuf Wireshark',
    'OmniBuf mitmproxy',
    '.obuf inspector',
  ],
  '/tooling/cli': [
    'omnibuf CLI',
    'omnibuf-cli',
    'decode .obuf',
    'jq binary packets',
    'schema-less binary decoder',
    'Homebrew omnibuf',
    'wire format CLI',
  ],
  '/tooling/editors': [
    'OmniBuf VS Code extension',
    'omnibuf-vscode',
    'OmniBuf Neovim plugin',
    'omnibuf-vim',
    '.obuf hex editor',
    'binary file JSON editor',
  ],
  '/tooling/devtools': [
    'OmniBuf DevTools',
    'omnibuf-devtools',
    'Chrome DevTools extension',
    'Firefox DevTools addon',
    'ConnectRPC inspector',
    'gRPC-Web network inspector',
    'application/omnibuf',
  ],
  '/tooling/traffic': [
    'OmniBuf Wireshark dissector',
    'omnibuf-wireshark',
    'tshark OmniBuf',
    'termshark Lua dissector',
    'OmniBuf mitmproxy addon',
    'omnibuf-mitmproxy',
    'gRPC packet inspection',
  ],
};

export interface RouteSeoData {
  keywords: string[];
  jsonLd: Record<string, unknown>[];
}

export function getRouteSeoData(
  normalizedPath: string,
  title: string,
  description: string,
): RouteSeoData {
  if (normalizedPath === '/') {
    return {
      keywords: ROUTE_KEYWORDS['/'],
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@graph': [
            PUBLISHER,
            {
              '@type': 'WebSite',
              name: 'OmniBuf',
              url: `${SITE_ORIGIN}/`,
              description,
              publisher: { '@type': 'Organization', name: 'OmniBuf', url: `${SITE_ORIGIN}/` },
            },
            {
              '@type': 'SoftwareSourceCode',
              name: 'OmniBuf',
              url: `${SITE_ORIGIN}/`,
              description,
              codeRepository: 'https://github.com/omnibuf',
              license: 'https://www.apache.org/licenses/LICENSE-2.0',
              programmingLanguage: languages.map((l) => l.label),
              keywords: DEFAULT_KEYWORDS.join(', '),
              sameAs: ['https://github.com/omnibuf', 'https://buf.build/omnibuf'],
            },
          ],
        },
      ],
    };
  }

  const langKey = normalizedPath.slice(1) as LanguageKey;
  const langEntry = languages.find((l) => l.key === langKey);
  if (langEntry) {
    const meta = LANGUAGE_SEO[langEntry.key];
    return {
      keywords: meta.keywords,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'SoftwareSourceCode',
          name: `OmniBuf for ${langEntry.label}`,
          description,
          url: `${SITE_ORIGIN}${langEntry.href}`,
          codeRepository: langEntry.repoUrl,
          license: 'https://www.apache.org/licenses/LICENSE-2.0',
          programmingLanguage: meta.programmingLanguage,
          ...(meta.runtimePlatform ? { runtimePlatform: meta.runtimePlatform } : {}),
          keywords: meta.keywords.join(', '),
          author: PUBLISHER,
        },
      ],
    };
  }

  if (normalizedPath === '/languages') {
    const keywords = ROUTE_KEYWORDS['/languages'];
    return {
      keywords,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: title,
          description,
          url: `${SITE_ORIGIN}/languages`,
          inLanguage: 'en',
          keywords: keywords.join(', '),
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: languages.map((lang, idx) => ({
              '@type': 'ListItem',
              position: idx + 1,
              name: `OmniBuf for ${lang.label}`,
              url: `${SITE_ORIGIN}${lang.href}`,
            })),
          },
          publisher: PUBLISHER,
        },
      ],
    };
  }

  if (normalizedPath === '/tooling') {
    const keywords = ROUTE_KEYWORDS['/tooling'];
    return {
      keywords,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: title,
          description,
          url: `${SITE_ORIGIN}/tooling`,
          inLanguage: 'en',
          keywords: keywords.join(', '),
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: toolingPages.map((tool, idx) => ({
              '@type': 'ListItem',
              position: idx + 1,
              name: `OmniBuf ${tool.label}`,
              url: `${SITE_ORIGIN}${tool.href}`,
            })),
          },
          publisher: PUBLISHER,
        },
      ],
    };
  }

  if (
    normalizedPath === '/how-it-works' ||
    normalizedPath === '/benchmarks' ||
    normalizedPath === '/spec'
  ) {
    const keywords = ROUTE_KEYWORDS[normalizedPath] ?? DEFAULT_KEYWORDS;
    return {
      keywords,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: title,
          description,
          url: `${SITE_ORIGIN}${normalizedPath}`,
          inLanguage: 'en',
          keywords: keywords.join(', '),
          author: PUBLISHER,
          publisher: PUBLISHER,
        },
      ],
    };
  }

  const toolEntry = toolingPages.find((t) => t.href === normalizedPath);
  if (toolEntry) {
    const keywords = ROUTE_KEYWORDS[normalizedPath] ?? DEFAULT_KEYWORDS;
    const osMap: Record<string, string> = {
      'tooling-cli': 'macOS, Linux, Windows',
      'tooling-editors': 'macOS, Linux, Windows (VS Code, Neovim, Vim)',
      'tooling-devtools': 'Chrome, Chromium, Edge, Brave, Firefox',
      'tooling-traffic': 'macOS, Linux, Windows (Wireshark, tshark, mitmproxy)',
    };
    return {
      keywords,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: `OmniBuf ${toolEntry.label}`,
          description,
          url: `${SITE_ORIGIN}${toolEntry.href}`,
          applicationCategory: 'DeveloperApplication',
          operatingSystem: osMap[toolEntry.key] ?? 'macOS, Linux, Windows',
          sameAs: toolEntry.repoUrl,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          keywords: keywords.join(', '),
          author: PUBLISHER,
        },
      ],
    };
  }

  return {
    keywords: DEFAULT_KEYWORDS,
    jsonLd: [],
  };
}
