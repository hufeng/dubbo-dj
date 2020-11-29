import fs from 'fs'
import path from 'path'
import dot from 'dot'
import { IType, Model } from './java-model'
import Base from './java'

type TServiceMethod = {
  [k in string]: IMethodMeta
}

type IMethodArgs = {
  name: string
  type: string
}

export interface IMethodMeta {
  args: Array<IMethodArgs>
  ret: string
}

const dotService = dot.template(
  fs.readFileSync(path.join(__dirname, './dot/service.dot')).toString()
)

class Service extends Base {
  private _serviceName: string
  private _group: string = ''
  private _version: string = '1.0.0'
  private _methods: TServiceMethod = {}
  private _curMethodName: string = ''

  constructor(private inf: string) {
    super()
    this._serviceName = this.inf.split('.').pop() || ''
  }

  group(group: string) {
    return this
  }

  version(version: string) {
    this._version = version
    return this
  }

  method(name: string) {
    this._curMethodName = name
    this._methods[name] = {
      args: [],
      ret: null,
    } as any
    return this
  }

  arg(name: string, type: () => IType | Model) {
    const method = this._methods[this._curMethodName]
    if (type instanceof Model) {
      const renameClsName = this.deps.add(this.cls2Path(type.cls), type.clsName)
      method.args.push({
        name,
        type: renameClsName,
      })
    } else {
      method.args.push({
        name,
        type: (type() as IType).tsType,
      })
    }

    return this
  }

  ret(type: () => IType | Model) {
    const method = this._methods[this._curMethodName]
    if (type instanceof Model) {
      const renameClsName = this.deps.add(this.cls2Path(type.cls), type.clsName)
      method.ret = renameClsName
    } else {
      method.ret = (type() as IType).tsType
    }
    return this
  }

  get serviceCode() {
    const methods = []
    const args = []

    for (let [name, meta] of Object.entries(this._methods)) {
      for (let arg of meta.args) {
        args.push(`${arg.name}: ${arg.type}`)
      }
      methods.push(`
        ${name}(${args.join()})${meta.ret ? ':' + meta.ret : 'void'} {
          // TODO implements this this method
        }
      `)
    }

    return dotService({
      mott: this.mott,
      service: this.inf,
      serviceName: this._serviceName,
      group: this._group,
      version: this._version,
      methods: methods,
    })
  }
}

export function service(inf: string) {
  return new Service(inf)
}
