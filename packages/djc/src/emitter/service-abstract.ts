import { Service } from '../dlang/service'
import Emitter from './emitter'
import { abstractServiceDot } from './ts'

export default class AbstractService extends Emitter {
  constructor(
    public service: Service,
    lang: 'ts' | 'go' | 'java',
    baseDir: string = './dubbo'
  ) {
    super(service.fullClsName, lang, baseDir)
    this.curFilePath = this.curFilePath.replace(
      service.clsName,
      `base/${service.clsName}`
    )
    this.fullClsName = this.fullClsName.replace(
      service.clsName,
      `base.${service.clsName}`
    )
  }

  get code() {
    const methods = []
    const args = []

    for (let [name, meta] of Object.entries(this.service._methods)) {
      for (let arg of meta.args) {
        args.push(`${arg.name}: ${arg.type}`)
      }
      methods.push(
        `abstract ${name}(${args.join()})${meta.ret ? ':' + meta.ret : 'void'};`
      )
    }

    return abstractServiceDot({
      mott: this.mott,
      comment: this.service.comment,
      imports: this.imports(this.service.deps).join(';'),
      service: this.service.fullClsName,
      serviceName: this.service.clsName,
      group: this.service._group,
      version: this.service._version,
      methods: methods,
    })
  }
}
