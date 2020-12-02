type fullClassName = string

export interface ICount {
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
  private map: Map<string, ICount> = new Map()

  add(fullClsName: string, clsName: string, isDefault: boolean = true) {
    let val = this.map.get(clsName)

    if (val) {
      // 如果已经存在
      const existClsName = val.map[fullClsName]
      if (existClsName) {
        return existClsName.clsName
      }

      // 不存在
      const renameClsName = `${clsName}${val.offset}`
      val.map[fullClsName] = {
        clsName: renameClsName,
        isDefault,
      }
      val.offset++
      return renameClsName
    } else {
      this.map.set(clsName, {
        offset: 1,
        map: {
          [fullClsName]: {
            clsName,
            isDefault,
          },
        },
      })
    }

    return clsName
  }

  get imports() {
    const imports = []
    for (let { map } of this.map.values()) {
      for (let [fullClassName, { clsName, isDefault }] of Object.entries(map)) {
        imports.push({
          fullClassName,
          importName: clsName,
          isDefault,
        })
      }
    }
    return imports
  }
}
