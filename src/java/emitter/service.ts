import fsx, { exists } from 'fs-extra'
import JavaBase from './base-clazz'
import { JavaService } from '../core/service'
import { serviceDot } from './dot/ts'
import debug from 'debug'

const log = debug(`dubbo:dj:service:say ~`)

export default class Service extends JavaBase {
  constructor(
    public service: JavaService,
    lang: 'ts' | 'go' | 'java',
    baseDir: string = './dubbo'
  ) {
    super(service.fullClsName, lang, baseDir)
  }

  async writeCode(): Promise<void> {
    // 如果存在就不覆盖
    const exists = await fsx.pathExists(this.curFilePath)
    if (!exists) {
      super.writeCode()
    } else {
      log(`${this.curFilePath} was existed, skip it ~~~~~~`)
    }
  }

  get code() {
    const methods = []
    const args = []

    for (let [name, meta] of Object.entries(this.service._methods)) {
      for (let arg of meta.args) {
        args.push(`${arg.name}: ${arg.type}`)
      }
      methods.push(`
        ${name}(${args.join()})${meta.ret ? ':' + meta.ret : 'void'} {
          throw new Error('Method not implemented.')
        }
      `)
    }

    return serviceDot({
      mott: this.mott,
      imports: this.imports(this.service.deps).join(';'),
      service: this.service.fullClsName,
      serviceName: this.service.clsName,
      group: this.service._group,
      version: this.service._version,
      methods: methods,
    })
  }
}
