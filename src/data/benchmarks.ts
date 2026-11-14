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
      'Protobuf is ~7% smaller on the wire (341 B vs 366 B) and has libraries for almost every language on earth. OmniBuf keeps the same .proto schemas and generated structs, encodes in a single pass (~6.0x faster in Go), decodes ~5.2x faster under equal struct reuse, and does not need the .proto file to inspect a packet.',
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
    maxVal: 2300,
    methodology:
      "Serializing the 11-field Go struct into a reused byte slice. FlatBuffers and Cap'n Proto times include building the buffer from the struct.",
    rows: [
      { name: 'OmniBuf (Generated)', val: 122, highlight: true, baseline: true },
      { name: 'OmniBuf (Go Struct Tags)', val: 348, highlight: true },
      { name: 'Avro (Raw Binary)', val: 541 },
      { name: 'FlatBuffers', val: 723 },
      { name: 'Protobuf', val: 726 },
      { name: "Cap'n Proto", val: 1312 },
      { name: 'MessagePack', val: 2038 },
      { name: 'JSON (encoding/json)', val: 2168 },
      { name: 'JSON (encoding/json/v2)', val: 2205 },
    ],
  },
  {
    title: 'Full Message Decode Speed',
    unit: 'ns',
    maxVal: 4600,
    methodology:
      'Unpacking and reading all 11 fields into a reused destination struct across every codec, including Protobuf.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 230, highlight: true, baseline: true },
      { name: 'FlatBuffers', val: 251 },
      { name: 'OmniBuf (Go Struct Tags)', val: 467, highlight: true },
      { name: 'Avro (Raw Binary)', val: 533 },
      { name: "Cap'n Proto", val: 974 },
      { name: 'Protobuf', val: 1200 },
      { name: 'MessagePack', val: 2832 },
      { name: 'JSON (encoding/json/v2)', val: 3537 },
      { name: 'JSON (encoding/json)', val: 4487 },
    ],
  },
  {
    title: 'Read a Single Nested Field',
    unit: 'ns',
    maxVal: 1350,
    methodology:
      "Reading a nested string field directly from the raw byte slice. Cap'n Proto and FlatBuffers use offset tables; OmniBuf hops over preceding field headers by length.",
    rows: [
      { name: "Cap'n Proto", val: 6 },
      { name: 'FlatBuffers', val: 35 },
      { name: 'OmniBuf', val: 110, highlight: true, baseline: true },
      { name: 'Avro (Raw Binary)', val: 587 },
      { name: 'MessagePack', val: 783 },
      { name: 'Protobuf', val: 1276 },
    ],
  },
  {
    title: 'Selective Single-Field Mutation',
    unit: 'ns',
    maxVal: 7000,
    methodology:
      'Checking a nested city string, incrementing the 64-bit sequence counter, and returning the updated packet. OmniBuf splices the field in place; the others decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Opaque Splice)', val: 284, highlight: true, baseline: true },
      { name: 'FlatBuffers', val: 1001 },
      { name: 'Avro (Raw Binary)', val: 1110 },
      { name: 'Protobuf', val: 2063 },
      { name: "Cap'n Proto", val: 2436 },
      { name: 'MessagePack', val: 5082 },
      { name: 'JSON (encoding/json/v2)', val: 6218 },
      { name: 'JSON (encoding/json)', val: 6799 },
    ],
  },
  {
    title: 'Large Embedded Message Encode',
    unit: 'ns',
    maxVal: 42000,
    methodology:
      'Serializing a 39 KiB packet whose 20 KiB and 18 KiB nested sub-messages exceed the 2-byte 16,383 B length reservation and trigger 2B-to-4B header shifts.',
    rows: [
      { name: 'FlatBuffers', val: 1423 },
      { name: 'OmniBuf (Generated)', val: 1842, highlight: true, baseline: true },
      { name: 'Protobuf', val: 2229 },
      { name: 'OmniBuf (Go Struct Tags)', val: 2926, highlight: true },
      { name: 'Avro (Raw Binary)', val: 9232 },
      { name: "Cap'n Proto", val: 10018 },
      { name: 'MessagePack', val: 16689 },
      { name: 'JSON (encoding/json/v2)', val: 40615 },
      { name: 'JSON (encoding/json)', val: 41041 },
    ],
  },
  {
    title: 'Embedded Message Growth',
    unit: 'ns',
    maxVal: 48000,
    methodology:
      'Growing a nested string field past 16 KiB ahead of 32 trailing Neighbor entries via Opaque splicing vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Opaque Splice)', val: 1153, highlight: true, baseline: true },
      { name: 'FlatBuffers', val: 3833 },
      { name: 'Avro (Raw Binary)', val: 7509 },
      { name: 'Protobuf', val: 8940 },
      { name: "Cap'n Proto", val: 11536 },
      { name: 'MessagePack', val: 30357 },
      { name: 'JSON (encoding/json/v2)', val: 43783 },
      { name: 'JSON (encoding/json)', val: 47105 },
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
    maxVal: 6800,
    methodology: 'Serializing the 11-field PeerUpdate object into a fresh Uint8Array (366 B).',
    rows: [
      {
        name: 'OmniBuf',
        val: 1239,
        ops: '807,242 ops/s',
        sizeBytes: 366,
        highlight: true,
        baseline: true,
      },
      { name: 'protobufjs', val: 1663, ops: '601,356 ops/s', sizeBytes: 341 },
      { name: 'JSON', val: 2439, ops: '410,052 ops/s', sizeBytes: 791 },
      {
        name: '@bufbuild/protobuf (protobuf-es)',
        val: 3065,
        ops: '326,303 ops/s',
        sizeBytes: 341,
      },
      { name: '@msgpack/msgpack', val: 4583, ops: '218,175 ops/s', sizeBytes: 622 },
      { name: 'google-protobuf', val: 6619, ops: '151,089 ops/s', sizeBytes: 341 },
    ],
  },
  {
    title: 'Full Message Decode Speed',
    unit: 'ns',
    maxVal: 4500,
    methodology: 'Decoding Uint8Array into a fresh PeerUpdate object and reading all 11 fields.',
    rows: [
      { name: 'OmniBuf', val: 1385, ops: '722,273 ops/s', highlight: true, baseline: true },
      { name: 'protobufjs', val: 2548, ops: '392,432 ops/s' },
      { name: 'JSON', val: 2647, ops: '377,826 ops/s' },
      { name: 'google-protobuf', val: 3611, ops: '276,952 ops/s' },
      { name: '@msgpack/msgpack', val: 3832, ops: '260,973 ops/s' },
      { name: '@bufbuild/protobuf (protobuf-es)', val: 4281, ops: '233,604 ops/s' },
    ],
  },
  {
    title: 'Read a Single Nested Field',
    unit: 'ns',
    maxVal: 4200,
    methodology:
      'Reading a nested city string from a Uint8Array. The other JS libraries decode the whole message first; OmniBuf skips earlier fields by byte length.',
    rows: [
      { name: 'OmniBuf', val: 399, ops: '2,507,169 ops/s', highlight: true, baseline: true },
      { name: 'protobufjs', val: 1549, ops: '645,519 ops/s' },
      { name: 'JSON', val: 2296, ops: '435,596 ops/s' },
      { name: 'google-protobuf', val: 3319, ops: '301,279 ops/s' },
      { name: '@msgpack/msgpack', val: 3612, ops: '276,825 ops/s' },
      { name: '@bufbuild/protobuf (protobuf-es)', val: 4060, ops: '246,330 ops/s' },
    ],
  },
  {
    title: 'Selective Single-Field Mutation',
    unit: 'ns',
    maxVal: 10000,
    methodology:
      'Checking a nested city string, incrementing the sequence number from the packet, and returning an updated Uint8Array.',
    rows: [
      { name: 'OmniBuf', val: 3377, ops: '296,102 ops/s', highlight: true, baseline: true },
      { name: 'protobufjs', val: 4045, ops: '247,240 ops/s' },
      { name: 'JSON', val: 4833, ops: '206,891 ops/s' },
      { name: '@bufbuild/protobuf (protobuf-es)', val: 7300, ops: '136,979 ops/s' },
      { name: '@msgpack/msgpack', val: 8069, ops: '123,926 ops/s' },
      { name: 'google-protobuf', val: 9815, ops: '101,888 ops/s' },
    ],
  },
  {
    title: 'Large Embedded Message Encode',
    unit: 'ns',
    maxVal: 120000,
    methodology:
      'Serializing a 39 KiB packet whose 20 KiB and 18 KiB nested messages exceed the 2-byte 16,383 B length reservation.',
    rows: [
      { name: 'protobufjs', val: 22363, ops: '44,716 ops/s', sizeBytes: 39227 },
      { name: 'google-protobuf', val: 23821, ops: '41,980 ops/s', sizeBytes: 39227 },
      {
        name: 'OmniBuf',
        val: 30841,
        ops: '32,425 ops/s',
        sizeBytes: 39256,
        highlight: true,
        baseline: true,
      },
      {
        name: '@bufbuild/protobuf (protobuf-es)',
        val: 30869,
        ops: '32,395 ops/s',
        sizeBytes: 39227,
      },
      { name: 'JSON', val: 35011, ops: '28,562 ops/s', sizeBytes: 39669 },
      { name: '@msgpack/msgpack', val: 118938, ops: '8,408 ops/s', sizeBytes: 39504 },
    ],
  },
  {
    title: 'Embedded Message Growth',
    unit: 'ns',
    maxVal: 110000,
    methodology:
      'Growing a nested string field past 16 KiB ahead of 32 trailing Neighbor entries and emitting an updated Uint8Array.',
    rows: [
      { name: 'OmniBuf', val: 23039, ops: '43,405 ops/s', highlight: true, baseline: true },
      { name: 'protobufjs', val: 29282, ops: '34,150 ops/s' },
      { name: 'JSON', val: 35580, ops: '28,106 ops/s' },
      { name: '@bufbuild/protobuf (protobuf-es)', val: 37191, ops: '26,888 ops/s' },
      { name: 'google-protobuf', val: 41997, ops: '23,811 ops/s' },
      { name: '@msgpack/msgpack', val: 106284, ops: '9,409 ops/s' },
    ],
  },
];

