import Emitter from './emitter'
import { Service } from '../dlang/service'
import { consumerServiceDot } from './ts'

export default class ConsumerService extends Emitter {
  constructor(
    public service: Service,
    lang: 'ts' | 'go' | 'java',
    baseDir: string = './dubbo'
  ) {
    super(service.fullClsName, lang, baseDir)
    this.curFilePath = this.curFilePath.replace(
      service.clsName,
      `consumer/${service.clsName}`
    )
    this.fullClsName = this.fullClsName.replace(
      service.clsName,
      `consumer.${service.clsName}`
    )
  }

  get code() {
    const methodNames = []
    const methodsInterface = []
    const methods = []

    for (let [name, meta] of Object.entries(this.service._methods)) {
      methodNames.push(name)

      // args
      const args = []
      const argsJava = []
      for (let arg of meta.args) {
        args.push(`${arg.name}: ${arg.tsType}`)
        argsJava.push(`${arg.javaType}`)
      }
      const retType = meta.ret ? meta.ret.tsType : 'void'
      methodsInterface.push(`
        ${name}(${args.join()}): TDubboCallResult<${retType}>;
      `)
      methods.push(`
        ${name}(${args.join()}): TDubboCallResult<${retType}> {
          return [${argsJava.join()}]
        }
      `)
    }

    return consumerServiceDot({
      mott: this.mott,
      comment: this.service.comment,
      imports: this.imports(this.service.deps).join(';'),
      infName: this.service.infName,
      service: this.service.fullClsName,
      serviceName: this.service.clsName,
      methodsInterface,
      methods,
      methodNames,
    })
  }
}
