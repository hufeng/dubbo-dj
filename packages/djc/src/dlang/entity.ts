import { IEntityField, IType } from '../types'
import { Enum } from './enum'
import Lang from './lang'
import { parseTypeMeta } from './type'

export class Entity extends Lang {
  fields: Array<IEntityField> = []
  constructor(fullClsName: string, comment?: string) {
    super(fullClsName, comment)
    this.deps.add('js-to-java', 'java')
  }

  field(name: string, type: Entity | Enum | (() => IType), comment?: string) {
    parseTypeMeta(type, {
      onBasic: (t) => {
        this.fields.push({
          name,
          type: {
            tsType: t.tsType,
            javaType: `${t.javaType}(this.${name})`,
          },
          comment: this.fieldComment(comment),
        })
      },
      onEntity: (t) => {
        const clsName = this.deps.add(t.fullClsName, t.infName)
        this.fields.push({
          name,
          type: {
            tsType: clsName,
            javaType: `this.${name}.__fields2java()`,
          },
          comment: this.fieldComment(comment),
        })
      },
      onEnum: (t) => {
        const clsName = this.deps.add(t.fullClsName, t.clsName)
        this.fields.push({
          name,
          type: {
            tsType: clsName,
            javaType: `java.enum('${t.fullClsName}', ${clsName}[this.${name}])`,
          },
          comment: this.fieldComment(comment),
        })
      },
      onGenericOneBasic: (t) => {
        // 泛型的类型为基本类型
        this.fields.push({
          name,
          type: {
            tsType: `${t.tsType}<${t.generic.tsType}>`,
            javaType: `${t.javaType}(s.$lhs(this.${name}, ${t.generic.javaType}))`,
          },
          comment: this.fieldComment(comment),
        })
      },
      onGenericOneEntity: (t) => {
        this.deps.add('@dubbo/dj-sugar', 's')
        const clsName = this.deps.add(t.generic.fullClsName, t.generic.infName)
        this.fields.push({
          name,
          type: {
            tsType: `${t.tsType}<${clsName}>`,
            javaType: `${t.javaType}(s.$lhs(this.${name}))`,
          },
          comment: this.fieldComment(comment),
        })
      },
      onGenericOneEnum: (t) => {
        this.deps.add('@dubbo/dj-sugar', 's')
        const clsName = this.deps.add(t.generic.fullClsName, t.generic.clsName)
        this.fields.push({
          name,
          type: {
            tsType: `${t.tsType}<${clsName}>`,
            javaType: `${t.javaType}(s.$lhs(this.${name}))`,
          },
          comment: this.fieldComment(comment),
        })
      },
      onGenericTwoBasic: (t) => {
        this.fields.push({
          name,
          type: {
            tsType: `${t.tsType}<${t.generic.tsType}>`,
            javaType: `s.$mhs(this.${name}, ${t.generic.javaType})`,
          },
          comment: this.fieldComment(comment),
        })
      },
      onGenericTwoEntity: (t) => {
        const clsName = this.deps.add(t.generic.fullClsName, t.generic.infName)
        this.fields.push({
          name,
          type: {
            tsType: `${t.tsType}<string, ${clsName}>`,
            javaType: `s.$mhs(this.${name})`,
          },
          comment: '',
        })
      },
      onGenericTwoEnum: (t) => {
        const clsName = this.deps.add(t.generic.fullClsName, t.generic.clsName)
        this.fields.push({
          name,
          type: {
            tsType: `${t.tsType}<string, ${clsName}>`,
            javaType: `s.$mhs(this.${name})`,
          },
          comment: '',
        })
      },
    })
  }
}

class EntityBuilder {
  constructor(private e: Entity) {}
  field(name: string, type: Entity | Enum | (() => IType), comment?: string) {
    this.e.field(name, type, comment)
    return this
  }
  ok() {
    return this.e
  }
}

export default function entity(fullClsName: string, comment?: string) {
  const e = new Entity(fullClsName, comment)
  return new EntityBuilder(e)
}
