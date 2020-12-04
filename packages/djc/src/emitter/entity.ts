import debug from 'debug'
import Emitter from './emitter'
import { Entity } from '../dlang/entity'
import { entityDot } from './ts'

const log = debug(`dubbo:dj:say ~`)

export default class EntityEmitter extends Emitter {
  constructor(
    private entity: Entity,
    lang: 'ts' | 'go' | 'java',
    baseDir: string = './dubbo'
  ) {
    super(entity.fullClsName, lang, baseDir)
    log(`init entity with base dir %s`, baseDir)
  }

  get code(): string {
    return entityDot({
      mott: this.mott,
      comment: this.entity.comment,
      imports: this.imports(this.entity.deps).join(';'),
      cls: this.entity.fullClsName,
      infName: this.entity.infName,
      fields: this.entity.fields,
      clsName: this.entity.clsName,
    })
  }
}
