import java from '..'
import fmt from '../fmt'

it('test java list', () => {
  const foo = java
    .model('org.apache.dubbo.domain.Foo')
    .field('id', java.Integer)

  const user = java
    .model('org.apache.duboo.domain.User')
    .field('id', java.Boolean)
    .field('likes', java.List(java.String))
    .field('list', java.List(foo))
    .field('listFoo', java.List(foo))
    .field('fooSet', java.Set(foo))
    .field('fooCollection', java.Collection(foo))

  console.log(fmt(user.bean))
})
