import { getWithDef } from '../common'

type fullClassName = string

export interface IDepCount {
  offset: number
  map: {
    [k in fullClassName]: {
      clsName: string
      isDefault: boolean
    }
  }
}

/**
 * collect deps
 */
export default class Deps {
  private map: Map<string, IDepCount> = new Map()

  /**
   * 添加依赖
   * @param fullName 当前entity或者service的全名称
   * @param clsName  当前的类名
   * @param isDefault  是不是默认导入
   */

  add(fullName: string, clsName: string, isDefault: boolean = true) {
    let val = this.map.get(clsName)

    if (val) {
      // 如果当前的依赖已经存在
      const existClsName = val.map[fullName]
      if (existClsName) {
        return existClsName.clsName
      }

      // 不存在
      const renameClsName = `${clsName}${val.offset}`
      val.map[fullName] = {
        clsName: renameClsName,
        isDefault,
      }
      val.offset++
      return renameClsName
    } else {
      this.map.set(clsName, {
        offset: 1,
        map: {
          [fullName]: {
            clsName,
            isDefault,
          },
        },
      })
    }

    return clsName
  }

  /**
   * 获取当前需要导入的模块
   */
  get imports() {
    const imports = {} as {
      [k in string]: {
        defaultImport: string
        specifiers: Array<string>
      }
    }
    for (let { map } of this.map.values()) {
      for (let [fullClassName, { clsName, isDefault }] of Object.entries(map)) {
        const clsInfo = getWithDef(imports, fullClassName, {
          defaultImport: '',
          specifiers: [],
        })

        if (isDefault) {
          clsInfo.defaultImport = clsName
        } else {
          clsInfo.specifiers.push(clsName)
        }
      }
    }
    return imports
  }
}
