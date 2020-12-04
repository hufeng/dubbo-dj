import * as dl from '../dlang'
import { ConsumerEmitter, EntityEmitter, fmt, ServiceEmitter } from '../emitter'
import EnumEmitter from '../emitter/enum'
import AbstractService from '../emitter/service-abstract'

const color = dl
  .enumer('Color', '颜色类型的枚举')
  .field('RED', 0)
  .field('GREEN', 1)
  .field('BLUE', 2)
  .ok()

const user = dl
  .entity('org.apache.dubbo.domain.User', '用户模块')
  .field('id', dl.Integer, '用户id')
  .field('name', dl.String, '用户名')
  .ok()

const userService = dl
  .service('org.apache.dubbo.service.UserService', '用户服务')
  .group('dubbo')
  .version('1.0.0')
  .method('sayHello')
  .arg('name', dl.String)
  .ret(dl.String)
  .ok()

it('test user entity', () => {
  const emitter = new EntityEmitter(user, 'ts')
  expect(fmt(emitter.code)).toMatchSnapshot()
})

it('test enum', () => {
  const emitter = new EnumEmitter(color, 'ts')
  expect(fmt(emitter.code)).toMatchSnapshot()
})

it('test user service', () => {
  const serviceEmitter = new ServiceEmitter(userService, 'ts')
  expect(fmt(serviceEmitter.code)).toMatchSnapshot()

  const abstractEmitter = new AbstractService(userService, 'ts')
  expect(fmt(abstractEmitter.code)).toMatchSnapshot()

  const consumerService = new ConsumerEmitter(userService, 'ts')
  expect(fmt(consumerService.code)).toMatchSnapshot()
})
