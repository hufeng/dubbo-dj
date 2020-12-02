import { dl } from '@dubbo/dj'

export const user = dl
  .entity('org.apache.dubbo.entity.User')
  .field('id', dl.Integer)
  .field('name', dl.String)
  .field('age', dl.String)
  .ok()
