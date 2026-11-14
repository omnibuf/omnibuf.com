import type { LanguageKey } from './languages';

export interface FormatStat {
  label: string;
  score: number;
}

export interface FormatProfile {
  key: string;
  name: string;
  url?: string;
  verdict?: string;
  stats: FormatStat[];
}

export interface BenchmarkRow {
  name: string;
  val: number;
  ops?: string;
  ratio?: string;
  sizeBytes?: number;
  highlight?: boolean;
  baseline?: boolean;
}

export interface BenchmarkCategory {
  title: string;
  unit: string;
  maxVal: number;
  methodology: string;
  rows: BenchmarkRow[];
}

export type EsBenchmarkRow = BenchmarkRow;
export type EsBenchmarkCategory = BenchmarkCategory;

export interface LanguageBenchmarkSuite {
  key: LanguageKey;
  label: string;
  shortLabel: string;
  headingPrefix: string;
  subtitleHtml: string;
  href: string;
  ctaLabel: string;
  competitorsLabel: string;
  heroSummaryHtml: string;
  categories: BenchmarkCategory[];
  butterflyEncodeRows: BenchmarkRow[];
  butterflyDecodeRows: BenchmarkRow[];
  hardwareLines: string[];
  environmentParagraphs: string[];
}

export const formatProfiles: Record<string, FormatProfile> = {
  omnibuf: {
    key: 'omnibuf',
    name: 'OmniBuf',
    verdict:
      "Each chart scores five things from our benchmark suite. Encode and Decode Speed measure turning native structs into bytes and back. Memory Efficiency reflects heap allocations (buffer reuse and zeroCopy strings keep Go allocations at zero). Wire Size is the byte length on the 11-field PeerUpdate packet. Field Lookup measures reading one nested field out of raw bytes: jumping by byte length beats scanning varints, though FlatBuffers and Cap'n Proto are still faster here since they jump straight to an offset.",
    stats: [
      { label: 'Wire Size', score: 94 },
      { label: 'Encode Speed', score: 100 },
      { label: 'Decode Speed', score: 100 },
      { label: 'Field Lookup', score: 78 },
      { label: 'Memory Efficiency', score: 98 },
    ],
  },
  protobuf: {
    key: 'protobuf',
    name: 'Protobuf',
    url: 'https://protobuf.dev/',
    verdict:
      'Protobuf is ~7% smaller on the wire (341 B vs 366 B) and has libraries for almost every language on earth. OmniBuf keeps the same .proto schemas and generated structs, encodes in a single pass (~5.8x faster in Go), decodes ~5.6x faster, and does not need the .proto file to inspect a packet.',
    stats: [
      { label: 'Wire Size', score: 100 },
      { label: 'Encode Speed', score: 45 },
      { label: 'Decode Speed', score: 42 },
      { label: 'Field Lookup', score: 72 },
      { label: 'Memory Efficiency', score: 65 },
    ],
  },
  flatbuffers: {
    key: 'flatbuffers',
    name: 'FlatBuffers',
    url: 'https://flatbuffers.dev/',
    verdict:
      'FlatBuffers reads fields straight out of a buffer by vtable offset, making it tough to beat for plucking two fields out of a huge message. The catch is authoring .fbs schemas and constructing messages through a builder API. On normal Go structs or TypeScript objects, OmniBuf is 39% smaller on the wire and much faster to encode.',
    stats: [
      { label: 'Wire Size', score: 57 },
      { label: 'Encode Speed', score: 60 },
      { label: 'Decode Speed', score: 90 },
      { label: 'Field Lookup', score: 98 },
      { label: 'Memory Efficiency', score: 98 },
    ],
  },
  capnproto: {
    key: 'capnproto',
    name: "Cap'n Proto",
    url: 'https://capnproto.org/',
    verdict:
      "Cap'n Proto lays out messages in memory as fixed-offset pointer structures and has its own RPC protocol with promise pipelining. Reading a single field in place takes 6 ns. Serializing normal language structs still requires copying fields in and out of segment builders: OmniBuf is 35% smaller and several times faster to encode and decode.",
    stats: [
      { label: 'Wire Size', score: 61 },
      { label: 'Encode Speed', score: 56 },
      { label: 'Decode Speed', score: 68 },
      { label: 'Field Lookup', score: 95 },
      { label: 'Memory Efficiency', score: 72 },
    ],
  },
  msgpack: {
    key: 'msgpack',
    name: 'MessagePack',
    url: 'https://msgpack.org/',
    verdict:
      'MessagePack fits arbitrary, untyped maps that have no schema at all. As a binary JSON encoding, an array of structs still repeats the string field names inside every element. OmniBuf is 44% smaller (and still 4% smaller even with Field #0 field names turned on, since array field names are only written once) and much faster in both Go and JS.',
    stats: [
      { label: 'Wire Size', score: 52 },
      { label: 'Encode Speed', score: 15 },
      { label: 'Decode Speed', score: 18 },
      { label: 'Field Lookup', score: 42 },
      { label: 'Memory Efficiency', score: 25 },
    ],
  },
  json: {
    key: 'json',
    name: 'JSON',
    url: 'https://www.json.org/',
    verdict:
      'JSON is the only format here that works straight in curl and jq with no schema or tooling. Once JSON parsing or payload size becomes a bottleneck, OmniBuf keeps the same Go struct-tag workflow (and defineMessage in TypeScript) at less than half the wire size and a fraction of the CPU time.',
    stats: [
      { label: 'Wire Size', score: 42 },
      { label: 'Encode Speed', score: 12 },
      { label: 'Decode Speed', score: 10 },
      { label: 'Field Lookup', score: 10 },
      { label: 'Memory Efficiency', score: 38 },
    ],
  },
  avro: {
    key: 'avro',
    name: 'Apache Avro',
    url: 'https://avro.apache.org/',
    verdict:
      "Avro is everywhere in Kafka and Spark. Raw Avro strips out all field tags and byte lengths (making it 313 B vs OmniBuf's 366 B), which means you cannot decode a packet or even skip a single field unless the exact writer schema is loaded in memory. Avro container files (OCF) go the other way and embed the full JSON schema in the header (1,359 B).",
    stats: [
      { label: 'Wire Size', score: 98 },
      { label: 'Encode Speed', score: 58 },
      { label: 'Decode Speed', score: 66 },
      { label: 'Field Lookup', score: 48 },
      { label: 'Memory Efficiency', score: 78 },
    ],
  },
  parquet: {
    key: 'parquet',
    name: 'Apache Parquet',
    url: 'https://parquet.apache.org/',
    verdict:
      'Parquet is not in the single-message charts; it is a columnar file format meant for batch analytics over thousands of rows, not RPC packets. Even a 1-row Parquet file carries column chunks, page headers, and a multi-kilobyte Thrift footer. Parquet fits event batches in S3 for DuckDB or Spark; OmniBuf fits individual messages over the network.',
    stats: [
      { label: 'Wire Size', score: 15 },
      { label: 'Encode Speed', score: 8 },
      { label: 'Decode Speed', score: 10 },
      { label: 'Field Lookup', score: 20 },
      { label: 'Memory Efficiency', score: 20 },
    ],
  },
};

