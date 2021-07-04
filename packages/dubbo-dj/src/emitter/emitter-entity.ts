import debug from 'debug'
import Emitter from './emitter'
import { entityDot } from './ts'
import { DubboEntity } from '../dlang/lang-entity'

const log = debug(`dj:entity-emitter:say ~`)

export default class DubboEntityEmitter extends Emitter {
  constructor(
    public e: DubboEntity,
    lang: 'ts' | 'go' | 'java',
    baseDir: string = './dubbo'
  ) {
    super(e.fullName, lang, baseDir)
    log(`init entity with base dir %s`, baseDir)
  }

  get code(): string {
    return entityDot(this.e.toJSON)
  }
}
