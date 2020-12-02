import Deps from './deps'

export default class Lang {
  clsName: string
  infName: string
  deps: Deps

  constructor(public fullClsName: string) {
    this.clsName = fullClsName.split('.').pop() || ''
    this.infName = `I${this.clsName}`
    this.deps = new Deps()
  }

  getComment(comment?: string) {
    return comment
      ? `
    /**
    * ${comment}
    */
   `
      : ''
  }
}
