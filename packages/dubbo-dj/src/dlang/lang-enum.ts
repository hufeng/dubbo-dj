import Lang from './lang'
import { IDubboEnumFiled } from '../types'

// ~~~~~~~~~~~~~~~~~~ model~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export class DubboEnum extends Lang {
  fields: Array<IDubboEnumFiled> = []

  constructor(fullName: string, comment?: string) {
    super(fullName, comment)
  }

  field(name: string, val: number | string, comment?: string) {
    this.fields.push({
      name,
      val,
      comment: this.wrapComment(comment),
    })
    return this
  }

  get toJSON() {
    return {
      mott: this.mott,
      comment: this.comment,
      fullName: this.fullName,
      fields: this.fields,
    }
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ DSL ~~~~~~~~~~~~~~~~~~~~~~~
export class DubboEnumDSL {
  private readonly enumeration: DubboEnum

  constructor(fullName: string, comment: string = '') {
    this.enumeration = new DubboEnum(fullName, comment)
  }

  /**
   * 枚举属性字段
   * @param name 属性名称
   * @param val
   * @param comment
   */
  field(name: string, val: number | string, comment?: string) {
    this.enumeration.field(name, val, comment)
    return this
  }

  /**
   * 完成Enum DSL的定义
   */
  ok() {
    return this.enumeration
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ factory ~~~~~~~~~~~~~~~~~~~~~~~~
export function enumeration(cls: string, comment?: string) {
  return new DubboEnumDSL(cls, comment)
}
