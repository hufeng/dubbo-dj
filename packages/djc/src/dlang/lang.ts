import Deps from './deps'

export default class Lang {
  clsName: string
  infName: string
  deps: Deps
  _comment: string

  constructor(public fullClsName: string, comment?: string) {
    this._comment = comment || ''

    this.clsName = fullClsName.split('.').pop() || ''
    this.infName = `I${this.clsName}`

    this.deps = new Deps()
  }

  get comment() {
    return this._comment
      ? `
    /**
    * ${this._comment}
    */`
      : ''
  }

  fieldComment(comment?: string) {
    return comment
      ? `
    /**
    * ${comment}
    */
   `
      : ''
  }
}
