import type { TypeMappingRow } from '../components/TypeMappingTable.astro';

export interface LanguageTypeMapping {
  title: string;
  nativeLabel: string;
  overrideLabel: string;
  rows: TypeMappingRow[];
  noteHtml?: string;
}

export const defaultTypeMappings: Record<
  'go' | 'rs' | 'py' | 'cpp' | 'java' | 'cs' | 'php',
  LanguageTypeMapping
> = {
  go: {
    title: 'Default Go Struct Tag Type Mapping',
    nativeLabel: 'Go Type',
    overrideLabel: 'omnibuf Tag Overrides',
    rows: [
      {
        nativeType: 'uint8, uint16, uint32, uint64, uint',
        protoType: 'uint32 / uint64',
        wireType: 'WireUint (0)',
        overrides: 'wire=sint, wire=fixed32, wire=fixed64',
      },
      {
        nativeType: 'int8, int16, int32, int64, int',
        protoType: 'sint32 / sint64',
        wireType: 'WireSint (1)',
        overrides: 'wire=uint, wire=fixed32 (sfixed32), wire=fixed64 (sfixed64)',
      },
      {
        nativeType: 'bool',
        protoType: 'bool',
        wireType: 'WireBoolFalse / True (2/3)',
        overrides: 'wire=bool',
      },
      {
        nativeType: 'float32 / float64',
        protoType: 'float / double',
        wireType: 'WireFloat32 (8) / Float64 (9)',
        overrides: 'wire=fixed32 / wire=fixed64',
      },
      {
        nativeType: 'string',
        protoType: 'string',
        wireType: 'WireString (10)',
        overrides: 'wire=bytes',
      },
      {
        nativeType: '[]byte',
        protoType: 'bytes',
        wireType: 'WireBytes (11)',
        overrides: 'wire=string, or wire=uint / sint / fixed32 / fixed64 (array)',
      },
      {
        nativeType: 'struct, *struct',
        protoType: 'message',
        wireType: 'WireSubMsg (12)',
        overrides: 'wire=submsg',
      },
      {
        nativeType: '[]T (non-byte slice)',
        protoType: 'repeated T',
        wireType: 'WireArray (13)',
        overrides: 'wire=... sets element wire type',
      },
      {
        nativeType: 'map[K]V',
        protoType: 'map<K, V>',
        wireType: 'WireMap (14)',
        overrides: 'wire=... sets value wire type',
      },
    ],
    noteHtml:
      '<code>int</code> and <code>uint</code> follow host word width. Passing <code>wire=fixed32</code> or <code>wire=fixed64</code> on signed integers automatically selects <code>WireSfixed32</code> (6) or <code>WireSfixed64</code> (7). Pointer scalars (<code>*T</code>) inherit <code>T</code> with explicit presence.',
  },
  rs: {
    title: 'Default #[derive(OmniBuf)] Rust Type Mapping',
    nativeLabel: 'Rust Type',
    overrideLabel: '#[omnibuf(...)] Overrides',
    rows: [
      {
        nativeType: 'u8, u16, u32',
        protoType: 'uint32',
        wireType: 'WIRE_UINT (0)',
        overrides: 'wire = "fixed32" | "fixed64"',
      },
      {
        nativeType: 'u64, usize',
        protoType: 'uint64',
        wireType: 'WIRE_UINT (0)',
        overrides: 'wire = "fixed64" ("fixed32" rejected as narrowing)',
      },
      {
        nativeType: 'i8, i16, i32',
        protoType: 'sint32',
        wireType: 'WIRE_SINT (1)',
        overrides: 'wire = "sfixed32" | "sfixed64"',
      },
      {
        nativeType: 'i64, isize',
        protoType: 'sint64',
        wireType: 'WIRE_SINT (1)',
        overrides: 'wire = "sfixed64" ("sfixed32" rejected as narrowing)',
      },
      {
        nativeType: 'bool',
        protoType: 'bool',
        wireType: 'WIRE_BOOL_FALSE / TRUE (2/3)',
        overrides: 'wire = "bool"',
      },
      {
        nativeType: 'f32 / f64',
        protoType: 'float / double',
        wireType: 'WIRE_FLOAT32 (8) / FLOAT64 (9)',
        overrides: 'wire = "float32" | "float64"',
      },
      {
        nativeType: 'String',
        protoType: 'string',
        wireType: 'WIRE_STRING (10)',
        overrides: 'wire = "string"',
      },
      {
        nativeType: 'Vec<u8>',
        protoType: 'bytes',
        wireType: 'WIRE_BYTES (11)',
        overrides: 'wire = "uint" | "fixed32" | "fixed64" (switches to WIRE_ARRAY)',
      },
      {
        nativeType: 'Struct, Box<T>, MessageField<T>',
        protoType: 'message',
        wireType: 'WIRE_SUB_MSG (12)',
        overrides: 'wire = "submsg"',
      },
      {
        nativeType: 'Vec<T>',
        protoType: 'repeated T',
        wireType: 'WIRE_ARRAY (13)',
        overrides: 'wire = "..." sets element wire type',
      },
      {
        nativeType: 'HashMap<K, V>, BTreeMap<K, V>',
        protoType: 'map<K, V>',
        wireType: 'WIRE_MAP (14)',
        overrides: 'key_wire = "...", val_wire = "..."',
      },
      {
        nativeType: 'EnumValue<E> (buffa)',
        protoType: 'enum',
        wireType: 'WIRE_SINT (1)',
        overrides: 'none',
      },
    ],
    noteHtml:
      '<code>Option&lt;T&gt;</code> wraps any scalar, sub-message, <code>Box&lt;T&gt;</code>, or <code>EnumValue&lt;E&gt;</code> with explicit presence and inherits <code>T</code>&apos;s default wire type.',
  },
  py: {
    title: 'Default @omnibuf_message Python Type Hint Mapping',
    nativeLabel: 'Python Type Hint',
    overrideLabel: 'wire= / Annotated Overrides',
    rows: [
      {
        nativeType: 'int',
        protoType: 'sint64',
        wireType: 'WIRE_SINT (1)',
        overrides:
          'Uint32, Uint64, Sint32, Sint64, Fixed32, Sfixed32, Fixed64, Sfixed64 (or wire="...")',
      },
      {
        nativeType: 'bool',
        protoType: 'bool',
        wireType: 'WIRE_BOOL_FALSE / TRUE (2/3)',
        overrides: 'wire="bool"',
      },
      {
        nativeType: 'float',
        protoType: 'double',
        wireType: 'WIRE_FLOAT64 (9)',
        overrides: 'Float32 / Float64 (or wire="float32" | "float64")',
      },
      {
        nativeType: 'str',
        protoType: 'string',
        wireType: 'WIRE_STRING (10)',
        overrides: 'wire="bytes"',
      },
      {
        nativeType: 'bytes, bytearray',
        protoType: 'bytes',
        wireType: 'WIRE_BYTES (11)',
        overrides: 'wire="string"',
      },
      {
        nativeType: 'enum.Enum (int)',
        protoType: 'enum',
        wireType: 'WIRE_SINT (1)',
        overrides: 'wire="sint" | "sint32"',
      },
      {
        nativeType: '@dataclass / @omnibuf_message',
        protoType: 'message',
        wireType: 'WIRE_SUB_MSG (12)',
        overrides: 'none',
      },
      {
        nativeType: 'list[T]',
        protoType: 'repeated T',
        wireType: 'WIRE_ARRAY (13)',
        overrides: 'elem_wire="...", wire="...", or Annotated alias on T',
      },
      {
        nativeType: 'dict[K, V]',
        protoType: 'map<K, V>',
        wireType: 'WIRE_MAP (14)',
        overrides: 'key_wire="...", val_wire="...", or Annotated aliases on K, V',
      },
    ],
    noteHtml:
      'Python <code>int</code> defaults to signed <code>sint64</code> and <code>float</code> defaults to 64-bit <code>double</code>. Explicit <code>wire=</code> arguments take precedence over <code>Annotated</code> aliases. <code>T | None</code> omits <code>None</code> values.',
  },
  cpp: {
    title: 'Default StructTraits<T> C++20 Type Mapping',
    nativeLabel: 'C++20 Type',
    overrideLabel: 'WireOverride Template Arg',
    rows: [
      {
        nativeType: 'uint8_t, uint16_t, uint32_t, uint64_t',
        protoType: 'uint32 / uint64',
        wireType: 'WireUint (0)',
        overrides: 'Sint, Fixed32, Fixed64, Sfixed32, Sfixed64',
      },
      {
        nativeType: 'int8_t, int16_t, int32_t, int64_t',
        protoType: 'sint32 / sint64',
        wireType: 'WireSint (1)',
        overrides: 'Uint, Fixed32 (Sfixed32), Fixed64 (Sfixed64), Sfixed32, Sfixed64',
      },
      {
        nativeType: 'enum / enum class',
        protoType: 'enum',
        wireType: 'WireSint (1)',
        overrides: 'Any integer WireOverride',
      },
      {
        nativeType: 'bool',
        protoType: 'bool',
        wireType: 'WireBoolFalse / True (2/3)',
        overrides: 'Default',
      },
      {
        nativeType: 'float / double',
        protoType: 'float / double',
        wireType: 'WireFloat32 (8) / Float64 (9)',
        overrides: 'Default',
      },
      {
        nativeType: 'std::string, std::string_view',
        protoType: 'string',
        wireType: 'WireString (10)',
        overrides: 'Default',
      },
      {
        nativeType: 'std::vector<uint8_t>, std::span<uint8_t>',
        protoType: 'bytes',
        wireType: 'WireBytes (11)',
        overrides: 'Default',
      },
      {
        nativeType: 'RegisteredStruct<T>',
        protoType: 'message',
        wireType: 'WireSubMsg (12)',
        overrides: 'Default',
      },
      {
        nativeType: 'std::vector<T> (T != uint8_t)',
        protoType: 'repeated T',
        wireType: 'WireArray (13)',
        overrides: '3rd template arg applies to element T',
      },
      {
        nativeType: 'std::map<K, V>, std::unordered_map<K, V>',
        protoType: 'map<K, V>',
        wireType: 'WireMap (14)',
        overrides: '4th arg sets key wire type; 3rd arg sets value wire type',
      },
    ],
    noteHtml:
      '<code>std::optional&lt;T&gt;</code>, <code>std::unique_ptr&lt;T&gt;</code>, and <code>omnibuf::Box&lt;T&gt;</code> unwrap to <code>T</code> with explicit presence. On signed integers, <code>WireOverride::Fixed32</code> and <code>Fixed64</code> automatically resolve to <code>WireSfixed32</code> and <code>WireSfixed64</code>.',
  },
  java: {
    title: 'Default @OmniBufField Java Type Mapping',
    nativeLabel: 'Java Type',
    overrideLabel: 'WireKind Overrides',
    rows: [
      {
        nativeType: 'int, Integer',
        protoType: 'uint32',
        wireType: 'WIRE_UINT (0)',
        overrides: 'SINT, FIXED32, SFIXED32',
      },
      {
        nativeType: 'long, Long',
        protoType: 'uint64',
        wireType: 'WIRE_UINT (0)',
        overrides: 'SINT, FIXED64, SFIXED64',
      },
      {
        nativeType: 'boolean, Boolean',
        protoType: 'bool',
        wireType: 'WIRE_BOOL_FALSE / TRUE (2/3)',
        overrides: 'BOOL',
      },
      {
        nativeType: 'float, Float / double, Double',
        protoType: 'float / double',
        wireType: 'WIRE_FLOAT32 (8) / FLOAT64 (9)',
        overrides: 'FLOAT32 / FLOAT64',
      },
      {
        nativeType: 'String',
        protoType: 'string',
        wireType: 'WIRE_STRING (10)',
        overrides: 'STRING',
      },
      {
        nativeType: 'byte[]',
        protoType: 'bytes',
        wireType: 'WIRE_BYTES (11)',
        overrides: 'BYTES',
      },
      {
        nativeType: 'Enum (by ordinal)',
        protoType: 'enum',
        wireType: 'WIRE_SINT (1)',
        overrides: 'SINT',
      },
      {
        nativeType: 'record / class',
        protoType: 'message',
        wireType: 'WIRE_SUB_MSG (12)',
        overrides: 'SUB_MSG',
      },
      {
        nativeType: 'int[], long[], List<E>',
        protoType: 'repeated E',
        wireType: 'WIRE_ARRAY (13)',
        overrides: 'wire = WireKind.* sets element wire type',
      },
      {
        nativeType: 'Map<K, V>',
        protoType: 'map<K, V>',
        wireType: 'WIRE_MAP (14)',
        overrides: 'keyWire = WireKind.*, valueWire = WireKind.*',
      },
    ],
    noteHtml:
      'Because Java lacks unsigned integer primitives, <code>int</code>, <code>long</code>, <code>int[]</code>, and <code>long[]</code> default to <code>WIRE_UINT</code> (0) under <code>WireKind.AUTO</code>. Pass <code>wire = WireKind.SINT</code> (or <code>SFIXED32</code> / <code>SFIXED64</code>) for fields that hold negative values.',
  },
  cs: {
    title: 'Default [OmniBufField] C# Type Mapping',
    nativeLabel: 'C# Type',
    overrideLabel: 'OmniBufWireType Overrides',
    rows: [
      {
        nativeType: 'byte, ushort, uint',
        protoType: 'uint32',
        wireType: 'Uint (0)',
        overrides: 'Sint; uint also allows Fixed32, Sfixed32',
      },
      {
        nativeType: 'ulong',
        protoType: 'uint64',
        wireType: 'Uint (0)',
        overrides: 'Sint, Fixed64, Sfixed64',
      },
      {
        nativeType: 'sbyte, short, int',
        protoType: 'sint32',
        wireType: 'Sint (1)',
        overrides: 'Uint; int also allows Sfixed32, Fixed32',
      },
      {
        nativeType: 'long',
        protoType: 'sint64',
        wireType: 'Sint (1)',
        overrides: 'Uint, Sfixed64, Fixed64',
      },
      {
        nativeType: 'enum',
        protoType: 'enum (underlying type)',
        wireType: 'Sint (1) by default',
        overrides: 'Matches underlying integer type',
      },
      {
        nativeType: 'bool',
        protoType: 'bool',
        wireType: 'BoolFalse / BoolTrue (2/3)',
        overrides: 'BoolFalse, BoolTrue',
      },
      {
        nativeType: 'float / double',
        protoType: 'float / double',
        wireType: 'Float32 (8) / Float64 (9)',
        overrides: 'Float32 / Float64',
      },
      {
        nativeType: 'string / byte[]',
        protoType: 'string / bytes',
        wireType: 'String (10) / Bytes (11)',
        overrides: 'String / Bytes',
      },
      {
        nativeType: 'class, struct, record',
        protoType: 'message',
        wireType: 'SubMsg (12)',
        overrides: 'SubMsg',
      },
      {
        nativeType: 'T[], List<T>, IReadOnlyList<T>',
        protoType: 'repeated T',
        wireType: 'Array (13)',
        overrides: 'ValueWire or Wire sets element wire type',
      },
      {
        nativeType: 'Dictionary<K, V>, IDictionary<K, V>',
        protoType: 'map<K, V>',
        wireType: 'Map (14)',
        overrides: 'KeyWire, ValueWire',
      },
    ],
    noteHtml:
      '<code>Nullable&lt;T&gt;</code> (<code>T?</code>) wraps scalars and value-type sub-messages with explicit presence and inherits <code>T</code>&apos;s default wire type.',
  },
  php: {
    title: 'Default #[OmniBufField] PHP Property Type Mapping',
    nativeLabel: 'PHP Property Type',
    overrideLabel: 'wire / elementWire / keyWire / valueWire',
    rows: [
      {
        nativeType: 'int',
        protoType: 'sint64',
        wireType: 'SINT (1)',
        overrides: "'uint32', 'uint64', 'sint32', 'fixed32', 'fixed64', 'sfixed32', 'sfixed64'",
      },
      {
        nativeType: 'bool',
        protoType: 'bool',
        wireType: 'BOOL_FALSE / TRUE (2/3)',
        overrides: "'bool'",
      },
      {
        nativeType: 'float',
        protoType: 'double',
        wireType: 'FLOAT64 (9)',
        overrides: "'float' / 'float32', 'double' / 'float64'",
      },
      {
        nativeType: 'string (or untyped)',
        protoType: 'string',
        wireType: 'STRING (10)',
        overrides: "'bytes', or 'uint64' / 'fixed64' (decimal string)",
      },
      {
        nativeType: 'Class type',
        protoType: 'message',
        wireType: 'SUB_MSG (12)',
        overrides: "'submsg' / 'message' (messageClass: for array/map elements)",
      },
      {
        nativeType: 'array',
        protoType: 'repeated / map',
        wireType: 'ARRAY (13) / MAP (14)',
        overrides: "elementWire: '...' for arrays; wire: 'map', keyWire:, valueWire: for maps",
      },
    ],
    noteHtml:
      'PHP <code>int</code> defaults to signed <code>sint64</code> and <code>float</code> defaults to <code>double</code> when <code>wire</code> is omitted. Array and map element types are declared explicitly because PHP does not carry generic type parameters at runtime.',
  },
};
