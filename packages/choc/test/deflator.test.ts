import 'mocha'
import { expect } from 'chai'
import path from 'path'
import { execSync } from 'child_process'
import { Deflator } from '../src'

describe('deflator test suit', function () {
  this.timeout(1000 * 60 * 3)

  before(() => {
    execSync('mvn package', {
      cwd: path.join(__dirname, 'my-app'),
      stdio: 'inherit',
    })
    execSync('mvn install dependency:copy-dependencies', {
      cwd: path.join(__dirname, 'my-app'),
      stdio: 'inherit',
    })
  })

  it('deflator prepare', async () => {
    const deflator = new Deflator({
      entry: 'com.mycompany',
      target: path.resolve(
        __dirname,
        'my-app',
        'target',
        'my-app-1.0-SNAPSHOT.jar'
      ),
      deps: path.resolve(__dirname, 'my-app', 'target', 'dependency'),
      suffix: 'Provider',
    })
    await deflator.prepare()
    expect(deflator.providers.includes('com/mycompany/app/HelloProvider'))
      .to.be.true
  })

  it('resolve', async () => {
    const deflator = new Deflator({
      entry: 'com.mycompany',
      target: path.resolve(
        __dirname,
        'my-app',
        'target',
        'my-app-1.0-SNAPSHOT.jar'
      ),
      deps: path.resolve(__dirname, 'my-app', 'target', 'dependency'),
      suffix: 'Provider',
    })
    await deflator.prepare()
    await deflator.run()
  })
})