// Rust results from omnibuf-rs/testdata/benchmarks.json (rustc 1.94.0)
export const rsBenchmarkCategories: BenchmarkCategory[] = [
  {
    title: 'Full Message Encode Speed',
    unit: 'ns',
    maxVal: 1100,
    methodology: 'Serializing PeerUpdate into a freshly allocated Vec<u8> across every library.',
    rows: [
      { name: 'OmniBuf (#[derive(OmniBuf)])', val: 242, sizeBytes: 366, highlight: true },
      { name: 'OmniBuf (Generated)', val: 243, sizeBytes: 366, highlight: true, baseline: true },
      { name: 'buffa (Protobuf)', val: 262, sizeBytes: 341 },
      { name: 'prost (Protobuf)', val: 300, sizeBytes: 341 },
      { name: 'rmp-serde (MessagePack)', val: 835, sizeBytes: 626 },
      { name: 'serde_json', val: 1041, sizeBytes: 803 },
    ],
  },
  {
    title: 'Full Message Decode Speed',
    unit: 'ns',
    maxVal: 1750,
    methodology: 'Decoding &[u8] into a fresh owned PeerUpdate struct and reading all 11 fields.',
    rows: [
      { name: 'OmniBuf (#[derive(OmniBuf)])', val: 557, highlight: true },
      { name: 'OmniBuf (Generated)', val: 563, highlight: true, baseline: true },
      { name: 'buffa (Protobuf)', val: 682 },
      { name: 'prost (Protobuf)', val: 887 },
      { name: 'rmp-serde (MessagePack)', val: 1150 },
      { name: 'serde_json', val: 1676 },
    ],
  },
  {
    title: 'Read a Single Nested Field',
    unit: 'ns',
    maxVal: 1750,
    methodology:
      'Borrowing a nested &str directly from &[u8] via OpaquePeerUpdate vs buffa PeerUpdateView vs full decode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 91, highlight: true, baseline: true },
      { name: 'buffa (Protobuf)', val: 480 },
      { name: 'prost (Protobuf)', val: 874 },
      { name: 'rmp-serde (MessagePack)', val: 1135 },
      { name: 'serde_json', val: 1664 },
    ],
  },
  {
    title: 'Selective Single-Field Mutation',
    unit: 'ns',
    maxVal: 2900,
    methodology:
      'Checking a nested city string and splicing an incremented 64-bit sequence counter into &[u8] vs decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 261, highlight: true, baseline: true },
      { name: 'buffa (Protobuf)', val: 949 },
      { name: 'prost (Protobuf)', val: 1218 },
      { name: 'rmp-serde (MessagePack)', val: 2020 },
      { name: 'serde_json', val: 2762 },
    ],
  },
  {
    title: 'Large Embedded Message Encode',
    unit: 'ns',
    maxVal: 19000,
    methodology:
      'Serializing a 39 KiB packet into Vec::with_capacity(128). Two-pass encoded_len() pre-sizing in buffa and prost avoids single-pass 2B-to-4B header shifts.',
    rows: [
      { name: 'buffa (Protobuf)', val: 1116, sizeBytes: 39227 },
      { name: 'prost (Protobuf)', val: 1137, sizeBytes: 39227 },
      { name: 'rmp-serde (MessagePack)', val: 2030, sizeBytes: 39508 },
      {
        name: 'OmniBuf (Generated)',
        val: 2883,
        sizeBytes: 39256,
        highlight: true,
        baseline: true,
      },
      { name: 'OmniBuf (#[derive(OmniBuf)])', val: 2894, sizeBytes: 39256, highlight: true },
      { name: 'serde_json', val: 18728, sizeBytes: 39681 },
    ],
  },
  {
    title: 'Embedded Message Growth',
    unit: 'ns',
    maxVal: 20500,
    methodology:
      'Growing a nested string field past 16 KiB ahead of 32 trailing Neighbor entries via Opaque splicing vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 2429, highlight: true, baseline: true },
      { name: 'buffa (Protobuf)', val: 4550 },
      { name: 'prost (Protobuf)', val: 5330 },
      { name: 'rmp-serde (MessagePack)', val: 8483 },
      { name: 'serde_json', val: 20092 },
    ],
  },
];

