import { IDepAdd, IDepValue, TFromModule } from '../types'

export class Dep {
  private readonly depMap: Map<TFromModule, IDepValue>

  constructor() {
    this.depMap = new Map<TFromModule, IDepValue>()
  }

  add({
    fromModule,
    importModule,
    is3rdModule = false,
    isDefaultModule = false,
  }: IDepAdd) {
    // 如果当前导入的模块不是第三方模块
    // 也就是当前模块我们的DSL生成的模块
    // 我们的模块名是org.apache.dubbo.service.HelloService
    // 之类的格式，所以在js中我们要进行切割
    const _fromModule = is3rdModule
      ? fromModule
      : this.resolveFromModule(fromModule)

    if (this.depMap.has(_fromModule)) {
      const moduleValue = this.depMap.get(_fromModule) as IDepValue
      if (isDefaultModule) {
        moduleValue.defaultModule = importModule
      } else {
        moduleValue.noneDefaultModules.add(importModule)
      }
    } else {
      if (isDefaultModule) {
        this.depMap.set(_fromModule, {
          is3rdModule,
          defaultModule: importModule,
          noneDefaultModules: new Set<string>(),
        })
      } else {
        this.depMap.set(_fromModule, {
          is3rdModule,
          defaultModule: '',
          noneDefaultModules: new Set([importModule]),
        })
      }
    }
  }

  getDepMap() {
    return this.depMap
  }

  resolveFromModule(importModule: string) {
    return importModule.split('.').join('/')
  }
}
