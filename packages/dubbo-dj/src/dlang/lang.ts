import { Dep } from './lang-deps'
import path from 'path'

export default class Lang {
  fullName: string
  shortName: string
  // ts interface name
  infName: string
  deps: Dep
  comment: string
  modulePath: string

  constructor(fullClsName: string, comment?: string) {
    this.fullName = fullClsName
    const splitFilenames = fullClsName.split('.') || ''
    this.shortName = splitFilenames.pop() || ''
    this.infName = `I${this.shortName}`

    this.modulePath = this.fullName.split('.').join('/')

    // init dep
    this.deps = new Dep()
    this.comment = this.wrapComment(comment)
  }

  wrapComment(comment: string = '') {
    return comment
      ? `
    /**
    * ${comment}
    */`
      : ''
  }

  // gen our mott
  get mott() {
    return `
      /**
       * auto generated by dubbo dj
       * ~~~ 💗 machine coding 💗 ~~~
       */
    `
  }

  imports(deps: Dep): string {
    const buff = []
    for (let [k, v] of deps.getDepMap().entries()) {
      buff.push('import ')
      if (v.defaultModule != '') {
        buff.push(` ${v.defaultModule} `)
        if (v.noneDefaultModules.size > 0) {
          buff.push(',')
        }
      }
      if (v.noneDefaultModules.size > 0) {
        buff.push(`{${[...v.noneDefaultModules].join(',')}}`)
      }
      if (v.is3rdModule) {
        buff.push(`from '${k}';`)
      } else {
        buff.push(`from '${this.relPath(this.modulePath, k)}'`)
      }
    }
    return buff.join('')
  }

  relPath(basePath: string, importPath: string) {
    return path.relative(basePath, importPath)
  }
}
