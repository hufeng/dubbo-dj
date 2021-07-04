import { project } from '../dlang/lang-project'

describe('project test suite', () => {
  it('test builder', () => {
    const proj = project
      .name('hello-service')
      .version('1.0.0')
      .description('a simple hello-world s')
      .ok()

    expect(proj).toEqual({
      name: 'hello-service',
      version: '1.0.0',
      description: 'a simple hello-world s',
    })
  })
})
