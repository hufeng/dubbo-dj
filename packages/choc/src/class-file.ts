import { ConstantPool, ClassInfo, ConstantInfo } from './constant-pool'
import { Utf8Info } from './constant-pool'
import { AutoOffsetBuffer } from './buffer'

export enum ClassAccessFlag {
  Public = 0x0001,
  Final = 0x0010,
  Super = 0x0020,
  Interface = 0x0200,
  Abstract = 0x0400,
  Synthetic = 0x1000,
  Annotation = 0x2000,
  Enum = 0x4000,
  Module = 0x8000,
}

export enum FieldAccessFlag {
  Public = 0x0001,
  Private = 0x0002,
  Protected = 0x0004,
  Static = 0x0008,
  Final = 0x0010,
  Volatile = 0x0040,
  Transient = 0x0080,
  Synthetic = 0x1000,
  Enum = 0x4000,
}

export enum MethodAccessFlag {
  Public = 0x0001,
  Private = 0x0002,
  Protected = 0x0004,
  Static = 0x0008,
  Final = 0x0010,
  Synchronized = 0x0020,
  Bridge = 0x0040,
  Varargs = 0x0080,
  Native = 0x0100,
  Abstract = 0x0400,
  Strict = 0x0800,
  Synthetic = 0x1000,
}

export enum AttributeInfoType {
  Unspecified = 'unspecified',
  ConstantValue = 'ConstantValue',
  Code = 'Code',
  StackMapTable = 'StackMapTable',
  Exceptions = 'Exceptions',
  BootstrapMethods = 'BootstrapMethods',
  InnerClasses = 'InnerClasses',
  EnclosingMethod = 'EnclosingMethod',
  Synthetic = 'Synthetic',
  Signature = 'Signature',
  SourceFile = 'SourceFile',
  LineNumberTable = 'LineNumberTable',
  LocalVariableTable = 'LocalVariableTable',
  LocalVariableTypeTable = 'LocalVariableTypeTable',
  SourceDebugExtension = 'SourceDebugExtension',
  Deprecated = 'Deprecated',
  RuntimeVisibleAnnotations = 'RuntimeVisibleAnnotations',
  RuntimeInvisibleAnnotations = 'RuntimeInvisibleAnnotations',
  RuntimeVisibleParameterAnnotations = 'RuntimeVisibleParameterAnnotations',
  RuntimeInvisibleParameterAnnotations = 'RuntimeInvisibleParameterAnnotations',
  RuntimeVisibleTypeAnnotations = 'RuntimeVisibleTypeAnnotations',
  RuntimeInvisibleTypeAnnotations = 'RuntimeInvisibleTypeAnnotations',
  AnnotationDefault = 'AnnotationDefault',
  MethodParameters = 'MethodParameters',
  Module = 'Module',
  ModulePackages = 'ModulePackages',
  ModuleMainClass = 'ModuleMainClass',
}

export class AttributeInfo {
  type = AttributeInfoType.Unspecified
  nameIndex = -1
  length = 0
  info = Buffer.alloc(0)
  constantPool = ConstantPool.default()

  constructor(attr?: AttributeInfo) {
    if (attr instanceof AttributeInfo) {
      this.nameIndex = attr.nameIndex
      this.length = attr.length
      this.info = attr.info
      this.constantPool = attr.constantPool
    }
  }

  get name() {
    return this.constantPool.getEntry<Utf8Info>(this.nameIndex)?.string
  }

  getType() {
    return this.name
  }

  get isConstantValue() {
    return this.name === AttributeInfoType.ConstantValue
  }

  get isCode() {
    return this.name === AttributeInfoType.Code
  }

  get isSignature() {
    return this.name === AttributeInfoType.Signature
  }

  get isMethodParameters() {
    return this.name === AttributeInfoType.MethodParameters
  }

  satisfy() {
    this.type = this.name as any
  }

  to<T extends AttributeInfo>(ctor: new (...args: any[]) => T) {
    const attr = new ctor(this)
    attr.satisfy()
    return attr
  }
}

export class ConstantValueAttr extends AttributeInfo {
  type = AttributeInfoType.ConstantValue
  constantValueIndex = -1

  satisfy() {
    this.constantValueIndex = this.info.readUInt16BE(0)
  }

  getValue<T extends ConstantInfo>() {
    return this.constantPool.getEntry<T>(this.constantValueIndex)
  }
}

export class CodeAttrExceptionTableEntry {
  startPC = -1
  endPC = -1
  handlerPC = -1
  catchType = -1
}

export class CodeAttr extends AttributeInfo {
  type = AttributeInfoType.Code
  maxStack = -1
  maxLocals = -1
  codeLength = 0
  code = Buffer.alloc(0)
  exceptionTableLength = -1
  exceptionTable: CodeAttrExceptionTableEntry[] = []
  attributesCount = -1
  attributes: AttributeInfo[] = []

  satisfy() {
    const buf = new AutoOffsetBuffer(this.info, 0)
    this.maxStack = buf.readUInt16BE()
    this.maxLocals = buf.readUInt16BE()
    this.codeLength = buf.readUInt32BE()
    this.code = buf.forward(this.codeLength)
    this.exceptionTableLength = buf.readUInt16BE()
    this.exceptionTable = []
    for (let i = 0, len = this.exceptionTableLength; i < len; ++i) {
      const entry = new CodeAttrExceptionTableEntry()
      entry.startPC = buf.readUInt16BE()
      entry.endPC = buf.readUInt16BE()
      entry.handlerPC = buf.readUInt16BE()
      entry.catchType = buf.readUInt16BE()
      this.exceptionTable.push(entry)
    }
    this.attributesCount = buf.readUInt16BE()
    this.attributes = []
    for (let i = 0, len = this.attributesCount; i < len; ++i) {
      const attr = new AttributeInfo()
      attr.nameIndex = buf.readUInt16BE()
      attr.length = buf.readUInt32BE()
      attr.info = buf.forward(attr.length)
      this.attributes.push(attr)
    }
  }
}

