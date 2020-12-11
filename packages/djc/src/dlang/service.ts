import { IType, TServiceMethod } from '../types'
import Lang from './lang'
import { Entity } from './entity'
import { Enum } from './enum'
import { parseTypeMeta } from './type'
export class Service extends Lang {
  _group: string = ''
  _version: string = '1.0.0'
  _methods: TServiceMethod = {}
  private _curMethodName: string = ''

  constructor(fullClsName: string, comment?: string) {
    super(fullClsName, comment)
  }

  group(group: string) {
    this._group = group
    return this
  }

  version(version: string) {
    this._version = version
    return this
  }

  method(name: string) {
    // set current method
    this._curMethodName = name

    // init method
    this._methods[name] = {
      args: [],
      ret: null,
    } as any

    return this
  }

  arg(name: string, type: Entity | Enum | (() => IType)) {
    const method = this._methods[this._curMethodName]

    parseTypeMeta(type, {
      onBasic(t) {
        method.args.push({
          name,
          type: t.tsType,
        })
      },
      onEnum: (t) => {
        const clsName = this.deps.add(t.fullClsName, t.clsName)
        method.args.push({ name, type: clsName })
      },
      onEntity: (t) => {
        const infName = this.deps.add(t.fullClsName, t.infName, false)
        method.args.push({ name, type: infName })
      },
      onGenericOneBasic: (t) => {
        method.args.push({
          name,
          type: `${t.tsType}<${t.generic.tsType}>`,
        })
      },
      onGenericOneEnum: (t) => {
        const clsName = this.deps.add(t.generic.fullClsName, t.generic.clsName)
        method.args.push({
          name,
          type: `${t.tsType}<${clsName}>`,
        })
      },
      onGenericOneEntity: (t) => {
        const infName = this.deps.add(
          t.generic.fullClsName,
          t.generic.infName,
          false
        )
        method.args.push({
          name,
          type: `${t.tsType}<${infName}>`,
        })
      },
      onGenericTwoBasic: (t) => {
        method.args.push({
          name,
          type: `${t.tsType}<string, ${t.generic.tsType}>`,
        })
      },
      onGenericTwoEnum: (t) => {
        const clsName = this.deps.add(t.generic.fullClsName, t.generic.clsName)
        method.args.push({
          name,
          type: `${t.tsType}<string, ${clsName}>`,
        })
      },
      onGenericTwoEntity: (t) => {
        const infName = this.deps.add(
          t.generic.fullClsName,
          t.generic.infName,
          false
        )
        method.args.push({
          name,
          type: `${t.tsType}<string, ${infName}>`,
        })
      },
    })

    return this
  }

  ret(type?: Entity | Enum | (() => IType)) {
    if (!type) {
      return this
    }

    // get current method meta data
    const method = this._methods[this._curMethodName]

    parseTypeMeta(type, {
      onBasic(t) {
        method.ret = {
          tsType: t.tsType,
          javaType: `${t.javaType}(res)`,
        }
      },
      onEnum: (t) => {
        const clsName = this.deps.add(t.fullClsName, t.clsName)
        method.ret = {
          tsType: clsName,
          javaType: `java.enum('${t.fullClsName}', ${t.clsName}[res])`,
        }
      },
      onEntity: (t) => {
        const infName = this.deps.add(t.fullClsName, t.infName, false)
        const clsName = this.deps.add(t.fullClsName, t.clsName)
        method.ret = {
          tsType: infName,
          javaType: `new ${clsName}(res).__field2java()`,
        }
      },
      onGenericOneBasic: (t) => {
        this.deps.add('@dubbo/sugar', 's')
        method.ret = {
          tsType: `${t.tsType}<${t.generic.tsType}>`,
          javaType: `${t.javaType}(s.$lhs(res, ${t.generic.javaType}))`,
        }
      },
      onGenericOneEnum: (t) => {
        this.deps.add('@dubbo/sugar', 's')
        const clsName = this.deps.add(t.generic.fullClsName, t.generic.clsName)
        method.ret = {
          tsType: `${t.tsType}<${clsName}>`,
          javaType: `${t.javaType}(s.$lhs(res))`,
        }
      },
      onGenericOneEntity: (t) => {
        this.deps.add('@dubbo/sugar', 's')
        const infName = this.deps.add(
          t.generic.fullClsName,
          t.generic.infName,
          false
        )
        method.ret = {
          tsType: `${t.tsType}<${infName}>`,
          javaType: `${t.javaType}(s.$lhs(res))`,
        }
      },
      onGenericTwoBasic: (t) => {
        this.deps.add('@dubbo/sugar', 's')
        method.ret = {
          tsType: `${t.tsType}<string, ${t.generic.tsType}>`,
          javaType: `s.$mhs(res, ${t.generic.javaType})`,
        }
      },
      onGenericTwoEnum: (t) => {
        this.deps.add('@dubbo/sugar', 's')
        const clsName = this.deps.add(t.generic.fullClsName, t.generic.clsName)
        method.ret = {
          tsType: `${t.tsType}<string, ${clsName}>`,
          javaType: `s.$mhs(res)`,
        }
      },
      onGenericTwoEntity: (t) => {
        this.deps.add('@dubbo/sugar', 's')
        const infName = this.deps.add(
          t.generic.fullClsName,
          t.generic.infName,
          false
        )
        method.ret = {
          tsType: `${t.tsType}<string, ${infName}>`,
          javaType: `s.$mhs(res)`,
        }
      },
    })

    return this
  }
}

class ServiceBuilder {
  constructor(private s: Service) {}
  group(group: string) {
    this.s.group(group)
    return this
  }

  version(version: string) {
    this.s.version(version)
    return this
  }

  method(name: string) {
    this.s.method(name)
    return this
  }

  arg(name: string, type: Entity | Enum | (() => IType)) {
    this.s.arg(name, type)
    return this
  }
  ret(type: Entity | Enum | (() => IType)) {
    this.s.ret(type)
    return this
  }

  ok() {
    return this.s
  }
}

export default function service(fullClsName: string, comment?: string) {
  const s = new Service(fullClsName, comment)
  return new ServiceBuilder(s)
}
