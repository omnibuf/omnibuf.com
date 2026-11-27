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
      "Each chart scores five things from our benchmark suite. Encode and Decode Speed measure turning native structs into bytes and reading every field back. Memory Efficiency reflects heap allocations (buffer reuse and zeroCopy strings keep Go allocations at zero). Wire Size is the byte length on the 11-field PeerUpdate packet. Field Lookup measures reading one nested field out of raw bytes: jumping by byte length beats scanning varints, though FlatBuffers and Cap'n Proto are still faster here since they jump straight to an offset.",
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
      'Protobuf is about 7% smaller on the wire (341 B vs 366 B) and has libraries for almost every language on earth. OmniBuf keeps the same .proto schemas and generated structs, encodes in a single pass (around 6x faster in Go), decodes around 5x faster, and does not need the .proto file to inspect a packet.',
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
      "Cap'n Proto lays out messages in memory as fixed-offset pointer structures and has its own RPC protocol with promise pipelining. A single field read takes 6 ns in place. Serializing normal language structs still requires copying fields in and out of segment builders: OmniBuf is 35% smaller and several times faster to encode and decode.",
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

// Go results from omnibuf-go/testdata/benchmarks.json (Go 1.27.4, Apple M1 Pro)
export const benchmarkCategories: BenchmarkCategory[] = [
  {
    title: 'Full Message Encode Speed',
    unit: 'ns',
    maxVal: 2500,
    methodology:
      "Serializes the 11-field Go struct into a reused byte slice. FlatBuffers and Cap'n Proto times include building the buffer from the struct.",
    rows: [
      { name: 'OmniBuf (Generated)', val: 95, highlight: true, baseline: true },
      { name: 'OmniBuf (Go Struct Tags)', val: 383, highlight: true },
      { name: 'Avro (Raw Binary)', val: 463 },
      { name: 'Protobuf', val: 560 },
      { name: 'FlatBuffers', val: 571 },
      { name: "Cap'n Proto", val: 1072 },
      { name: 'MessagePack', val: 1617 },
      { name: 'JSON (encoding/json)', val: 2063 },
      { name: 'JSON (encoding/json/v2)', val: 2098 },
    ],
  },
  {
    title: 'Full Message Decode Speed',
    unit: 'ns',
    maxVal: 4000,
    methodology:
      'Unpacks and reads all 11 fields into a reused destination struct across every codec, including Protobuf.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 187, highlight: true, baseline: true },
      { name: 'FlatBuffers', val: 195 },
      { name: 'OmniBuf (Go Struct Tags)', val: 363, highlight: true },
      { name: 'Avro (Raw Binary)', val: 501 },
      { name: "Cap'n Proto", val: 816 },
      { name: 'Protobuf', val: 1041 },
      { name: 'MessagePack', val: 2397 },
      { name: 'JSON (encoding/json/v2)', val: 2715 },
      { name: 'JSON (encoding/json)', val: 3448 },
    ],
  },
  {
    title: 'Read a Single Nested Field',
    unit: 'ns',
    maxVal: 1500,
    methodology:
      "Reads a nested string field directly from the raw byte slice. Cap'n Proto and FlatBuffers use offset tables; OmniBuf hops over preceding field headers by length.",
    rows: [
      { name: "Cap'n Proto", val: 5 },
      { name: 'FlatBuffers', val: 26 },
      { name: 'OmniBuf', val: 84, highlight: true, baseline: true },
      { name: 'Avro (Raw Binary)', val: 449 },
      { name: 'MessagePack', val: 702 },
      { name: 'Protobuf', val: 1096 },
    ],
  },
  {
    title: 'Selective Single-Field Mutation',
    unit: 'ns',
    maxVal: 7000,
    methodology:
      'Checks a nested city string, increments the 64-bit sequence counter, and returns the updated packet. OmniBuf splices the field in place; the others decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Opaque Splice)', val: 214, highlight: true, baseline: true },
      { name: 'FlatBuffers', val: 781 },
      { name: 'Avro (Raw Binary)', val: 1026 },
      { name: 'Protobuf', val: 1819 },
      { name: "Cap'n Proto", val: 2121 },
      { name: 'MessagePack', val: 4729 },
      { name: 'JSON (encoding/json/v2)', val: 5056 },
      { name: 'JSON (encoding/json)', val: 5789 },
    ],
  },
  {
    title: 'Large Embedded Message Encode',
    unit: 'ns',
    maxVal: 40000,
    methodology:
      'Serializes a 39 KiB packet whose 20 KiB and 18 KiB nested sub-messages exceed the 2-byte 16,383 B length reservation and trigger 2B-to-4B header shifts.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 612, highlight: true, baseline: true },
      { name: 'FlatBuffers', val: 1099 },
      { name: 'Protobuf', val: 1704 },
      { name: 'OmniBuf (Go Struct Tags)', val: 1785, highlight: true },
      { name: 'Avro (Raw Binary)', val: 5500 },
      { name: "Cap'n Proto", val: 7518 },
      { name: 'MessagePack', val: 9451 },
      { name: 'JSON (encoding/json/v2)', val: 32641 },
      { name: 'JSON (encoding/json)', val: 32807 },
    ],
  },
  {
    title: 'Embedded Message Growth',
    unit: 'ns',
    maxVal: 50000,
    methodology:
      'Grows a nested string field past 16 KiB ahead of 32 trailing Neighbor entries via Opaque splicing vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Opaque Splice)', val: 908, highlight: true, baseline: true },
      { name: 'FlatBuffers', val: 3504 },
      { name: 'Avro (Raw Binary)', val: 6382 },
      { name: 'Protobuf', val: 7630 },
      { name: "Cap'n Proto", val: 11414 },
      { name: 'MessagePack', val: 27657 },
      { name: 'JSON (encoding/json/v2)', val: 35274 },
      { name: 'JSON (encoding/json)', val: 42664 },
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

// TypeScript results from omnibuf-es/testdata/benchmarks.json (Node.js v26.13.1)
export const esBenchmarkCategories: EsBenchmarkCategory[] = [
  {
    title: 'Full Message Encode Speed',
    unit: 'ns',
    maxVal: 5000,
    methodology: 'Serializes the 11-field PeerUpdate object into a fresh Uint8Array (366 B).',
    rows: [
      { name: 'OmniBuf', val: 736, ops: '1,358,132 ops/s', sizeBytes: 366 },
      { name: 'protobufjs', val: 1211, ops: '825,786 ops/s', sizeBytes: 341 },
      { name: 'JSON', val: 1493, ops: '669,788 ops/s', sizeBytes: 791 },
      { name: '@bufbuild/protobuf (protobuf-es)', val: 2159, ops: '463,090 ops/s', sizeBytes: 341 },
      { name: '@msgpack/msgpack', val: 3318, ops: '301,373 ops/s', sizeBytes: 622 },
      { name: 'google-protobuf', val: 4210, ops: '237,533 ops/s', sizeBytes: 341 },
    ],
  },
  {
    title: 'Full Message Decode Speed',
    unit: 'ns',
    maxVal: 4000,
    methodology: 'Decodes Uint8Array into a fresh PeerUpdate object and reads all 11 fields.',
    rows: [
      { name: 'OmniBuf', val: 635, ops: '1,574,693 ops/s' },
      { name: 'protobufjs', val: 1706, ops: '586,093 ops/s' },
      { name: 'JSON', val: 1867, ops: '535,504 ops/s' },
      { name: '@msgpack/msgpack', val: 2629, ops: '380,434 ops/s' },
      { name: 'google-protobuf', val: 2649, ops: '377,475 ops/s' },
      { name: '@bufbuild/protobuf (protobuf-es)', val: 3182, ops: '314,297 ops/s' },
    ],
  },
  {
    title: 'Read a Single Nested Field',
    unit: 'ns',
    maxVal: 3500,
    methodology:
      'Reads a nested city string from a Uint8Array. The other JS libraries decode the whole message first; OmniBuf skips earlier fields by byte length.',
    rows: [
      { name: 'OmniBuf', val: 247, ops: '4,046,221 ops/s' },
      { name: 'protobufjs', val: 1113, ops: '898,493 ops/s' },
      { name: 'JSON', val: 1702, ops: '587,443 ops/s' },
      { name: 'google-protobuf', val: 2544, ops: '393,057 ops/s' },
      { name: '@msgpack/msgpack', val: 2559, ops: '390,758 ops/s' },
      { name: '@bufbuild/protobuf (protobuf-es)', val: 3002, ops: '333,095 ops/s' },
    ],
  },
  {
    title: 'Selective Single-Field Mutation',
    unit: 'ns',
    maxVal: 8000,
    methodology:
      'Checks a nested city string, increments the sequence number from the packet, and returns an updated Uint8Array.',
    rows: [
      { name: 'OmniBuf', val: 1150, ops: '869,476 ops/s' },
      { name: 'JSON', val: 2734, ops: '365,786 ops/s' },
      { name: 'protobufjs', val: 3079, ops: '324,756 ops/s' },
      { name: '@bufbuild/protobuf (protobuf-es)', val: 5854, ops: '170,813 ops/s' },
      { name: '@msgpack/msgpack', val: 6285, ops: '159,106 ops/s' },
      { name: 'google-protobuf', val: 7020, ops: '142,444 ops/s' },
    ],
  },
  {
    title: 'Large Embedded Message Encode',
    unit: 'ns',
    maxVal: 100000,
    methodology:
      'Serializes a 39 KiB packet whose 20 KiB and 18 KiB nested messages exceed the 2-byte 16,383 B length reservation.',
    rows: [
      { name: 'OmniBuf', val: 4031, ops: '248,052 ops/s', sizeBytes: 39256 },
      { name: 'google-protobuf', val: 11496, ops: '86,983 ops/s', sizeBytes: 39227 },
      { name: 'protobufjs', val: 12879, ops: '77,644 ops/s', sizeBytes: 39227 },
      {
        name: '@bufbuild/protobuf (protobuf-es)',
        val: 17965,
        ops: '55,663 ops/s',
        sizeBytes: 39227,
      },
      { name: 'JSON', val: 19248, ops: '51,954 ops/s', sizeBytes: 39669 },
      { name: '@msgpack/msgpack', val: 88270, ops: '11,329 ops/s', sizeBytes: 39504 },
    ],
  },
  {
    title: 'Embedded Message Growth',
    unit: 'ns',
    maxVal: 90000,
    methodology:
      'Grows a nested string field past 16 KiB ahead of 32 trailing Neighbor entries and emits an updated Uint8Array.',
    rows: [
      { name: 'OmniBuf', val: 4802, ops: '208,265 ops/s' },
      { name: 'protobufjs', val: 18916, ops: '52,865 ops/s' },
      { name: 'JSON', val: 21756, ops: '45,965 ops/s' },
      { name: '@bufbuild/protobuf (protobuf-es)', val: 26698, ops: '37,456 ops/s' },
      { name: 'google-protobuf', val: 27120, ops: '36,873 ops/s' },
      { name: '@msgpack/msgpack', val: 78831, ops: '12,685 ops/s' },
    ],
  },
];

