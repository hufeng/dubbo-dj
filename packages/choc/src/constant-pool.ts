import { AutoOffsetBuffer } from './buffer'

export class ConstantPool {
  _table = new Map<number, ConstantInfo>()
  _buf: AutoOffsetBuffer
  _entryCount: number
  _count: number

  static default() {
    return new ConstantPool(new AutoOffsetBuffer(Buffer.alloc(0), 0), 0)
  }

  constructor(buf: AutoOffsetBuffer, entryCount: number) {
    this._buf = buf
    this._entryCount = entryCount
    this._count = 0
  }

  satisfy() {
    for (let i = 1, len = this._entryCount; i < len; ++i) {
      const tag = this._buf.readUInt8()
      const info = this._readInfo(tag)
      this._table.set(i, info)
      ++this._count
      if (tag === ConstantType.Long || tag === ConstantType.Double) i += 1
    }
  }

  getEntry<T extends ConstantInfo>(index: number): T | undefined {
    if (this._table.has(index)) return this._table.get(index)! as T
    return undefined
  }

  _readInfo(tag: number) {
    switch (tag) {
      case ConstantType.Class:
        return this._readClass()
      case ConstantType.Fieldref:
        return this._readFieldref()
      case ConstantType.Methodref:
        return this._readMethodref()
      case ConstantType.InterfaceMethodref:
        return this._readInterfaceMethodref()
      case ConstantType.String:
        return this._readString()
      case ConstantType.Integer:
        return this._readInteger()
      case ConstantType.Float:
        return this._readFloat()
      case ConstantType.Long:
        return this._readLong()
      case ConstantType.Double:
        return this._readDouble()
      case ConstantType.NameAndType:
        return this._readNameAndType()
      case ConstantType.Utf8:
        return this._readUtf8()
      case ConstantType.MethodHandle:
        return this._readMethodHandle()
      case ConstantType.MethodType:
        return this._readMethodType()
      case ConstantType.InvokeDynamic:
        return this._readInvokeDynamic()
      case ConstantType.Module:
        return this._readModule()
      case ConstantType.Package:
        return this._readPackage()
      default:
        throw new Error('unreachable')
    }
  }

  _readClass() {
    const nameIndex = this._buf.readUInt16BE()
    return new ClassInfo(this, nameIndex)
  }

  _readFieldref() {
    const classIndex = this._buf.readUInt16BE()
    const nameAndTypeIndex = this._buf.readUInt16BE()
    return new FieldrefInfo(this, classIndex, nameAndTypeIndex)
  }

  _readMethodref() {
    const classIndex = this._buf.readUInt16BE()
    const nameAndTypeIndex = this._buf.readUInt16BE()
    return new MethodrefInfo(this, classIndex, nameAndTypeIndex)
  }

  _readInterfaceMethodref() {
    const classIndex = this._buf.readUInt16BE()
    const nameAndTypeIndex = this._buf.readUInt16BE()
    return new InterfaceMethodrefInfo(this, classIndex, nameAndTypeIndex)
  }

  _readString() {
    const stringIndex = this._buf.readUInt16BE()
    return new StringInfo(this, stringIndex)
  }

  _readInteger() {
    const bytes = this._buf.forward(4)
    return new IntegerInfo(this, bytes)
  }

  _readFloat() {
    const bytes = this._buf.forward(4)
    return new FloatInfo(this, bytes)
  }

  _readLong() {
    const highBytes = this._buf.forward(4)
    const lowBytes = this._buf.forward(4)
    return new LongInfo(this, highBytes, lowBytes)
  }

  _readDouble() {
    const highBytes = this._buf.forward(4)
    const lowBytes = this._buf.forward(4)
    return new DoubleInfo(this, highBytes, lowBytes)
  }

  _readNameAndType() {
    const nameIndex = this._buf.readUInt16BE()
    const descriptorIndex = this._buf.readUInt16BE()
    return new NameAndTypeInfo(this, nameIndex, descriptorIndex)
  }

  _readUtf8() {
    const length = this._buf.readUInt16BE()
    const bytes = this._buf.forward(length)
    return new Utf8Info(this, length, bytes)
  }

