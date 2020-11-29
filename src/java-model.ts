import fs from 'fs'
import dot from 'dot'
import Deps from './java-deps'
import path from 'path'
import Base from './java'

export interface IType {
  tsType: string
  javaType: string
  generic?: Model | IType
}

export interface IField {
  name: string
  type: IType
  comment?: string
}

const dotInf = dot.template(
  fs.readFileSync(path.join(__dirname, './dot/inf.dot')).toString()
)
const dotCls = dot.template(
  fs.readFileSync(path.join(__dirname, './dot/cls.dot')).toString()
)

export class Model extends Base {
  clsName: string
  fields: Array<IField> = []

  constructor(public cls: string) {
    super()
    this.clsName = this.cls.split('.').pop() || ''
  }

  field(name: string, type: Model | (() => IType), comment?: string) {
    // 当前的参数类型是model实例
    if (type instanceof Model) {
      const renameClsName = this.deps.add(this.cls2Path(type.cls), type.clsName)
      this.fields.push({
        name,
        type: {
          tsType: renameClsName,
          javaType: `this.${name}.__fields2Java()`,
        },
        comment: this.buildComment(comment),
      })
      return this
    }

    const { tsType, javaType, generic } = type() as IType

    // 如果当前的类型不存在泛型
    if (!generic) {
      this.fields.push({
        name,
        type: {
          tsType: tsType,
          javaType: `${javaType}(this.${name})`,
        },
        comment: this.buildComment(comment),
      })
      return this
    }

    // 针对泛型的处理
    if (
      generic &&
      (javaType === 'java.List' ||
        javaType === 'java.Set' ||
        javaType === 'java.Collection')
    ) {
      if (generic instanceof Model) {
        const renameClsName = this.deps.add(
          this.cls2Path(generic.cls),
          generic.clsName
        )

        this.fields.push({
          name,
          type: {
            tsType: `${tsType}<${renameClsName}>`,
            javaType: `((l = []) => ${javaType}(l.map(v => v.__fields2Java())))(this.${name})`,
          },
          comment: this.buildComment(comment),
        })
        return this
      }
      this.fields.push({
        name,
        type: {
          tsType: `${tsType}<${generic.tsType}>`,
          javaType: `((l = []) => ${javaType}(l.map(${generic.javaType})))(this.${name})`,
        },
        comment: this.buildComment(comment),
      })
      return this
    }

    return this
  }

  get infName() {
    return `I${this.clsName}`
  }

  get inf() {
    return dotInf({
      mott: this.mott,
      imports: this.deps.imports,
      infName: this.infName,
      fields: this.fields,
    })
  }

  get bean() {
    return dotCls({
      mott: this.mott,
      imports: this.deps.imports,
      cls: this.cls,
      infName: this.infName,
      clsName: this.clsName,
      fields: this.fields,
    })
  }
}

export function model(cls: string) {
  return new Model(cls)
}