// Rust results from omnibuf-rs/testdata/benchmarks.json (rustc 1.100.0)
export const rsBenchmarkCategories: BenchmarkCategory[] = [
  {
    title: 'Full Message Encode Speed',
    unit: 'ns',
    maxVal: 900,
    methodology: 'Serializes PeerUpdate into a freshly allocated Vec<u8> across every library.',
    rows: [
      { name: 'OmniBuf (#[derive(OmniBuf)])', val: 136, sizeBytes: 366, highlight: true },
      { name: 'OmniBuf (Generated)', val: 138, sizeBytes: 366, highlight: true, baseline: true },
      { name: 'buffa (Protobuf)', val: 212, sizeBytes: 341 },
      { name: 'prost (Protobuf)', val: 237, sizeBytes: 341 },
      { name: 'rmp-serde (MessagePack)', val: 644, sizeBytes: 626 },
      { name: 'serde_json', val: 791, sizeBytes: 803 },
    ],
  },
  {
    title: 'Full Message Decode Speed',
    unit: 'ns',
    maxVal: 1500,
    methodology: 'Decodes &[u8] into a fresh owned PeerUpdate struct and reads all 11 fields.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 316, highlight: true, baseline: true },
      { name: 'OmniBuf (#[derive(OmniBuf)])', val: 347, highlight: true },
      { name: 'buffa (Protobuf)', val: 540 },
      { name: 'prost (Protobuf)', val: 703 },
      { name: 'rmp-serde (MessagePack)', val: 879 },
      { name: 'serde_json', val: 1260 },
    ],
  },
  {
    title: 'Read a Single Nested Field',
    unit: 'ns',
    maxVal: 1500,
    methodology:
      'Borrows a nested &str directly from &[u8] via OpaquePeerUpdate vs buffa PeerUpdateView vs full decode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 76, highlight: true, baseline: true },
      { name: 'buffa (Protobuf)', val: 373 },
      { name: 'prost (Protobuf)', val: 691 },
      { name: 'rmp-serde (MessagePack)', val: 870 },
      { name: 'serde_json', val: 1257 },
    ],
  },
  {
    title: 'Selective Single-Field Mutation',
    unit: 'ns',
    maxVal: 2500,
    methodology:
      'Checks a nested city string and splices an incremented 64-bit sequence counter into &[u8] vs decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 220, highlight: true, baseline: true },
      { name: 'buffa (Protobuf)', val: 738 },
      { name: 'prost (Protobuf)', val: 973 },
      { name: 'rmp-serde (MessagePack)', val: 1541 },
      { name: 'serde_json', val: 2100 },
    ],
  },
  {
    title: 'Large Embedded Message Encode',
    unit: 'ns',
    maxVal: 17000,
    methodology:
      'Serializes a 39 KiB packet whose >16 KiB nested sub-messages trigger 4-byte container length pre-sizing vs two-pass encoded_len() in buffa and prost.',
    rows: [
      { name: 'OmniBuf (#[derive(OmniBuf)])', val: 1172, sizeBytes: 39256, highlight: true },
      { name: 'OmniBuf (Generated)', val: 1594, sizeBytes: 39256, highlight: true, baseline: true },
      { name: 'prost (Protobuf)', val: 1625, sizeBytes: 39227 },
      { name: 'rmp-serde (MessagePack)', val: 1722, sizeBytes: 39508 },
      { name: 'buffa (Protobuf)', val: 1745, sizeBytes: 39227 },
      { name: 'serde_json', val: 14557, sizeBytes: 39681 },
    ],
  },
  {
    title: 'Embedded Message Growth',
    unit: 'ns',
    maxVal: 18000,
    methodology:
      'Grows a nested string field past 16 KiB ahead of 32 trailing Neighbor entries via Opaque splicing vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 1874, highlight: true, baseline: true },
      { name: 'buffa (Protobuf)', val: 3648 },
      { name: 'prost (Protobuf)', val: 4161 },
      { name: 'rmp-serde (MessagePack)', val: 6463 },
      { name: 'serde_json', val: 15463 },
    ],
  },
];

// Python results from omnibuf-py/testdata/benchmarks.json (Python 3.14.5, rustc 1.94.0)
export const pyBenchmarkCategories: BenchmarkCategory[] = [
  {
    title: 'Full Message Encode Speed',
    unit: 'ns',
    maxVal: 6000,
    methodology:
      'Serializes PeerUpdate into fresh bytes across native Rust and C extensions (omnibuf, upb, protobuf-py, msgspec, msgpack, stdlib json).',
    rows: [
      { name: 'OmniBuf (Generated)', val: 372, sizeBytes: 366, highlight: true, baseline: true },
      { name: 'OmniBuf (@dataclass)', val: 375, sizeBytes: 366, highlight: true },
      { name: 'google.protobuf (upb)', val: 437, sizeBytes: 341 },
      { name: 'msgspec', val: 632, sizeBytes: 634 },
      { name: 'protobuf-py', val: 948, sizeBytes: 341 },
      { name: 'msgpack', val: 1681, sizeBytes: 634 },
      { name: 'json (stdlib)', val: 4844, sizeBytes: 874 },
    ],
  },
  {
    title: 'Full Message Decode Speed',
    unit: 'ns',
    maxVal: 7000,
    methodology:
      'Decodes bytes and reads all 11 fields in Python. Accessing every field forces upb to materialize Python strings and sub-messages out of its C arena.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 1686, highlight: true, baseline: true },
      { name: 'OmniBuf (@dataclass)', val: 1699, highlight: true },
      { name: 'msgspec', val: 2215 },
      { name: 'protobuf-py', val: 3353 },
      { name: 'msgpack', val: 4142 },
      { name: 'google.protobuf (upb)', val: 4819 },
      { name: 'json (stdlib)', val: 6227 },
    ],
  },
  {
    title: 'Read a Single Nested Field',
    unit: 'ns',
    maxVal: 6000,
    methodology: 'OpaquePeerUpdate header-hop lookup vs native C and Rust extension decode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 469, highlight: true, baseline: true },
      { name: 'google.protobuf (upb)', val: 795 },
      { name: 'msgspec', val: 1224 },
      { name: 'protobuf-py', val: 2204 },
      { name: 'msgpack', val: 2872 },
      { name: 'json (stdlib)', val: 4858 },
    ],
  },
  {
    title: 'Selective Single-Field Mutation',
    unit: 'ns',
    maxVal: 11000,
    methodology:
      'Checks a nested city string and splices an updated sequence number vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 760, highlight: true, baseline: true },
      { name: 'google.protobuf (upb)', val: 1373 },
      { name: 'msgspec', val: 1852 },
      { name: 'protobuf-py', val: 3268 },
      { name: 'msgpack', val: 4570 },
      { name: 'json (stdlib)', val: 9979 },
    ],
  },
  {
    title: 'Large Embedded Message Encode',
    unit: 'ns',
    maxVal: 75000,
    methodology:
      'Serializes a 39 KiB packet whose 20 KiB and 18 KiB nested strings trigger 4-byte container length pre-sizing.',
    rows: [
      { name: 'msgspec', val: 1822, sizeBytes: 39516 },
      { name: 'OmniBuf (@dataclass)', val: 1860, sizeBytes: 39256, highlight: true },
      { name: 'OmniBuf (Generated)', val: 1881, sizeBytes: 39256, highlight: true, baseline: true },
      { name: 'google.protobuf (upb)', val: 2248, sizeBytes: 39227 },
      { name: 'msgpack', val: 3243, sizeBytes: 39516 },
      { name: 'protobuf-py', val: 3340, sizeBytes: 39227 },
      { name: 'json (stdlib)', val: 65433, sizeBytes: 39752 },
    ],
  },
  {
    title: 'Embedded Message Growth',
    unit: 'ns',
    maxVal: 75000,
    methodology:
      'Grows a nested string field past 16 KiB ahead of 32 trailing Neighbor entries via Opaque splicing vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 2393, highlight: true, baseline: true },
      { name: 'google.protobuf (upb)', val: 4600 },
      { name: 'msgspec', val: 7165 },
      { name: 'protobuf-py', val: 13813 },
      { name: 'msgpack', val: 19169 },
      { name: 'json (stdlib)', val: 64368 },
    ],
  },
];

