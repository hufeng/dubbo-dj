import java from '../core'
import { Clazz, Enum } from '../emitter'

it('test java list', () => {
  const color = java
    .Enum('org.apache.dubbo.service.Color')
    .field('Red', 0)
    .field('Green', 1)
    .field('Blue', 2)
    .ok()

  const foo = java
    .Clazz('org.apache.dubbo.domain.Foo')
    .field('id', java.Integer)
    .ok()

  const user = java
    .Clazz('org.apache.duboo.domain.User')
    .field('id', java.Boolean)
    .field('likes', java.List(java.String))
    .field('list', java.List(foo))
    .field('listFoo', java.List(foo))
    .field('fooSet', java.Set(foo))
    .field('fooCollection', java.Collection(foo))
    .field('map', java.Map(java.String, java.String))
    .ok()

  expect(new Clazz(user, 'ts').pretteyCode).toMatchSnapshot()
  expect(new Enum(color, 'ts')).toMatchSnapshot()
})
