import { entity, service, t } from '../dlang'
import { f } from '../dlang/lang-service'
import {
  DubboAbstractServiceEmitter,
  DubboConsumerService,
  DubboServiceProviderEmitter,
} from '../emitter'

describe('test s lang suite', () => {
  it('test baisc s', () => {
    const addr = entity('org.apache.dubbo.entity.Addr')
      .field('id', t.Integer, '地址id')
      .field('province', t.String, '省')
      .field('city', t.String, '市')
      .field('region', t.String, '区')
      .ok()
    const helloService = service('org.apache.dubbo.s.HelloService')
      .func(
        f.name('sayHello'),
        f.args(f.arg('name', t.String), f.arg('email', t.String)),
        f.ret(t.String)
      )
      .func(
        f.name('sayWorld'),
        f.args(f.arg('name', t.List(t.String)), f.arg('addr', t.List(addr))),
        f.ret(t.List(t.Integer))
      ).ok

    expect(helloService).toMatchSnapshot()
    expect(
      new DubboServiceProviderEmitter(helloService, 'ts').prettyCode
    ).toMatchSnapshot()

    expect(
      new DubboAbstractServiceEmitter(helloService, 'ts').prettyCode
    ).toMatchSnapshot()
    expect(
      new DubboConsumerService(helloService, 'ts').prettyCode
    ).toMatchSnapshot()
  })
})
