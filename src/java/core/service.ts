import { combine } from 'js-to-java'
import { IType, TServiceMethod } from '../types'
import BaseClazz from './base-clazz'
import { JavaClazz } from './clazz'

export class JavaService extends BaseClazz {
  _group: string = ''
  _version: string = '1.0.0'
  _methods: TServiceMethod = {}
  private _curMethodName: string = ''

  constructor(fullClsName: string) {
    super(fullClsName)
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

  arg(name: string, type: JavaClazz | (() => IType)) {
    const method = this._methods[this._curMethodName]

    if (type instanceof JavaClazz) {
      const renamed = this.deps.add(type.fullClsName, type.clsName)
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

  ret(type: JavaClazz | (() => IType)) {
    // get current method meta data
    const method = this._methods[this._curMethodName]

    if (type instanceof JavaClazz) {
      const renameClsName = this.deps.add(type.fullClsName, type.clsName)
      method.ret = renameClsName
    } else {
      // FXIEDME 反省处理
      method.ret = type().tsType
    }

    return this
  }
}

export default function Service(fullClsName: string) {
  const service = new JavaService(fullClsName)
  return {
    group(group: string) {
      service.group(group)
      return this
    },

    version(version: string) {
      service.version(version)
      return this
    },

    method(name: string) {
      service.method(name)
      return this
    },

    arg(name: string, type: JavaClazz | (() => IType)) {
      service.arg(name, type)
      return this
    },

    ret(type: JavaClazz | (() => IType)) {
      service.ret(type)
      return this
    },
    ok() {
      return service
    },
  }
}
