import debug from 'debug'
import { Enum } from '../dlang/enum'
import {
  AbstractServiceEmitter,
  ConsumerEmitter,
  EntityEmitter,
  ServiceEmitter,
} from '../emitter'
import EnumEmitter from '../emitter/enum'
import { IBuildParam } from '../types'

const log = debug(`dubbo:dj:say ~`)

export async function djc(build: IBuildParam) {
  const dir = process.cwd()
  const langdir = `${dir}/dsl`

  const {
    buildEntry: { entity, service },
    config: { lang },
  } = build

  log(`read dsl dir [%s] with lang [%s]`, langdir, lang)

  log('class %s', JSON.stringify(entity, null, 2))
  log('service %s', JSON.stringify(service, null, 2))

  // generate clazz code
  for (let m of Object.values(entity || {})) {
    if (m instanceof Enum) {
      const e = new EnumEmitter(m, 'ts')
      e.writeCode()
    } else {
      const clz = new EntityEmitter(m, 'ts')
      clz.writeCode()
    }
  }

  // generate service
  for (let s of Object.values(service || {})) {
    const absService = new AbstractServiceEmitter(s, 'ts')
    absService.writeCode()

    const emitService = new ServiceEmitter(s, 'ts')
    emitService.writeCode()

    const consumerService = new ConsumerEmitter(s, 'ts')
    consumerService.writeCode()
  }
}
