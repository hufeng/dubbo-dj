import JavaBase from './base-clazz'
import { JavaService } from '../core/service'
import { abstractServiceDot } from './dot/ts'

export default class AbstractService extends JavaBase {
  constructor(
    public service: JavaService,
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
      imports: this.imports(this.service.deps).join(';'),
      service: this.service.fullClsName,
      serviceName: this.service.clsName,
      group: this.service._group,
      version: this.service._version,
      methods: methods,
    })
  }
}
