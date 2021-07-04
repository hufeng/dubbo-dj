import { IProject } from './type'

export class DubboProject {
  private readonly meta: IProject = { name: '', version: '', description: '' }

  name(name: string) {
    this.meta.name = name
    return this
  }

  version(version: string) {
    this.meta.version = version
    return this
  }

  description(description: string) {
    this.meta.description = description
    return this
  }

  ok() {
    return this.meta
  }
}

export const project = new DubboProject()
