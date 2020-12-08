import { IEntityField, IType } from '../types'
import { Enum } from './enum'
import Lang from './lang'

export class Entity extends Lang {
  fields: Array<IEntityField> = []
  constructor(fullClsName: string, comment?: string) {
    super(fullClsName, comment)
    this.deps.add('js-to-java', 'java')
  }

  field(name: string, type: Entity | Enum | (() => IType), comment?: string) {
    // 如果当前的field类型为enum
    if (type instanceof Enum) {
      this.addEnumField(type, name, comment)
      return
    }

    // 如果当前的属性类型为entity实体
    if (type instanceof Entity) {
      this.addEntityFiled(type, name, comment)
      return this
    }

    // 获取当前类型信息
    const { tsType, javaType, generic } = type()

    // 当前field为基础类型，不带泛型的
    if (!generic || generic.length === 0) {
      this.addBasicField(name, tsType, javaType, comment)
      return this
    }

    // 容器类型 带泛型
    // 如List,Set带一种类型
    // Map, HashMap等两种类型

    // add sugar transform
    this.deps.add('@dubbo/dj-sugar', 's')

    // 针对泛型的处理 - 一元泛型- 针对list, Set, Collection, Iterator
    if (generic.length === 1) {
      // 获取当前的泛型的类型
      this.addOneGenericField(generic, name, tsType, javaType, comment)
      return this
    }

    // 针对二元泛型的处理， Map, HashMap, Dictionary
    else if (generic.length === 2) {
      this.addTwoGenericsField(generic, name)
    }

    return this
  }

  private addTwoGenericsField(generic: (Entity | IType)[], name: string) {
    const [lg, rg] = generic

    // 二元的左子树泛型 只支持java.String
    if (lg instanceof Entity || lg.javaType !== 'java.String') {
      throw new Error(
        'Map/HashMap/Dictionary left generic type only support java.String'
      )
    }

    // 右侧泛型是 Entity 类型
    if (rg instanceof Entity) {
      const renamed = this.deps.add(rg.fullClsName, rg.clsName)
      this.fields.push({
        name,
        type: {
          tsType: `Map<string, ${renamed}>`,
          javaType: `s.$mhs(this.${name})`,
        },
        comment: '',
      })
    }

    // 右侧类型为基本数据类型
    else {
      this.fields.push({
        name,
        type: {
          tsType: `Map<string, ${rg.tsType}>`,
          javaType: `s.$mhs(this.${name}, ${rg.javaType})`,
        },
        comment: '',
      })
    }
  }

  private addOneGenericField(
    generic: (Entity | IType)[],
    name: string,
    tsType: string,
    javaType: string,
    comment: string | undefined
  ) {
    const g = generic[0]
    // 如果当前的泛型类型是 JavaClass
    if (g instanceof Entity) {
      const renamed = this.deps.add(g.fullClsName, g.clsName)
      this.fields.push({
        name,
        type: {
          tsType: `${tsType}<${renamed}>`,
          javaType: `${javaType}(s.$lhs(this.${name}))`,
        },
        comment: this.fieldComment(comment),
      })
    } else {
      // 泛型的类型为基本类型
      this.fields.push({
        name,
        type: {
          tsType: `${tsType}<${g.tsType}>`,
          javaType: `${javaType}(s.$lhs(this.${name}, ${g.javaType}))`,
        },
        comment: this.fieldComment(comment),
      })
    }
  }

  private addBasicField(
    name: string,
    tsType: string,
    javaType: string,
    comment: string | undefined
  ) {
    this.fields.push({
      name,
      type: {
        tsType: tsType,
        javaType: `${javaType}(this.${name})`,
      },
      comment: this.fieldComment(comment),
    })
  }

  private addEnumField(type: Enum, name: string, comment?: string) {
    const renamed = this.deps.add(type.fullClsName, type.clsName)
    this.fields.push({
      name,
      type: {
        tsType: renamed,
        javaType: `java.enum('${type.fullClsName}', ${renamed}[this.${name}])`,
      },
      comment: this.fieldComment(comment),
    })
  }

  private addEntityFiled(type: Entity, name: string, comment?: string) {
    const renamed = this.deps.add(type.fullClsName, type.clsName)
    this.fields.push({
      name,
      type: {
        tsType: renamed,
        javaType: `this.${name}.__fields2java()`,
      },
      comment: this.fieldComment(comment),
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
