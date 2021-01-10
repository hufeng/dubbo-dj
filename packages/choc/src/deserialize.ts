import fs from 'fs'
import { promisify } from 'util'
import { ClassFile, AttributeInfo, FieldInfo, MethodInfo } from './class-file'
import { AutoOffsetBuffer } from './buffer'
import { ConstantPool } from './constant-pool'

const readFile = promisify(fs.readFile)

export class Deserializer {
  buf: AutoOffsetBuffer

  static async fromFile(file: string) {
    const buf = await readFile(file)
    return new Deserializer(buf)
  }

  constructor(buf: Buffer) {
    this.buf = new AutoOffsetBuffer(buf, 0)
  }

  satisfy() {
    const cf = new ClassFile()
    cf.magic = this.buf.readUInt32BE()
    cf.minorVersion = this.buf.readUInt16BE()
    cf.majorVersion = this.buf.readUInt16BE()

    cf.constantPoolCount = this.buf.readUInt16BE()
    cf.constantPool = new ConstantPool(this.buf, cf.constantPoolCount)
    cf.constantPool.satisfy()

    cf.accessFlag = this.buf.readUInt16BE()
    cf.thisClass = this.buf.readUInt16BE()
    cf.superClass = this.buf.readUInt16BE()

    cf.interfacesCount = this.buf.readUInt16BE()
    cf.interfaces = this._readInterfaces(cf.interfacesCount)

    cf.fieldsCount = this.buf.readUInt16BE()
    cf.fields = this._readFields(cf.constantPool, cf.fieldsCount)

    cf.methodsCount = this.buf.readUInt16BE()
    cf.methods = this._readMethods(cf.constantPool, cf.methodsCount)

    cf.attributesCount = this.buf.readUInt16BE()
    cf.attributes = this._readAttributes(cf.constantPool, cf.attributesCount)
    return cf
  }

  _readInterfaces(cnt: number) {
    const r: number[] = []
    for (let i = 0; i < cnt; ++i) {
      r.push(this.buf.readUInt16BE())
    }
    return r
  }

  _readFields(constantPool: ConstantPool, cnt: number) {
    const r: FieldInfo[] = []
    for (let i = 0; i < cnt; ++i) {
      const f = new FieldInfo(constantPool)
      f.accessFlags = this.buf.readUInt16BE()
      f.nameIndex = this.buf.readUInt16BE()
      f.descriptorIndex = this.buf.readUInt16BE()
      f.attributesCount = this.buf.readUInt16BE()
      f.attributes = this._readAttributes(constantPool, f.attributesCount)
      r.push(f)
    }
    return r
  }

  _readMethods(constantPool: ConstantPool, cnt: number) {
    const r: MethodInfo[] = []
    for (let i = 0; i < cnt; ++i) {
      const m = new MethodInfo(constantPool)
      m.accessFlags = this.buf.readUInt16BE()
      m.nameIndex = this.buf.readUInt16BE()
      m.descriptorIndex = this.buf.readUInt16BE()
      m.attributesCount = this.buf.readUInt16BE()
      m.attributes = this._readAttributes(constantPool, m.attributesCount)
      r.push(m)
    }
    return r
  }

  _readAttributes(constantPool: ConstantPool, cnt: number) {
    const r: AttributeInfo[] = []
    for (let i = 0; i < cnt; ++i) {
      const a = new AttributeInfo()
      a.nameIndex = this.buf.readUInt16BE()
      a.length = this.buf.readUInt32BE()
      a.info = this.buf.forward(a.length)
      a.constantPool = constantPool
      r.push(a)
    }
    return r
  }
}
