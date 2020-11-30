import JavaBase from './base-clazz'
import { JavaClazz } from '../core/clazz'
import debug from 'debug'
import { clazzDot } from './dot/ts'

const log = debug(`dubbo:dj:emitter/clazz：say ~`)

export default class Clazz extends JavaBase {
  constructor(
    private clazz: JavaClazz,
    lang: 'ts' | 'go' | 'java',
    private baseDir: string = './dubbo'
  ) {
    super(clazz.fullClsName, lang, baseDir)
  }

  get code(): string {
    return clazzDot({
      mott: this.mott,
      imports: this.imports(this.clazz.deps).join(';'),
      cls: this.clazz.fullClsName,
      infName: this.clazz.infName,
      fields: this.clazz.fields,
      clsName: this.clazz.clsName,
    })
  }
}
