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
      { name: 'OmniBuf (Generated)', val: 104, highlight: true, baseline: true },
      { name: 'OmniBuf (Go Struct Tags)', val: 346, highlight: true },
      { name: 'Avro (Raw Binary)', val: 414 },
      { name: 'Protobuf', val: 557 },
      { name: 'FlatBuffers', val: 560 },
      { name: "Cap'n Proto", val: 1020 },
      { name: 'MessagePack', val: 1592 },
      { name: 'JSON (encoding/json/v2)', val: 1686 },
      { name: 'JSON (encoding/json)', val: 1690 },
    ],
  },
  {
    title: 'Full Message Decode Speed',
    unit: 'ns',
    maxVal: 4600,
    methodology:
      'Unpacking and reading all 11 fields into a reused destination struct across every codec, including Protobuf.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 184, highlight: true, baseline: true },
      { name: 'FlatBuffers', val: 193 },
      { name: 'OmniBuf (Go Struct Tags)', val: 360, highlight: true },
      { name: 'Avro (Raw Binary)', val: 409 },
      { name: "Cap'n Proto", val: 769 },
      { name: 'Protobuf', val: 955 },
      { name: 'MessagePack', val: 2183 },
      { name: 'JSON (encoding/json/v2)', val: 2733 },
      { name: 'JSON (encoding/json)', val: 3445 },
    ],
  },
  {
    title: 'Read a Single Nested Field',
    unit: 'ns',
    maxVal: 1350,
    methodology:
      "Reading a nested string field directly from the raw byte slice. Cap'n Proto and FlatBuffers use offset tables; OmniBuf hops over preceding field headers by length.",
    rows: [
      { name: "Cap'n Proto", val: 5 },
      { name: 'FlatBuffers', val: 27 },
      { name: 'OmniBuf', val: 85, highlight: true, baseline: true },
      { name: 'Avro (Raw Binary)', val: 472 },
      { name: 'MessagePack', val: 601 },
      { name: 'Protobuf', val: 995 },
    ],
  },
  {
    title: 'Selective Single-Field Mutation',
    unit: 'ns',
    maxVal: 7000,
    methodology:
      'Checking a nested city string, incrementing the 64-bit sequence counter, and returning the updated packet. OmniBuf splices the field in place; the others decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Opaque Splice)', val: 219, highlight: true, baseline: true },
      { name: 'FlatBuffers', val: 767 },
      { name: 'Avro (Raw Binary)', val: 855 },
      { name: 'Protobuf', val: 1596 },
      { name: "Cap'n Proto", val: 1882 },
      { name: 'MessagePack', val: 3967 },
      { name: 'JSON (encoding/json/v2)', val: 4501 },
      { name: 'JSON (encoding/json)', val: 5412 },
    ],
  },
  {
    title: 'Large Embedded Message Encode',
    unit: 'ns',
    maxVal: 42000,
    methodology:
      'Serializing a 39 KiB packet whose 20 KiB and 18 KiB nested sub-messages exceed the 2-byte 16,383 B length reservation and trigger 2B-to-4B header shifts.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 650, highlight: true, baseline: true },
      { name: 'FlatBuffers', val: 1079 },
      { name: 'Protobuf', val: 1697 },
      { name: 'OmniBuf (Go Struct Tags)', val: 1698, highlight: true },
      { name: 'Avro (Raw Binary)', val: 6572 },
      { name: "Cap'n Proto", val: 7688 },
      { name: 'MessagePack', val: 11973 },
      { name: 'JSON (encoding/json/v2)', val: 31618 },
      { name: 'JSON (encoding/json)', val: 32753 },
    ],
  },
  {
    title: 'Embedded Message Growth',
    unit: 'ns',
    maxVal: 48000,
    methodology:
      'Growing a nested string field past 16 KiB ahead of 32 trailing Neighbor entries via Opaque splicing vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Opaque Splice)', val: 861, highlight: true, baseline: true },
      { name: 'FlatBuffers', val: 2981 },
      { name: 'Avro (Raw Binary)', val: 5689 },
      { name: 'Protobuf', val: 6905 },
      { name: "Cap'n Proto", val: 8441 },
      { name: 'MessagePack', val: 23410 },
      { name: 'JSON (encoding/json/v2)', val: 32940 },
      { name: 'JSON (encoding/json)', val: 35446 },
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
      { name: 'protobufjs', val: 1256, ops: '601,356 ops/s', sizeBytes: 341 },
      { name: 'JSON', val: 1789, ops: '410,052 ops/s', sizeBytes: 791 },
      {
        name: '@bufbuild/protobuf (protobuf-es)',
        val: 3065,
        ops: '326,303 ops/s',
        sizeBytes: 341,
      },
      { name: '@msgpack/msgpack', val: 3297, ops: '218,175 ops/s', sizeBytes: 622 },
      { name: 'google-protobuf', val: 4578, ops: '151,089 ops/s', sizeBytes: 341 },
    ],
  },
  {
    title: 'Full Message Decode Speed',
    unit: 'ns',
    maxVal: 4500,
    methodology: 'Decoding Uint8Array into a fresh PeerUpdate object and reading all 11 fields.',
    rows: [
      { name: 'OmniBuf', val: 954, ops: '722,273 ops/s', highlight: true, baseline: true },
      { name: 'protobufjs', val: 1901, ops: '392,432 ops/s' },
      { name: 'JSON', val: 1969, ops: '377,826 ops/s' },
      { name: 'google-protobuf', val: 2866, ops: '276,952 ops/s' },
      { name: '@msgpack/msgpack', val: 2963, ops: '260,973 ops/s' },
      { name: '@bufbuild/protobuf (protobuf-es)', val: 3240, ops: '233,604 ops/s' },
    ],
  },
  {
    title: 'Read a Single Nested Field',
    unit: 'ns',
    maxVal: 4200,
    methodology:
      'Reading a nested city string from a Uint8Array. The other JS libraries decode the whole message first; OmniBuf skips earlier fields by byte length.',
    rows: [
      { name: 'OmniBuf', val: 298, ops: '2,507,169 ops/s', highlight: true, baseline: true },
      { name: 'protobufjs', val: 1167, ops: '645,519 ops/s' },
      { name: 'JSON', val: 1751, ops: '435,596 ops/s' },
      { name: 'google-protobuf', val: 2527, ops: '301,279 ops/s' },
      { name: '@msgpack/msgpack', val: 2774, ops: '276,825 ops/s' },
      { name: '@bufbuild/protobuf (protobuf-es)', val: 2945, ops: '246,330 ops/s' },
    ],
  },
  {
    title: 'Selective Single-Field Mutation',
    unit: 'ns',
    maxVal: 10000,
    methodology:
      'Checking a nested city string, incrementing the sequence number from the packet, and returning an updated Uint8Array.',
    rows: [
      { name: 'OmniBuf', val: 2921, ops: '296,102 ops/s', highlight: true, baseline: true },
      { name: 'protobufjs', val: 3120, ops: '247,240 ops/s' },
      { name: 'JSON', val: 3609, ops: '206,891 ops/s' },
      { name: '@bufbuild/protobuf (protobuf-es)', val: 5219, ops: '136,979 ops/s' },
      { name: '@msgpack/msgpack', val: 6092, ops: '123,926 ops/s' },
      { name: 'google-protobuf', val: 7067, ops: '101,888 ops/s' },
    ],
  },
  {
    title: 'Large Embedded Message Encode',
    unit: 'ns',
    maxVal: 120000,
    methodology:
      'Serializing a 39 KiB packet whose 20 KiB and 18 KiB nested messages exceed the 2-byte 16,383 B length reservation.',
    rows: [
      { name: 'protobufjs', val: 16692, ops: '44,716 ops/s', sizeBytes: 39227 },
      { name: 'google-protobuf', val: 19305, ops: '41,980 ops/s', sizeBytes: 39227 },
      { name: 'JSON', val: 25417, ops: '28,562 ops/s', sizeBytes: 39669 },
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
      { name: '@msgpack/msgpack', val: 88928, ops: '8,408 ops/s', sizeBytes: 39504 },
    ],
  },
  {
    title: 'Embedded Message Growth',
    unit: 'ns',
    maxVal: 110000,
    methodology:
      'Growing a nested string field past 16 KiB ahead of 32 trailing Neighbor entries and emitting an updated Uint8Array.',
    rows: [
      { name: 'OmniBuf', val: 19338, ops: '43,405 ops/s', highlight: true, baseline: true },
      { name: 'protobufjs', val: 22411, ops: '34,150 ops/s' },
      { name: 'JSON', val: 25767, ops: '28,106 ops/s' },
      { name: '@bufbuild/protobuf (protobuf-es)', val: 27968, ops: '26,888 ops/s' },
      { name: 'google-protobuf', val: 31845, ops: '23,811 ops/s' },
      { name: '@msgpack/msgpack', val: 79295, ops: '9,409 ops/s' },
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
      { name: 'OmniBuf (Generated)', val: 139, sizeBytes: 366, highlight: true, baseline: true },
      { name: 'OmniBuf (#[derive(OmniBuf)])', val: 139, sizeBytes: 366, highlight: true },
      { name: 'buffa (Protobuf)', val: 200, sizeBytes: 341 },
      { name: 'prost (Protobuf)', val: 227, sizeBytes: 341 },
      { name: 'rmp-serde (MessagePack)', val: 628, sizeBytes: 626 },
      { name: 'serde_json', val: 783, sizeBytes: 803 },
    ],
  },
  {
    title: 'Full Message Decode Speed',
    unit: 'ns',
    maxVal: 1750,
    methodology: 'Decoding &[u8] into a fresh owned PeerUpdate struct and reading all 11 fields.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 425, highlight: true, baseline: true },
      { name: 'OmniBuf (#[derive(OmniBuf)])', val: 433, highlight: true },
      { name: 'buffa (Protobuf)', val: 525 },
      { name: 'prost (Protobuf)', val: 666 },
      { name: 'rmp-serde (MessagePack)', val: 862 },
      { name: 'serde_json', val: 1311 },
    ],
  },
  {
    title: 'Read a Single Nested Field',
    unit: 'ns',
    maxVal: 1750,
    methodology:
      'Borrowing a nested &str directly from &[u8] via OpaquePeerUpdate vs buffa PeerUpdateView vs full decode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 77, highlight: true, baseline: true },
      { name: 'buffa (Protobuf)', val: 366 },
      { name: 'prost (Protobuf)', val: 653 },
      { name: 'rmp-serde (MessagePack)', val: 853 },
      { name: 'serde_json', val: 1270 },
    ],
  },
  {
    title: 'Selective Single-Field Mutation',
    unit: 'ns',
    maxVal: 2900,
    methodology:
      'Checking a nested city string and splicing an incremented 64-bit sequence counter into &[u8] vs decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 232, highlight: true, baseline: true },
      { name: 'buffa (Protobuf)', val: 725 },
      { name: 'prost (Protobuf)', val: 937 },
      { name: 'rmp-serde (MessagePack)', val: 1588 },
      { name: 'serde_json', val: 2151 },
    ],
  },
  {
    title: 'Large Embedded Message Encode',
    unit: 'ns',
    maxVal: 19000,
    methodology:
      'Serializing a 39 KiB packet whose >16 KiB nested sub-messages trigger 4-byte container length pre-sizing vs two-pass encoded_len() in buffa and prost.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 849, sizeBytes: 39256, highlight: true, baseline: true },
      { name: 'buffa (Protobuf)', val: 924, sizeBytes: 39227 },
      { name: 'prost (Protobuf)', val: 975, sizeBytes: 39227 },
      { name: 'OmniBuf (#[derive(OmniBuf)])', val: 1049, sizeBytes: 39256, highlight: true },
      { name: 'rmp-serde (MessagePack)', val: 1763, sizeBytes: 39508 },
      { name: 'serde_json', val: 14324, sizeBytes: 39681 },
    ],
  },
  {
    title: 'Embedded Message Growth',
    unit: 'ns',
    maxVal: 20500,
    methodology:
      'Growing a nested string field past 16 KiB ahead of 32 trailing Neighbor entries via Opaque splicing vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 1574, highlight: true, baseline: true },
      { name: 'buffa (Protobuf)', val: 3679 },
      { name: 'prost (Protobuf)', val: 4134 },
      { name: 'rmp-serde (MessagePack)', val: 6487 },
      { name: 'serde_json', val: 15498 },
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
      { name: 'OmniBuf (Generated)', val: 411, sizeBytes: 366, highlight: true, baseline: true },
      { name: 'OmniBuf (@dataclass)', val: 418, sizeBytes: 366, highlight: true },
      { name: 'google.protobuf (upb)', val: 432, sizeBytes: 341 },
      { name: 'msgspec', val: 625, sizeBytes: 634 },
      { name: 'protobuf-py', val: 931, sizeBytes: 341 },
      { name: 'msgpack', val: 1699, sizeBytes: 634 },
      { name: 'json (stdlib)', val: 4859, sizeBytes: 874 },
    ],
  },
  {
    title: 'Full Message Decode Speed',
    unit: 'ns',
    maxVal: 8200,
    methodology:
      'Decoding bytes and reading all 11 fields in Python. Accessing every field forces upb to materialize Python strings and sub-messages out of its C arena.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 1942, highlight: true, baseline: true },
      { name: 'OmniBuf (@dataclass)', val: 1949, highlight: true },
      { name: 'msgspec', val: 2106 },
      { name: 'protobuf-py', val: 3348 },
      { name: 'msgpack', val: 3917 },
      { name: 'google.protobuf (upb)', val: 4518 },
      { name: 'json (stdlib)', val: 6193 },
    ],
  },
  {
    title: 'Read a Single Nested Field',
    unit: 'ns',
    maxVal: 6500,
    methodology: 'OpaquePeerUpdate header-hop lookup vs native C and Rust extension decode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 502, highlight: true, baseline: true },
      { name: 'google.protobuf (upb)', val: 783 },
      { name: 'msgspec', val: 1159 },
      { name: 'protobuf-py', val: 2165 },
      { name: 'msgpack', val: 2928 },
      { name: 'json (stdlib)', val: 4828 },
    ],
  },
  {
    title: 'Selective Single-Field Mutation',
    unit: 'ns',
    maxVal: 13200,
    methodology:
      'Checking a nested city string and splicing an updated sequence number vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 808, highlight: true, baseline: true },
      { name: 'google.protobuf (upb)', val: 1356 },
      { name: 'msgspec', val: 1826 },
      { name: 'protobuf-py', val: 3230 },
      { name: 'msgpack', val: 4529 },
      { name: 'json (stdlib)', val: 9857 },
    ],
  },
  {
    title: 'Large Embedded Message Encode',
    unit: 'ns',
    maxVal: 88000,
    methodology:
      'Serializing a 39 KiB packet whose 20 KiB and 18 KiB nested strings trigger 4-byte container length pre-sizing.',
    rows: [
      { name: 'msgspec', val: 1946, sizeBytes: 39516 },
      { name: 'OmniBuf (@dataclass)', val: 2040, sizeBytes: 39256, highlight: true },
      { name: 'OmniBuf (Generated)', val: 2138, sizeBytes: 39256, highlight: true, baseline: true },
      { name: 'google.protobuf (upb)', val: 2230, sizeBytes: 39227 },
      { name: 'protobuf-py', val: 3162, sizeBytes: 39227 },
      { name: 'msgpack', val: 3286, sizeBytes: 39516 },
      { name: 'json (stdlib)', val: 67099, sizeBytes: 39752 },
    ],
  },
  {
    title: 'Embedded Message Growth',
    unit: 'ns',
    maxVal: 85000,
    methodology:
      'Growing a nested string field past 16 KiB ahead of 32 trailing Neighbor entries via Opaque splicing vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 2768, highlight: true, baseline: true },
      { name: 'google.protobuf (upb)', val: 4409 },
      { name: 'msgspec', val: 7074 },
      { name: 'protobuf-py', val: 13707 },
      { name: 'msgpack', val: 18675 },
      { name: 'json (stdlib)', val: 64558 },
    ],
  },
];

