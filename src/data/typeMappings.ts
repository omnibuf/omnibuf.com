import type { TypeMappingRow } from '../components/TypeMappingTable.astro';

export interface LanguageTypeMapping {
  title: string;
  nativeLabel: string;
  rows: TypeMappingRow[];
  noteHtml: string;
}

export const defaultTypeMappings: Record<
  'go' | 'rs' | 'py' | 'cpp' | 'nano' | 'java' | 'cs' | 'php',
  LanguageTypeMapping
> = {
  go: {
    title: 'Go type defaults',
    nativeLabel: 'Go type',
    rows: [
      { nativeType: 'uint8, uint16, uint32', protoType: 'uint32' },
      { nativeType: 'uint64', protoType: 'uint64' },
      { nativeType: 'int8, int16, int32', protoType: 'sint32' },
      { nativeType: 'int64', protoType: 'sint64' },
      { nativeType: 'bool', protoType: 'bool' },
      { nativeType: 'float32 / float64', protoType: 'float / double' },
      { nativeType: 'string', protoType: 'string' },
      { nativeType: '[]byte', protoType: 'bytes' },
      { nativeType: 'struct, *struct', protoType: 'message' },
      { nativeType: '[]T', protoType: 'repeated T' },
      { nativeType: 'map[K]V', protoType: 'map<K, V>' },
    ],
    noteHtml:
      '<code>int</code> and <code>uint</code> encode as 32-bit on 32-bit builds and 64-bit on 64-bit builds. Add <code>wire=</code> to change the encoding (<code>fixed32</code>, <code>fixed64</code>, <code>sint</code>, <code>uint</code>, <code>string</code>, or <code>bytes</code>). On signed integers, <code>wire=fixed32</code> and <code>wire=fixed64</code> write <code>sfixed32</code> and <code>sfixed64</code>. Pointer fields like <code>*int32</code> or <code>*string</code> encode like the base type, and <code>nil</code> pointers are omitted.',
  },
  rs: {
    title: 'Rust type defaults',
    nativeLabel: 'Rust type',
    rows: [
      { nativeType: 'u8, u16, u32', protoType: 'uint32' },
      { nativeType: 'u64, usize', protoType: 'uint64' },
      { nativeType: 'i8, i16, i32', protoType: 'sint32' },
      { nativeType: 'i64, isize', protoType: 'sint64' },
      { nativeType: 'bool', protoType: 'bool' },
      { nativeType: 'f32 / f64', protoType: 'float / double' },
      { nativeType: 'String', protoType: 'string' },
      { nativeType: 'Vec<u8>', protoType: 'bytes' },
      { nativeType: 'Struct, Box<T>, MessageField<T>', protoType: 'message' },
      { nativeType: 'Vec<T>', protoType: 'repeated T' },
      { nativeType: 'HashMap<K, V>, BTreeMap<K, V>', protoType: 'map<K, V>' },
      { nativeType: 'EnumValue<E>', protoType: 'enum' },
    ],
    noteHtml:
      'Use <code>wire = &quot;fixed32&quot;</code>, <code>&quot;fixed64&quot;</code>, <code>&quot;sfixed32&quot;</code>, or <code>&quot;sfixed64&quot;</code> to switch an integer field to fixed width (narrowing a 64-bit field to 32-bit is rejected at compile time). Map fields accept <code>key_wire</code> and <code>val_wire</code>. <code>Option&lt;T&gt;</code> omits <code>None</code> and encodes <code>Some(v)</code> as <code>T</code>.',
  },
  py: {
    title: 'Python type hint defaults',
    nativeLabel: 'Python type',
    rows: [
      { nativeType: 'int', protoType: 'sint64' },
      { nativeType: 'bool', protoType: 'bool' },
      { nativeType: 'float', protoType: 'double' },
      { nativeType: 'str', protoType: 'string' },
      { nativeType: 'bytes, bytearray', protoType: 'bytes' },
      { nativeType: 'enum.Enum', protoType: 'enum' },
      { nativeType: '@dataclass', protoType: 'message' },
      { nativeType: 'list[T]', protoType: 'repeated T' },
      { nativeType: 'dict[K, V]', protoType: 'map<K, V>' },
    ],
    noteHtml:
      'Python <code>int</code> defaults to signed <code>sint64</code> and <code>float</code> defaults to 64-bit <code>double</code>. Pin a narrower or unsigned type with the <code>Annotated</code> aliases (<code>Uint32</code>, <code>Uint64</code>, <code>Sint32</code>, <code>Fixed32</code>, <code>Sfixed32</code>, <code>Fixed64</code>, <code>Sfixed64</code>, <code>Float32</code>) or pass <code>wire=</code>, <code>elem_wire=</code>, <code>key_wire=</code>, or <code>val_wire=</code> to <code>omnibuf_field</code>. Fields typed <code>T | None</code> are skipped when <code>None</code>.',
  },
  cpp: {
    title: 'C++20 type defaults',
    nativeLabel: 'C++20 type',
    rows: [
      { nativeType: 'uint8_t .. uint32_t / uint64_t', protoType: 'uint32 / uint64' },
      { nativeType: 'int8_t .. int32_t / int64_t', protoType: 'sint32 / sint64' },
      { nativeType: 'enum / enum class', protoType: 'enum' },
      { nativeType: 'bool', protoType: 'bool' },
      { nativeType: 'float / double', protoType: 'float / double' },
      { nativeType: 'std::string, std::string_view', protoType: 'string' },
      { nativeType: 'std::vector<uint8_t>, std::span', protoType: 'bytes' },
      { nativeType: 'Registered struct', protoType: 'message' },
      { nativeType: 'std::vector<T>', protoType: 'repeated T' },
      { nativeType: 'std::map, std::unordered_map', protoType: 'map<K, V>' },
    ],
    noteHtml:
      'Pass a <code>WireOverride</code> as the third template argument to <code>omnibuf::field</code> (<code>Uint</code>, <code>Sint</code>, <code>Fixed32</code>, <code>Fixed64</code>, <code>Sfixed32</code>, or <code>Sfixed64</code>), plus a fourth argument for map keys. On signed integers, <code>Fixed32</code> and <code>Fixed64</code> write <code>sfixed32</code> and <code>sfixed64</code>. <code>std::optional&lt;T&gt;</code>, <code>std::unique_ptr&lt;T&gt;</code>, and <code>omnibuf::Box&lt;T&gt;</code> encode as <code>T</code> when set and are omitted when empty.',
  },
  nano: {
    title: 'C99 Nano generated struct mapping',
    nativeLabel: 'Generated C99 type',
    rows: [
      { nativeType: 'uint32_t / uint64_t', protoType: 'uint32, fixed32 / uint64, fixed64' },
      {
        nativeType: 'int32_t / int64_t',
        protoType: 'int32, sint32, sfixed32 / int64, sint64, sfixed64',
      },
      { nativeType: 'bool', protoType: 'bool' },
      { nativeType: 'float / double', protoType: 'float / double' },
      { nativeType: 'typedef enum { ... }', protoType: 'enum' },
      { nativeType: 'char field[MAX_SIZE]', protoType: 'string (null-terminated)' },
      {
        nativeType: 'OB_BYTES_ARRAY_T(MAX_SIZE)',
        protoType: 'bytes (or uint8_t[MAX_SIZE] with fixed_length)',
      },
      { nativeType: 'bool has_x; SubMsg x;', protoType: 'message (embedded value)' },
      { nativeType: 'uint16_t x_count; T x[MAX_COUNT];', protoType: 'repeated T' },
      { nativeType: 'uint16_t which_x; union { ... } x;', protoType: 'oneof' },
      { nativeType: 'uint16_t x_count; Entry x[MAX_COUNT];', protoType: 'map<K, V>' },
    ],
    noteHtml:
      'Every <code>string</code>, <code>bytes</code>, <code>repeated</code>, and <code>map</code> field requires static bounds via <code>omnibuf.nano.v1</code> proto options or a sidecar <code>.options</code> file. Unbounded fields fail at codegen time so RAM usage stays fixed at compile time.',
  },
  java: {
    title: 'Java type defaults',
    nativeLabel: 'Java type',
    rows: [
      { nativeType: 'int, Integer', protoType: 'uint32' },
      { nativeType: 'long, Long', protoType: 'uint64' },
      { nativeType: 'boolean, Boolean', protoType: 'bool' },
      { nativeType: 'float, Float / double, Double', protoType: 'float / double' },
      { nativeType: 'String', protoType: 'string' },
      { nativeType: 'byte[]', protoType: 'bytes' },
      { nativeType: 'Enum', protoType: 'enum' },
      { nativeType: 'record, class', protoType: 'message' },
      { nativeType: 'int[], long[], List<E>', protoType: 'repeated E' },
      { nativeType: 'Map<K, V>', protoType: 'map<K, V>' },
    ],
    noteHtml:
      'Java has no unsigned integer primitives, so <code>int</code>, <code>long</code>, <code>int[]</code>, and <code>long[]</code> default to unsigned <code>uint32</code> and <code>uint64</code>. Set <code>wire = WireKind.SINT</code> (or <code>SFIXED32</code> / <code>SFIXED64</code>) on fields that hold negative values, and use <code>keyWire</code> / <code>valueWire</code> to override map key or value types.',
  },
  cs: {
    title: 'C# type defaults',
    nativeLabel: 'C# type',
    rows: [
      { nativeType: 'byte, ushort, uint', protoType: 'uint32' },
      { nativeType: 'ulong', protoType: 'uint64' },
      { nativeType: 'sbyte, short, int', protoType: 'sint32' },
      { nativeType: 'long', protoType: 'sint64' },
      { nativeType: 'enum', protoType: 'enum (underlying type)' },
      { nativeType: 'bool', protoType: 'bool' },
      { nativeType: 'float / double', protoType: 'float / double' },
      { nativeType: 'string / byte[]', protoType: 'string / bytes' },
      { nativeType: 'class, struct, record', protoType: 'message' },
      { nativeType: 'T[], List<T>', protoType: 'repeated T' },
      { nativeType: 'Dictionary<K, V>', protoType: 'map<K, V>' },
    ],
    noteHtml:
      'Enums follow their underlying integer type (signed <code>sint32</code> by default). Override an integer field with <code>Wire = OmniBufWireType.Fixed32</code>, <code>Fixed64</code>, <code>Sfixed32</code>, <code>Sfixed64</code>, <code>Uint</code>, or <code>Sint</code>, or set <code>KeyWire</code> and <code>ValueWire</code> on dictionaries. Nullable types (<code>T?</code>) omit <code>null</code> values and encode non-null values as <code>T</code>.',
  },
  php: {
    title: 'PHP property type defaults',
    nativeLabel: 'PHP type',
    rows: [
      { nativeType: 'int', protoType: 'sint64' },
      { nativeType: 'bool', protoType: 'bool' },
      { nativeType: 'float', protoType: 'double' },
      { nativeType: 'string (or untyped)', protoType: 'string' },
      { nativeType: 'Class', protoType: 'message' },
      { nativeType: 'array', protoType: 'repeated / map' },
    ],
    noteHtml:
      'Untyped properties default to <code>string</code>, <code>int</code> defaults to signed <code>sint64</code>, and <code>float</code> defaults to <code>double</code>. Pass a type string to <code>#[OmniBufField]</code> (such as <code>&apos;uint32&apos;</code>, <code>&apos;uint64&apos;</code>, <code>&apos;fixed32&apos;</code>, <code>&apos;fixed64&apos;</code>, <code>&apos;float32&apos;</code>, or <code>&apos;bytes&apos;</code>) to override it. PHP arrays carry no element types at runtime, so repeated fields need <code>elementWire:</code> and maps need <code>wire: &apos;map&apos;</code> with <code>keyWire:</code> and <code>valueWire:</code>.',
  },
};
