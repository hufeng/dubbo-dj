import fmt from '../emitter/fmt'
import java from '../core'
import { Service } from '../emitter'
import { userService } from '../../cmd/dsl/service'

const user = java
  .Clazz('org.apache.dubbo.domain.User')
  .field('id', java.Integer)
  .ok()

const UserService = java
  .Service('org.apache.dubbo.service.UserService')
  .group('A')
  .version('1.0.0')
  .method('sayHello')
  .arg('isExit', java.Boolean)
  .arg('user', user)
  .ret(java.Integer)
  .method('sayHi')
  .arg('i', java.Integer)
  .ret(java.String)
  .ok()

it('test java service', () => {
  expect(JSON.stringify(UserService, null, 2)).toMatchSnapshot()
  expect(new Service(userService, 'ts').pretteyCode).toMatchSnapshot()
})