export const opponentKeys = [
  'protobuf',
  'flatbuffers',
  'capnproto',
  'avro',
  'parquet',
  'msgpack',
  'json',
] as const;

// Go results from omnibuf-go/testdata/benchmarks.json (Go 1.27.1, Apple M1 Pro)
export const benchmarkCategories: BenchmarkCategory[] = [
  {
    title: 'Full Message Encode Speed',
    unit: 'ns',
    maxVal: 2400,
    methodology:
      "Serializing the 11-field Go struct into a reused byte slice. FlatBuffers and Cap'n Proto times include building the buffer from the struct.",
    rows: [
      { name: 'OmniBuf (Generated)', val: 126, highlight: true, baseline: true },
      { name: 'OmniBuf (Go Struct Tags)', val: 349, highlight: true },
      { name: 'Avro (Raw Binary)', val: 543 },
      { name: 'FlatBuffers', val: 726 },
      { name: 'Protobuf', val: 728 },
      { name: "Cap'n Proto", val: 1323 },
      { name: 'MessagePack', val: 2094 },
      { name: 'JSON (encoding/json)', val: 2189 },
      { name: 'JSON (encoding/json/v2)', val: 2247 },
    ],
  },
  {
    title: 'Full Message Decode Speed',
    unit: 'ns',
    maxVal: 4600,
    methodology:
      'Unpacking all 11 fields into a struct. Most libraries reuse the destination struct; standard Go Protobuf allocates a fresh one. Zero-copy strings are enabled where supported.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 228, highlight: true, baseline: true },
      { name: 'FlatBuffers', val: 252 },
      { name: 'OmniBuf (Go Struct Tags)', val: 463, highlight: true },
      { name: 'Avro (Raw Binary)', val: 556 },
      { name: "Cap'n Proto", val: 988 },
      { name: 'Protobuf', val: 1288 },
      { name: 'MessagePack', val: 2781 },
      { name: 'JSON (encoding/json/v2)', val: 3964 },
      { name: 'JSON (encoding/json)', val: 4459 },
    ],
  },
  {
    title: 'Read a Single Nested Field (peer.location.city)',
    unit: 'ns',
    maxVal: 1400,
    methodology:
      "Reading peer.location.city directly from the raw byte slice. Cap'n Proto and FlatBuffers use offset tables; OmniBuf hops over preceding field headers by length.",
    rows: [
      { name: "Cap'n Proto", val: 6 },
      { name: 'FlatBuffers', val: 35 },
      { name: 'OmniBuf', val: 108, highlight: true, baseline: true },
      { name: 'Avro (Raw Binary)', val: 645 },
      { name: 'MessagePack', val: 795 },
      { name: 'Protobuf', val: 1299 },
    ],
  },
  {
    title: 'Selective Single-Field Mutation (peer.sequence)',
    unit: 'ns',
    maxVal: 7000,
    methodology:
      'Checking peer.location.city, incrementing the 64-bit sequence number, and returning the updated packet. OmniBuf splices the field in place; the others decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Opaque Splice)', val: 290, highlight: true, baseline: true },
      { name: 'FlatBuffers', val: 988 },
      { name: 'Avro (Raw Binary)', val: 1121 },
      { name: 'Protobuf', val: 2084 },
      { name: "Cap'n Proto", val: 2473 },
      { name: 'MessagePack', val: 5117 },
      { name: 'JSON (encoding/json)', val: 6813 },
    ],
  },
  {
    title: 'Packet Size on the Wire',
    unit: 'B',
    maxVal: 1400,
    methodology:
      'Encoded byte size for the 11-field PeerUpdate message. Raw Avro omits all tags and lengths (requiring the writer schema to read), and Avro OCF embeds the JSON schema header.',
    rows: [
      { name: 'Avro (Raw, No Field Tags)', val: 313 },
      { name: 'Protobuf', val: 341 },
      { name: 'OmniBuf', val: 366, highlight: true, baseline: true },
      { name: "Cap'n Proto", val: 560 },
      { name: 'FlatBuffers', val: 600 },
      { name: 'OmniBuf (With Field #0 Names)', val: 630, highlight: true },
      { name: 'MessagePack', val: 656 },
      { name: 'JSON', val: 803 },
      { name: 'Avro OCF (With Schema Header)', val: 1359 },
    ],
  },
];

