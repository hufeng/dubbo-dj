import fmt from '../fmt'
import java from '../'

const user = java
  .model('org.apache.dubbo.domain.User')
  .field('id', java.Integer)

const UserService = java
  .service('org.apache.dubbo.service.UserService')
  .group('A')
  .version('1.0.0')
  .method('sayHello')
  .arg('isExit', java.Boolean)
  .arg('user', user)
  .ret(java.Integer)
  .method('sayHi')
  .arg('i', java.Integer)
  .ret(java.String)

it('test java service', () => {
  expect(JSON.stringify(UserService, null, 2)).toMatchSnapshot()
  expect(fmt(UserService.serviceCode)).toMatchSnapshot()
})
