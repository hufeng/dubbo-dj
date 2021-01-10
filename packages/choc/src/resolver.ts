// import path from 'path'
import { Deserializer } from './deserialize'

export class ClassResolver {
  constructor(public jar = '', public binaryName = '') {}

  async resolve() {
    const dec = await Deserializer.fromFile(this.jar)
    const cf = dec.satisfy()

    console.log('Class: ' + cf.name)

    console.log('SuperClass: ' + cf.getSuperClass())

    console.log('Interfaces: ' + cf.getInterfaces())
  }
}
