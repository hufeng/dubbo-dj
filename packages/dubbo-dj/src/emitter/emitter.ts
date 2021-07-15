import debug from 'debug'
import fsx from 'fs-extra'
import { fmt } from '../common'

const FILE_EXT = {
  ts: 'ts',
  go: 'go',
  java: 'java',
  swagger: 'html',
}
const log = debug(`dj:emitter：say ~`)

export default abstract class Emitter {
  protected baseDir: string
  protected genFilePath: string
  private readonly fullName: string

  protected constructor(
    fullName: string,
    lang: 'ts' | 'go' | 'java' | 'swagger' = 'ts',
    rootDir: string = './dubbo'
  ) {
    this.fullName = fullName
    const fileExt = this.fileExt(lang)
    const pkgDir = this.dotPath(fullName)
    this.baseDir = `${rootDir}/`
    this.genFilePath = `${pkgDir}.${fileExt}`
  }

  dotPath(cls: string) {
    return cls.replace(/\./g, '/')
  }

  // write to => ./dubbo/ts/**/*.ts
  async writeCode(): Promise<void> {
    const fullFilePath = this.baseDir + this.genFilePath
    try {
      await fsx.ensureFile(fullFilePath)
      await fsx.writeFile(fullFilePath, this.prettyCode)
      log('create %s => %s was successfully', this.fullName, fullFilePath)
    } catch (err) {
      log('write file error %s', err)
      console.error(err)
    }
  }

  fileExt(lang: 'ts' | 'java' | 'go' | 'swagger'): string {
    return FILE_EXT[lang]
  }

  get prettyCode(): string {
    return fmt(this.code)
  }

  /**
   * 子类只需要实现该方法即可
   */
  abstract get code(): string
}
