import Lang from './lang'

export class Enum extends Lang {
  fields: Array<{ name: string; val: number | string; comment: string }> = []

  constructor(fullClsName: string) {
    super(fullClsName)
  }

  field(name: string, val: number | string, coment?: string) {
    this.fields.push({
      name,
      val,
      comment: this.getComment(coment),
    })
    return this
  }
}

export default function enumer(cls: string) {
  const e = new Enum(cls)
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
