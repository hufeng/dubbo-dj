import Emitter from './emitter'
import { consumerServiceDot } from './ts'
import { DubboService } from '../dlang/lang-service'

export default class DubboConsumerService extends Emitter {
  constructor(
    public service: DubboService,
    lang: 'ts' | 'go' | 'java',
    baseDir: string = './dubbo'
  ) {
    super(service.fullName, lang, baseDir)
  }

  get code() {
    return consumerServiceDot(this.service.toJSON)
  }
}
