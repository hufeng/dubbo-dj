import java from '../../java/core'
import { user } from './model'

const userService = java
  .Service('org.apache.dubbo.service.UserService')
  .group('')
  .version('1.0.0')
  .method('sayHello')
  .arg('user', user)
  .ret(user)
  .method('sayWorld')
  .arg('name', java.String)
  .ret(java.String)
  .ok()

export { userService }
