import { dl } from '@dubbo/dj'
import { user } from './entity'

export const userService = dl
  .service('org.apache.dubbo.service.UserService')
  .group('')
  .version('1.0.0')
  .method('sayHello')
  .arg('user', user)
  .ret(user)
  .method('sayWorld')
  .arg('name', dl.String)
  .ret(dl.String)
  .ok()