  _readMethodHandle() {
    const referenceKind = this._buf.readUInt8()
    const referenceIndex = this._buf.readUInt16BE()
    return new MethodHandleInfo(this, referenceKind, referenceIndex)
  }

  _readMethodType() {
    const descriptorIndex = this._buf.readUInt16BE()
    return new MethodTypeInfo(this, descriptorIndex)
  }

  _readInvokeDynamic() {
    const bootstrapMethodAttrIndex = this._buf.readUInt16BE()
    const nameAndTypeIndex = this._buf.readUInt16BE()
    return new InvokeDynamicInfo(
      this,
      bootstrapMethodAttrIndex,
      nameAndTypeIndex
    )
  }

  _readModule() {
    const nameIndex = this._buf.readUInt16BE()
    return new ModuleInfo(this, nameIndex)
  }

  _readPackage() {
    const nameIndex = this._buf.readUInt16BE()
    return new PackageInfo(this, nameIndex)
  }
}

export enum ConstantType {
  Unusable = -1,
  Class = 7,
  Fieldref = 9,
  Methodref = 10,
  InterfaceMethodref = 11,
  String = 8,
  Integer = 3,
  Float = 4,
  Long = 5,
  Double = 6,
  NameAndType = 12,
  Utf8 = 1,
  MethodHandle = 15,
  MethodType = 16,
  InvokeDynamic = 18,
  Module = 19,
  Package = 20,
}

export class ConstantInfo {
  readonly tag: number
  readonly pool: ConstantPool

  constructor(tag: number, pool: ConstantPool) {
    this.tag = tag
    this.pool = pool
  }

  get usable() {
    return true
  }
}

export class UnusableConstantInfo extends ConstantInfo {
  readonly tag = ConstantType.Unusable

  constructor() {
    super(ConstantType.Unusable, null as any)
  }

  get usable() {
    return false
  }
}

export class ClassInfo extends ConstantInfo {
  readonly nameIndex: number

  constructor(pool: ConstantPool, nameIndex: number) {
    super(ConstantType.Class, pool)
    this.nameIndex = nameIndex
  }

  get name() {
    return this.pool.getEntry<Utf8Info>(this.nameIndex)?.string
  }
}

export class FieldrefInfo extends ConstantInfo {
  readonly classIndex: number
  readonly nameAndTypeIndex: number

  constructor(
    pool: ConstantPool,
    classIndex: number,
    nameAndTypeIndex: number
  ) {
    super(ConstantType.Fieldref, pool)
    this.classIndex = classIndex
    this.nameAndTypeIndex = nameAndTypeIndex
  }

  get class() {
    return this.pool.getEntry<ClassInfo>(this.classIndex)
  }

  get nameAndType() {
    return this.pool.getEntry<NameAndTypeInfo>(this.nameAndTypeIndex)
  }
}

export class MethodrefInfo extends ConstantInfo {
  readonly classIndex: number
  readonly nameAndTypeIndex: number

  constructor(
    pool: ConstantPool,
    classIndex: number,
    nameAndTypeIndex: number
  ) {
    super(ConstantType.Methodref, pool)
    this.classIndex = classIndex
    this.nameAndTypeIndex = nameAndTypeIndex
  }

  get class() {
    return this.pool.getEntry<ClassInfo>(this.classIndex)
  }

  get nameAndType() {
    return this.pool.getEntry<NameAndTypeInfo>(this.nameAndTypeIndex)
  }
}

export class InterfaceMethodrefInfo extends ConstantInfo {
  readonly classIndex: number
  readonly nameAndTypeIndex: number

  constructor(
    pool: ConstantPool,
    classIndex: number,
    nameAndTypeIndex: number
  ) {
    super(ConstantType.InterfaceMethodref, pool)
    this.classIndex = classIndex
    this.nameAndTypeIndex = nameAndTypeIndex
  }

  get class() {
    return this.pool.getEntry<ClassInfo>(this.classIndex)
  }

  get nameAndType() {
    return this.pool.getEntry<NameAndTypeInfo>(this.nameAndTypeIndex)
  }
}

export class StringInfo extends ConstantInfo {
  readonly stringIndex: number

  constructor(pool: ConstantPool, stringIndex: number) {
    super(ConstantType.String, pool)
    this.stringIndex = stringIndex
  }

