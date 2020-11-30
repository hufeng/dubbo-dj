import { JavaEnum } from '../core/enum'
import JavaBase from './base-clazz'
import { enumDot } from './dot/ts'

export default class Enum extends JavaBase {
  constructor(
    public javaEnum: JavaEnum,
    lang: 'ts' | 'go' | 'java',
    baseDir: string = './dubbo'
  ) {
    super(javaEnum.fullClsName, lang, baseDir)
  }

  get code() {
    return enumDot({
      mott: this.mott,
      name: this.javaEnum.clsName,
      fields: this.javaEnum.fields,
    })
  }
}