// TypeScript results from omnibuf-es/testdata/benchmarks.json (Node.js v24.22.1)
export const esBenchmarkCategories: EsBenchmarkCategory[] = [
  {
    title: 'Full Message Encode Speed',
    unit: 'ns',
    maxVal: 6200,
    methodology: 'PeerUpdate object -> fresh Uint8Array (366 B).',
    rows: [
      {
        name: 'OmniBuf',
        val: 1208,
        ops: '827,724 ops/s',
        sizeBytes: 366,
        highlight: true,
        baseline: true,
      },
      {
        name: 'protobufjs',
        val: 1628,
        ops: '614,123 ops/s',
        sizeBytes: 341,
      },
      {
        name: 'JSON',
        val: 2385,
        ops: '419,367 ops/s',
        sizeBytes: 791,
      },
      {
        name: '@bufbuild/protobuf (protobuf-es)',
        val: 2812,
        ops: '355,679 ops/s',
        sizeBytes: 341,
      },
      {
        name: '@msgpack/msgpack',
        val: 4934,
        ops: '202,658 ops/s',
        sizeBytes: 622,
      },
      {
        name: 'google-protobuf',
        val: 6055,
        ops: '165,150 ops/s',
        sizeBytes: 341,
      },
    ],
  },
  {
    title: 'Full Message Decode Speed',
    unit: 'ns',
    maxVal: 4000,
    methodology: 'Uint8Array (366 B) -> fresh PeerUpdate object.',
    rows: [
      {
        name: 'OmniBuf',
        val: 1147,
        ops: '872,002 ops/s',
        highlight: true,
        baseline: true,
      },
      {
        name: 'protobufjs',
        val: 1550,
        ops: '645,157 ops/s',
      },
      {
        name: 'JSON',
        val: 2295,
        ops: '435,806 ops/s',
      },
      {
        name: 'google-protobuf',
        val: 3452,
        ops: '289,670 ops/s',
      },
      {
        name: '@msgpack/msgpack',
        val: 3728,
        ops: '268,272 ops/s',
      },
      {
        name: '@bufbuild/protobuf (protobuf-es)',
        val: 3871,
        ops: '258,321 ops/s',
      },
    ],
  },
  {
    title: 'Read a Single Nested Field (peer.location.city)',
    unit: 'ns',
    maxVal: 4000,
    methodology:
      'Reading peer.location.city from a Uint8Array. The other JS libraries decode the whole message first; OmniBuf skips earlier fields by byte length.',
    rows: [
      {
        name: 'OmniBuf',
        val: 398,
        ops: '2,512,498 ops/s',
        highlight: true,
        baseline: true,
      },
      {
        name: 'protobufjs',
        val: 1587,
        ops: '630,277 ops/s',
      },
      {
        name: 'JSON',
        val: 2304,
        ops: '433,952 ops/s',
      },
      {
        name: 'google-protobuf',
        val: 3611,
        ops: '276,952 ops/s',
      },
      {
        name: '@msgpack/msgpack',
        val: 3697,
        ops: '270,474 ops/s',
      },
      {
        name: '@bufbuild/protobuf (protobuf-es)',
        val: 3802,
        ops: '263,016 ops/s',
      },
    ],
  },
  {
    title: 'Selective Single-Field Mutation (peer.sequence)',
    unit: 'ns',
    maxVal: 9800,
    methodology: 'peer.sequence++ in the packet buffer -> updated Uint8Array.',
    rows: [
      {
        name: 'OmniBuf',
        val: 542,
        ops: '1,843,789 ops/s',
        highlight: true,
        baseline: true,
      },
      {
        name: 'protobufjs',
        val: 3708,
        ops: '269,708 ops/s',
      },
      {
        name: 'JSON',
        val: 4953,
        ops: '201,889 ops/s',
      },
      {
        name: '@bufbuild/protobuf (protobuf-es)',
        val: 7335,
        ops: '136,334 ops/s',
      },
      {
        name: '@msgpack/msgpack',
        val: 8131,
        ops: '122,984 ops/s',
      },
      {
        name: 'google-protobuf',
        val: 9671,
        ops: '103,403 ops/s',
      },
    ],
  },
];

// Rust results from omnibuf-rs/testdata/benchmarks.json (rustc 1.94.0)
export const rsBenchmarkCategories: BenchmarkCategory[] = [
  {
    title: 'Full Message Encode Speed',
    unit: 'ns',
    maxVal: 1100,
    methodology: 'Serializing PeerUpdate into a freshly allocated Vec<u8>.',
    rows: [
      { name: 'OmniBuf (#[derive(OmniBuf)])', val: 186, sizeBytes: 366, highlight: true },
      { name: 'OmniBuf (Generated)', val: 190, sizeBytes: 366, highlight: true, baseline: true },
      { name: 'prost (Protobuf)', val: 299, sizeBytes: 341 },
      { name: 'rmp-serde (MessagePack)', val: 825, sizeBytes: 626 },
      { name: 'serde_json', val: 1036, sizeBytes: 803 },
    ],
  },
  {
    title: 'Full Message Decode Speed',
    unit: 'ns',
    maxVal: 1750,
    methodology:
      'Decoding &[u8] into a fresh owned PeerUpdate struct (allocating Strings and Vecs).',
    rows: [
      { name: 'OmniBuf (#[derive(OmniBuf)])', val: 658, highlight: true },
      { name: 'OmniBuf (Generated)', val: 677, highlight: true, baseline: true },
      { name: 'prost (Protobuf)', val: 868 },
      { name: 'rmp-serde (MessagePack)', val: 1129 },
      { name: 'serde_json', val: 1675 },
    ],
  },
  {
    title: 'Read a Single Nested Field (peer.location.city)',
    unit: 'ns',
    maxVal: 1750,
    methodology:
      'Borrowing peer.location.city (&str) directly from &[u8] via OpaquePeerUpdate vs full decode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 93, highlight: true, baseline: true },
      { name: 'prost (Protobuf)', val: 866 },
      { name: 'rmp-serde (MessagePack)', val: 1127 },
      { name: 'serde_json', val: 1675 },
    ],
  },
  {
    title: 'Selective Single-Field Mutation (peer.sequence)',
    unit: 'ns',
    maxVal: 2900,
    methodology: 'Splicing an updated 64-bit sequence number into &[u8] vs decode + re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 115, highlight: true, baseline: true },
      { name: 'prost (Protobuf)', val: 1206 },
      { name: 'rmp-serde (MessagePack)', val: 1980 },
      { name: 'serde_json', val: 2758 },
    ],
  },
];

