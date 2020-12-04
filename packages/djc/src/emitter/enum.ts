import { Enum } from '../dlang/enum'
import Emitter from './emitter'
import { enumDot } from './ts'

export default class EnumEmitter extends Emitter {
  constructor(
    public enumer: Enum,
    lang: 'ts' | 'go' | 'java',
    baseDir: string = './dubbo'
  ) {
    super(enumer.fullClsName, lang, baseDir)
  }

  get code() {
    return enumDot({
      mott: this.mott,
      comment: this.enumer.comment,
      name: this.enumer.clsName,
      fields: this.enumer.fields,
    })
  }
}
