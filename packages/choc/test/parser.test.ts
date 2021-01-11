import 'mocha'
import { expect } from 'chai'
import path from 'path'
import { execSync } from 'child_process'
import { ClassResolverManager } from '../src'

const DIR = path.join(__dirname, 'parser')

describe('parsing test suit', function () {
  this.timeout(1000 * 60 * 3)

  before(() => {
    execSync('javac **/*.java', {
      cwd: DIR,
      stdio: 'inherit',
    })

    ClassResolverManager.singleton().setBaseDir(DIR)
  })

  // it('class signature', async () => {
  //   const cm = ClassResolverManager.singleton()
  //   const cs = await cm.resolve('cases/ClassA')

  //   console.log(cs)
  // })

  it('class signature', async () => {
    const cm = ClassResolverManager.singleton()
    const cs = await cm.resolve('cases/ClassC')

    console.log(cs)
    console.log(cs.typeParams[0].types)
    console.log(cs.superClass?.typeArgs)
    // const cs1 = await cm.resolve('cases/BaseA');
    // console.log(cs1.typeParams[0])
    // console.log(ClassResolverManager.singleton().getFlattenFields(cs))
  })
})
