import fsx, { exists } from 'fs-extra'
import debug from 'debug'
import commander from 'commander'
import { JavaClazz } from '../java/core/clazz'
import Clazz from '../java/emitter/clazz'
import { AbstractService, Enum, Service } from '../java/emitter'
import { JavaService } from '../java/core/service'
import { JavaEnum } from '../java/core/enum'

const log = debug(`dubbo:dj:say ~`)

// work-flow
;(async () => {
  commander.parse(process.argv)
  const dir = commander.args[0] || process.cwd()
  const lang = (commander.args[1] || 'ts') as 'ts' | 'go' | 'java'
  const langdir = `${dir}/dsl`
  log(`read dsl dir [%s]`, langdir)

  // get model && service
  const { model, service } = require(`${langdir}`).default
  log('class %s', JSON.stringify(model, null, 2))
  log('service %s', JSON.stringify(service, null, 2))

  // generate clazz code
  for (let m of Object.values(model || {})) {
    if (m instanceof JavaEnum) {
      const clz = new Enum(m as JavaEnum, lang)
      clz.writeCode()
    } else {
      const clz = new Clazz(m as JavaClazz, lang)
      clz.writeCode()
    }
  }

  // generate service
  for (let s of Object.values(service || {})) {
    const absService = new AbstractService(s as JavaService, lang)
    absService.writeCode()

    const service = new Service(s as JavaService, lang)
    service.writeCode()
  }
})()
