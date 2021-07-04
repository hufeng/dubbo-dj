import Emitter from './emitter'
import { DubboService } from '../dlang/lang-service'
import { abstractServiceDot } from './ts'

export default class DubboAbstractServiceEmitter extends Emitter {
  constructor(
    public s: DubboService,
    lang: 'ts' | 'go' | 'java',
    baseDir: string = './dubbo'
  ) {
    super(s.fullName, lang, baseDir)
  }

  get code() {
    return abstractServiceDot(this.s.toJSON)
  }
}
