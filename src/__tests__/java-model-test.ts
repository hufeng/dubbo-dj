import fmt from '../fmt'
import java from '../'

const user = java
  .model('org.apache.dubbo.js.User')
  .field('id', java.Integer, '用户id')
  .field('name', java.String, '用户名')
  .field('isMale', java.Boolean)

const h = java
  .model('org.apache.dubbo.js.service.User')
  .field('id', java.Integer)

const product = java
  .model('org.apache.dubbo.js.Product')
  .field('id', java.Integer, '商品')
  .field('price', java.Integer, '价格')
  .field('color', java.String, '颜色')
  .field('user', user, '管理用户')
  .field('user2', user, 'xx')
  .field('h', h)

it('test user inf and class', () => {
  expect(user).toMatchSnapshot()
  expect(JSON.stringify(user, null, 2)).toMatchSnapshot()
  expect(fmt(user.inf)).toMatchSnapshot()
  expect(fmt(user.bean)).toMatchSnapshot()
})

it('test product import and rename', () => {
  expect(fmt(product.inf)).toMatchSnapshot()
  expect(fmt(product.bean)).toMatchSnapshot()
})
