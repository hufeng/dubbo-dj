import Emitter from './emitter'
import { consumerServiceDot } from './ts'
import { DubboService } from '../dlang/lang-service'

export default class DubboConsumerServiceEmitter extends Emitter {
  constructor(
    public service: DubboService,
    lang: 'ts' | 'go' | 'java' | 'swagger',
    rootDir: string = './dubbo'
  ) {
    super(service.fullName, lang, rootDir)
    this.baseDir += 'consumer/'
  }

  get code() {
    return consumerServiceDot(this.service.toJSON)
  }
}
