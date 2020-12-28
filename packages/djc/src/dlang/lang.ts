import Deps from './deps'

export default class Lang {
  fullClsName: string
  clsName: string
  infName: string

  deps: Deps
  comment: string

  constructor(fullClsName: string, comment?: string) {
    this.fullClsName = fullClsName
    this.clsName = fullClsName.split('.').pop() || ''
    this.infName = `I${this.clsName}`

    this.deps = new Deps()
    this.comment = this.getComment(comment || '')
  }

  getComment(comment: string) {
    return comment
      ? `
    /**
    * ${comment}
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
