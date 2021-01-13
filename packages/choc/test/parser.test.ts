import 'mocha'
import path from 'path'
import { expect } from 'chai'
import { execSync } from 'child_process'
import { ClassResolverManager, ClassTypeSignature } from '../src'

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

  it('class signature', async () => {
    const cm = ClassResolverManager.singleton()
    expect(async () => await cm.resolve('cases/ClassA')).to.not.throw()
  })

  it('class signature', async () => {
    const cm = ClassResolverManager.singleton()
    const cs = await cm.resolve('cases/ClassC')

    expect(cs.privateFields.length).to.eq(1)
    expect(cs.typeParams.length).to.eq(2)

    const sp = cs.superClasses[0]
    expect(sp).to.be.not.undefined
    expect(sp.binaryName).to.eq('cases/BaseA')
  })

  it('fields flatten', async () => {
    const cm = ClassResolverManager.singleton()
    const fields = await cm.getFlattenFields('cases/ClassC')

    const fieldA = fields.get('fieldA')
    const fieldC = fields.get('fieldC')
    const map = fields.get('map')

    expect(fieldA).to.be.not.undefined
    expect(fieldC).to.be.not.undefined
    expect(map).to.be.not.undefined

    expect(fieldA?.as<ClassTypeSignature>().binaryName).to.eq('java/util/Date')
    expect(fieldC?.as<ClassTypeSignature>().binaryName).to.eq('java/util/Date')
    expect(map?.as<ClassTypeSignature>().binaryName).to.eq('java/util/HashMap')
    expect(map?.as<ClassTypeSignature>().binaryName).to.eq('java/util/HashMap')

    const typeArgs = map?.as<ClassTypeSignature>().typeArgs!
    expect(typeArgs[0].type?.as<ClassTypeSignature>().binaryName).to.eq(
      'java/lang/Object'
    )
    expect(typeArgs[1].type?.as<ClassTypeSignature>().binaryName).to.eq(
      'java/util/Date'
    )
  })

  it('methods', async () => {
    const cm = ClassResolverManager.singleton()
    const methods = await cm.getMethods('cases/ClassC')
    const m = methods.get('m1')
    expect(m).to.not.undefined

    const params = m?.params
    const ret = m?.ret
    expect(params?.length).to.eq(2)
    expect(params![0].as<ClassTypeSignature>().binaryName).to.eq(
      'java/util/Date'
    )
    expect(params![1].as<ClassTypeSignature>().binaryName).to.eq(
      'java/lang/Object'
    )
    expect(ret?.as<ClassTypeSignature>().binaryName).to.eq('java/lang/Object')
  })
})
