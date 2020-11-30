import BaseClazz from './base-clazz'

export class JavaEnum extends BaseClazz {
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

export default function Enum(cls: string) {
  const javaEnum = new JavaEnum(cls)
  return {
    field(name: string, val: number | string, coment?: string) {
      javaEnum.field(name, val, coment)
      return this
    },

    ok() {
      return javaEnum
    },
  }
}