// Python results from omnibuf-py/testdata/benchmarks.json (Python 3.14.5)
export const pyBenchmarkCategories: BenchmarkCategory[] = [
  {
    title: 'Full Message Encode Speed',
    unit: 'ns',
    maxVal: 18500,
    methodology:
      'Pure-Python OmniBuf vs compiled C and Rust extensions (upb, protobuf-py-ext, msgspec, msgpack, _json).',
    rows: [
      { name: 'google.protobuf (upb)', val: 562, sizeBytes: 341 },
      { name: 'msgspec', val: 822, sizeBytes: 634 },
      { name: 'protobuf-py', val: 1226, sizeBytes: 341 },
      { name: 'msgpack', val: 2646, sizeBytes: 634 },
      { name: 'json (stdlib)', val: 6214, sizeBytes: 874 },
      { name: 'OmniBuf (Generated)', val: 10287, sizeBytes: 366, highlight: true, baseline: true },
      { name: 'OmniBuf (@dataclass)', val: 17858, sizeBytes: 366, highlight: true },
    ],
  },
  {
    title: 'Full Message Decode Speed',
    unit: 'ns',
    maxVal: 37000,
    methodology:
      'Unpacking all 11 fields in pure Python 3.14 bytecode vs C and Rust native extensions.',
    rows: [
      { name: 'google.protobuf (upb)', val: 814 },
      { name: 'msgspec', val: 1560 },
      { name: 'protobuf-py', val: 2853 },
      { name: 'msgpack', val: 3553 },
      { name: 'json (stdlib)', val: 5901 },
      { name: 'OmniBuf (Generated)', val: 18646, highlight: true, baseline: true },
      { name: 'OmniBuf (@dataclass)', val: 36377, highlight: true },
    ],
  },
  {
    title: 'Read a Single Nested Field (peer.location.city)',
    unit: 'ns',
    maxVal: 6200,
    methodology: 'Pure-Python OpaquePeerUpdate header-hop lookup vs full C/Rust extension decode.',
    rows: [
      { name: 'google.protobuf (upb)', val: 1020 },
      { name: 'msgspec', val: 1593 },
      { name: 'protobuf-py', val: 2851 },
      { name: 'msgpack', val: 3737 },
      { name: 'OmniBuf (Generated)', val: 5562, highlight: true, baseline: true },
      { name: 'json (stdlib)', val: 5920 },
    ],
  },
  {
    title: 'Selective Single-Field Mutation (peer.sequence)',
    unit: 'ns',
    maxVal: 13000,
    methodology:
      'Pure-Python OpaquePeerUpdate single-field byte splice vs full decode and re-encode.',
    rows: [
      { name: 'google.protobuf (upb)', val: 1450 },
      { name: 'msgspec', val: 2375 },
      { name: 'protobuf-py', val: 4182 },
      { name: 'OmniBuf (Generated)', val: 4690, highlight: true, baseline: true },
      { name: 'msgpack', val: 6428 },
      { name: 'json (stdlib)', val: 12559 },
    ],
  },
];

// C++20 results from omnibuf-cpp/testdata/benchmarks.json (Apple Clang 21.0.0 -O3)
export const cppBenchmarkCategories: BenchmarkCategory[] = [
  {
    title: 'Full Message Encode Speed',
    unit: 'ns',
    maxVal: 1750,
    methodology:
      'Serializing PeerUpdate into a fresh std::vector<uint8_t> against in-tree LEB128 Protobuf and JSON codecs.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 252, sizeBytes: 366, highlight: true, baseline: true },
      { name: 'OmniBuf (C++ Struct)', val: 339, sizeBytes: 366, highlight: true },
      { name: 'Protobuf (LEB128 Wire)', val: 404, sizeBytes: 341 },
      { name: 'JSON', val: 1681, sizeBytes: 803 },
    ],
  },
  {
    title: 'Full Message Decode Speed',
    unit: 'ns',
    maxVal: 1650,
    methodology:
      'Decoding into a fresh C++20 PeerUpdate struct (allocating std::string and std::vector fields).',
    rows: [
      { name: 'OmniBuf (Generated)', val: 448, highlight: true, baseline: true },
      { name: 'Protobuf (LEB128 Wire)', val: 626 },
      { name: 'OmniBuf (C++ Struct)', val: 643, highlight: true },
      { name: 'JSON', val: 1573 },
    ],
  },
  {
    title: 'Read a Single Nested Field (peer.location.city)',
    unit: 'ns',
    maxVal: 1650,
    methodology:
      'Returning std::string_view into the packet via OpaquePeerUpdate vs full message decode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 122, highlight: true, baseline: true },
      { name: 'Protobuf (LEB128 Wire)', val: 629 },
      { name: 'JSON', val: 1577 },
    ],
  },
  {
    title: 'Selective Single-Field Mutation (peer.sequence)',
    unit: 'ns',
    maxVal: 3400,
    methodology: 'Splicing peer.sequence via OpaquePeerUpdate vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 149, highlight: true, baseline: true },
      { name: 'Protobuf (LEB128 Wire)', val: 1040 },
      { name: 'JSON', val: 3280 },
    ],
  },
];

