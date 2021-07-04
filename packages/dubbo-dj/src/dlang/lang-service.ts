import Lang from './lang'
import { universalType } from './type'
import { IArg, IFuncArg, IType, TDataType, TFuncOption } from '../types'
import { DubboDep } from './lang-deps'

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~ model ~~~~~~~~~~~~~~~~~~~~~~~~~~
export class DubboService extends Lang {
  funcs: Array<Func>

  constructor(fullName: string, comment: string = '') {
    super(fullName, comment)
    this.funcs = []
  }

  get toJSON() {
    return {
      mott: this.mott,
      comment: this.wrapComment(this.comment),
      fullName: this.fullName,
      shortName: this.shortName,
      infName: this.infName,
      funcs: this.funcs,
      imports: this.imports(this.deps),
    }
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ DSL ~~~~~~~~~~~~~~~~~~~~~~~
export class ServiceBuilder {
  private readonly service: DubboService

  constructor(fullName: string, comment: string = '') {
    this.service = new DubboService(fullName, comment)
  }

  func(...f: Array<TFuncOption>) {
    const func = new Func()
    for (let opt of f) {
      opt(func, this.service.deps)
    }
    this.service.funcs.push(func)
    return this
  }

  get ok() {
    return this.service
  }
}

export function service(name: string, comment?: string) {
  return new ServiceBuilder(name, comment)
}

// ~~~~~~~~~ Func && FuncBuilder ~~~~~~~~~~~~~~~~~~
export class Func {
  public comment: string = ''
  public name: string = ''
  public args: Array<IFuncArg> = []
  public ret: IType = null as any
}

// ~~~~~~~~~~~~~~~ functional option type ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export const f = {
  name: (name: string, comment: string = '') => (func: Func) => {
    func.name = name
    func.comment = comment
  },
  ret: (type: TDataType) => (func: Func, deps: DubboDep) => {
    func.ret = universalType(deps, type)
  },
  args: (...args: Array<IArg>) => (func: Func, deps: DubboDep) => {
    func.args = args.map((v) => {
      return {
        ...v,
        type: universalType(deps, v.type),
      }
    })
  },
  arg: (name: string, type: TDataType, comment?: string) => {
    return {
      name,
      type,
      comment,
    }
  },
}
