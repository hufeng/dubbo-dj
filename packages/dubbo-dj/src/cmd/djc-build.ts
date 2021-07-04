import debug from 'debug'
import EnumEmitter from '../emitter/emitter-enum'
import { IConfigure } from '../types'
import {
  DubboAbstractServiceEmitter,
  DubboConsumerService,
  DubboEntityEmitter,
  DubboServiceProviderEmitter,
} from '../emitter'
import { DubboEnum } from '../dlang/lang-enum'

const log = debug(`dubbo:dj:say ~`)

export async function djc(build: IConfigure) {
  const dir = process.cwd()
  const langdir = `${dir}/dsl`

  let {
    buildEntry: { entity, service },
    output = {
      lang: ['ts'],
      type: ['consumer', 'service', 'serviceImpl', 'entity'],
    },
  } = build

  let {
    lang = 'ts',
    type = ['consumer', 'service', 'serviceImpl', 'entity'],
  } = output

  if (typeof lang === 'string') {
    lang = [lang]
  }
  if (typeof type === 'string') {
    type = [type]
  }

  log(`read dsl dir [%s] with lang [%s]`, langdir, lang)

  log('class %s', JSON.stringify(entity, null, 2))
  log('s %s', JSON.stringify(service, null, 2))

  for (let l of lang) {
    if (type.includes('entity')) {
      for (let m of Object.values(entity || {})) {
        if (m instanceof DubboEnum) {
          const e = new EnumEmitter(m, l)
          e.writeCode()
        } else {
          const clz = new DubboEntityEmitter(m, l)
          clz.writeCode()
        }
      }
    }

    // generate s
    for (let s of Object.values(service || {})) {
      if (type.includes('consumer')) {
        const consumerService = new DubboConsumerService(s, l)
        consumerService.writeCode()
      }

      if (type.includes('service')) {
        const absService = new DubboAbstractServiceEmitter(s, l)
        absService.writeCode()
      }

      if (type.includes('serviceImpl')) {
        const emitService = new DubboServiceProviderEmitter(s, l)
        emitService.writeCode()
      }
    }
  }
}
