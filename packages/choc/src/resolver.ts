import path from 'path'
import assert from 'assert'
import { Deserializer } from './deserialize'
import {
  ClassSignature,
  ClassTypeSignature,
  MethodTypeSignature,
  SignatureParser,
  TypeArg,
  TypeNode,
  TypeParam,
  TypeVar,
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
  // for there is a `ClassB` is defined as `ClassB<TB, TA extends Data> extends ClassTA<TA>`
  // then every field of ClassB comes from `ClassTA` with generic type `TA` now has the type `Data`
  //
  // for there is a `ClassC` is defined as `ClassC<TC, TB extends String, TA extends Integer> extends ClassB<TB, TA>`
  // fields come from `ClassB` with generic type `TB` now have type `String` and fields come from `ClassA` with 
  // generic type `TA` now have type `Integer`
  //
  // so for flatting the fields of `ClassC` we follow below steps:
  // 1. get super classes chain of ClassC : `[ClassB, ClassA]`
  // 2. shift the chain, got the shifted item which is `ClassB` in this step
  // 3. grab the type args of ClassB from ClassC's type params by using ClassB's TypeArgs,
  //   `[String, Integer]` in this step
  // 4. apply those type args from step3 to ClassB
  // 5. shift the chain, get the shifted item is `ClassA` in this step
  // 6. grab the type args of ClassA from those type args from step3 by using ClassA's
  //    TypeArgs
  // 7. apply those type args from step6 to ClassA
  // 8. merge all the fields by using the reverse order of the chain from step1
  //
  // for the details of how to grab the type args:
  // if we are at the step3 of above steps, the type params of ClassC should be an array of object:
  // `[ {name: 'TC', type: xxx}, { name: 'TB', type: xxx }, { name: 'TA', type: xxx } ]`
  // and ClassB will apply type args: `[ { name: 'TB' }, { name: 'TA' } ]`
  //
  // note here `TB` and `TA` are type variables, not the generic type of ClassB's signature,
  // consider below case if you feel it's confused:
  // `ClassC<TC, TBX extends String, TAY extends Integer> extends ClassB<TBX, TAY>` and now the type args
  // passed to ClassB to apply are: `[ { name: 'TBX' }, { name: 'TAY } ]`
  async getFlattenFields(s: ClassSignature | string, typeArgs: TypeArg[] = []) {
    if (typeof s === 'string') s = await this.resolve(s)

    const fields = new Map<string, TypeNode>()
    let privateFields: string[] = []

    const superClasses: ClassTypeSignature[] = []
    let sp = s.superClass
    while (sp) {
      superClasses.push(sp)
      sp = this._pool.get(sp.binaryName)?.superClass
    }

    let superFields: Array<Map<string, TypeNode>> = []
    let prevAppliedTypeArgs = typeArgs

    // if no type args is specified then use the base
    // type of the type param as type arg
    if (prevAppliedTypeArgs.length === 0) {
      prevAppliedTypeArgs = s.typeParams.map((t) => {
        const ta = new TypeArg()
        ta.type = t.types[0]
        return ta
      })
    }

    const ownFields = await this.applyTypeArgs(
      s.binaryName,
      prevAppliedTypeArgs
    )

    let prevTypeParams = s.typeParams
    for (const sp of superClasses) {
      const args: TypeArg[] = []

      for (const ta of sp.typeArgs) {
        if (!ta.type) continue

        if (ta.type.isTypeVar) {
          const idx = prevTypeParams.findIndex(
            (p) => p.name === (ta.type as TypeVar).name
          )
          args.push(prevAppliedTypeArgs[idx])
        } else {
          args.push(ta)
        }
      }

      const spc = await this.resolve(sp.binaryName)
      const applied = await this.applyTypeArgs(spc.binaryName, args)
      superFields.push(applied.fields)
      prevTypeParams = spc.typeParams
      prevAppliedTypeArgs = applied.args

      privateFields = privateFields.concat(spc.privateFields)
    }

    for (let i = superFields.length - 1; i >= 0; --i) {
      superFields[i].forEach((v, k) => fields.set(k, v))
    }
    ownFields.fields.forEach((v, k) => fields.set(k, v))

    // TODO: enum

    const noStatic = new Map<string, TypeNode>()
    fields.forEach((v, k) => {
      if (v.isStatic) return
      noStatic.set(k, v)
    })

    return noStatic
  }

  async applyTypeArgs(binaryName: string, args: TypeArg[]) {
    const cs = await this.resolve(binaryName)
    const fields = new Map<string, TypeNode>()

    const names: string[] = []
    const namedArgs = new Map<string, TypeArg>()
    // if no arg then use the default params
    if (args.length === 0) {
      for (const tp of cs.typeParams) {
        const ta = new TypeArg()
        ta.type = tp.types[0]
        names.push(tp.name)
        namedArgs.set(tp.name, ta)
      }
    } else {
      cs.typeParams.forEach((p, i) => {
        names.push(p.name)
        namedArgs.set(p.name, args[i])
      })
    }

    for (const [name, field] of cs.fields) {
      // class<T> { field: T }
      if (field.isTypeVar) {
        fields.set(name, namedArgs.get((field as TypeVar).name)?.type!)
      } else {
        assert(field.isClassType)
        // class<T> { field: ArrayList<T> }
        const c = (field as ClassTypeSignature).clone()
        c.applyTypeArgs(namedArgs)
        fields.set(name, c)
      }
    }

    const appliedArgs: TypeArg[] = []
    names.forEach((name) => {
      if (namedArgs.has(name)) appliedArgs.push(namedArgs.get(name)!)
    })
    return { fields, args: appliedArgs }
  }

  async getMethods(s: ClassSignature | string) {
    if (typeof s === 'string') s = await this.resolve(s)

    const noInternal = new Map<string, MethodTypeSignature>()
    if (s.isEnum) return noInternal

    for (const [name, m] of s.methods) {
      if (name.startsWith('<init>') || name.startsWith('<clinit>')) continue
      noInternal.set(name, m)
    }

    return noInternal
  }
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
