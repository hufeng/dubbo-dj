import Lang from './lang'

export class Enum extends Lang {
  fields: Array<{ name: string; val: number | string; comment: string }> = []

  constructor(fullClsName: string, comment?: string) {
    super(fullClsName, comment)
  }

  field(name: string, val: number | string, coment?: string) {
    this.fields.push({
      name,
      val,
      comment: this.fieldComment(coment),
    })
    return this
  }
}

export default function enumer(cls: string, comment?: string) {
  const e = new Enum(cls, comment)
  return {
    field(name: string, val: number | string, coment?: string) {
      e.field(name, val, coment)
      return this
    },

    ok() {
      return e
    },
  }
}
