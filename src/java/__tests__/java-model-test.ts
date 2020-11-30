import java from '../core'
import { Clazz } from '../emitter'
import fmt from '../emitter/fmt'

const user = java
  .Clazz('org.apache.dubbo.js.User')
  .field('id', java.Integer, '用户id')
  .field('name', java.String, '用户名')
  .field('isMale', java.Boolean)
  .ok()

const h = java
  .Clazz('org.apache.dubbo.js.service.User')
  .field('id', java.Integer)
  .ok()

const product = java
  .Clazz('org.apache.dubbo.js.Product')
  .field('id', java.Integer, '商品')
  .field('price', java.Integer, '价格')
  .field('color', java.String, '颜色')
  .field('user', user, '管理用户')
  .field('user2', user, 'xx')
  .field('h', h)
  .ok()

it('test user inf and class', () => {
  expect(user).toMatchSnapshot()
  expect(JSON.stringify(user, null, 2)).toMatchSnapshot()

  const clazz = new Clazz(user, 'ts')
  expect(clazz.pretteyCode).toMatchSnapshot()
})

it('test product import and rename', () => {
  const clazz = new Clazz(product, 'ts')
  expect(fmt(clazz.pretteyCode)).toMatchSnapshot()
})