  get string() {
    return (this.pool.getEntry(this.stringIndex) as Utf8Info).string
  }
}

export class IntegerInfo extends ConstantInfo {
  readonly bytes: Buffer

  constructor(pool: ConstantPool, bytes: Buffer) {
    super(ConstantType.Integer, pool)
    this.bytes = bytes
  }

  get number() {
    return this.bytes.readInt32BE(0)
  }
}

export class FloatInfo extends ConstantInfo {
  readonly bytes: Buffer

  constructor(pool: ConstantPool, bytes: Buffer) {
    super(ConstantType.Float, pool)
    this.bytes = bytes
  }

  get number() {
    const bits = this.bytes.readUInt32BE(0)

    if (bits === 0x7f800000) return Number.POSITIVE_INFINITY
    if (bits === 0xff800000) return Number.NEGATIVE_INFINITY
    if (
      (bits >= 0x7f800001 && bits <= 0x7fffffff) ||
      (bits >= 0xff800001 && bits <= 0xffffffff)
    ) {
      return NaN
    }

    const s = bits >> 31 == 0 ? 1 : -1
    const e = (bits >> 23) & 0xff
    const m = e == 0 ? (bits & 0x7fffff) << 1 : (bits & 0x7fffff) | 0x800000
    return s * m * Math.pow(2, e - 150)
  }
}

export class LongInfo extends ConstantInfo {
  readonly highBytes: Buffer
  readonly lowBytes: Buffer

  constructor(pool: ConstantPool, highBytes: Buffer, lowBytes: Buffer) {
    super(ConstantType.Long, pool)
    this.highBytes = highBytes
    this.lowBytes = lowBytes
  }

  get number() {
    const h = BigInt(this.highBytes.readUInt32BE(0))
    const l = BigInt(this.lowBytes.readUInt32BE(0))
    return BigInt((h << 32n) | l)
  }
}

export class DoubleInfo extends ConstantInfo {
  readonly highBytes: Buffer
  readonly lowBytes: Buffer

  constructor(pool: ConstantPool, highBytes: Buffer, lowBytes: Buffer) {
    super(ConstantType.Double, pool)
    this.highBytes = highBytes
    this.lowBytes = lowBytes
  }

  get number() {
    const h = BigInt(this.highBytes.readUInt32BE(0))
    const l = BigInt(this.lowBytes.readUInt32BE(0))
    const bits = (h << 32n) | l

    if (bits === 0x7ff0000000000000n) return Number.POSITIVE_INFINITY
    if (bits === 0xfff0000000000000n) return Number.NEGATIVE_INFINITY
    if (
      (bits >= 0x7ff0000000000001n && bits <= 0x7fffffffffffffffn) ||
      (bits >= 0xfff0000000000001n && bits <= 0xffffffffffffffffn)
    ) {
      return NaN
    }

    const s = bits >> 63n === 0n ? 1n : -1n
    const e = (bits >> 52n) & 0x7ffn
    const m =
      e === 0n
        ? (bits & 0xfffffffffffffn) << 1n
        : (bits & 0xfffffffffffffn) | 0x10000000000000n
    return s * m * BigInt(Math.pow(2, Number(e - 1075n)))
  }
}

export class NameAndTypeInfo extends ConstantInfo {
  readonly nameIndex: number
  readonly descriptorIndex: number

  constructor(pool: ConstantPool, nameIndex: number, descriptorIndex: number) {
    super(ConstantType.NameAndType, pool)
    this.nameIndex = nameIndex
    this.descriptorIndex = descriptorIndex
  }

  get name() {
    return this.pool.getEntry<Utf8Info>(this.nameIndex)?.string
  }

  get descriptor() {
    return this.pool.getEntry<Utf8Info>(this.nameIndex)?.string
  }
}

export class Utf8Info extends ConstantInfo {
  readonly length: number
  readonly bytes: Buffer

  constructor(pool: ConstantPool, length: number, bytes: Buffer) {
    super(ConstantType.Utf8, pool)
    this.length = length
    this.bytes = bytes
  }

  _str: string | null = null

