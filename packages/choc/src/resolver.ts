import path from 'path'
import { Deserializer } from './deserialize'
import {
  ClassSignature,
  ClassTypeSignature,
  SignatureParser,
  TypeNode,
} from './signature'
import { ClassAccessFlag, FieldAccessFlag } from './class-file'
import { isBuiltin } from './rt-list'

export class ClassResolverManager {
  static _inst: ClassResolverManager | null = null

  _baseDir = ''
  _pending = new Map<string, Promise<ClassSignature>>()
  _pool = new Map<string, ClassSignature>()

  static singleton() {
    if (ClassResolverManager._inst === null) {
      ClassResolverManager._inst = new ClassResolverManager()
    }
    return ClassResolverManager._inst
  }

  constructor() {}

  setBaseDir(dir: string) {
    this._baseDir = dir
    return this
  }

  async resolve(binaryName: string) {
    if (this._pool.has(binaryName)) return this._pool.get(binaryName)!
    let pending = this._pending.get(binaryName)
    if (!pending) {
      pending = (async () => {
        let s: ClassSignature
        if (isBuiltin(binaryName)) {
          s = new ClassSignature()
          s.binaryName = binaryName
        } else {
          const r = new ClassResolver(this._baseDir, binaryName)
          s = await r.resolve()
        }
        this._pool.set(binaryName, s)
        this._pending.delete(binaryName)
        return s
      })()
      this._pending.set(binaryName, pending)
    }
    return pending
  }

  // assume there is `ClassA<TA>`
  //
  // for `ClassB` is defined as `ClassB<TB, TA extends Data> extends ClassTA<TA>` then 
  // every its fields of ClassB come rom `ClassTA` with generic type `TA` now have type `Data`
  //
  // for `ClassC<TC, TB extends String, TA extends Integer> extends ClassB<TB, TA>`
  // fields come from `ClassB` with generic type `TB` now have type `String` and fields
  // come from `ClassA` with generic type `TA` now have type `Integer`
  //
  // so for flatting the fields of `ClassC` we follow below steps:
  // 1. get ClassC's super classes chain: `[ClassB, ClassA]`
  // 2. shift the chain, get the shifted item is `ClassB` in this step
  // 3. grab the type args of ClassB from ClassC's type params by using ClassB's TypeArgs,
  //   `[String, Integer]` in this step
  // 4. apply those type args from step3 to ClassB
  // 5. shift the chain, get the shifted item is `ClassA` in this step
  // 6. grab the type args of ClassA from those type args from step3 by using ClassA's 
  //    TypeArgs
  // 7. apply those type args from step6 to ClassA
  // 8. merge all the fields by reverse order of the chain from step1
  //
  // for the details of how to grab the type args:
  // if we are at the step3 of above steps, the type params of ClassC should be an array of object:
  // `[ {name: 'TC', type: xxx}, { name: 'TB', type: xxx }, { name: 'TC', type: xxx } ]`
  // and ClassB has the TypeArgs: `[ { name: 'TB' }, { name: 'TA' } ]`
  //
  // note here `TB` and `TA` are type variables, not the generic type of ClassB's signature, 
  // consider this case if you feel it's confused: 
  // `ClassC<TC, TBX extends String, TAY extends Integer> extends ClassB<TBX, TAY>` and now ClassB
  // has the TypeArgs: `[ { name: 'TBX' }, { name: 'TAY } ]`
  getFlattenFields(s: ClassSignature) {
    const fields = new Map<string, TypeNode>()
    const superClasses: ClassTypeSignature[] = []
    let sp = s.superClass
    while (sp) {
      superClasses.push(sp)
      sp = this._pool.get(sp.binaryName)?.superClass
    }

    superFields
  }

  getFlattenMethods() {}
}

export class ClassResolver {
  constructor(public readonly baseDir = '', public readonly binaryName = '') {}

  async resolve(): Promise<any> {
    const dec = await Deserializer.fromFile(
      path.resolve(this.baseDir, this.binaryName + '.class')
    )
    const cf = dec.satisfy()

    let cs: ClassSignature
    if (cf.signature) {
      cs = new SignatureParser(cf.signature).parseClassSignature()
    } else {
      cs = new ClassSignature()
    }
    cs.binaryName = this.binaryName

    const superClass = cf.getSuperClass()
    if (superClass) {
      await ClassResolverManager.singleton().resolve(superClass)
    }

    cs.isInterface = !!(cf.accessFlag & ClassAccessFlag.Interface)
    cs.isAbstract = !!(cf.accessFlag & ClassAccessFlag.Abstract)
    cs.isEnum = !!(cf.accessFlag & ClassAccessFlag.Enum)

    cf.fields.forEach((field) => {
      const s = field.signature || field.descriptor
      if (s) {
        const ts = new SignatureParser(s).parseTypeSignature()
        if (ts === null) return
        ts.isStatic = !!(field.accessFlags & FieldAccessFlag.Static)
        const isPrivate = !!(field.accessFlags & FieldAccessFlag.Private)
        if (isPrivate) {
          cs.privateFields.push(field.name!)
        }
        cs.fields.set(field.name!, ts)
      }
    })

    cf.methods.forEach((method) => {
      const parser = new SignatureParser(method.descriptor!)
      const ms = parser.parseMethodTypeSignature()
      cs.methods.set(method.name!, ms)
    })

    return cs
  }
}