// Python results from omnibuf-py/testdata/benchmarks.json (Python 3.14.5, rustc 1.94.0)
export const pyBenchmarkCategories: BenchmarkCategory[] = [
  {
    title: 'Full Message Encode Speed',
    unit: 'ns',
    maxVal: 6500,
    methodology:
      'Serializing PeerUpdate into fresh bytes across native Rust and C extensions (omnibuf, upb, protobuf-py, msgspec, msgpack, stdlib json).',
    rows: [
      { name: 'google.protobuf (upb)', val: 568, sizeBytes: 341 },
      { name: 'OmniBuf (Generated)', val: 782, sizeBytes: 366, highlight: true, baseline: true },
      { name: 'msgspec', val: 824, sizeBytes: 634 },
      { name: 'OmniBuf (@dataclass)', val: 897, sizeBytes: 366, highlight: true },
      { name: 'protobuf-py', val: 1281, sizeBytes: 341 },
      { name: 'msgpack', val: 2196, sizeBytes: 634 },
      { name: 'json (stdlib)', val: 6276, sizeBytes: 874 },
    ],
  },
  {
    title: 'Full Message Decode Speed',
    unit: 'ns',
    maxVal: 8200,
    methodology:
      'Decoding bytes and reading all 11 fields in Python. Accessing every field forces upb to materialize Python strings and sub-messages out of its C arena.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 2777, highlight: true, baseline: true },
      { name: 'msgspec', val: 2817 },
      { name: 'OmniBuf (@dataclass)', val: 2856, highlight: true },
      { name: 'protobuf-py', val: 4220 },
      { name: 'msgpack', val: 5299 },
      { name: 'google.protobuf (upb)', val: 5982 },
      { name: 'json (stdlib)', val: 8024 },
    ],
  },
  {
    title: 'Read a Single Nested Field',
    unit: 'ns',
    maxVal: 6500,
    methodology: 'OpaquePeerUpdate header-hop lookup vs native C and Rust extension decode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 521, highlight: true, baseline: true },
      { name: 'google.protobuf (upb)', val: 1037 },
      { name: 'msgspec', val: 1571 },
      { name: 'protobuf-py', val: 2845 },
      { name: 'msgpack', val: 3845 },
      { name: 'json (stdlib)', val: 6358 },
    ],
  },
  {
    title: 'Selective Single-Field Mutation',
    unit: 'ns',
    maxVal: 13200,
    methodology:
      'Checking a nested city string and splicing an updated sequence number vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 1312, highlight: true, baseline: true },
      { name: 'google.protobuf (upb)', val: 1783 },
      { name: 'msgspec', val: 2394 },
      { name: 'protobuf-py', val: 4287 },
      { name: 'msgpack', val: 6072 },
      { name: 'json (stdlib)', val: 12995 },
    ],
  },
  {
    title: 'Large Embedded Message Encode',
    unit: 'ns',
    maxVal: 88000,
    methodology:
      'Serializing a 39 KiB packet whose 20 KiB and 18 KiB nested strings trigger 2B-to-4B container header expansion.',
    rows: [
      { name: 'msgspec', val: 2263, sizeBytes: 39516 },
      { name: 'google.protobuf (upb)', val: 2829, sizeBytes: 39227 },
      {
        name: 'OmniBuf (Generated)',
        val: 3644,
        sizeBytes: 39256,
        highlight: true,
        baseline: true,
      },
      { name: 'OmniBuf (@dataclass)', val: 3764, sizeBytes: 39256, highlight: true },
      { name: 'msgpack', val: 3973, sizeBytes: 39516 },
      { name: 'protobuf-py', val: 4334, sizeBytes: 39227 },
      { name: 'json (stdlib)', val: 87019, sizeBytes: 39752 },
    ],
  },
  {
    title: 'Embedded Message Growth',
    unit: 'ns',
    maxVal: 86000,
    methodology:
      'Growing a nested string field past 16 KiB ahead of 32 trailing Neighbor entries via Opaque splicing vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 4606, highlight: true, baseline: true },
      { name: 'google.protobuf (upb)', val: 6120 },
      { name: 'msgspec', val: 9301 },
      { name: 'protobuf-py', val: 19046 },
      { name: 'msgpack', val: 24959 },
      { name: 'json (stdlib)', val: 84737 },
    ],
  },
];

