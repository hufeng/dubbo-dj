import { service, f, t } from '@dubbo/dj'
import { user } from './entity'

export const helloService = service('org.apache.dubbo.service.UserService')
  .func(f.name('sayHello'), f.args(f.arg('user', user)), f.ret(user))
  .func(
    f.name('sayWorld'),
    f.args(f.arg('names', t.List(t.String))),
    f.ret(t.String)
  )
  .ok()