// C++20 results from omnibuf-cpp/testdata/benchmarks.json (Apple Clang 21.0.0 -O3, libprotobuf 36.2)
export const cppBenchmarkCategories: BenchmarkCategory[] = [
  {
    title: 'Full Message Encode Speed',
    unit: 'ns',
    maxVal: 600,
    methodology:
      'Serializes PeerUpdate into a fresh std::vector<uint8_t> against official libprotobuf (C++), an in-tree LEB128 wire codec, and JSON.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 170, sizeBytes: 366, highlight: true, baseline: true },
      { name: 'OmniBuf (C++ Struct)', val: 206, sizeBytes: 366, highlight: true },
      { name: 'Protobuf (LEB128 Wire)', val: 213, sizeBytes: 341 },
      { name: 'Protobuf (libprotobuf)', val: 249, sizeBytes: 341 },
      { name: 'JSON', val: 465, sizeBytes: 803 },
    ],
  },
  {
    title: 'Full Message Decode Speed',
    unit: 'ns',
    maxVal: 1500,
    methodology: 'Decodes into a fresh C++20 PeerUpdate struct and touches all 11 fields.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 336, highlight: true, baseline: true },
      { name: 'OmniBuf (C++ Struct)', val: 390, highlight: true },
      { name: 'Protobuf (LEB128 Wire)', val: 436 },
      { name: 'Protobuf (libprotobuf)', val: 832 },
      { name: 'JSON', val: 1159 },
    ],
  },
  {
    title: 'Read a Single Nested Field',
    unit: 'ns',
    maxVal: 1500,
    methodology:
      'Returns std::string_view into the packet via OpaquePeerUpdate vs full message decode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 103, highlight: true, baseline: true },
      { name: 'Protobuf (LEB128 Wire)', val: 454 },
      { name: 'Protobuf (libprotobuf)', val: 831 },
      { name: 'JSON', val: 1130 },
    ],
  },
  {
    title: 'Selective Single-Field Mutation',
    unit: 'ns',
    maxVal: 2000,
    methodology:
      'Checks a nested city string and splices an updated sequence counter via OpaquePeerUpdate vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 291, highlight: true, baseline: true },
      { name: 'Protobuf (LEB128 Wire)', val: 670 },
      { name: 'Protobuf (libprotobuf)', val: 1101 },
      { name: 'JSON', val: 1617 },
    ],
  },
  {
    title: 'Large Embedded Message Encode',
    unit: 'ns',
    maxVal: 45000,
    methodology:
      'Serializes a 39 KiB packet whose >16 KiB nested sub-messages trigger 2B-to-4B header expansion vs Protobuf two-pass sizing.',
    rows: [
      { name: 'OmniBuf (C++ Struct)', val: 1472, sizeBytes: 39256, highlight: true },
      { name: 'OmniBuf (Generated)', val: 1508, sizeBytes: 39256, highlight: true, baseline: true },
      { name: 'Protobuf (LEB128 Wire)', val: 1645, sizeBytes: 39227 },
      { name: 'Protobuf (libprotobuf)', val: 2668, sizeBytes: 39227 },
      { name: 'JSON', val: 40102, sizeBytes: 39681 },
    ],
  },
  {
    title: 'Embedded Message Growth',
    unit: 'ns',
    maxVal: 35000,
    methodology:
      'Grows a nested string field past 16 KiB ahead of 32 trailing Neighbor entries via Opaque splicing vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 1706, highlight: true, baseline: true },
      { name: 'Protobuf (LEB128 Wire)', val: 3499 },
      { name: 'Protobuf (libprotobuf)', val: 5762 },
      { name: 'JSON', val: 27598 },
    ],
  },
];

// Java results from omnibuf-java/testdata/benchmarks.json (OpenJDK 25.0.5)
export const javaBenchmarkCategories: BenchmarkCategory[] = [
  {
    title: 'Full Message Encode Speed',
    unit: 'ns',
    maxVal: 2000,
    methodology:
      'Serializes PeerUpdate into a fresh byte[] across generated OmniBuf, protobuf-java, FlatBuffers, and Jackson.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 254, sizeBytes: 366, highlight: true, baseline: true },
      { name: 'Protobuf (protobuf-java)', val: 340, sizeBytes: 341 },
      { name: 'OmniBuf (@OmniBufField)', val: 544, sizeBytes: 366, highlight: true },
      { name: 'FlatBuffers', val: 797, sizeBytes: 600 },
      { name: 'OmniBuf (Protobuf)', val: 1210, sizeBytes: 366, highlight: true },
      { name: 'JSON (Jackson)', val: 1471, sizeBytes: 803 },
      { name: 'MessagePack (Jackson)', val: 1749, sizeBytes: 626 },
    ],
  },
  {
    title: 'Full Message Decode Speed',
    unit: 'ns',
    maxVal: 3500,
    methodology: 'Decodes byte[] into a fresh PeerUpdate object and reads all 11 fields.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 704, highlight: true, baseline: true },
      { name: 'OmniBuf (@OmniBufField)', val: 801, highlight: true },
      { name: 'FlatBuffers', val: 868 },
      { name: 'Protobuf (protobuf-java)', val: 1150 },
      { name: 'OmniBuf (Protobuf)', val: 2217, highlight: true },
      { name: 'JSON (Jackson)', val: 2391 },
      { name: 'MessagePack (Jackson)', val: 2739 },
    ],
  },
  {
    title: 'Read a Single Nested Field',
    unit: 'ns',
    maxVal: 3000,
    methodology:
      'Reads a nested city string via FlatBuffers vtables or OpaquePeerUpdate vs full decode.',
    rows: [
      { name: 'FlatBuffers', val: 15 },
      { name: 'OmniBuf (Generated)', val: 78, highlight: true, baseline: true },
      { name: 'Protobuf (protobuf-java)', val: 775 },
      { name: 'JSON (Jackson)', val: 2020 },
      { name: 'MessagePack (Jackson)', val: 2389 },
    ],
  },
  {
    title: 'Selective Single-Field Mutation',
    unit: 'ns',
    maxVal: 5000,
    methodology:
      'Checks a nested city string and splices an updated sequence counter via OpaquePeerUpdate vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 253, highlight: true, baseline: true },
      { name: 'Protobuf (protobuf-java)', val: 1065 },
      { name: 'FlatBuffers', val: 1112 },
      { name: 'JSON (Jackson)', val: 3437 },
      { name: 'MessagePack (Jackson)', val: 4302 },
    ],
  },
  {
    title: 'Large Embedded Message Encode',
    unit: 'ns',
    maxVal: 110000,
    methodology:
      'Serializes a 39 KiB packet with >16 KiB nested strings. Immutable protobuf-java reuses cached ByteString UTF-8 bytes and memoizedSerializedSize.',
    rows: [
      { name: 'Protobuf (protobuf-java)', val: 3791, sizeBytes: 39227 },
      { name: 'OmniBuf (Generated)', val: 3992, sizeBytes: 39256, highlight: true, baseline: true },
      { name: 'OmniBuf (@OmniBufField)', val: 4182, sizeBytes: 39256, highlight: true },
      { name: 'OmniBuf (Protobuf)', val: 4898, sizeBytes: 39256, highlight: true },
      { name: 'JSON (Jackson)', val: 49858, sizeBytes: 39681 },
      { name: 'FlatBuffers', val: 60354, sizeBytes: 39488 },
      { name: 'MessagePack (Jackson)', val: 92396, sizeBytes: 39508 },
    ],
  },
  {
    title: 'Embedded Message Growth',
    unit: 'ns',
    maxVal: 75000,
    methodology:
      'Grows a nested string field past 16 KiB ahead of 32 trailing Neighbor entries via Opaque splicing vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 2304, highlight: true, baseline: true },
      { name: 'Protobuf (protobuf-java)', val: 19012 },
      { name: 'FlatBuffers', val: 35977 },
      { name: 'JSON (Jackson)', val: 39068 },
      { name: 'MessagePack (Jackson)', val: 66115 },
    ],
  },
];

