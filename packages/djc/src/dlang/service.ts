import { IType, TServiceMethod } from '../types'
import Lang from './lang'
import { Entity } from './entity'

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

  arg(name: string, type: Entity | (() => IType)) {
    const method = this._methods[this._curMethodName]

    if (type instanceof Entity) {
      const renamed = this.deps.add(type.fullClsName, type.infName, false)
      method.args.push({
        name,
        type: renamed,
      })
    } else {
      // FIXEDME 泛型的处理
      method.args.push({
        name,
        type: type().tsType,
      })
    }

    return this
  }

  ret(type: Entity | (() => IType)) {
    // get current method meta data
    const method = this._methods[this._curMethodName]

    if (type instanceof Entity) {
      const renameClsName = this.deps.add(type.fullClsName, type.clsName)
      method.ret = renameClsName
    } else {
      // FXIEDME 反省处理
      method.ret = type().tsType
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

    arg(name: string, type: Entity | (() => IType)) {
      s.arg(name, type)
      return this
    },

    ret(type: Entity | (() => IType)) {
      s.ret(type)
      return this
    },
    ok() {
      return s
    },
  }
}