// Java 21 results from omnibuf-java/testdata/benchmarks.json (OpenJDK 21.0.13)
export const javaBenchmarkCategories: BenchmarkCategory[] = [
  {
    title: 'Full Message Encode Speed',
    unit: 'ns',
    maxVal: 2500,
    methodology:
      'Serializing PeerUpdate into a fresh byte[]. protobuf-java reuses its cached memoizedSerializedSize on the immutable sample.',
    rows: [
      { name: 'Protobuf (protobuf-java)', val: 340, sizeBytes: 341 },
      { name: 'OmniBuf (Generated)', val: 372, sizeBytes: 366, highlight: true, baseline: true },
      { name: 'OmniBuf (@OmniBufField)', val: 680, sizeBytes: 366, highlight: true },
      { name: 'JSON (Jackson)', val: 1634, sizeBytes: 803 },
      { name: 'MessagePack (Jackson)', val: 2397, sizeBytes: 626 },
    ],
  },
  {
    title: 'Full Message Decode Speed',
    unit: 'ns',
    maxVal: 4100,
    methodology: 'Decoding byte[] into a fresh PeerUpdate object.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 745, highlight: true, baseline: true },
      { name: 'Protobuf (protobuf-java)', val: 982 },
      { name: 'OmniBuf (@OmniBufField)', val: 1801, highlight: true },
      { name: 'JSON (Jackson)', val: 2513 },
      { name: 'MessagePack (Jackson)', val: 3991 },
    ],
  },
  {
    title: 'Read a Single Nested Field (peer.location.city)',
    unit: 'ns',
    maxVal: 4100,
    methodology: 'Reading peer.location.city via OpaquePeerUpdate vs full message decode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 187, highlight: true, baseline: true },
      { name: 'Protobuf (protobuf-java)', val: 966 },
      { name: 'JSON (Jackson)', val: 2514 },
      { name: 'MessagePack (Jackson)', val: 3991 },
    ],
  },
  {
    title: 'Selective Single-Field Mutation (peer.sequence)',
    unit: 'ns',
    maxVal: 6800,
    methodology: 'Splicing peer.sequence via OpaquePeerUpdate vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 144, highlight: true, baseline: true },
      { name: 'Protobuf (protobuf-java)', val: 1483 },
      { name: 'JSON (Jackson)', val: 4396 },
      { name: 'MessagePack (Jackson)', val: 6614 },
    ],
  },
];

// C# results from omnibuf-cs/testdata/benchmarks.json (.NET 8.0.29)
export const csBenchmarkCategories: BenchmarkCategory[] = [
  {
    title: 'Full Message Encode Speed',
    unit: 'ns',
    maxVal: 1150,
    methodology: 'Serializing PeerUpdate into a fresh byte[] on .NET 8 RyuJIT.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 314, sizeBytes: 366, highlight: true, baseline: true },
      { name: 'OmniBuf ([OmniBufField])', val: 458, sizeBytes: 366, highlight: true },
      { name: 'MessagePack-CSharp', val: 599, sizeBytes: 626 },
      { name: 'Google.Protobuf', val: 635, sizeBytes: 341 },
      { name: 'System.Text.Json', val: 1108, sizeBytes: 803 },
    ],
  },
  {
    title: 'Full Message Decode Speed',
    unit: 'ns',
    maxVal: 3250,
    methodology: 'Decoding ReadOnlySpan<byte> into a fresh PeerUpdate instance.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 659, highlight: true, baseline: true },
      { name: 'OmniBuf ([OmniBufField])', val: 756, highlight: true },
      { name: 'Google.Protobuf', val: 816 },
      { name: 'MessagePack-CSharp', val: 1181 },
      { name: 'System.Text.Json', val: 3132 },
    ],
  },
  {
    title: 'Read a Single Nested Field (peer.location.city)',
    unit: 'ns',
    maxVal: 3250,
    methodology: 'Reading peer.location.city via OpaquePeerUpdate vs full message decode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 141, highlight: true, baseline: true },
      { name: 'Google.Protobuf', val: 815 },
      { name: 'MessagePack-CSharp', val: 1176 },
      { name: 'System.Text.Json', val: 3128 },
    ],
  },
  {
    title: 'Selective Single-Field Mutation (peer.sequence)',
    unit: 'ns',
    maxVal: 4400,
    methodology: 'Splicing peer.sequence via OpaquePeerUpdate vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 134, highlight: true, baseline: true },
      { name: 'Google.Protobuf', val: 1503 },
      { name: 'MessagePack-CSharp', val: 1834 },
      { name: 'System.Text.Json', val: 4298 },
    ],
  },
];

const goSpeedCategories = benchmarkCategories.filter((cat) => cat.unit !== 'B');
const goEncodeCat = benchmarkCategories.find((cat) => cat.title === 'Full Message Encode Speed');
const goDecodeCat = benchmarkCategories.find((cat) => cat.title === 'Full Message Decode Speed');
const esEncodeCat = esBenchmarkCategories.find((cat) => cat.title === 'Full Message Encode Speed');
const esDecodeCat = esBenchmarkCategories.find((cat) => cat.title === 'Full Message Decode Speed');
const rsEncodeCat = rsBenchmarkCategories[0];
const rsDecodeCat = rsBenchmarkCategories[1];
const pyEncodeCat = pyBenchmarkCategories[0];
const pyDecodeCat = pyBenchmarkCategories[1];
const cppEncodeCat = cppBenchmarkCategories[0];
const cppDecodeCat = cppBenchmarkCategories[1];
const javaEncodeCat = javaBenchmarkCategories[0];
const javaDecodeCat = javaBenchmarkCategories[1];
const csEncodeCat = csBenchmarkCategories[0];
const csDecodeCat = csBenchmarkCategories[1];

