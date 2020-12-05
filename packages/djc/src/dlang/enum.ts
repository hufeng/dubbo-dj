import Lang from './lang'

export class Enum extends Lang {
  fields: Array<{ name: string; val: number | string; comment: string }> = []

  constructor(fullClsName: string, comment?: string) {
    super(fullClsName, comment)
  }

  field(name: string, val: number | string, comment?: string) {
    this.fields.push({
      name,
      val,
      comment: this.fieldComment(comment),
    })
    return this
  }
}

export default function enumer(cls: string, comment?: string) {
  const e = new Enum(cls, comment)
  return {
    field(name: string, val: number | string, comment?: string) {
      e.field(name, val, comment)
      return this
    },

    ok() {
      return e
    },
  }
}