// C# results from omnibuf-cs/testdata/benchmarks.json (.NET 8.0.29)
export const csBenchmarkCategories: BenchmarkCategory[] = [
  {
    title: 'Full Message Encode Speed',
    unit: 'ns',
    maxVal: 1000,
    methodology: 'Serializes PeerUpdate into a fresh byte[] on .NET 8 RyuJIT.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 163, sizeBytes: 366, highlight: true, baseline: true },
      { name: 'OmniBuf ([OmniBufField])', val: 270, sizeBytes: 366, highlight: true },
      { name: 'MessagePack-CSharp', val: 487, sizeBytes: 626 },
      { name: 'Google.Protobuf', val: 496, sizeBytes: 341 },
      { name: 'System.Text.Json', val: 900, sizeBytes: 803 },
    ],
  },
  {
    title: 'Full Message Decode Speed',
    unit: 'ns',
    maxVal: 3000,
    methodology:
      'Decodes ReadOnlySpan<byte> into a fresh PeerUpdate instance and reads all 11 fields.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 303, highlight: true, baseline: true },
      { name: 'OmniBuf ([OmniBufField])', val: 517, highlight: true },
      { name: 'Google.Protobuf', val: 712 },
      { name: 'MessagePack-CSharp', val: 1033 },
      { name: 'System.Text.Json', val: 2550 },
    ],
  },
  {
    title: 'Read a Single Nested Field',
    unit: 'ns',
    maxVal: 3000,
    methodology: 'Reads a nested city string via OpaquePeerUpdate vs full message decode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 108, highlight: true, baseline: true },
      { name: 'Google.Protobuf', val: 657 },
      { name: 'MessagePack-CSharp', val: 964 },
      { name: 'System.Text.Json', val: 2470 },
    ],
  },
  {
    title: 'Selective Single-Field Mutation',
    unit: 'ns',
    maxVal: 4000,
    methodology:
      'Checks a nested city string and splices an updated sequence counter via OpaquePeerUpdate vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 290, highlight: true, baseline: true },
      { name: 'Google.Protobuf', val: 1190 },
      { name: 'MessagePack-CSharp', val: 1455 },
      { name: 'System.Text.Json', val: 3402 },
    ],
  },
  {
    title: 'Large Embedded Message Encode',
    unit: 'ns',
    maxVal: 25000,
    methodology:
      'Serializes a 39 KiB packet whose >16 KiB nested sub-messages trigger 2B-to-4B header expansion.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 3575, sizeBytes: 39256, highlight: true, baseline: true },
      { name: 'OmniBuf ([OmniBufField])', val: 4492, sizeBytes: 39256, highlight: true },
      { name: 'MessagePack-CSharp', val: 4862, sizeBytes: 39508 },
      { name: 'System.Text.Json', val: 7001, sizeBytes: 39681 },
      { name: 'Google.Protobuf', val: 20910, sizeBytes: 39227 },
    ],
  },
  {
    title: 'Embedded Message Growth',
    unit: 'ns',
    maxVal: 19000,
    methodology:
      'Grows a nested string field past 16 KiB ahead of 32 trailing Neighbor entries via Opaque splicing vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 3773, highlight: true, baseline: true },
      { name: 'MessagePack-CSharp', val: 7210 },
      { name: 'Google.Protobuf', val: 15768 },
      { name: 'System.Text.Json', val: 16486 },
    ],
  },
];

// Swift results from omnibuf-swift/testdata/benchmarks.json (Swift 6.3.2, Apple M1 Pro)
export const swiftBenchmarkCategories: BenchmarkCategory[] = [
  {
    title: 'Full Message Encode Speed',
    unit: 'ns',
    maxVal: 17000,
    methodology: 'Serializes PeerUpdate into a fresh byte buffer in Swift 6 release mode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 274, sizeBytes: 365, highlight: true, baseline: true },
      { name: 'SwiftProtobuf', val: 1048, sizeBytes: 341 },
      { name: 'OmniBuf (Struct Schema)', val: 2020, sizeBytes: 365, highlight: true },
      { name: 'JSON (Foundation)', val: 14550, sizeBytes: 791 },
    ],
  },
  {
    title: 'Full Message Decode Speed',
    unit: 'ns',
    maxVal: 18000,
    methodology: 'Decodes raw bytes into a fresh PeerUpdate value and reads all 11 fields.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 785, highlight: true, baseline: true },
      { name: 'SwiftProtobuf', val: 1805 },
      { name: 'OmniBuf (Struct Schema)', val: 4413, highlight: true },
      { name: 'JSON (Foundation)', val: 15834 },
    ],
  },
  {
    title: 'Read a Single Nested Field',
    unit: 'ns',
    maxVal: 18000,
    methodology: 'Reads a nested city string via OpaquePeerUpdate vs full message decode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 117, highlight: true, baseline: true },
      { name: 'SwiftProtobuf', val: 1819 },
      { name: 'JSON (Foundation)', val: 15708 },
    ],
  },
  {
    title: 'Selective Single-Field Mutation',
    unit: 'ns',
    maxVal: 35000,
    methodology:
      'Checks a nested city string and splices an updated sequence counter via OpaquePeerUpdate vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 405, highlight: true, baseline: true },
      { name: 'SwiftProtobuf', val: 2920 },
      { name: 'JSON (Foundation)', val: 30664 },
    ],
  },
  {
    title: 'Large Embedded Message Encode',
    unit: 'ns',
    maxVal: 100000,
    methodology:
      'Serializes a 39 KiB packet whose >16 KiB nested sub-messages trigger 2B-to-4B header expansion.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 1706, sizeBytes: 39255, highlight: true, baseline: true },
      { name: 'SwiftProtobuf', val: 2532, sizeBytes: 39227 },
      { name: 'OmniBuf (Struct Schema)', val: 5148, sizeBytes: 39255, highlight: true },
      { name: 'JSON (Foundation)', val: 90182, sizeBytes: 39669 },
    ],
  },
  {
    title: 'Embedded Message Growth',
    unit: 'ns',
    maxVal: 160000,
    methodology:
      'Grows a nested string field past 16 KiB ahead of 32 trailing Neighbor entries via Opaque splicing vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 1176, highlight: true, baseline: true },
      { name: 'SwiftProtobuf', val: 13692 },
      { name: 'JSON (Foundation)', val: 144428 },
    ],
  },
];

// Dart results from omnibuf-dart/testdata/benchmarks.json (Dart 3.14.1 AOT, Apple M1 Pro)
export const dartBenchmarkCategories: BenchmarkCategory[] = [
  {
    title: 'Full Message Encode Speed',
    unit: 'ns',
    maxVal: 10000,
    methodology: 'Serializes PeerUpdate into a fresh Uint8List in Dart 3 AOT native binary.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 642, sizeBytes: 365, highlight: true, baseline: true },
      { name: 'OmniBuf (Schema)', val: 1211, sizeBytes: 365, highlight: true },
      { name: 'package:protobuf', val: 3360, sizeBytes: 343 },
      { name: 'dart:convert (JSON)', val: 8515, sizeBytes: 803 },
    ],
  },
  {
    title: 'Full Message Decode Speed',
    unit: 'ns',
    maxVal: 5000,
    methodology: 'Decodes Uint8List into a fresh PeerUpdate object and reads all 11 fields.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 803, highlight: true, baseline: true },
      { name: 'OmniBuf (Schema)', val: 2030, highlight: true },
      { name: 'package:protobuf', val: 2248 },
      { name: 'dart:convert (JSON)', val: 4250 },
    ],
  },
  {
    title: 'Read a Single Nested Field',
    unit: 'ns',
    maxVal: 5000,
    methodology: 'Reads a nested city string via OpaquePeerUpdate vs full message decode.',
    rows: [
      { name: 'OmniBuf (Opaque)', val: 299, highlight: true, baseline: true },
      { name: 'package:protobuf', val: 2215 },
      { name: 'dart:convert (JSON)', val: 4205 },
    ],
  },
  {
    title: 'Selective Single-Field Mutation',
    unit: 'ns',
    maxVal: 13000,
    methodology:
      'Checks a nested city string and splices an updated sequence counter via OpaquePeerUpdate vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Opaque Splice)', val: 1161, highlight: true, baseline: true },
      { name: 'package:protobuf', val: 4714 },
      { name: 'dart:convert (JSON)', val: 11469 },
    ],
  },
  {
    title: 'Large Embedded Message Encode',
    unit: 'ns',
    maxVal: 160000,
    methodology:
      'Serializes a 39 KiB packet whose >16 KiB nested sub-messages trigger 2B-to-4B header expansion.',
    rows: [
      {
        name: 'OmniBuf (Generated)',
        val: 38567,
        sizeBytes: 39255,
        highlight: true,
        baseline: true,
      },
      { name: 'package:protobuf', val: 91042, sizeBytes: 39229 },
      { name: 'dart:convert (JSON)', val: 143719, sizeBytes: 39681 },
    ],
  },
  {
    title: 'Embedded Message Growth',
    unit: 'ns',
    maxVal: 140000,
    methodology:
      'Grows a nested string field past 16 KiB ahead of 32 trailing Neighbor entries via Opaque splicing vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Opaque Splice)', val: 30457, highlight: true, baseline: true },
      { name: 'package:protobuf', val: 67909 },
      { name: 'dart:convert (JSON)', val: 120838 },
    ],
  },
];

