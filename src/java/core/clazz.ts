import { IJavaClazzField, IType } from '../types'
import BaseClazz from './base-clazz'

export class JavaClazz extends BaseClazz {
  fields: Array<IJavaClazzField> = []
  constructor(fullClsName: string) {
    super(fullClsName)
    this.deps.add('js-to-java', 'java')
  }

  field(name: string, type: JavaClazz | (() => IType), comment?: string) {
    // 当前的参数类型是 JavaClazz 实例
    if (type instanceof JavaClazz) {
      this.javaClazzFiled(type, name, comment)
      return this
    }

    // 获取当前类型信息
    const { tsType, javaType, generic } = type()

    // 当前field为基础类型，不带泛型的
    if (!generic || generic.length === 0) {
      this.javaBasicTypeField(name, tsType, javaType, comment)
      return this
    }

    // 容器类型 带泛型
    // 如List,Set带一种类型
    // Map, HashMap等两种类型

    // add suger transform
    this.deps.add('@dubbo/dj-suger', 's')

    // 针对泛型的处理 - 一元泛型- 针对list, Set, Collection, Iterator
    if (generic.length === 1) {
      // 获取当前的泛型的类型
      this.oneGenericField(generic, name, tsType, javaType, comment)
      return this
    }

    // 针对二元泛型的处理， Map, HashMap, Dictionary
    else if (generic.length === 2) {
      this.twoGenericsField(generic, name)
    }

    return this
  }

  private twoGenericsField(generic: (JavaClazz | IType)[], name: string) {
    const [lg, rg] = generic

    // 二元的左子树泛型 只支持java.String
    if (lg instanceof JavaClazz || lg.javaType !== 'java.String') {
      throw new Error(
        'Map/HashMap/Dictionary left generic type only support java.String'
      )
    }

    // 右侧泛型是 JavaClazz类型
    if (rg instanceof JavaClazz) {
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

  private oneGenericField(
    generic: (JavaClazz | IType)[],
    name: string,
    tsType: string,
    javaType: string,
    comment: string | undefined
  ) {
    const g = generic[0]
    // 如果当前的泛型类型是 JavaClass
    if (g instanceof JavaClazz) {
      const renamed = this.deps.add(g.fullClsName, g.clsName)
      this.fields.push({
        name,
        type: {
          tsType: `${tsType}<${renamed}>`,
          javaType: `${javaType}(s.$lhs(this.${name}))`,
        },
        comment: this.getComment(comment),
      })
    } else {
      // 泛型的类型为基本类型
      this.fields.push({
        name,
        type: {
          tsType: `${tsType}<${g.tsType}>`,
          javaType: `${javaType}(s.$lhs(this.${name}, ${g.javaType}))`,
        },
        comment: this.getComment(comment),
      })
    }
  }

  private javaBasicTypeField(
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
      comment: this.getComment(comment),
    })
  }

  private javaClazzFiled(
    type: JavaClazz,
    name: string,
    comment: string | undefined
  ) {
    const renamed = this.deps.add(type.fullClsName, type.clsName)
    this.fields.push({
      name,
      type: {
        tsType: renamed,
        javaType: `this.${name}.__fields2java()`,
      },
      comment: this.getComment(comment),
    })
  }
}

export default function Clazz(fullClsName: string) {
  const clz = new JavaClazz(fullClsName)
  return {
    field(name: string, type: JavaClazz | (() => IType), comment?: string) {
      clz.field(name, type, comment)
      return this
    },
    ok() {
      return clz
    },
  }
}
