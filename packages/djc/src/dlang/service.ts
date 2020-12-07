import { IType, TServiceMethod } from '../types'
import Lang from './lang'
import { Entity } from './entity'
import { Enum } from './enum'

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

    if (type instanceof Enum) {
      const renamed = this.deps.add(type.fullClsName, type.clsName)
      method.args.push({ name, type: renamed })
      return this
    }

    if (type instanceof Entity) {
      const renamed = this.deps.add(type.fullClsName, type.infName, false)
      method.args.push({
        name,
        type: renamed,
      })
      return this
    }

    // 获取当前的类型信息
    const { tsType, generic } = type()

    // 如果当前类型没有泛型
    if (!generic || generic.length === 0) {
      method.args.push({
        name,
        type: tsType,
      })

      return this
    }

    // 如果当前有泛型，泛型参数有一个

    if (generic?.length === 1) {
      const g = generic[0]
      if (g instanceof Entity) {
        const renamed = this.deps.add(g.fullClsName, g.infName)
        method.args.push({
          name,
          type: `${tsType}<${renamed}>`,
        })
      } else if (g instanceof Enum) {
        const rename = this.deps.add(g.fullClsName, g.clsName)
        method.args.push({ name, type: `${tsType}<${rename}>` })
      } else {
        method.args.push({
          name,
          type: `${tsType}<${g.tsType}>`,
        })
      }
      return this
    }

    if (generic.length === 2) {
      const [lg, rg] = generic
      if (lg instanceof Entity || lg.javaType !== 'java.String') {
        throw new Error(
          'Map/HashMap/Dictionary left generic type only support java.String'
        )
      }
      if (rg instanceof Entity) {
        const renamed = this.deps.add(rg.fullClsName, rg.infName)
        method.args.push({
          name,
          type: `${tsType}<string, ${renamed}`,
        })
      } else if (rg instanceof Enum) {
        const renamed = this.deps.add(rg.fullClsName, rg.clsName)
        method.args.push({
          name,
          type: `${tsType}<string, ${renamed}`,
        })
      } else {
        method.args.push({
          name,
          type: `${tsType}<string, ${rg.tsType}>`,
        })
      }
    }

    return this
  }

  ret(type: Entity | Enum | (() => IType)) {
    // get current method meta data
    const method = this._methods[this._curMethodName]

    if (type instanceof Enum) {
      const renamed = this.deps.add(type.fullClsName, type.clsName)
      method.ret = renamed
      return this
    }

    if (type instanceof Entity) {
      const renameClsName = this.deps.add(type.fullClsName, type.clsName)
      method.ret = renameClsName
      return this
    }

    const { tsType, generic } = type()

    // basic type, not generic type
    if (!generic || generic.length === 0) {
      method.ret = tsType
      return this
    }

    // 如果只有一个泛型
    if (generic.length === 1) {
      const g = generic[0]
      if (g instanceof Entity) {
        const rename = this.deps.add(g.fullClsName, g.infName)
        method.ret = `${tsType}<${rename}>`
      } else if (g instanceof Enum) {
        const rename = this.deps.add(g.fullClsName, g.clsName)
        method.ret = `${tsType}<${rename}>`
      } else {
        method.ret = `${tsType}<${g.tsType}>`
      }
      return this
    }

    // 如果有两个泛型
    if (generic.length === 2) {
      const [lg, rg] = generic
      if (lg instanceof Entity || lg.javaType !== 'java.String') {
        throw new Error(
          'Map/HashMap/Dictionary left generic type only support java.String'
        )
      }

      if (rg instanceof Entity) {
        const rename = this.deps.add(rg.fullClsName, rg.infName)
        method.ret = `${tsType}<string, ${rename}>`
      } else if (rg instanceof Enum) {
        const rename = this.deps.add(rg.fullClsName, rg.clsName)
        method.ret = `${tsType}<string, ${rename}>`
      } else {
        method.ret = `${tsType}<string, ${rg.tsType}>`
      }
    }

    return this
  }
}

export default function service(fullClsName: string, comment?: string) {
  const s = new Service(fullClsName, comment)
  return {
    group(group: string) {
      s.group(group)
      return this
    },

    version(version: string) {
      s.version(version)
      return this
    },

    method(name: string) {
      s.method(name)
      return this
    },

    arg(name: string, type: Entity | Enum | (() => IType)) {
      s.arg(name, type)
      return this
    },

    ret(type: Entity | Enum | (() => IType)) {
      s.ret(type)
      return this
    },

    ok() {
      return s
    },
  }
}