// C++20 results from omnibuf-cpp/testdata/benchmarks.json (Apple Clang 21.0.0 -O3, libprotobuf 36.2)
export const cppBenchmarkCategories: BenchmarkCategory[] = [
  {
    title: 'Full Message Encode Speed',
    unit: 'ns',
    maxVal: 650,
    methodology:
      'Serializing PeerUpdate into a fresh std::vector<uint8_t> against official libprotobuf (C++), an in-tree LEB128 wire codec, and JSON.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 204, sizeBytes: 366, highlight: true, baseline: true },
      { name: 'OmniBuf (C++ Struct)', val: 205, sizeBytes: 366, highlight: true },
      { name: 'Protobuf (LEB128 Wire)', val: 213, sizeBytes: 341 },
      { name: 'Protobuf (libprotobuf)', val: 249, sizeBytes: 341 },
      { name: 'JSON', val: 464, sizeBytes: 803 },
    ],
  },
  {
    title: 'Full Message Decode Speed',
    unit: 'ns',
    maxVal: 1800,
    methodology: 'Decoding into a fresh C++20 PeerUpdate struct and reading all 11 fields.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 475, highlight: true, baseline: true },
      { name: 'OmniBuf (C++ Struct)', val: 519, highlight: true },
      { name: 'Protobuf (LEB128 Wire)', val: 576 },
      { name: 'Protobuf (libprotobuf)', val: 998 },
      { name: 'JSON', val: 1274 },
    ],
  },
  {
    title: 'Read a Single Nested Field',
    unit: 'ns',
    maxVal: 1550,
    methodology:
      'Returning std::string_view into the packet via OpaquePeerUpdate vs full message decode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 98, highlight: true, baseline: true },
      { name: 'Protobuf (LEB128 Wire)', val: 449 },
      { name: 'Protobuf (libprotobuf)', val: 839 },
      { name: 'JSON', val: 1127 },
    ],
  },
  {
    title: 'Selective Single-Field Mutation',
    unit: 'ns',
    maxVal: 2500,
    methodology:
      'Checking a nested city string and splicing an updated sequence counter via OpaquePeerUpdate vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 293, highlight: true, baseline: true },
      { name: 'Protobuf (LEB128 Wire)', val: 653 },
      { name: 'Protobuf (libprotobuf)', val: 1098 },
      { name: 'JSON', val: 1606 },
    ],
  },
  {
    title: 'Large Embedded Message Encode',
    unit: 'ns',
    maxVal: 55000,
    methodology:
      'Serializing a 39 KiB packet whose >16 KiB nested sub-messages trigger 2B-to-4B header expansion vs Protobuf two-pass sizing.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 1433, sizeBytes: 39256, highlight: true, baseline: true },
      { name: 'OmniBuf (C++ Struct)', val: 1508, sizeBytes: 39256, highlight: true },
      { name: 'Protobuf (LEB128 Wire)', val: 1906, sizeBytes: 39227 },
      { name: 'Protobuf (libprotobuf)', val: 2963, sizeBytes: 39227 },
      { name: 'JSON', val: 40563, sizeBytes: 39681 },
    ],
  },
  {
    title: 'Embedded Message Growth',
    unit: 'ns',
    maxVal: 38000,
    methodology:
      'Growing a nested string field past 16 KiB ahead of 32 trailing Neighbor entries via Opaque splicing vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 1699, highlight: true, baseline: true },
      { name: 'Protobuf (LEB128 Wire)', val: 3488 },
      { name: 'Protobuf (libprotobuf)', val: 5750 },
      { name: 'JSON', val: 27781 },
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
      'Serializing PeerUpdate into a fresh byte[] across generated OmniBuf, protobuf-java, FlatBuffers, and Jackson.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 246, sizeBytes: 366, highlight: true, baseline: true },
      { name: 'Protobuf (protobuf-java)', val: 260, sizeBytes: 341 },
      { name: 'OmniBuf (@OmniBufField)', val: 514, sizeBytes: 366, highlight: true },
      { name: 'FlatBuffers', val: 795, sizeBytes: 600 },
      { name: 'OmniBuf (Protobuf)', val: 1034, sizeBytes: 366, highlight: true },
      { name: 'JSON (Jackson)', val: 1158, sizeBytes: 803 },
      { name: 'MessagePack (Jackson)', val: 1955, sizeBytes: 626 },
    ],
  },
  {
    title: 'Full Message Decode Speed',
    unit: 'ns',
    maxVal: 4500,
    methodology: 'Decoding byte[] into a fresh PeerUpdate object and reading all 11 fields.',
    rows: [
      { name: 'OmniBuf (@OmniBufField)', val: 763, highlight: true },
      { name: 'OmniBuf (Generated)', val: 857, highlight: true, baseline: true },
      { name: 'FlatBuffers', val: 860 },
      { name: 'Protobuf (protobuf-java)', val: 1321 },
      { name: 'OmniBuf (Protobuf)', val: 2150, highlight: true },
      { name: 'JSON (Jackson)', val: 2309 },
      { name: 'MessagePack (Jackson)', val: 3575 },
    ],
  },
  {
    title: 'Read a Single Nested Field',
    unit: 'ns',
    maxVal: 4200,
    methodology:
      'Reading a nested city string via FlatBuffers vtables or OpaquePeerUpdate vs full decode.',
    rows: [
      { name: 'FlatBuffers', val: 15 },
      { name: 'OmniBuf (Generated)', val: 77, highlight: true, baseline: true },
      { name: 'Protobuf (protobuf-java)', val: 883 },
      { name: 'JSON (Jackson)', val: 1959 },
      { name: 'MessagePack (Jackson)', val: 3121 },
    ],
  },
  {
    title: 'Selective Single-Field Mutation',
    unit: 'ns',
    maxVal: 6600,
    methodology:
      'Checking a nested city string and splicing an updated sequence counter via OpaquePeerUpdate vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 255, highlight: true, baseline: true },
      { name: 'FlatBuffers', val: 1122 },
      { name: 'Protobuf (protobuf-java)', val: 1123 },
      { name: 'JSON (Jackson)', val: 3214 },
      { name: 'MessagePack (Jackson)', val: 5040 },
    ],
  },
  {
    title: 'Large Embedded Message Encode',
    unit: 'ns',
    maxVal: 120000,
    methodology:
      'Serializing a 39 KiB packet with >16 KiB nested strings. Immutable protobuf-java reuses cached ByteString UTF-8 bytes and memoizedSerializedSize.',
    rows: [
      { name: 'Protobuf (protobuf-java)', val: 3659, sizeBytes: 39227 },
      { name: 'OmniBuf (@OmniBufField)', val: 4125, sizeBytes: 39256, highlight: true },
      { name: 'OmniBuf (Protobuf)', val: 4700, sizeBytes: 39256, highlight: true },
      {
        name: 'OmniBuf (Generated)',
        val: 5044,
        sizeBytes: 39256,
        highlight: true,
        baseline: true,
      },
      { name: 'JSON (Jackson)', val: 48886, sizeBytes: 39681 },
      { name: 'FlatBuffers', val: 60626, sizeBytes: 39488 },
      { name: 'MessagePack (Jackson)', val: 90249, sizeBytes: 39508 },
    ],
  },
  {
    title: 'Embedded Message Growth',
    unit: 'ns',
    maxVal: 90000,
    methodology:
      'Growing a nested string field past 16 KiB ahead of 32 trailing Neighbor entries via Opaque splicing vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 2320, highlight: true, baseline: true },
      { name: 'Protobuf (protobuf-java)', val: 19332 },
      { name: 'FlatBuffers', val: 36126 },
      { name: 'JSON (Jackson)', val: 37974 },
      { name: 'MessagePack (Jackson)', val: 68812 },
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
      { name: 'OmniBuf (Generated)', val: 317, sizeBytes: 366, highlight: true, baseline: true },
      { name: 'OmniBuf ([OmniBufField])', val: 343, sizeBytes: 366, highlight: true },
      { name: 'MessagePack-CSharp', val: 457, sizeBytes: 626 },
      { name: 'Google.Protobuf', val: 492, sizeBytes: 341 },
      { name: 'System.Text.Json', val: 849, sizeBytes: 803 },
    ],
  },
  {
    title: 'Full Message Decode Speed',
    unit: 'ns',
    maxVal: 3400,
    methodology:
      'Decoding ReadOnlySpan<byte> into a fresh PeerUpdate instance and reading all 11 fields.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 623, highlight: true, baseline: true },
      { name: 'OmniBuf ([OmniBufField])', val: 677, highlight: true },
      { name: 'Google.Protobuf', val: 688 },
      { name: 'MessagePack-CSharp', val: 994 },
      { name: 'System.Text.Json', val: 2689 },
    ],
  },
  {
    title: 'Read a Single Nested Field',
    unit: 'ns',
    maxVal: 3300,
    methodology: 'Reading a nested city string via OpaquePeerUpdate vs full message decode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 110, highlight: true, baseline: true },
      { name: 'Google.Protobuf', val: 627 },
      { name: 'MessagePack-CSharp', val: 921 },
      { name: 'System.Text.Json', val: 2617 },
    ],
  },
  {
    title: 'Selective Single-Field Mutation',
    unit: 'ns',
    maxVal: 4500,
    methodology:
      'Checking a nested city string and splicing an updated sequence counter via OpaquePeerUpdate vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 289, highlight: true, baseline: true },
      { name: 'Google.Protobuf', val: 1150 },
      { name: 'MessagePack-CSharp', val: 1458 },
      { name: 'System.Text.Json', val: 3659 },
    ],
  },
  {
    title: 'Large Embedded Message Encode',
    unit: 'ns',
    maxVal: 27500,
    methodology:
      'Serializing a 39 KiB packet whose >16 KiB nested sub-messages trigger 2B-to-4B header expansion.',
    rows: [
      { name: 'MessagePack-CSharp', val: 4317, sizeBytes: 39508 },
      { name: 'OmniBuf ([OmniBufField])', val: 4346, sizeBytes: 39256, highlight: true },
      { name: 'System.Text.Json', val: 6745, sizeBytes: 39681 },
      { name: 'Google.Protobuf', val: 20077, sizeBytes: 39227 },
      {
        name: 'OmniBuf (Generated)',
        val: 6649,
        sizeBytes: 39256,
        highlight: true,
        baseline: true,
      },
    ],
  },
  {
    title: 'Embedded Message Growth',
    unit: 'ns',
    maxVal: 21500,
    methodology:
      'Growing a nested string field past 16 KiB ahead of 32 trailing Neighbor entries via Opaque splicing vs full decode and re-encode.',
    rows: [
      { name: 'OmniBuf (Generated)', val: 3873, highlight: true, baseline: true },
      { name: 'MessagePack-CSharp', val: 6827 },
      { name: 'Google.Protobuf', val: 14634 },
      { name: 'System.Text.Json', val: 15803 },
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
      'In Go, OmniBuf encodes and decodes <strong>around 5x to 6x faster</strong> than Protobuf. Plain Go structs with struct tags run <strong>around 6x to 10x faster</strong> than standard JSON at roughly half the wire size. Generated views read or splice single fields in place. Explore the <a href="/go" class="doc-link">Go runtime</a>.',
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
      'Benchmark source lives in <a href="https://github.com/omnibuf/omnibuf-go/blob/main/benchmarks/omnibuf_bench_test.go" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">benchmarks/omnibuf_bench_test.go</a>, <a href="https://github.com/omnibuf/omnibuf-go/blob/main/benchmarks/opaque_table_bench_test.go" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">benchmarks/opaque_table_bench_test.go</a>, <a href="https://github.com/omnibuf/omnibuf-go/blob/main/benchmarks/jsonv2_bench_test.go" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">benchmarks/jsonv2_bench_test.go</a>, and <a href="https://github.com/omnibuf/omnibuf-go/blob/main/benchmarks/competitors_test.go" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">benchmarks/competitors_test.go</a>, with recorded output in <a href="https://github.com/omnibuf/omnibuf-go/blob/main/testdata/benchmarks.txt" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">testdata/benchmarks.txt</a> and <a href="https://github.com/omnibuf/omnibuf-go/blob/main/testdata/benchmarks.json" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">testdata/benchmarks.json</a>.',
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
      'TypeScript and JavaScript apps encode and decode <strong>around 2x to 3x faster</strong> with OmniBuf than with Protobuf-ES, and read individual nested fields <strong>about 10x faster</strong>. Against built-in JSON in Node.js and browsers, OmniBuf runs <strong>about 2x faster</strong> at less than half the byte size. Explore the <a href="/es" class="doc-link">TypeScript runtime</a>.',
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
      'OmniBuf&apos;s Rust crate edges ahead of both buffa and prost on full message encode and decode, and runs <strong>around 3x to 4x faster</strong> than JSON. Zero-copy views borrow nested strings <strong>about 5x to 10x faster</strong> and splice single-field updates <strong>around 4x faster</strong>. Explore the <a href="/rs" class="doc-link">Rust runtime</a>.',
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
      'Python&apos;s compiled Rust extension outpaces Google&apos;s C Protobuf backend, msgspec, and stdlib JSON on both encode and decode. Full message decoding finishes <strong>over 2x faster</strong> than Google Protobuf, and lazy views read nested fields <strong>nearly 2x faster</strong>. Explore the <a href="/py" class="doc-link">Python runtime</a>.',
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
      'Compiled with Apple Clang 21.0.0 (<code>-O3 -DNDEBUG -std=c++20</code>) on an Apple M1 Pro Mac. Zero-dependency <code>omnibuf-cpp</code> headers are benchmarked against official <code>libprotobuf</code> 36.2 (<code>google::protobuf::Message</code>), an in-tree LEB128 Protobuf wire codec, and JSON on the exact same <code>PeerUpdate</code> workload, UTF-8 rules, and 11-field checksum sink.',
      'Benchmark source lives in <a href="https://github.com/omnibuf/omnibuf-cpp/blob/main/benchmarks/peer_bench.cpp" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">benchmarks/peer_bench.cpp</a> and <a href="https://github.com/omnibuf/omnibuf-cpp/blob/main/benchmarks/libprotobuf_peer.cpp" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">benchmarks/libprotobuf_peer.cpp</a>, with recorded output in <a href="https://github.com/omnibuf/omnibuf-cpp/blob/main/testdata/benchmarks.json" target="_blank" rel="noopener noreferrer" class="doc-link font-mono">testdata/benchmarks.json</a>.',
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
      'Java services encode and decode faster with OmniBuf than with Java Protobuf, and run <strong>around 4x to 5x faster</strong> than Jackson JSON. Generated views read nested fields <strong>about 8x faster</strong> than Protobuf and splice single-field updates <strong>about 5x faster</strong>. Explore the <a href="/java" class="doc-link">Java runtime</a>.',
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
      'On .NET, OmniBuf encodes <strong>about 2x faster</strong> than Google Protobuf and decodes <strong>over 4x faster</strong> than System.Text.Json. Span-based views read nested fields <strong>nearly 6x faster</strong> than Protobuf and splice single-field updates <strong>about 4x faster</strong>. Explore the <a href="/cs" class="doc-link">C# runtime</a>.',
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
