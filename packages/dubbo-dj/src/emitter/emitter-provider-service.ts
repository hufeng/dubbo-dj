import fsx from 'fs-extra'
import Emitter from './emitter'
import debug from 'debug'
import { serviceDot } from './ts'
import { DubboService } from '../dlang/lang-service'

const log = debug(`dj:provider:say ~`)

export default class DubboServiceProviderEmitter extends Emitter {
  constructor(
    public s: DubboService,
    lang: 'ts' | 'go' | 'java',
    baseDir: string = './dubbo'
  ) {
    super(s.fullName, lang, baseDir)
  }

  async writeCode(): Promise<void> {
    const exists = await fsx.pathExists(this.genFilePath)
    if (!exists) {
      await super.writeCode()
    } else {
      log(`${this.genFilePath} was existed, skip it ~~~~~~`)
    }
  }

  get code() {
    return serviceDot(this.s.toJSON)
  }
}