// C++20 results from omnibuf-cpp/testdata/benchmarks.json (Apple Clang 21.0.0 -O3)
export const cppBenchmarkCategories: BenchmarkCategory[] = [
  {
    title: 'Full Message Encode Speed',
    unit: 'ns',
    maxVal: 720,
    methodology:
      'Serializing PeerUpdate into a fresh std::vector<uint8_t> against in-tree LEB128 Protobuf and JSON codecs.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 281, sizeBytes: 366, highlight: true, baseline: true },
      { name: 'Protobuf (LEB128 Wire)', val: 306, sizeBytes: 341 },
      { name: 'OmniBuf (C++ Struct)', val: 348, sizeBytes: 366, highlight: true },
      { name: 'JSON', val: 670, sizeBytes: 803 },
    ],
  },
  {
    title: 'Full Message Decode Speed',
    unit: 'ns',
    maxVal: 1800,
    methodology: 'Decoding into a fresh C++20 PeerUpdate struct and reading all 11 fields.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 654, highlight: true, baseline: true },
      { name: 'Protobuf (LEB128 Wire)', val: 791 },
      { name: 'OmniBuf (C++ Struct)', val: 877, highlight: true },
      { name: 'JSON', val: 1701 },
    ],
  },
  {
    title: 'Read a Single Nested Field',
    unit: 'ns',
    maxVal: 1550,
    methodology:
      'Returning std::string_view into the packet via OpaquePeerUpdate vs full message decode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 120, highlight: true, baseline: true },
      { name: 'Protobuf (LEB128 Wire)', val: 591 },
      { name: 'JSON', val: 1495 },
    ],
  },
  {
    title: 'Selective Single-Field Mutation',
    unit: 'ns',
    maxVal: 2500,
    methodology:
      'Checking a nested city string and splicing an updated sequence counter via OpaquePeerUpdate vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 436, highlight: true, baseline: true },
      { name: 'Protobuf (LEB128 Wire)', val: 960 },
      { name: 'JSON', val: 2375 },
    ],
  },
  {
    title: 'Large Embedded Message Encode',
    unit: 'ns',
    maxVal: 55000,
    methodology:
      'Serializing a 39 KiB packet whose >16 KiB nested sub-messages trigger 2B-to-4B header expansion vs Protobuf two-pass sizing.',
    rows: [
      { name: 'Protobuf (LEB128 Wire)', val: 4203, sizeBytes: 39227 },
      {
        name: 'OmniBuf (Generated)',
        val: 5240,
        sizeBytes: 39256,
        highlight: true,
        baseline: true,
      },
      { name: 'OmniBuf (C++ Struct)', val: 5327, sizeBytes: 39256, highlight: true },
      { name: 'JSON', val: 53581, sizeBytes: 39681 },
    ],
  },
  {
    title: 'Embedded Message Growth',
    unit: 'ns',
    maxVal: 38000,
    methodology:
      'Growing a nested string field past 16 KiB ahead of 32 trailing Neighbor entries via Opaque splicing vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 3640, highlight: true, baseline: true },
      { name: 'Protobuf (LEB128 Wire)', val: 5967 },
      { name: 'JSON', val: 36900 },
    ],
  },
];