export class SourceFileAttr extends AttributeInfo {
  type = AttributeInfoType.SourceFile
  sourceFileIndex = -1

  satisfy() {
    this.sourceFileIndex = this.info.readUInt16BE(0)
  }

  get sourceFile() {
    return this.constantPool.getEntry<Utf8Info>(this.sourceFileIndex)?.string
  }
}

export class InnerClassTableEntry {
  innerClassInfoIndex = -1
  outerClassInfoIndex = -1
  innerNameIndex = -1
  innerClassAccessFlags = -1
}

export class InnerClassesAttr extends AttributeInfo {
  type = AttributeInfoType.InnerClasses
  numberOfClasses = 0
  classTable: InnerClassTableEntry[] = []

  satisfy() {
    const buf = new AutoOffsetBuffer(this.info, 0)
    this.numberOfClasses = buf.readUInt16BE()
    this.classTable = []
    for (let i = 0, len = this.numberOfClasses; i < len; ++i) {
      const entry = new InnerClassTableEntry()
      entry.innerClassInfoIndex = buf.readUInt16BE()
      entry.outerClassInfoIndex = buf.readUInt16BE()
      entry.innerNameIndex = buf.readUInt16BE()
      entry.innerClassAccessFlags = buf.readUInt16BE()
      this.classTable.push(entry)
    }
  }
}

export class MethodParameterTableEntry {
  nameIndex = -1
  accessFlags = -1
}

export class MethodParameters extends AttributeInfo {
  type = AttributeInfoType.MethodParameters
  parametersCount = 0
  parameterTable: MethodParameterTableEntry[] = []

  satisfy() {
    const buf = new AutoOffsetBuffer(this.info, 0)
    this.parametersCount = buf.readUInt8()
    this.parameterTable = []
    for (let i = 0, len = this.parametersCount; i < len; ++i) {
      const entry = new MethodParameterTableEntry()
      entry.nameIndex = buf.readUInt16BE()
      entry.accessFlags = buf.readUInt16BE()
      this.parameterTable.push(entry)
    }
  }

  get formalParams() {
    return this.parameterTable.map(
      (p) => this.constantPool.getEntry<Utf8Info>(p.nameIndex)?.string
    )
  }
}

export class SignatureAttr extends AttributeInfo {
  type = AttributeInfoType.Signature
  signatureIndex = -1

  satisfy() {
    this.signatureIndex = this.info.readUInt16BE(0)
  }

  get signature() {
    return this.constantPool.getEntry<Utf8Info>(this.signatureIndex)?.string
  }
}

export class FieldInfo {
  accessFlags = -1
  nameIndex = -1
  descriptorIndex = -1
  attributesCount = 0
  attributes: AttributeInfo[] = []
  constantPool: ConstantPool
  constructor(constantPool: ConstantPool) {
    this.constantPool = constantPool
  }

  get name() {
    return this.constantPool.getEntry<Utf8Info>(this.nameIndex)?.string
  }

  get descriptor() {
    return this.constantPool.getEntry<Utf8Info>(this.descriptorIndex)?.string
  }

  get signature() {
    const attrs = this.attributes.filter((attr) => attr.isSignature)
    if (attrs.length === 1) return attrs[0].to(SignatureAttr).signature
    return null
  }
}

export class MethodInfo {
  accessFlags = -1
  nameIndex = -1
  descriptorIndex = -1
  attributesCount = 0
  attributes: AttributeInfo[] = []
  constantPool: ConstantPool
  constructor(constantPool: ConstantPool) {
    this.constantPool = constantPool
  }

  get name() {
    return this.constantPool.getEntry<Utf8Info>(this.nameIndex)?.string
  }

  get descriptor() {
    return this.constantPool.getEntry<Utf8Info>(this.descriptorIndex)?.string
  }

  get signature() {
    const attrs = this.attributes.filter((attr) => attr.isSignature)
    if (attrs.length === 1) return attrs[0].to(SignatureAttr).signature
    return null
  }

  get formalParams() {
    const attrs = this.attributes.filter((attr) => attr.isMethodParameters)
    if (attrs.length === 1) return attrs[0].to(MethodParameters).formalParams
    return []
  }
}

export class ClassFile {
  magic = -1
  minorVersion = -1
  majorVersion = -1
  constantPoolCount = -1
  constantPool = ConstantPool.default()
  accessFlag = -1
  thisClass = -1
  superClass = -1
  interfacesCount = 0
  interfaces: number[] = []
  fieldsCount = 0
  fields: FieldInfo[] = []
  methodsCount = 0
  methods: MethodInfo[] = []
  attributesCount = 0
  attributes: AttributeInfo[] = []

  get name() {
    return this.constantPool.getEntry<ClassInfo>(this.thisClass)?.name
  }

  // has value if there are generic types in class definition
  get signature() {
    const attrs = this.attributes.filter((attr) => attr.isSignature)
    if (attrs.length === 1) return attrs[0].to(SignatureAttr).signature
    return null
  }

  getSuperClass() {
    return this.constantPool.getEntry<ClassInfo>(this.superClass)?.name
  }

  getInterfaces() {
    return this.interfaces.map(
      (itf) => this.constantPool.getEntry<ClassInfo>(itf)?.name
    )
  }
}
