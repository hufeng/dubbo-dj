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
    const proxyMethods = []

    for (let [name, meta] of Object.entries(this.service._methods)) {
      const args = []
      const argNames = []

      for (let arg of meta.args) {
        argNames.push(arg.name)
        args.push(`${arg.name}: ${arg.type}`)
      }
      if (meta.ret) {
        const { tsType, javaType } = meta.ret
        const retType = tsType ? tsType : 'void'
        methods.push(`abstract ${name}(${args.join()}):Promise<${retType}>;`)
        proxyMethods.push(
          `${name}: async (${args.join()}) => {const res = await this.${name}(${argNames.join()}); return ${javaType}}`
        )
      } else {
        methods.push(`abstract ${name}(${args.join()}):Promise<void>;`)
        proxyMethods.push(
          `${name}: (${args.join()}) => this.${name}(${argNames.join()})`
        )
      }
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
      proxyMethods: proxyMethods,
    })
  }
}
