import Lang from './lang'
import { universalType } from './type'
import { IDubboEntityField, IType, TDataType } from '../types'

// ~~~~~~~~~~~~~~~~~~ model~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export class DubboEntity extends Lang {
  fields: Array<IDubboEntityField>

  constructor(fullName: string, comment?: string) {
    super(fullName, comment)
    this.fields = []
    this.deps.add({
      fromModule: 'js-to-java',
      isDefaultModule: true,
      importModule: 'java',
      is3rdModule: true,
    })
  }

  field(name: string, type: IType, comment?: string) {
    this.fields.push({
      comment: this.wrapComment(comment),
      name,
      type,
    })
  }

  get toJSON() {
    return {
      mott: this.mott,
      comment: this.comment,
      fullName: this.fullName,
      shortName: this.shortName,
      infName: this.infName,
      fields: this.fields,
      imports: this.imports(this.deps),
    }
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ DSL ~~~~~~~~~~~~~~~~~~~~~~~
export class EntityBuilder {
  private readonly entity: DubboEntity

  constructor(fullName: string, comment?: string) {
    this.entity = new DubboEntity(fullName, comment)
  }

  field(name: string, type: TDataType, comment?: string) {
    const t = universalType(this.entity.deps, type)
    this.entity.field(name, t, comment)
    return this
  }

  ok() {
    return this.entity
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ factory ~~~~~~~~~~~~~~~~~~~~~~~~
export function entity(fullName: string, comment?: string) {
  return new EntityBuilder(fullName, comment)
}
