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
    parseTypeMeta(type, this.deps, {
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
        const infName = this.deps.add(t.fullClsName, t.infName, false)
        this.fields.push({
          name,
          type: {
            tsType: infName,
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
      onGenericOne: (t) => {
        this.fields.push({
          name,
          type: {
            tsType: `${t.tsType}`,
            javaType: `s.$hs(this.${name}, ${JSON.stringify(t.schema)})`,
          },
          comment: this.fieldComment(comment),
        })
      },
      onGenericTwo: (t) => {
        this.fields.push({
          name,
          type: {
            tsType: `Map<${t.generic[0].tsType}, ${t.generic[1].tsType}>`,
            javaType: `${t.javaType}`,
          },
          comment: this.fieldComment(comment),
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
