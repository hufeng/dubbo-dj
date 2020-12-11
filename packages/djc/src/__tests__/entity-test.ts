import * as dl from '../dlang'
import { EntityEmitter, fmt } from '../emitter'

const color = dl
  .enumer('org.apache.dubbo.enum.Color', '颜色类型的枚举')
  .field('RED', 0)
  .field('GREEN', 1)
  .field('BLUE', 2)
  .ok()

const addr = dl
  .entity('org.apache.dubbo.entity.Addr')
  .field('id', dl.Integer, '地址id')
  .field('province', dl.String, '省')
  .field('city', dl.String, '市')
  .field('region', dl.String, '区')
  .field('map', dl.HashMap(dl.String, color))
  .ok()

const user = dl
  .entity('org.apache.dubbo.domain.User', '用户模块')
  .field('id', dl.Integer, '用户id')
  .field('i', dl.int)
  .field('s', dl.short)
  .field('us', dl.Short)
  .field('ch', dl.char)
  .field('uch', dl.Char)
  .field('name', dl.String, '用户名')
  .field('bool', dl.boolean)
  .field('bl', dl.Boolean)
  .field('dou', dl.Double)
  .field('dd', dl.double)
  .field('f', dl.float)
  .field('ff', dl.Float)
  .field('ul', dl.Long)
  .field('l', dl.long)
  .field('maps', dl.HashMap(dl.String, dl.String))
  .field('ss', dl.Set(dl.String))
  .field('se', dl.Set(color))
  .field('ll', dl.List(color))
  .field('color', color)
  .field('addr', addr)
  .field('addrs', dl.List(addr))
  .ok()

it('test user entity', () => {
  const emitter = new EntityEmitter(user, 'ts')
  expect(fmt(emitter.code)).toMatchSnapshot()
})