// PHP results from omnibuf-php/testdata/benchmarks.json (PHP 8.6.0, Apple M1 Pro)
export const phpBenchmarkCategories: BenchmarkCategory[] = [
  {
    title: 'Full Message Encode Speed',
    unit: 'ns',
    maxVal: 100000,
    methodology:
      'Serializes PeerUpdate into a PHP binary string on PHP 8.6 via the public PHP APIs (marshalOmnibuf / OmniBuf::marshal) with the optional 100% Rust ext-omnibuf extension, pure-PHP OmniBuf, pure-PHP google/protobuf, and stdlib JSON.',
    rows: [
      { name: 'OmniBuf (ext-omnibuf)', val: 839, sizeBytes: 365, highlight: true, baseline: true },
      { name: 'OmniBuf Attributes (ext-omnibuf)', val: 858, sizeBytes: 366, highlight: true },
      { name: 'JSON (stdlib)', val: 1497, sizeBytes: 803 },
      { name: 'OmniBuf (Pure PHP Generated)', val: 4771, sizeBytes: 365, highlight: true },
      { name: 'OmniBuf (Pure PHP Attributes)', val: 12317, sizeBytes: 366, highlight: true },
      { name: 'google/protobuf (pure PHP)', val: 88927, sizeBytes: 341 },
    ],
  },
  {
    title: 'Full Message Decode Speed',
    unit: 'ns',
    maxVal: 60000,
    methodology: 'Decodes a binary string into a fresh PeerUpdate object and reads all 11 fields.',
    rows: [
      { name: 'OmniBuf (ext-omnibuf)', val: 1707, highlight: true, baseline: true },
      { name: 'OmniBuf Attributes (ext-omnibuf)', val: 1880, highlight: true },
      { name: 'JSON (stdlib)', val: 4305 },
      { name: 'OmniBuf (Pure PHP Generated)', val: 16679, highlight: true },
      { name: 'OmniBuf (Pure PHP Attributes)', val: 25718, highlight: true },
      { name: 'google/protobuf (pure PHP)', val: 53325 },
    ],
  },
  {
    title: 'Read a Single Nested Field',
    unit: 'ns',
    maxVal: 55000,
    methodology: 'Reads a nested city string via OpaquePeerUpdate vs full message decode.',
    rows: [
      { name: 'OmniBuf (ext-omnibuf)', val: 532, highlight: true, baseline: true },
      { name: 'JSON (stdlib)', val: 3799 },
      { name: 'OmniBuf (Pure PHP Generated)', val: 6044, highlight: true },
      { name: 'google/protobuf (pure PHP)', val: 49371 },
    ],
  },
  {
    title: 'Selective Single-Field Mutation',
    unit: 'ns',
    maxVal: 170000,
    methodology:
      'Checks a nested city string and splices an updated sequence counter via OpaquePeerUpdate vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (ext-omnibuf)', val: 1504, highlight: true, baseline: true },
      { name: 'JSON (stdlib)', val: 5262 },
      { name: 'OmniBuf (Pure PHP Generated)', val: 15175, highlight: true },
      { name: 'google/protobuf (pure PHP)', val: 147216 },
    ],
  },
  {
    title: 'Large Embedded Message Encode',
    unit: 'ns',
    maxVal: 1350000,
    methodology:
      'Serializes a 39 KiB packet whose >16 KiB nested sub-messages trigger 4-byte container length backpatching.',
    rows: [
      {
        name: 'OmniBuf (ext-omnibuf)',
        val: 5681,
        sizeBytes: 39255,
        highlight: true,
        baseline: true,
      },
      { name: 'OmniBuf Attributes (ext-omnibuf)', val: 6186, sizeBytes: 39256, highlight: true },
      { name: 'OmniBuf (Pure PHP Generated)', val: 9061, sizeBytes: 39255, highlight: true },
      { name: 'OmniBuf (Pure PHP Attributes)', val: 18544, sizeBytes: 39256, highlight: true },
      { name: 'JSON (stdlib)', val: 24499, sizeBytes: 39681 },
      { name: 'google/protobuf (pure PHP)', val: 1221487, sizeBytes: 39227 },
    ],
  },
  {
    title: 'Embedded Message Growth',
    unit: 'ns',
    maxVal: 1400000,
    methodology:
      'Grows a nested string field past 16 KiB ahead of 32 trailing Neighbor entries via Opaque splicing vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (ext-omnibuf)', val: 4964, highlight: true, baseline: true },
      { name: 'OmniBuf (Pure PHP Generated)', val: 14692, highlight: true },
      { name: 'JSON (stdlib)', val: 31163 },
      { name: 'google/protobuf (pure PHP)', val: 1238492 },
    ],
  },
];

// Elixir results from omnibuf-elixir/testdata/benchmarks.json (Elixir 1.18.6 / OTP 27, Apple M1 Pro)
export const elixirBenchmarkCategories: BenchmarkCategory[] = [
  {
    title: 'Full Message Encode Speed',
    unit: 'ns',
    maxVal: 7000,
    methodology:
      'Serializes PeerUpdate to a flat binary on BEAM OTP 27 across optional Rustler NIF (omnibuf-rs), pure-Elixir iodata, Jason JSON, and elixir-protobuf.',
    rows: [
      { name: 'OmniBuf (Rust NIF)', val: 945, sizeBytes: 358, highlight: true, baseline: true },
      { name: 'OmniBuf (Pure Elixir)', val: 2276, sizeBytes: 358, highlight: true },
      { name: 'Jason (JSON)', val: 4986, sizeBytes: 803 },
      { name: 'elixir-protobuf', val: 5942, sizeBytes: 341 },
    ],
  },
  {
    title: 'Full Message Decode Speed',
    unit: 'ns',
    maxVal: 7000,
    methodology: 'Decodes a binary into a fresh PeerUpdate struct and reads all 11 fields.',
    rows: [
      { name: 'OmniBuf (Rust NIF)', val: 1627, highlight: true, baseline: true },
      { name: 'OmniBuf (Pure Elixir)', val: 4503, highlight: true },
      { name: 'elixir-protobuf', val: 4509 },
      { name: 'Jason (JSON)', val: 6179 },
    ],
  },
  {
    title: 'Read a Single Nested Field',
    unit: 'ns',
    maxVal: 7000,
    methodology: 'Reads a nested city string via PeerUpdate.Opaque vs full message decode.',
    rows: [
      { name: 'OmniBuf (Rust NIF)', val: 423, highlight: true, baseline: true },
      { name: 'OmniBuf (Pure Elixir)', val: 1574, highlight: true },
      { name: 'elixir-protobuf', val: 4770 },
      { name: 'Jason (JSON)', val: 6274 },
    ],
  },
  {
    title: 'Selective Single-Field Mutation',
    unit: 'ns',
    maxVal: 14000,
    methodology:
      'Checks a nested city string and splices an updated sequence counter via zero-copy BEAM sub-binaries vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Rust NIF)', val: 618, highlight: true, baseline: true },
      { name: 'OmniBuf (Pure Elixir)', val: 2650, highlight: true },
      { name: 'elixir-protobuf', val: 10999 },
      { name: 'Jason (JSON)', val: 12050 },
    ],
  },
  {
    title: 'Large Embedded Message Encode',
    unit: 'ns',
    maxVal: 120000,
    methodology:
      'Serializes a 39 KiB packet whose >16 KiB nested sub-messages trigger 2B-to-4B header expansion.',
    rows: [
      { name: 'OmniBuf (Pure Elixir)', val: 2945, sizeBytes: 39250, highlight: true },
      { name: 'OmniBuf (Rust NIF)', val: 2982, sizeBytes: 39250, highlight: true, baseline: true },
      { name: 'Jason (JSON)', val: 83265, sizeBytes: 39681 },
      { name: 'elixir-protobuf', val: 105716, sizeBytes: 39227 },
    ],
  },
  {
    title: 'Embedded Message Growth',
    unit: 'ns',
    maxVal: 120000,
    methodology:
      'Grows a nested string field past 16 KiB ahead of 32 trailing Neighbor entries via Opaque splicing vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Rust NIF)', val: 4972, highlight: true, baseline: true },
      { name: 'OmniBuf (Pure Elixir)', val: 6386, highlight: true },
      { name: 'Jason (JSON)', val: 90588 },
      { name: 'elixir-protobuf', val: 104248 },
    ],
  },
];

