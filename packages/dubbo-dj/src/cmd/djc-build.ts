import {
  DubboAbstractServiceEmitter,
  DubboServiceEmitter,
  DubboConsumerServiceEmitter,
  DubboEnumEmitter,
  DubboEntityEmitter,
} from '../emitter'
import { DubboEnum } from '../dlang/lang-enum'
import { IConfigure } from '../types'

// 默认生成代码的路径
const DEFAULT_DIR = `${process.cwd()}/dubbo`

export async function djc(build: IConfigure) {
  let {
    entry: { entity = {}, service = {} },
    output = {},
  } = build

  const langs = output.langs || ['ts']
  const dir = output.dir || DEFAULT_DIR
  const types = output.types || ['consumer', 'service', 'serviceImpl', 'entity']

  for (let lang of langs) {
    for (let type of types) {
      switch (type) {
        // 生成entity
        case 'entity':
          for (let e of Object.values(entity)) {
            if (e instanceof DubboEnum) {
              new DubboEnumEmitter(
                e,
                lang,
                `${dir}/${lang}/consumer`
              ).writeCode()
              new DubboEnumEmitter(
                e,
                lang,
                `${dir}/${lang}/service`
              ).writeCode()
            } else {
              new DubboEntityEmitter(
                e,
                lang,
                `${dir}/${lang}/consumer`
              ).writeCode()
              new DubboEntityEmitter(
                e,
                lang,
                `${dir}/${lang}/service`
              ).writeCode()
            }
          }
          break
        // 生成consumer调用的代码
        case 'consumer':
          for (let s of Object.values(service)) {
            new DubboConsumerServiceEmitter(
              s,
              lang,
              `${dir}/${lang}`
            ).writeCode()
          }
          break
        //生成service抽象类代码
        case 'service':
          for (let s of Object.values(service)) {
            new DubboAbstractServiceEmitter(
              s,
              lang,
              `${dir}/${lang}`
            ).writeCode()
          }
          break
        // 生成service实现类代码
        case 'serviceImpl':
          for (let s of Object.values(service)) {
            new DubboServiceEmitter(s, lang, `${dir}/${lang}`).writeCode()
          }
          break
        default:
          throw new Error(
            `types only support 'consumer' | 'entity‘ | ’service' | 'serviceImpl', you specify wrong type '${type}'`
          )
      }
    }
  }
}
