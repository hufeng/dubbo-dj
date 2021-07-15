import { entity, service, t } from '../dlang'
import { f } from '../dlang'
import {
  DubboAbstractServiceEmitter,
  DubboConsumerServiceEmitter,
  DubboServiceEmitter,
} from '../emitter'

describe('test s lang suite', () => {
  it('test basic s', () => {
    const addr = entity('org.apache.dubbo.domain.Address')
      .field('id', t.Integer, '地址id')
      .field('province', t.String, '省')
      .field('city', t.String, '市')
      .field('region', t.String, '区')
      .ok()
    const helloService = service('org.apache.dubbo.service.HelloService')
      .func(
        f.name('sayHello'),
        f.args(f.arg('name', t.String), f.arg('email', t.String)),
        f.ret(t.String)
      )
      .func(
        f.name('sayWorld'),
        f.args(f.arg('name', t.List(t.String)), f.arg('addr', t.List(addr))),
        f.ret(t.List(t.Integer))
      )
      .ok()

    expect(helloService).toMatchSnapshot()
    expect(
      new DubboServiceEmitter(helloService, 'ts').prettyCode
    ).toMatchSnapshot()

    expect(
      new DubboAbstractServiceEmitter(helloService, 'ts').prettyCode
    ).toMatchSnapshot()
    expect(
      new DubboConsumerServiceEmitter(helloService, 'ts').prettyCode
    ).toMatchSnapshot()
  })
})