const primaryAndCompetitors = (rows: BenchmarkRow[]) =>
  rows.filter((r) => Boolean(r.baseline) || !r.highlight);

export const languageBenchmarks: Record<LanguageKey, LanguageBenchmarkSuite> = {
  go: {
    key: 'go',
    label: 'Go',
    shortLabel: 'Go',
    headingPrefix: 'Go',
    subtitleHtml:
      '11-field <code>PeerUpdate</code> struct on Apple M1 Pro (Go 1.27.1). <strong>Shorter bars = Faster.</strong>',
    href: '/go#benchmarks',
    ctaLabel: 'See full results',
    competitorsLabel: "Protobuf, FlatBuffers, Avro, Cap'n Proto, MsgPack, JSON",
    heroSummaryHtml:
      'In our Go benchmarks, OmniBuf runs <strong>5.8x faster on encode and 5.6x faster on decode</strong> than standard Go Protobuf on an 11-field message. Against <code>encoding/json</code> on plain Go structs, it is <strong>over 17x faster</strong> and cuts packet size in half. Read <a href="/how-it-works" class="doc-link">how the wire format works</a> or check the <a href="/spec" class="doc-link">wire specification</a>.',
    categories: goSpeedCategories,
    butterflyEncodeRows: (goEncodeCat?.rows ?? []).filter(
      (r) => (r.baseline || !r.highlight) && r.name !== 'JSON (encoding/json/v2)',
    ),
    butterflyDecodeRows: (goDecodeCat?.rows ?? []).filter(
      (r) => (r.baseline || !r.highlight) && r.name !== 'JSON (encoding/json/v2)',
    ),
    hardwareLines: [
      'CPU: Apple M1 Pro (darwin/arm64)',
      'Compiler: Go 1.27.1',
      'Samples: 5 × 250 ms, CPU=1',
      'Workload: 11-field PeerUpdate (366 B)',
    ],
    environmentParagraphs: [
      'M1 Pro MacBook Pro, Go 1.27.1 (<code>GOEXPERIMENT=jsonv2</code>), <code>-benchtime=250ms -count=5 -cpu=1</code>. Every benchmark encodes and decodes the 11-field <code>PeerUpdate</code> struct: integers, booleans, strings, one <code>Location</code> struct, and 4 <code>Neighbor</code> structs.',
      'Benchmark source lives in <a href="https://github.com/omnibuf/omnibuf-go/blob/main/omnibuf_bench_test.go" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">omnibuf_bench_test.go</a>, <a href="https://github.com/omnibuf/omnibuf-go/blob/main/opaque_table_bench_test.go" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">opaque_table_bench_test.go</a>, <a href="https://github.com/omnibuf/omnibuf-go/blob/main/jsonv2_bench_test.go" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">jsonv2_bench_test.go</a>, and <a href="https://github.com/omnibuf/omnibuf-go/blob/main/peer_codecs_test.go" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">peer_codecs_test.go</a>, with recorded output in <a href="https://github.com/omnibuf/omnibuf-go/blob/main/testdata/benchmarks.txt" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">testdata/benchmarks.txt</a> and <a href="https://github.com/omnibuf/omnibuf-go/blob/main/testdata/benchmarks.json" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">testdata/benchmarks.json</a>.',
    ],
  },
  es: {
    key: 'es',
    label: 'TypeScript & JS',
    shortLabel: 'TS / JS',
    headingPrefix: 'TypeScript & JS',
    subtitleHtml:
      '11-field <code>PeerUpdate</code> numbers on Node.js v24 (Apple M1 Pro) across <code>@omnibuf/core</code>, <code>protobufjs</code>, <code>@bufbuild/protobuf</code>, <code>google-protobuf</code>, <code>@msgpack/msgpack</code>, and <code>JSON</code>. <strong>Shorter bars = Faster.</strong>',
    href: '/es#benchmarks',
    ctaLabel: 'See full results',
    competitorsLabel: 'protobufjs, protobuf-es, google-protobuf, MsgPack, JSON',
    heroSummaryHtml:
      'In TypeScript and JavaScript on Node.js v24, <code>@omnibuf/core</code> encodes <strong>2.3x faster</strong> and decodes <strong>3.4x faster</strong> than <code>@bufbuild/protobuf</code> (<code>protobuf-es</code>), and splices a single field in place <strong>13.5x faster</strong>. Against native <code>JSON.stringify</code> and <code>JSON.parse</code>, it runs <strong>2x faster</strong> at less than half the byte size. Read <a href="/how-it-works" class="doc-link">how the wire format works</a> or check the <a href="/spec" class="doc-link">wire specification</a>.',
    categories: esBenchmarkCategories,
    butterflyEncodeRows: esEncodeCat?.rows ?? [],
    butterflyDecodeRows: esDecodeCat?.rows ?? [],
    hardwareLines: [
      'CPU: Apple M1 Pro (darwin/arm64)',
      'Runtime: Node.js v24.22.1 (V8)',
      'Command: pnpm run bench',
    ],
    environmentParagraphs: [
      'Measured on an Apple M1 Pro Mac using Node.js v24.22.1. Each test uses the same 11-field <code>PeerUpdate</code> message as the Go benchmark suite (numbers, booleans, strings, a nested <code>Location</code> message, and 4 <code>Neighbor</code> messages).',
      'Benchmark source is in <a href="https://github.com/omnibuf/omnibuf-es/blob/main/benchmarks/bench.ts" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">benchmarks/bench.ts</a> in the <code>omnibuf-es</code> repository (<code>pnpm run bench</code>), with recorded output in <a href="https://github.com/omnibuf/omnibuf-es/blob/main/testdata/benchmarks.json" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">testdata/benchmarks.json</a>.',
    ],
  },
  rs: {
    key: 'rs',
    label: 'Rust',
    shortLabel: 'Rust',
    headingPrefix: 'Rust',
    subtitleHtml:
      '11-field <code>PeerUpdate</code> struct on Apple M1 Pro (<code>rustc 1.94.0</code>) across <code>omnibuf</code>, <code>prost</code>, <code>rmp-serde</code>, and <code>serde_json</code>. <strong>Shorter bars = Faster.</strong>',
    href: '/rs#benchmarks',
    ctaLabel: 'See full results',
    competitorsLabel: 'prost, rmp-serde, serde_json',
    heroSummaryHtml:
      'In Rust (<code>rustc 1.94.0</code>), <code>omnibuf</code> encodes <strong>1.6x faster</strong> and decodes <strong>1.3x faster</strong> than <code>prost</code> on fresh struct allocations. Zero-copy <code>Opaque</code> views borrow nested <code>&amp;str</code> fields <strong>9.3x faster</strong> than <code>prost</code> and splice single-field updates <strong>10.5x faster</strong>. Check the <a href="/rs" class="doc-link">Rust guide</a> or <a href="/spec" class="doc-link">wire specification</a>.',
    categories: rsBenchmarkCategories,
    butterflyEncodeRows: primaryAndCompetitors(rsEncodeCat.rows),
    butterflyDecodeRows: primaryAndCompetitors(rsDecodeCat.rows),
    hardwareLines: [
      'CPU: Apple M1 Pro (darwin/arm64)',
      'Compiler: rustc 1.94.0 (--release)',
      'Command: just bench',
    ],
    environmentParagraphs: [
      'Compiled with <code>rustc 1.94.0</code> in release mode on an Apple M1 Pro Mac. Both encode and decode allocate fresh owned containers (<code>Vec&lt;u8&gt;</code> on encode; 12 <code>String</code> values and 3 <code>Vec</code> buffers on decode) so every library runs under identical ownership rules.',
      'Recorded in <code>omnibuf-rs/testdata/benchmarks.json</code> via <code>crates/omnibuf-bench</code>.',
    ],
  },
  py: {
    key: 'py',
    label: 'Python',
    shortLabel: 'Python',
    headingPrefix: 'Python',
    subtitleHtml:
      'Pure-Python <code>omnibuf</code> on Python 3.14.5 vs C and Rust native extensions (<code>protobuf-py</code>, <code>upb</code>, <code>msgspec</code>, <code>msgpack</code>, stdlib <code>json</code>). <strong>Shorter bars = Faster.</strong>',
    href: '/py#benchmarks',
    ctaLabel: 'See full results',
    competitorsLabel: 'protobuf-py (Rust), upb (C), msgspec (C), msgpack (C), json (C)',
    heroSummaryHtml:
      '<code>omnibuf-py</code> is currently pure Python 3.14 bytecode, whereas <code>protobuf-py</code> (Rust), <code>upb</code> (C), <code>msgspec</code> (C), and stdlib <code>json</code> (C) run native extensions. Full-message encode and decode are slower than those native bindings today, while <code>Opaque</code> single-field splicing still beats C <code>msgpack</code> by <strong>1.4x</strong> and stdlib <code>json</code> by <strong>2.7x</strong>. See the <a href="/py" class="doc-link">Python guide</a>.',
    categories: pyBenchmarkCategories,
    butterflyEncodeRows: primaryAndCompetitors(pyEncodeCat.rows),
    butterflyDecodeRows: primaryAndCompetitors(pyDecodeCat.rows),
    hardwareLines: [
      'CPU: Apple M1 Pro (darwin/arm64)',
      'Runtime: Python 3.14.5 (CPython)',
      'Command: just bench',
    ],
    environmentParagraphs: [
      'Measured on CPython 3.14.5 on an Apple M1 Pro Mac. Every competing serializer in this chart dispatches into compiled C or Rust extensions (<code>protobuf-py-ext</code> in Rust, Google <code>upb</code> in C, <code>msgspec</code> in C, <code>msgpack._cmsgpack</code> in C, and CPython <code>_json</code> in C), while <code>omnibuf</code> executes pure Python bytecode.',
      'Recorded in <code>omnibuf-py/testdata/benchmarks.json</code> via <code>benchmarks/bench_peer.py</code>.',
    ],
  },
  cpp: {
    key: 'cpp',
    label: 'C++',
    shortLabel: 'C++',
    headingPrefix: 'C++20',
    subtitleHtml:
      '11-field <code>PeerUpdate</code> struct on Apple Clang 21 (<code>-O3 -DNDEBUG</code>, C++20). <strong>Shorter bars = Faster.</strong>',
    href: '/cpp#benchmarks',
    ctaLabel: 'See full results',
    competitorsLabel: 'Protobuf (LEB128 Wire), JSON',
    heroSummaryHtml:
      'In C++20 (Apple Clang 21 <code>-O3</code>), generated OmniBuf headers encode <strong>1.6x faster</strong> and decode <strong>1.4x faster</strong> than LEB128 Protobuf wire encoding on the same <code>PeerUpdate</code> struct. <code>Opaque</code> views read nested <code>std::string_view</code> slices <strong>5.2x faster</strong> and splice updates <strong>7.0x faster</strong>. See the <a href="/cpp" class="doc-link">C++20 guide</a>.',
    categories: cppBenchmarkCategories,
    butterflyEncodeRows: primaryAndCompetitors(cppEncodeCat.rows),
    butterflyDecodeRows: primaryAndCompetitors(cppDecodeCat.rows),
    hardwareLines: [
      'CPU: Apple M1 Pro (darwin/arm64)',
      'Compiler: Apple Clang 21.0.0 (-O3, C++20)',
      'Command: just bench',
    ],
    environmentParagraphs: [
      'Compiled with Apple Clang 21.0.0 (<code>-O3 -DNDEBUG -std=c++20</code>) on an Apple M1 Pro Mac. Because <code>omnibuf-cpp</code> has zero external C++ library dependencies, the benchmark harness compares generated and <code>StructTraits</code> OmniBuf codecs against in-tree LEB128 Protobuf wire and JSON codecs operating on the exact same <code>PeerUpdate</code> struct and UTF-8 validation rules.',
      'Recorded in <code>omnibuf-cpp/testdata/benchmarks.json</code> via <code>benchmarks/peer_bench.cpp</code>.',
    ],
  },
  java: {
    key: 'java',
    label: 'Java',
    shortLabel: 'Java',
    headingPrefix: 'Java 21',
    subtitleHtml:
      '11-field <code>PeerUpdate</code> workload on OpenJDK 21.0.13 (C2 JIT) across <code>com.omnibuf</code>, <code>protobuf-java</code>, Jackson JSON, and Jackson MessagePack. <strong>Shorter bars = Faster.</strong>',
    href: '/java#benchmarks',
    ctaLabel: 'See full results',
    competitorsLabel: 'protobuf-java, Jackson JSON, Jackson MsgPack',
    heroSummaryHtml:
      'On OpenJDK 21, generated OmniBuf classes decode <strong>1.3x faster</strong> than <code>protobuf-java</code>, read a nested string field <strong>5.2x faster</strong>, and splice single-field updates <strong>10.3x faster</strong> (while <code>protobuf-java</code> edges out full encode by 9% when reusing its cached <code>memoizedSerializedSize</code>). Against Jackson JSON, OmniBuf encodes <strong>4.4x faster</strong>. See the <a href="/java" class="doc-link">Java guide</a>.',
    categories: javaBenchmarkCategories,
    butterflyEncodeRows: primaryAndCompetitors(javaEncodeCat.rows),
    butterflyDecodeRows: primaryAndCompetitors(javaDecodeCat.rows),
    hardwareLines: [
      'CPU: Apple M1 Pro (darwin/arm64)',
      'Runtime: OpenJDK 21.0.13 (Temurin C2)',
      'Command: just bench',
    ],
    environmentParagraphs: [
      'Measured on Eclipse Temurin OpenJDK 21.0.13 after C2 JIT warmup on an Apple M1 Pro Mac. Note that <code>protobuf-java</code> caches <code>memoizedSerializedSize</code> on immutable message instances after the first call, avoiding its second size pass on repeated encodes of the same object.',
      'Recorded in <code>omnibuf-java/testdata/benchmarks.json</code> via <code>BenchmarkMain.java</code>.',
    ],
  },
  cs: {
    key: 'cs',
    label: 'C# / .NET',
    shortLabel: 'C#',
    headingPrefix: 'C# & .NET 8',
    subtitleHtml:
      '11-field <code>PeerUpdate</code> workload on .NET 8.0.29 (RyuJIT) across <code>OmniBuf</code>, <code>Google.Protobuf</code>, <code>MessagePack-CSharp</code>, and <code>System.Text.Json</code>. <strong>Shorter bars = Faster.</strong>',
    href: '/cs#benchmarks',
    ctaLabel: 'See full results',
    competitorsLabel: 'Google.Protobuf, MessagePack-CSharp, System.Text.Json',
    heroSummaryHtml:
      'On .NET 8 RyuJIT, generated OmniBuf classes encode <strong>2.0x faster</strong> than <code>Google.Protobuf</code> and <strong>1.9x faster</strong> than <code>MessagePack-CSharp</code>, while decoding <strong>1.2x faster</strong> than <code>Google.Protobuf</code> and <strong>4.8x faster</strong> than <code>System.Text.Json</code>. Single-field <code>Opaque</code> splicing runs <strong>11.2x faster</strong> than <code>Google.Protobuf</code>. See the <a href="/cs" class="doc-link">C# guide</a>.',
    categories: csBenchmarkCategories,
    butterflyEncodeRows: primaryAndCompetitors(csEncodeCat.rows),
    butterflyDecodeRows: primaryAndCompetitors(csDecodeCat.rows),
    hardwareLines: [
      'CPU: Apple M1 Pro (darwin/arm64)',
      'Runtime: .NET 8.0.29 (RyuJIT Tier-1 PGO)',
      'Command: just bench',
    ],
    environmentParagraphs: [
      'Measured on .NET 8.0.29 (Release build with Dynamic PGO warmup) on an Apple M1 Pro Mac. Every benchmark allocates a fresh <code>byte[]</code> on encode and a fresh <code>PeerUpdate</code> instance on decode, tracking per-operation heap bytes with <code>GC.GetAllocatedBytesForCurrentThread</code>.',
      'Recorded in <code>omnibuf-cs/testdata/benchmarks.json</code> via <code>OmniBuf.Benchmarks</code>.',
    ],
  },
};

export const languageBenchmarkList: LanguageBenchmarkSuite[] = [
  languageBenchmarks.go,
  languageBenchmarks.es,
  languageBenchmarks.rs,
  languageBenchmarks.cpp,
  languageBenchmarks.cs,
  languageBenchmarks.java,
  languageBenchmarks.py,
];
