import * as t from '../dlang/type'
import { entity, enumeration } from '../dlang'
import { DubboEntityEmitter } from '../emitter'

const color = enumeration(
  'org.apache.dubbo.domain.enum.Color',
  '颜色类型的枚举'
)
  .field('RED', 0)
  .field('GREEN', 1)
  .field('BLUE', 2)
  .ok()

const addr = entity('org.apache.dubbo.domain.Address')
  .field('id', t.Integer, '地址id')
  .field('province', t.String, '省')
  .field('city', t.String, '市')
  .field('region', t.String, '区')
  .ok()

describe('e test suite', () => {
  it('test basic e', () => {
    const user = entity('org.apache.dubbo.domain.User')
      .field('id', t.Integer, '用户id')
      .field('name', t.String, '用户名')
      .field('email', t.String, '邮箱')
      .field('color', color)
      .ok()
    expect(user.toJSON).toMatchSnapshot()
    expect(
      new DubboEntityEmitter(user, 'ts', './').prettyCode
    ).toMatchSnapshot()
  })

  it('test first-level list', () => {
    const user = entity('org.apache.dubbo.domain.User')
      .field('id', t.Integer, '用户id')
      .field('name', t.String, '用户名')
      .field('likes', t.List(t.String), '爱好')
      .field('addrs', t.List(addr))
      .ok()
    expect(user.toJSON).toMatchSnapshot()
    expect(
      new DubboEntityEmitter(user, 'ts', './').prettyCode
    ).toMatchSnapshot()
  })

  it('test nested generic', () => {
    const user = entity('org.apache.dubbo.domain.User')
      .field('email', t.List(t.List(t.String)))
      .field('addrs', t.List(t.List(addr)))
      .ok()
    expect(user.toJSON).toMatchSnapshot()
    expect(
      new DubboEntityEmitter(user, 'ts', './').prettyCode
    ).toMatchSnapshot()
  })
})