// Java 21 results from omnibuf-java/testdata/benchmarks.json (OpenJDK 21.0.13)
export const javaBenchmarkCategories: BenchmarkCategory[] = [
  {
    title: 'Full Message Encode Speed',
    unit: 'ns',
    maxVal: 2600,
    methodology:
      'Serializing PeerUpdate into a fresh byte[] across generated OmniBuf, protobuf-java, FlatBuffers, and Jackson.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 343, sizeBytes: 366, highlight: true, baseline: true },
      { name: 'Protobuf (protobuf-java)', val: 347, sizeBytes: 341 },
      { name: 'OmniBuf (@OmniBufField)', val: 627, sizeBytes: 366, highlight: true },
      { name: 'FlatBuffers', val: 1030, sizeBytes: 600 },
      { name: 'OmniBuf (Protobuf)', val: 1361, sizeBytes: 366, highlight: true },
      { name: 'JSON (Jackson)', val: 1784, sizeBytes: 803 },
      { name: 'MessagePack (Jackson)', val: 2508, sizeBytes: 626 },
    ],
  },
  {
    title: 'Full Message Decode Speed',
    unit: 'ns',
    maxVal: 4800,
    methodology: 'Decoding byte[] into a fresh PeerUpdate object and reading all 11 fields.',
    rows: [
      { name: 'FlatBuffers', val: 1034 },
      { name: 'OmniBuf (Generated)', val: 1110, highlight: true, baseline: true },
      { name: 'OmniBuf (@OmniBufField)', val: 1114, highlight: true },
      { name: 'Protobuf (protobuf-java)', val: 1578 },
      { name: 'OmniBuf (Protobuf)', val: 2831, highlight: true },
      { name: 'JSON (Jackson)', val: 3087 },
      { name: 'MessagePack (Jackson)', val: 4614 },
    ],
  },
  {
    title: 'Read a Single Nested Field',
    unit: 'ns',
    maxVal: 4300,
    methodology:
      'Reading a nested city string via FlatBuffers vtables or OpaquePeerUpdate vs full decode.',
    rows: [
      { name: 'FlatBuffers', val: 23 },
      { name: 'OmniBuf (Generated)', val: 106, highlight: true, baseline: true },
      { name: 'Protobuf (protobuf-java)', val: 1085 },
      { name: 'JSON (Jackson)', val: 2569 },
      { name: 'MessagePack (Jackson)', val: 4151 },
    ],
  },
  {
    title: 'Selective Single-Field Mutation',
    unit: 'ns',
    maxVal: 7000,
    methodology:
      'Checking a nested city string and splicing an updated sequence counter via OpaquePeerUpdate vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 314, highlight: true, baseline: true },
      { name: 'FlatBuffers', val: 1479 },
      { name: 'Protobuf (protobuf-java)', val: 1499 },
      { name: 'JSON (Jackson)', val: 4443 },
      { name: 'MessagePack (Jackson)', val: 6832 },
    ],
  },
  {
    title: 'Large Embedded Message Encode',
    unit: 'ns',
    maxVal: 120000,
    methodology:
      'Serializing a 39 KiB packet with >16 KiB nested strings. Immutable protobuf-java reuses cached ByteString UTF-8 bytes and memoizedSerializedSize.',
    rows: [
      { name: 'Protobuf (protobuf-java)', val: 4569, sizeBytes: 39227 },
      {
        name: 'OmniBuf (Generated)',
        val: 8634,
        sizeBytes: 39256,
        highlight: true,
        baseline: true,
      },
      { name: 'OmniBuf (@OmniBufField)', val: 8990, sizeBytes: 39256, highlight: true },
      { name: 'OmniBuf (Protobuf)', val: 10158, sizeBytes: 39256, highlight: true },
      { name: 'JSON (Jackson)', val: 64010, sizeBytes: 39681 },
      { name: 'FlatBuffers', val: 77469, sizeBytes: 39488 },
      { name: 'MessagePack (Jackson)', val: 118690, sizeBytes: 39508 },
    ],
  },
  {
    title: 'Embedded Message Growth',
    unit: 'ns',
    maxVal: 92000,
    methodology:
      'Growing a nested string field past 16 KiB ahead of 32 trailing Neighbor entries via Opaque splicing vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 4774, highlight: true, baseline: true },
      { name: 'Protobuf (protobuf-java)', val: 25025 },
      { name: 'FlatBuffers', val: 46960 },
      { name: 'JSON (Jackson)', val: 51229 },
      { name: 'MessagePack (Jackson)', val: 90798 },
    ],
  },
];

