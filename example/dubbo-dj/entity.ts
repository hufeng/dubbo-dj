import { entity, t } from '@dubbo/dj'

export const address = entity('org.apache.dubbo.entity.Address')
  .field('province', t.String)
  .field('city', t.String)
  .ok()

export const user = entity('org.apache.dubbo.entity.User')
  .field('id', t.Integer, '用户id')
  .field('name', t.String, '用户名')
  .field('age', t.int, '年龄')
  .field('addr', address)
  .field('addresses', t.List(address))
  .ok()
