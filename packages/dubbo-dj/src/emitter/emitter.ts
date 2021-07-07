import debug from 'debug'
import fsx from 'fs-extra'
import { fmt } from '../common'

const FILE_EXT = {
  ts: 'ts',
  go: 'go',
  java: 'java',
}
const log = debug(`dj:emitter：say ~`)

export default abstract class Emitter {
  protected readonly genFilePath: string
  private readonly fullName: string

  protected constructor(
    fullName: string,
    lang: 'ts' | 'go' | 'java' = 'ts',
    baseDir: string = './dubbo'
  ) {
    this.fullName = fullName
    const fileExt = FILE_EXT[lang]
    const pkgDir = this.dotPath(fullName)
    this.genFilePath = `${baseDir}/${lang}/${pkgDir}.${fileExt}`
  }

  dotPath(cls: string) {
    return cls.replace(/\./g, '/')
  }

  // write to => ./dubbo/ts/**/*.ts
  async writeCode(): Promise<void> {
    try {
      await fsx.ensureFile(this.genFilePath)
      await fsx.writeFile(this.genFilePath, this.prettyCode)
      log('create %s => %s was successfully', this.fullName, this.genFilePath)
    } catch (err) {
      log('write file error %s', err)
      console.error(err)
    }
  }

  get prettyCode(): string {
    return fmt(this.code)
  }

  /**
   * 子类只需要实现该方法即可
   */
  abstract get code(): string
}