// C99 Nano results from omnibuf-nano/testdata/benchmarks.json (Apple Clang -O3, Apple M1 Pro)
export const nanoBenchmarkCategories: BenchmarkCategory[] = [
  {
    title: 'Full Message Encode Speed',
    unit: 'ns',
    maxVal: 2000,
    methodology:
      'Serializes a static 976-byte PeerUpdate C99 struct into a fixed stack buffer (zero malloc) using descriptor tables in RODATA, comparing omnibuf-nano against nanopb 0.4.9.1.',
    rows: [
      { name: 'OmniBuf Nano (C99)', val: 778, sizeBytes: 365, highlight: true, baseline: true },
      { name: 'nanopb (C99)', val: 1418, sizeBytes: 341 },
    ],
  },
  {
    title: 'Full Message Decode Speed',
    unit: 'ns',
    maxVal: 1500,
    methodology:
      'Zero-initializes and decodes a full 11-field PeerUpdate packet into a static 976-byte C99 struct using streaming input callbacks.',
    rows: [
      { name: 'OmniBuf Nano (C99)', val: 972, highlight: true, baseline: true },
      { name: 'nanopb (C99)', val: 1194 },
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
const swiftEncodeCat = swiftBenchmarkCategories[0];
const swiftDecodeCat = swiftBenchmarkCategories[1];
const dartEncodeCat = dartBenchmarkCategories[0];
const dartDecodeCat = dartBenchmarkCategories[1];
const phpEncodeCat = phpBenchmarkCategories[0];
const phpDecodeCat = phpBenchmarkCategories[1];
const elixirEncodeCat = elixirBenchmarkCategories[0];
const elixirDecodeCat = elixirBenchmarkCategories[1];
const nanoEncodeCat = nanoBenchmarkCategories[0];
const nanoDecodeCat = nanoBenchmarkCategories[1];

const primaryAndCompetitors = (rows: BenchmarkRow[]) =>
  rows.filter((r) => Boolean(r.baseline) || !r.highlight);

export const languageBenchmarks: Record<LanguageKey, LanguageBenchmarkSuite> = {
  go: {
    key: 'go',
    label: 'Go',
    shortLabel: 'Go',
    headingPrefix: 'Go',
    href: '/benchmarks?lang=go',
    ctaLabel: 'See full results',
    competitorsLabel: "Protobuf, FlatBuffers, Avro, Cap'n Proto, MsgPack, JSON",
    heroSummaryHtml:
      'In Go, OmniBuf encodes and decodes <strong>around 5x to 6x faster</strong> than Protobuf. Plain Go structs with struct tags run <strong>around 5x to 9x faster</strong> than standard JSON at roughly half the wire size. Generated views read or splice single fields in place. Explore the <a href="/go" class="doc-link">Go runtime</a>.',
    categories: goSpeedCategories,
    butterflyEncodeRows: (goEncodeCat?.rows ?? []).filter(
      (r) => (r.baseline || !r.highlight) && r.name !== 'JSON (encoding/json/v2)',
    ),
    butterflyDecodeRows: (goDecodeCat?.rows ?? []).filter(
      (r) => (r.baseline || !r.highlight) && r.name !== 'JSON (encoding/json/v2)',
    ),
    hardwareLines: [
      'CPU: Apple M1 Pro (darwin/arm64)',
      'Compiler: Go 1.27.4',
      'Samples: 5 × 250 ms, CPU=1',
    ],
    environmentParagraphs: [
      'M1 Pro MacBook Pro, Go 1.27.4 (<code>GOEXPERIMENT=jsonv2</code>), <code>-benchtime=250ms -count=5 -cpu=1</code>. Every decode benchmark reads all 11 fields into a checksum (so the compiler cannot skip unused work) and reuses the destination struct across codecs, including Protobuf.',
      'Benchmark source lives in <a href="https://github.com/omnibuf/omnibuf-go/tree/main/benchmarks" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">benchmarks/</a>, with recorded output in <a href="https://github.com/omnibuf/omnibuf-go/blob/main/testdata/benchmarks.txt" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">testdata/benchmarks.txt</a> and <a href="https://github.com/omnibuf/omnibuf-go/blob/main/testdata/benchmarks.json" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">testdata/benchmarks.json</a>.',
    ],
  },
  es: {
    key: 'es',
    label: 'TypeScript & JS',
    shortLabel: 'TS / JS',
    headingPrefix: 'TypeScript & JS',
    href: '/benchmarks?lang=es',
    ctaLabel: 'See full results',
    competitorsLabel: 'protobufjs, protobuf-es, google-protobuf, MsgPack, JSON',
    heroSummaryHtml:
      'TypeScript and JavaScript apps encode and decode <strong>around 3x to 5x faster</strong> with OmniBuf than with Protobuf-ES, and read individual nested fields <strong>about 12x faster</strong>. Against built-in JSON in Node.js and browsers, OmniBuf runs <strong>around 2x to 3x faster</strong> at less than half the byte size. Explore the <a href="/es" class="doc-link">TypeScript runtime</a>.',
    categories: esBenchmarkCategories,
    butterflyEncodeRows: esEncodeCat?.rows ?? [],
    butterflyDecodeRows: esDecodeCat?.rows ?? [],
    hardwareLines: [
      'CPU: Apple M1 Pro (darwin/arm64)',
      'Runtime: Node.js v26.13.1 (V8)',
      'Command: pnpm run bench',
    ],
    environmentParagraphs: [
      'Measured on an Apple M1 Pro Mac using Node.js v26.13.1. Every decode benchmark reads all 11 fields of the <code>PeerUpdate</code> message, and every mutation benchmark checks <code>location.city</code> before incrementing <code>sequence</code> from the input packet.',
      'Benchmark source lives in <a href="https://github.com/omnibuf/omnibuf-es/tree/main/benchmarks" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">benchmarks/</a> in the <code>omnibuf-es</code> repository (<code>pnpm run bench</code>), with recorded output in <a href="https://github.com/omnibuf/omnibuf-es/blob/main/testdata/benchmarks.json" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">testdata/benchmarks.json</a>.',
    ],
  },
  rs: {
    key: 'rs',
    label: 'Rust',
    shortLabel: 'Rust',
    headingPrefix: 'Rust',
    href: '/benchmarks?lang=rs',
    ctaLabel: 'See full results',
    competitorsLabel: 'buffa, prost, rmp-serde, serde_json',
    heroSummaryHtml:
      'OmniBuf&apos;s Rust crate leads both buffa and prost on full message encode and decode, and runs <strong>around 4x to 5x faster</strong> than JSON. Zero-copy views borrow nested strings <strong>about 5x to 9x faster</strong> and splice single-field updates <strong>around 4x faster</strong>. Explore the <a href="/rs" class="doc-link">Rust runtime</a>.',
    categories: rsBenchmarkCategories,
    butterflyEncodeRows: primaryAndCompetitors(rsEncodeCat.rows),
    butterflyDecodeRows: primaryAndCompetitors(rsDecodeCat.rows),
    hardwareLines: [
      'CPU: Apple M1 Pro (darwin/arm64)',
      'Compiler: rustc 1.100.0 (--release)',
      'Command: just bench',
    ],
    environmentParagraphs: [
      'Compiled with <code>rustc 1.100.0</code> in release mode on an Apple M1 Pro Mac. Encode benchmarks start from identical <code>Vec::with_capacity(128)</code> buffers, and decode benchmarks read all 11 fields through <code>black_box</code> so the compiler cannot optimize them away.',
      'Benchmark source lives in <a href="https://github.com/omnibuf/omnibuf-rs/tree/main/crates/omnibuf-bench" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">crates/omnibuf-bench/</a>, with recorded output in <a href="https://github.com/omnibuf/omnibuf-rs/blob/main/testdata/benchmarks.json" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">testdata/benchmarks.json</a>.',
    ],
  },
  py: {
    key: 'py',
    label: 'Python',
    shortLabel: 'Python',
    headingPrefix: 'Python',
    href: '/benchmarks?lang=py',
    ctaLabel: 'See full results',
    competitorsLabel: 'protobuf-py (Rust), upb (C), msgspec (C), msgpack (C), json (C)',
    heroSummaryHtml:
      'Python&apos;s compiled Rust extension outpaces Google&apos;s C Protobuf backend, msgspec, and stdlib JSON on both encode and decode. Full message decoding finishes <strong>nearly 3x faster</strong> than Google Protobuf, and lazy views read nested fields <strong>nearly 2x faster</strong>. Explore the <a href="/py" class="doc-link">Python runtime</a>.',
    categories: pyBenchmarkCategories,
    butterflyEncodeRows: primaryAndCompetitors(pyEncodeCat.rows),
    butterflyDecodeRows: primaryAndCompetitors(pyDecodeCat.rows),
    hardwareLines: [
      'CPU: Apple M1 Pro (darwin/arm64)',
      'Runtime: Python 3.14.5 + rustc 1.94.0',
      'Command: just bench',
    ],
    environmentParagraphs: [
      'Measured on CPython 3.14.5 on an Apple M1 Pro Mac. Every serializer in this chart runs compiled native code: <code>omnibuf</code> (Rust), <code>protobuf-py</code> (Rust), Google <code>upb</code> (C), <code>msgspec</code> (C), <code>msgpack</code> (C), and stdlib <code>json</code> (C). Full decode reads all 11 fields in Python so lazy C-arena wrappers materialize the exact same Python strings and sub-messages as eager dataclasses.',
      'Benchmark source lives in <a href="https://github.com/omnibuf/omnibuf-py/tree/main/benchmarks" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">benchmarks/</a>, with recorded output in <a href="https://github.com/omnibuf/omnibuf-py/blob/main/testdata/benchmarks.json" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">testdata/benchmarks.json</a>.',
    ],
  },
  cpp: {
    key: 'cpp',
    label: 'C++',
    shortLabel: 'C++',
    headingPrefix: 'C++',
    href: '/benchmarks?lang=cpp',
    ctaLabel: 'See full results',
    competitorsLabel: 'libprotobuf, Protobuf (LEB128 Wire), JSON',
    heroSummaryHtml:
      'The header-only C++20 library decodes <strong>over 2x faster</strong> than official <code>libprotobuf</code> and encodes faster across both small and large embedded messages. Zero-copy views read nested string slices <strong>over 8x faster</strong> than <code>libprotobuf</code> and splice scalar updates <strong>nearly 4x faster</strong>. Explore the <a href="/cpp" class="doc-link">C++ runtime</a>.',
    categories: cppBenchmarkCategories,
    butterflyEncodeRows: (cppEncodeCat?.rows ?? []).filter(
      (r) => (r.baseline || !r.highlight) && r.name !== 'Protobuf (LEB128 Wire)',
    ),
    butterflyDecodeRows: (cppDecodeCat?.rows ?? []).filter(
      (r) => (r.baseline || !r.highlight) && r.name !== 'Protobuf (LEB128 Wire)',
    ),
    hardwareLines: [
      'CPU: Apple M1 Pro (darwin/arm64)',
      'Compiler: Apple Clang 21.0.0 (-O3, C++20)',
      'Peer: libprotobuf 36.2 + in-tree LEB128 & JSON',
      'Command: just bench',
    ],
    environmentParagraphs: [
      'Compiled with Apple Clang 21.0.0 (<code>-O3 -DNDEBUG -std=c++20</code>) on an Apple M1 Pro Mac. Zero-dependency <code>omnibuf-cpp</code> headers are benchmarked against official <code>libprotobuf</code> 36.2 (<code>google::protobuf::Message</code>), an in-tree LEB128 Protobuf wire codec, and JSON on the exact same <code>PeerUpdate</code> workload, UTF-8 rules, and full 11-field decode check.',
      'Benchmark source lives in <a href="https://github.com/omnibuf/omnibuf-cpp/tree/main/benchmarks" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">benchmarks/</a>, with recorded output in <a href="https://github.com/omnibuf/omnibuf-cpp/blob/main/testdata/benchmarks.json" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">testdata/benchmarks.json</a>.',
    ],
  },
  java: {
    key: 'java',
    label: 'Java',
    shortLabel: 'Java',
    headingPrefix: 'Java',
    href: '/benchmarks?lang=java',
    ctaLabel: 'See full results',
    competitorsLabel: 'protobuf-java, FlatBuffers, Jackson JSON, Jackson MsgPack',
    heroSummaryHtml:
      'Java services encode and decode faster with OmniBuf than with Java Protobuf, and run <strong>around 3x to 6x faster</strong> than Jackson JSON. Generated views read nested fields <strong>nearly 10x faster</strong> than Protobuf and splice single-field updates <strong>over 4x faster</strong>. Explore the <a href="/java" class="doc-link">Java runtime</a>.',
    categories: javaBenchmarkCategories,
    butterflyEncodeRows: primaryAndCompetitors(javaEncodeCat.rows),
    butterflyDecodeRows: primaryAndCompetitors(javaDecodeCat.rows),
    hardwareLines: [
      'CPU: Apple M1 Pro (darwin/arm64)',
      'Runtime: OpenJDK 25.0.5 (Temurin C2)',
      'Command: just bench',
    ],
    environmentParagraphs: [
      'Measured on Eclipse Temurin OpenJDK 25.0.5 after C2 JIT warmup on an Apple M1 Pro Mac. Every decode benchmark reads all 11 fields into a volatile checksum so the JIT cannot optimize unused reads away. Immutable <code>protobuf-java</code> instances cache UTF-8 <code>ByteString</code> slices and <code>memoizedSerializedSize</code> after the first pass, giving it an advantage on repeated encodes of unchanged 39 KiB messages.',
      'Benchmark source lives in <a href="https://github.com/omnibuf/omnibuf-java/tree/main/src/test/java/com/omnibuf/bench" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">src/test/java/com/omnibuf/bench/</a>, with recorded output in <a href="https://github.com/omnibuf/omnibuf-java/blob/main/testdata/benchmarks.json" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">testdata/benchmarks.json</a>.',
    ],
  },
  cs: {
    key: 'cs',
    label: 'C# / .NET',
    shortLabel: 'C#',
    headingPrefix: 'C# & .NET',
    href: '/benchmarks?lang=cs',
    ctaLabel: 'See full results',
    competitorsLabel: 'Google.Protobuf, MessagePack-CSharp, System.Text.Json',
    heroSummaryHtml:
      'On .NET, OmniBuf encodes <strong>over 3x faster</strong> and decodes <strong>over 2x faster</strong> than Google Protobuf, and decodes <strong>over 8x faster</strong> than System.Text.Json. Span-based views read nested fields <strong>over 6x faster</strong> than Protobuf and splice single-field updates <strong>over 4x faster</strong>. Explore the <a href="/cs" class="doc-link">C# runtime</a>.',
    categories: csBenchmarkCategories,
    butterflyEncodeRows: primaryAndCompetitors(csEncodeCat.rows),
    butterflyDecodeRows: primaryAndCompetitors(csDecodeCat.rows),
    hardwareLines: [
      'CPU: Apple M1 Pro (darwin/arm64)',
      'Runtime: .NET 8.0.29 (RyuJIT Tier-1 PGO)',
      'Command: just bench',
    ],
    environmentParagraphs: [
      'Measured on .NET 8.0.29 (Release build with Dynamic PGO warmup) on an Apple M1 Pro Mac. Every benchmark allocates a fresh <code>byte[]</code> on encode and reads all 11 fields on decode, tracking per-operation heap bytes with <code>GC.GetAllocatedBytesForCurrentThread</code>.',
      'Benchmark source lives in <a href="https://github.com/omnibuf/omnibuf-cs/tree/main/src/OmniBuf.Benchmarks" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">src/OmniBuf.Benchmarks/</a>, with recorded output in <a href="https://github.com/omnibuf/omnibuf-cs/blob/main/testdata/benchmarks.json" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">testdata/benchmarks.json</a>.',
    ],
  },
  swift: {
    key: 'swift',
    label: 'Swift',
    shortLabel: 'Swift',
    headingPrefix: 'Swift',
    href: '/benchmarks?lang=swift',
    ctaLabel: 'See full results',
    competitorsLabel: 'SwiftProtobuf, Foundation JSON',
    heroSummaryHtml:
      'On Swift 6, OmniBuf encodes <strong>nearly 4x faster</strong> and decodes <strong>over 2x faster</strong> than SwiftProtobuf. Lazy views read nested strings <strong>around 15x faster</strong> than SwiftProtobuf and splice single-field updates <strong>about 7x faster</strong>. Explore the <a href="/swift" class="doc-link">Swift runtime</a>.',
    categories: swiftBenchmarkCategories,
    butterflyEncodeRows: primaryAndCompetitors(swiftEncodeCat.rows),
    butterflyDecodeRows: primaryAndCompetitors(swiftDecodeCat.rows),
    hardwareLines: [
      'CPU: Apple M1 Pro (darwin/arm64)',
      'Compiler: Swift 6.3.2 (-c release)',
      'Command: just bench',
    ],
    environmentParagraphs: [
      'Compiled with Swift 6.3.2 in release mode on an Apple M1 Pro Mac. Every decode benchmark reads all 11 fields of <code>PeerUpdate</code> into a checksum so lazy and eager decoders do the same work.',
      'Benchmark source lives in <a href="https://github.com/omnibuf/omnibuf-swift/tree/main/Sources/OmniBufBench" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">Sources/OmniBufBench/</a>, with recorded output in <a href="https://github.com/omnibuf/omnibuf-swift/blob/main/testdata/benchmarks.json" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">testdata/benchmarks.json</a>.',
    ],
  },
  dart: {
    key: 'dart',
    label: 'Dart',
    shortLabel: 'Dart',
    headingPrefix: 'Dart',
    href: '/benchmarks?lang=dart',
    ctaLabel: 'See full results',
    competitorsLabel: 'package:protobuf, dart:convert (JSON)',
    heroSummaryHtml:
      'Compiled Dart 3 AOT binaries encode <strong>over 5x faster</strong> and decode <strong>nearly 3x faster</strong> with OmniBuf than with <code>package:protobuf</code>. Lazy views read nested fields <strong>over 7x faster</strong> and splice single-field mutations <strong>over 4x faster</strong>. Explore the <a href="/dart" class="doc-link">Dart runtime</a>.',
    categories: dartBenchmarkCategories,
    butterflyEncodeRows: primaryAndCompetitors(dartEncodeCat.rows),
    butterflyDecodeRows: primaryAndCompetitors(dartDecodeCat.rows),
    hardwareLines: [
      'CPU: Apple M1 Pro (darwin/arm64)',
      'Runtime: Dart 3.14.1 (AOT native)',
      'Command: just bench',
    ],
    environmentParagraphs: [
      'Compiled as a native Dart 3.14.1 AOT executable on an Apple M1 Pro Mac. Every decode benchmark reads all 11 fields of <code>PeerUpdate</code> into a checksum so nothing gets optimized away.',
      'Benchmark source lives in <a href="https://github.com/omnibuf/omnibuf-dart/tree/main/benchmark" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">benchmark/</a>, with recorded output in <a href="https://github.com/omnibuf/omnibuf-dart/blob/main/testdata/benchmarks.json" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">testdata/benchmarks.json</a>.',
    ],
  },
  php: {
    key: 'php',
    label: 'PHP',
    shortLabel: 'PHP',
    headingPrefix: 'PHP',
    href: '/benchmarks?lang=php',
    ctaLabel: 'See full results',
    competitorsLabel: 'google/protobuf (pure PHP), JSON (C stdlib)',
    heroSummaryHtml:
      'With the optional pure-Rust <code>ext-omnibuf</code> extension loaded, PHP beats C stdlib JSON across all six benchmarks: encoding <strong>nearly 2x faster</strong>, decoding <strong>over 2x faster</strong>, and reading nested fields <strong>over 7x faster</strong>. Without any extension installed, pure-PHP OmniBuf encodes <strong>nearly 19x faster</strong> than pure-PHP Protobuf. Explore the <a href="/php" class="doc-link">PHP runtime</a>.',
    categories: phpBenchmarkCategories,
    butterflyEncodeRows: primaryAndCompetitors(phpEncodeCat.rows),
    butterflyDecodeRows: primaryAndCompetitors(phpDecodeCat.rows),
    hardwareLines: [
      'CPU: Apple M1 Pro (darwin/arm64)',
      'Runtime: PHP 8.6.0 (ext-omnibuf Rust + pure PHP)',
      'Command: php -d extension=ext/modules/omnibuf.so benchmarks/bench.php',
    ],
    environmentParagraphs: [
      'Measured on PHP 8.6.0 on an Apple M1 Pro Mac through the public PHP APIs (<code>marshalOmnibuf</code>, <code>OmniBuf::marshal</code>, and <code>OpaquePeerUpdate</code>) with the optional 100% Rust <code>ext-omnibuf</code> extension (<code>ext-php-rs</code>) alongside pure-PHP <code>omnibuf/omnibuf</code>, pure-PHP <code>google/protobuf</code>, and C stdlib <code>json_encode</code> / <code>json_decode</code>.',
      'Benchmark source lives in <a href="https://github.com/omnibuf/omnibuf-php/tree/main/benchmarks" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">benchmarks/</a>, with recorded output in <a href="https://github.com/omnibuf/omnibuf-php/blob/main/testdata/benchmarks.json" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">testdata/benchmarks.json</a>.',
    ],
  },
  elixir: {
    key: 'elixir',
    label: 'Elixir',
    shortLabel: 'Elixir',
    headingPrefix: 'Elixir',
    href: '/benchmarks?lang=elixir',
    ctaLabel: 'See full results',
    competitorsLabel: 'elixir-protobuf, Jason (JSON)',
    heroSummaryHtml:
      'On the BEAM, OmniBuf with its optional Rust NIF encodes <strong>over 6x faster</strong> and decodes <strong>nearly 3x faster</strong> than <code>elixir-protobuf</code>. Lazy views read nested strings <strong>over 11x faster</strong> and splice single-field updates <strong>over 17x faster</strong>. Explore the <a href="/elixir" class="doc-link">Elixir runtime</a>.',
    categories: elixirBenchmarkCategories,
    butterflyEncodeRows: primaryAndCompetitors(elixirEncodeCat.rows),
    butterflyDecodeRows: primaryAndCompetitors(elixirDecodeCat.rows),
    hardwareLines: [
      'CPU: Apple M1 Pro (darwin/arm64)',
      'Runtime: Elixir 1.18.6 / Erlang OTP 27 (+ Rust NIF)',
      'Command: just bench',
    ],
    environmentParagraphs: [
      'Measured on Elixir 1.18.6 running on Erlang/OTP 27 on an Apple M1 Pro Mac. Both the optional Rustler NIF backed by <code>omnibuf-rs</code> and the pure-Elixir iodata / binary pattern-matching backend pass all 1109 conformance tests.',
      'Benchmark source lives in <a href="https://github.com/omnibuf/omnibuf-elixir/tree/main/bench" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">bench/</a>, with recorded output in <a href="https://github.com/omnibuf/omnibuf-elixir/blob/main/testdata/benchmarks.json" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">testdata/benchmarks.json</a>.',
    ],
  },
  nano: {
    key: 'nano',
    label: 'C (Nano)',
    shortLabel: 'C99',
    headingPrefix: 'C99 Nano',
    href: '/benchmarks?lang=nano',
    ctaLabel: 'See full results',
    competitorsLabel: 'nanopb 0.4.9.1 (C99)',
    heroSummaryHtml:
      'Built for microcontrollers with zero dynamic allocation, OmniBuf Nano encodes <strong>82% faster</strong> and decodes <strong>23% faster</strong> than <code>nanopb</code> with 0 bytes of static RAM (<code>.data</code>/<code>.bss</code>). Explore <a href="/nano" class="doc-link">C (Nano)</a>.',
    categories: nanoBenchmarkCategories,
    butterflyEncodeRows: primaryAndCompetitors(nanoEncodeCat.rows),
    butterflyDecodeRows: primaryAndCompetitors(nanoDecodeCat.rows),
    hardwareLines: [
      'CPU: Apple M1 Pro (darwin/arm64)',
      'Compiler: Apple Clang (-O3 -DNDEBUG -std=c99)',
      'Command: just bench',
    ],
    environmentParagraphs: [
      'Compiled with Apple Clang at <code>-O3 -DNDEBUG -std=c99</code> on an Apple M1 Pro Mac. Both <code>omnibuf-nano</code> and <code>nanopb 0.4.9.1</code> use identical static <code>PeerUpdate</code> struct bounds (976 bytes) generated from the same <code>.proto</code> and <code>.options</code> files.',
      'At <code>-Os</code>, the <code>omnibuf-nano</code> C99 runtime compiles to 12,461 bytes of <code>__TEXT</code> (0 bytes <code>.data</code>/<code>.bss</code>), compared to 11,165 bytes for <code>nanopb</code>. Benchmark source lives in <a href="https://github.com/omnibuf/omnibuf-nano/tree/main/benchmarks" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">benchmarks/</a>, with recorded output in <a href="https://github.com/omnibuf/omnibuf-nano/blob/main/testdata/benchmarks.json" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">testdata/benchmarks.json</a>.',
    ],
  },
};

export const languageBenchmarkList: LanguageBenchmarkSuite[] = [
  languageBenchmarks.go,
  languageBenchmarks.es,
  languageBenchmarks.rs,
  languageBenchmarks.py,
  languageBenchmarks.cpp,
  languageBenchmarks.nano,
  languageBenchmarks.java,
  languageBenchmarks.cs,
  languageBenchmarks.swift,
  languageBenchmarks.dart,
  languageBenchmarks.php,
  languageBenchmarks.elixir,
];
