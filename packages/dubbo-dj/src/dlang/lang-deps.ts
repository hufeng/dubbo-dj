export type TFromModule = string
export interface IDepValue {
  is3rdLib: boolean
  defaultModule: string
  noneDefaultModules: Set<string>
}
export interface IDepAdd {
  fromModule: string
  importModule: string
  isDefaultModule?: boolean
  is3rdLib?: boolean
}

export class DubboDep {
  private readonly depMap: Map<TFromModule, IDepValue>

  constructor() {
    this.depMap = new Map<TFromModule, IDepValue>()
  }

  add({
    fromModule,
    importModule,
    isDefaultModule = false,
    is3rdLib = false,
  }: IDepAdd) {
    if (this.depMap.has(fromModule)) {
      const moduleValue = this.depMap.get(fromModule) || {
        defaultModule: '',
        noneDefaultModules: new Set(),
      }
      if (isDefaultModule) {
        moduleValue.defaultModule = importModule
      } else {
        moduleValue.noneDefaultModules.add(importModule)
      }
    } else {
      if (isDefaultModule) {
        this.depMap.set(fromModule, {
          is3rdLib,
          defaultModule: importModule,
          noneDefaultModules: new Set<string>(),
        })
      } else {
        this.depMap.set(fromModule, {
          is3rdLib,
          defaultModule: '',
          noneDefaultModules: new Set([importModule]),
        })
      }
    }
  }

  getDepMap() {
    return this.depMap
  }
}
