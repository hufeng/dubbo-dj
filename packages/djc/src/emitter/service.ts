import fsx from 'fs-extra'
import Emitter from './emitter'
import debug from 'debug'
import { Service } from '../dlang/service'
import { serviceDot } from './ts'

const log = debug(`dubbo:dj:service:say ~`)

export default class ServiceEmitter extends Emitter {
  constructor(
    public service: Service,
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

    for (let [name, meta] of Object.entries(this.service._methods)) {
      const args = []

      for (let arg of meta.args) {
        args.push(`${arg.name}: ${arg.type}`)
      }
      const retType = meta.ret ? meta.ret.tsType : 'void'
      methods.push(`
       async ${name}(${args.join()}): Promise<${retType}> {
          throw new Error('Method not implemented.')
        }
      `)
    }

    return serviceDot({
      mott: this.mott,
      comment: this.service.comment,
      imports: this.imports(this.service.deps, {
        filterDefault: true,
        filterWhiteList: true,
      }).join(';'),
      serviceName: this.service.clsName,
      methods: methods,
    })
  }
}