  _deserialize() {
    let str = ''
    for (let i = 0, len = this.length; i < len; ++i) {
      const byt = this.bytes.readUInt8(i)
      if (byt >= 0x01 && byt <= 0x7f) {
        str += String.fromCharCode(byt)
      } else if (byt === 0x0 || byt >>> 5 === 0x6) {
        const x = byt
        const y = this.bytes.readUInt8(++i)
        str += String.fromCharCode(((x & 0x1f) << 6) | (y & 0x3f))
      } else if (byt >>> 4 === 0xe) {
        const x = byt
        const y = this.bytes.readUInt8(++i)
        const z = this.bytes.readUInt8(++i)
        str += String.fromCharCode(
          ((x & 0xf) << 12) | ((y & 0x3f) << 6) | (z & 0x3f)
        )
      } else {
        // byt should be `0b11101101`
        const v = this.bytes.readUInt8(++i) & 0xf
        const w = this.bytes.readUInt8(++i) & 0x3f
        // below byt should be `0b11101101` just skip the
        // assertion for performance consideration
        this.bytes.readUInt8(++i)
        const y = this.bytes.readUInt8(++i) & 0xf
        const z = this.bytes.readUInt8(++i) & 0x3f
        str += String.fromCodePoint(
          0x10000 +
            ((v & 0x0f) << 16) +
            ((w & 0x3f) << 10) +
            ((y & 0x0f) << 6) +
            (z & 0x3f)
        )
      }
    }
    return str
  }

  get string() {
    if (this._str === null) this._str = this._deserialize()
    return this._str
  }

  toString() {
    return this.string
  }
}

export class MethodHandleInfo extends ConstantInfo {
  readonly referenceKind: number
  readonly referenceIndex: number

  constructor(
    pool: ConstantPool,
    referenceKind: number,
    referenceIndex: number
  ) {
    super(ConstantType.MethodHandle, pool)
    this.referenceKind = referenceKind
    this.referenceIndex = referenceIndex
  }

  get reference() {
    switch (this.referenceKind) {
      case 1:
      case 2:
      case 3:
      case 4:
        return this.pool.getEntry<FieldrefInfo>(this.referenceIndex)
      case 5:
      case 8:
        return this.pool.getEntry<MethodrefInfo>(this.referenceIndex)
      case 6:
      case 7:
        return this.pool.getEntry<MethodrefInfo | InterfaceMethodrefInfo>(
          this.referenceIndex
        )
      case 9:
        return this.pool.getEntry<InterfaceMethodrefInfo>(this.referenceIndex)
    }
    return new UnusableConstantInfo()
  }
}

export class MethodTypeInfo extends ConstantInfo {
  readonly descriptorIndex: number

  constructor(pool: ConstantPool, descriptorIndex: number) {
    super(ConstantType.MethodType, pool)
    this.descriptorIndex = descriptorIndex
  }

  get descriptor() {
    return this.pool.getEntry<Utf8Info>(this.descriptorIndex)?.string
  }
}

export class InvokeDynamicInfo extends ConstantInfo {
  readonly bootstrapMethodAttrIndex: number
  readonly nameAndTypeIndex: number

  constructor(
    pool: ConstantPool,
    bootstrapMethodAttrIndex: number,
    nameAndTypeIndex: number
  ) {
    super(ConstantType.InvokeDynamic, pool)
    this.bootstrapMethodAttrIndex = bootstrapMethodAttrIndex
    this.nameAndTypeIndex = nameAndTypeIndex
  }

  get nameAndType() {
    return this.pool.getEntry<NameAndTypeInfo>(this.nameAndTypeIndex)
  }
}

export class ModuleInfo extends ConstantInfo {
  readonly nameIndex: number

  constructor(pool: ConstantPool, nameIndex: number) {
    super(ConstantType.Module, pool)
    this.nameIndex = nameIndex
  }

  get name() {
    return this.pool.getEntry<Utf8Info>(this.nameIndex)?.string
  }
}

export class PackageInfo extends ConstantInfo {
  readonly nameIndex: number

  constructor(pool: ConstantPool, nameIndex: number) {
    super(ConstantType.Package, pool)
    this.nameIndex = nameIndex
  }

  get name() {
    return this.pool.getEntry<Utf8Info>(this.nameIndex)?.string
  }
}
