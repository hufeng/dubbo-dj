import Emitter from './emitter'
import { DubboService } from '../dlang/lang-service'
import { abstractServiceDot } from './ts'

export default class DubboAbstractServiceEmitter extends Emitter {
  constructor(
    public s: DubboService,
    lang: 'ts' | 'go' | 'java' | 'swagger',
    rootDir: string = './dubbo'
  ) {
    super(s.fullName, lang, rootDir)
    this.baseDir += 'service/'
    this.genFilePath = this.genFilePath.replace(
      s.shortName,
      `base/${s.shortName}`
    )
  }

  get code() {
    const raw = this.s.modulePath
    this.s.modulePath = this.genFilePath
    const code = abstractServiceDot(this.s.toJSON)
    this.s.modulePath = raw
    return code
  }
}