// C# results from omnibuf-cs/testdata/benchmarks.json (.NET 8.0.29)
export const csBenchmarkCategories: BenchmarkCategory[] = [
  {
    title: 'Full Message Encode Speed',
    unit: 'ns',
    maxVal: 1200,
    methodology: 'Serializing PeerUpdate into a fresh byte[] on .NET 8 RyuJIT.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 308, sizeBytes: 366, highlight: true, baseline: true },
      { name: 'OmniBuf ([OmniBufField])', val: 478, sizeBytes: 366, highlight: true },
      { name: 'MessagePack-CSharp', val: 607, sizeBytes: 626 },
      { name: 'Google.Protobuf', val: 655, sizeBytes: 341 },
      { name: 'System.Text.Json', val: 1122, sizeBytes: 803 },
    ],
  },
  {
    title: 'Full Message Decode Speed',
    unit: 'ns',
    maxVal: 3400,
    methodology:
      'Decoding ReadOnlySpan<byte> into a fresh PeerUpdate instance and reading all 11 fields.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 743, highlight: true, baseline: true },
      { name: 'OmniBuf ([OmniBufField])', val: 896, highlight: true },
      { name: 'Google.Protobuf', val: 900 },
      { name: 'MessagePack-CSharp', val: 1300 },
      { name: 'System.Text.Json', val: 3279 },
    ],
  },
  {
    title: 'Read a Single Nested Field',
    unit: 'ns',
    maxVal: 3300,
    methodology: 'Reading a nested city string via OpaquePeerUpdate vs full message decode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 144, highlight: true, baseline: true },
      { name: 'Google.Protobuf', val: 820 },
      { name: 'MessagePack-CSharp', val: 1200 },
      { name: 'System.Text.Json', val: 3169 },
    ],
  },
  {
    title: 'Selective Single-Field Mutation',
    unit: 'ns',
    maxVal: 4500,
    methodology:
      'Checking a nested city string and splicing an updated sequence counter via OpaquePeerUpdate vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 365, highlight: true, baseline: true },
      { name: 'Google.Protobuf', val: 1499 },
      { name: 'MessagePack-CSharp', val: 1845 },
      { name: 'System.Text.Json', val: 4370 },
    ],
  },
  {
    title: 'Large Embedded Message Encode',
    unit: 'ns',
    maxVal: 27500,
    methodology:
      'Serializing a 39 KiB packet whose >16 KiB nested sub-messages trigger 2B-to-4B header expansion.',
    rows: [
      { name: 'MessagePack-CSharp', val: 6186, sizeBytes: 39508 },
      {
        name: 'OmniBuf (Generated)',
        val: 6649,
        sizeBytes: 39256,
        highlight: true,
        baseline: true,
      },
      { name: 'OmniBuf ([OmniBufField])', val: 6946, sizeBytes: 39256, highlight: true },
      { name: 'System.Text.Json', val: 9047, sizeBytes: 39681 },
      { name: 'Google.Protobuf', val: 26575, sizeBytes: 39227 },
    ],
  },
  {
    title: 'Embedded Message Growth',
    unit: 'ns',
    maxVal: 21500,
    methodology:
      'Growing a nested string field past 16 KiB ahead of 32 trailing Neighbor entries via Opaque splicing vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 6629, highlight: true, baseline: true },
      { name: 'MessagePack-CSharp', val: 9000 },
      { name: 'Google.Protobuf', val: 19480 },
      { name: 'System.Text.Json', val: 20479 },
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
      'In our Go benchmarks, OmniBuf runs <strong>6.0x faster on encode and 5.2x faster on decode</strong> than standard Go Protobuf under equal struct reuse. Growing an embedded sub-message past 16 KiB runs <strong>7.8x faster</strong> via <code>Opaque</code> splicing, and against <code>encoding/json</code> on plain Go structs OmniBuf is <strong>over 17x faster</strong> at half the byte size. Read <a href="/how-it-works" class="doc-link">how the wire format works</a> or check the <a href="/spec" class="doc-link">wire specification</a>.',
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
      'M1 Pro MacBook Pro, Go 1.27.1 (<code>GOEXPERIMENT=jsonv2</code>), <code>-benchtime=250ms -count=5 -cpu=1</code>. Every decode benchmark reads all 11 fields into a non-inlined checksum sink and reuses the destination struct across codecs, including Protobuf.',
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
      'In TypeScript and JavaScript on Node.js v24, <code>@omnibuf/core</code> encodes <strong>2.5x faster</strong> and decodes <strong>3.1x faster</strong> than <code>@bufbuild/protobuf</code> (<code>protobuf-es</code>), reads a nested field <strong>10.2x faster</strong>, and splices targeted updates <strong>2.2x faster</strong>. Against native <code>JSON.stringify</code> and <code>JSON.parse</code>, it runs nearly <strong>2x faster</strong> at less than half the byte size. Read <a href="/how-it-works" class="doc-link">how the wire format works</a> or check the <a href="/spec" class="doc-link">wire specification</a>.',
    categories: esBenchmarkCategories,
    butterflyEncodeRows: esEncodeCat?.rows ?? [],
    butterflyDecodeRows: esDecodeCat?.rows ?? [],
    hardwareLines: [
      'CPU: Apple M1 Pro (darwin/arm64)',
      'Runtime: Node.js v24.22.1 (V8)',
      'Command: pnpm run bench',
    ],
    environmentParagraphs: [
      'Measured on an Apple M1 Pro Mac using Node.js v24.22.1. Every decode benchmark reads all 11 fields of the <code>PeerUpdate</code> message, and every mutation benchmark checks <code>location.city</code> before incrementing <code>sequence</code> from the input packet.',
      'Benchmark source is in <a href="https://github.com/omnibuf/omnibuf-es/blob/main/benchmarks/bench.ts" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">benchmarks/bench.ts</a> in the <code>omnibuf-es</code> repository (<code>pnpm run bench</code>), with recorded output in <a href="https://github.com/omnibuf/omnibuf-es/blob/main/testdata/benchmarks.json" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">testdata/benchmarks.json</a>.',
    ],
  },
  rs: {
    key: 'rs',
    label: 'Rust',
    shortLabel: 'Rust',
    headingPrefix: 'Rust',
    subtitleHtml:
      '11-field <code>PeerUpdate</code> struct on Apple M1 Pro (<code>rustc 1.94.0</code>) across <code>omnibuf</code>, <code>buffa</code>, <code>prost</code>, <code>rmp-serde</code>, and <code>serde_json</code>. <strong>Shorter bars = Faster.</strong>',
    href: '/rs#benchmarks',
    ctaLabel: 'See full results',
    competitorsLabel: 'buffa, prost, rmp-serde, serde_json',
    heroSummaryHtml:
      'In Rust (<code>rustc 1.94.0</code>), <code>omnibuf</code> encodes and decodes ahead of both <code>buffa</code> and <code>prost</code> on canonical 11-field allocations. Zero-copy <code>Opaque</code> views borrow nested <code>&amp;str</code> fields <strong>5.3x faster</strong> than <code>buffa</code>&apos;s <code>PeerUpdateView</code> (<strong>9.6x faster</strong> than <code>prost</code>) and splice single-field updates <strong>3.6x to 4.7x faster</strong>, while two-pass <code>encoded_len()</code> pre-sizing keeps <code>buffa</code> and <code>prost</code> ahead when encoding fresh &gt;16 KiB nested messages. Check the <a href="/rs" class="doc-link">Rust guide</a>.',
    categories: rsBenchmarkCategories,
    butterflyEncodeRows: primaryAndCompetitors(rsEncodeCat.rows),
    butterflyDecodeRows: primaryAndCompetitors(rsDecodeCat.rows),
    hardwareLines: [
      'CPU: Apple M1 Pro (darwin/arm64)',
      'Compiler: rustc 1.94.0 (--release)',
      'Command: just bench',
    ],
    environmentParagraphs: [
      'Compiled with <code>rustc 1.94.0</code> in release mode on an Apple M1 Pro Mac. Encode benchmarks start from identical <code>Vec::with_capacity(128)</code> buffers, and decode benchmarks read all 11 fields into a <code>black_box</code> checksum sink.',
      'Benchmark source lives in <a href="https://github.com/omnibuf/omnibuf-rs/blob/main/crates/omnibuf-bench/src/main.rs" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">crates/omnibuf-bench/src/main.rs</a>, with recorded output in <a href="https://github.com/omnibuf/omnibuf-rs/blob/main/testdata/benchmarks.json" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">testdata/benchmarks.json</a>.',
    ],
  },
  py: {
    key: 'py',
    label: 'Python',
    shortLabel: 'Python',
    headingPrefix: 'Python',
    subtitleHtml:
      '11-field <code>PeerUpdate</code> workload on Python 3.14.5 across <code>omnibuf</code> (compiled Rust extension), <code>protobuf-py</code>, <code>upb</code>, <code>msgspec</code>, <code>msgpack</code>, and stdlib <code>json</code>. <strong>Shorter bars = Faster.</strong>',
    href: '/py#benchmarks',
    ctaLabel: 'See full results',
    competitorsLabel: 'protobuf-py (Rust), upb (C), msgspec (C), msgpack (C), json (C)',
    heroSummaryHtml:
      'In Python 3.14, <code>omnibuf</code> (backed by a compiled Rust extension) decodes and materializes all 11 Python fields <strong>2.2x faster</strong> than Google&apos;s C <code>upb</code> backend and <strong>1.5x faster</strong> than <code>protobuf-py</code>, edging out C <code>msgspec</code> while <code>upb</code> keeps the lead on raw C-arena encode. On <code>Opaque</code> views, nested field lookup beats <code>upb</code> by <strong>2.0x</strong> and single-field splicing wins by <strong>1.4x</strong> (<strong>3.3x</strong> vs <code>protobuf-py</code>). See the <a href="/py" class="doc-link">Python guide</a>.',
    categories: pyBenchmarkCategories,
    butterflyEncodeRows: primaryAndCompetitors(pyEncodeCat.rows),
    butterflyDecodeRows: primaryAndCompetitors(pyDecodeCat.rows),
    hardwareLines: [
      'CPU: Apple M1 Pro (darwin/arm64)',
      'Runtime: Python 3.14.5 + rustc 1.94.0',
      'Command: just bench',
    ],
    environmentParagraphs: [
      'Measured on CPython 3.14.5 on an Apple M1 Pro Mac. Every serializer in this chart runs compiled native code: <code>omnibuf</code> (Rust), <code>protobuf-py</code> (Rust), Google <code>upb</code> (C), <code>msgspec</code> (C), <code>msgpack</code> (C), and stdlib <code>json</code> (C). Full decode reads all 11 fields in Python so lazy C-arena wrappers pay the same Python string and sub-message allocation work as eager dataclasses.',
      'Benchmark source lives in <a href="https://github.com/omnibuf/omnibuf-py/blob/main/benchmarks/bench.py" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">benchmarks/bench.py</a>, with recorded output in <a href="https://github.com/omnibuf/omnibuf-py/blob/main/testdata/benchmarks.json" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">testdata/benchmarks.json</a>.',
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
      'In C++20 (Apple Clang 21 <code>-O3</code>), generated OmniBuf headers encode and decode ahead of LEB128 Protobuf wire encoding on the canonical <code>PeerUpdate</code> struct, while Protobuf&apos;s two-pass sizing leads when encoding fresh &gt;16 KiB nested sub-messages. <code>Opaque</code> views read nested <code>std::string_view</code> slices <strong>4.9x faster</strong>, splice scalar updates <strong>2.2x faster</strong>, and grow embedded messages <strong>1.6x faster</strong>. See the <a href="/cpp" class="doc-link">C++20 guide</a>.',
    categories: cppBenchmarkCategories,
    butterflyEncodeRows: primaryAndCompetitors(cppEncodeCat.rows),
    butterflyDecodeRows: primaryAndCompetitors(cppDecodeCat.rows),
    hardwareLines: [
      'CPU: Apple M1 Pro (darwin/arm64)',
      'Compiler: Apple Clang 21.0.0 (-O3, C++20)',
      'Command: just bench',
    ],
    environmentParagraphs: [
      'Compiled with Apple Clang 21.0.0 (<code>-O3 -DNDEBUG -std=c++20</code>) on an Apple M1 Pro Mac. Zero-dependency <code>omnibuf-cpp</code> headers are benchmarked against in-tree LEB128 Protobuf wire and JSON codecs operating on the exact same <code>PeerUpdate</code> struct, UTF-8 validation rules, and 11-field checksum sink.',
      'Benchmark source lives in <a href="https://github.com/omnibuf/omnibuf-cpp/blob/main/benchmarks/peer_bench.cpp" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">benchmarks/peer_bench.cpp</a>, with recorded output in <a href="https://github.com/omnibuf/omnibuf-cpp/blob/main/testdata/benchmarks.json" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">testdata/benchmarks.json</a>.',
    ],
  },
  java: {
    key: 'java',
    label: 'Java',
    shortLabel: 'Java',
    headingPrefix: 'Java 21',
    subtitleHtml:
      '11-field <code>PeerUpdate</code> workload on OpenJDK 21.0.13 (C2 JIT) across <code>com.omnibuf</code>, <code>protobuf-java</code>, <code>FlatBuffers</code>, Jackson JSON, and Jackson MessagePack. <strong>Shorter bars = Faster.</strong>',
    href: '/java#benchmarks',
    ctaLabel: 'See full results',
    competitorsLabel: 'protobuf-java, FlatBuffers, Jackson JSON, Jackson MsgPack',
    heroSummaryHtml:
      'On OpenJDK 21, generated OmniBuf classes match <code>protobuf-java</code> on canonical encode while decoding <strong>1.4x faster</strong>, reading a nested string field <strong>10.2x faster</strong>, splicing single-field updates <strong>4.8x faster</strong>, and growing embedded messages past 16 KiB <strong>5.2x faster</strong>. Against Jackson JSON, OmniBuf encodes <strong>5.2x faster</strong>. See the <a href="/java" class="doc-link">Java guide</a>.',
    categories: javaBenchmarkCategories,
    butterflyEncodeRows: primaryAndCompetitors(javaEncodeCat.rows),
    butterflyDecodeRows: primaryAndCompetitors(javaDecodeCat.rows),
    hardwareLines: [
      'CPU: Apple M1 Pro (darwin/arm64)',
      'Runtime: OpenJDK 21.0.13 (Temurin C2)',
      'Command: just bench',
    ],
    environmentParagraphs: [
      'Measured on Eclipse Temurin OpenJDK 21.0.13 after C2 JIT warmup on an Apple M1 Pro Mac. Every decode benchmark reads all 11 fields into a volatile checksum sink. Immutable <code>protobuf-java</code> instances cache UTF-8 <code>ByteString</code> slices and <code>memoizedSerializedSize</code> after the first pass, giving it an advantage on repeated encodes of unchanged 39 KiB messages.',
      'Benchmark source lives in <a href="https://github.com/omnibuf/omnibuf-java/blob/main/src/test/java/com/omnibuf/bench/BenchmarkMain.java" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">BenchmarkMain.java</a>, with recorded output in <a href="https://github.com/omnibuf/omnibuf-java/blob/main/testdata/benchmarks.json" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">testdata/benchmarks.json</a>.',
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
      'On .NET 8 RyuJIT, generated OmniBuf classes encode <strong>2.1x faster</strong> than <code>Google.Protobuf</code> and <strong>2.0x faster</strong> than <code>MessagePack-CSharp</code>, while decoding <strong>1.2x faster</strong> than <code>Google.Protobuf</code> and <strong>4.4x faster</strong> than <code>System.Text.Json</code>. Targeted <code>Opaque</code> splicing runs <strong>4.1x faster</strong> than <code>Google.Protobuf</code> and grows &gt;16 KiB sub-messages <strong>2.9x faster</strong>. See the <a href="/cs" class="doc-link">C# guide</a>.',
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
      'Benchmark source lives in <a href="https://github.com/omnibuf/omnibuf-cs/blob/main/src/OmniBuf.Benchmarks/Program.cs" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">src/OmniBuf.Benchmarks/Program.cs</a>, with recorded output in <a href="https://github.com/omnibuf/omnibuf-cs/blob/main/testdata/benchmarks.json" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">testdata/benchmarks.json</a>.',
    ],
  },
};

export const languageBenchmarkList: LanguageBenchmarkSuite[] = [
  languageBenchmarks.go,
  languageBenchmarks.es,
  languageBenchmarks.rs,
  languageBenchmarks.py,
  languageBenchmarks.cpp,
  languageBenchmarks.cs,
  languageBenchmarks.java,
];
