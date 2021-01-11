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
    this.deps.add('js-to-java', 'java')
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

    parseTypeMeta(type, this.deps, {
      onBasic: (t) => {
        method.args.push({
          name,
          tsType: t.tsType,
          javaType: `${t.javaType}(${name})`,
        })
      },
      onEnum: (t) => {
        const clsName = this.deps.add(t.fullClsName, t.clsName)
        method.args.push({
          name,
          tsType: clsName,
          javaType: `java.enum('${t.fullClsName}', ${t.clsName}[${name}])`,
        })
      },
      onEntity: (t) => {
        const infName = this.deps.add(t.fullClsName, t.infName, false)
        const clsName = this.deps.add(t.fullClsName, t.clsName)
        method.args.push({
          name,
          tsType: infName,
          javaType: `new ${clsName}(${name}).__fields2java()`,
        })
      },
      onGenericOne: (t) => {
        method.args.push({
          name,
          tsType: `${t.tsType}<${t.generic.tsType}>`,
          javaType: ``,
        })
      },
      onGenericTwo: (t) => {
        method.args.push({
          name,
          tsType: `${t.tsType}<${(t.generic[0].tsType, t.generic[1].tsType)}>`,
          javaType: ``,
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

    parseTypeMeta(type, this.deps, {
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
          javaType: `new ${clsName}(res).__fields2java()`,
        }
      },
      onGenericOne: (t) => {
        method.ret = {
          tsType: `${t.tsType}<${t.generic.tsType}>`,
          javaType: ``,
        }
      },
      onGenericTwo: (t) => {
        method.ret = {
          tsType: `${t.tsType}<${t.generic[0].tsType}, ${t.generic[1].tsType}>`,
          javaType: ``,
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
