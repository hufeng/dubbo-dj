import Emitter from './emitter'
import { enumDot } from './ts'
import { DubboEnum } from '../dlang/lang-enum'

export default class DubboEnumEmitter extends Emitter {
  constructor(
    public e: DubboEnum,
    lang: 'ts' | 'go' | 'java' | 'swagger',
    baseDir: string = './dubbo'
  ) {
    super(e.fullName, lang, baseDir)
  }

  get code() {
    return enumDot({
      mott: this.e.mott,
      comment: this.e.comment,
      name: this.e.shortName,
      fields: this.e.fields,
    })
  }
}
