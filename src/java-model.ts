import fs from 'fs'
import dot from 'dot'
import Deps from './java-deps'
import path from 'path'
import Base from './java'

export interface IType {
  tsType: string
  javaType: string
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
    } else {
      const meta = type() as IType
      this.fields.push({
        name,
        type: {
          tsType: meta.tsType,
          javaType: `${meta.javaType}(this.${name})`,
        },
        comment: this.buildComment(comment),
      })
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
