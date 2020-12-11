import { IType } from '../types'
import { Entity } from './entity'
import { Enum } from './enum'

// ~~~~~~~~~ Boolean && boolean ~~~~~~~~~~~~~~~
export function Boolean() {
  return {
    tsType: 'boolean',
    javaType: 'java.Boolean',
  }
}

export function boolean() {
  return {
    tsType: 'boolean',
    javaType: 'java.boolean',
  }
}

// ~~~~~~~~~ each number type ~~~~~~~~~~~~~~
export function Integer() {
  return {
    tsType: 'number',
    javaType: 'java.Integer',
  }
}

export function int() {
  return {
    tsType: 'number',
    javaType: 'java.int',
  }
}

export function short() {
  return {
    tsType: 'number',
    javaType: 'java.short',
  }
}

export function Short(): IType {
  return {
    tsType: 'number',
    javaType: 'java.Short',
  }
}

export function byte(): IType {
  return {
    tsType: 'number',
    javaType: 'java.byte',
  }
}

export function Byte(): IType {
  return {
    tsType: 'number',
    javaType: 'java.Byte',
  }
}

export function long(): IType {
  return {
    tsType: 'number',
    javaType: 'java.long',
  }
}

export function Long(): IType {
  return {
    tsType: 'number',
    javaType: 'java.Long',
  }
}

export function double(): IType {
  return {
    tsType: 'number',
    javaType: 'java.double',
  }
}

export function Double(): IType {
  return {
    tsType: 'number',
    javaType: 'java.Double',
  }
}

export function float(): IType {
  return {
    tsType: 'number',
    javaType: 'java.float',
  }
}

export function Float(): IType {
  return {
    tsType: 'number',
    javaType: 'java.Float',
  }
}

// ~~~~~~~~~~~~~~ String ~~~~~~~~~~~~~~~~
export function String(): IType {
  return {
    tsType: 'string',
    javaType: 'java.String',
  }
}

export function char(): IType {
  return {
    tsType: 'string',
    javaType: 'java.char',
  }
}

export function Char(): IType {
  return {
    tsType: 'string',
    javaType: 'java.Char',
  }
}

export function chars(): IType {
  return {
    tsType: 'string',
    javaType: 'java.chars',
  }
}

export function Character(): IType {
  return {
    tsType: 'string',
    javaType: 'java.Character',
  }
}

// ~~~~~~~~~~~~~~~~~~~~~ container ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export function List(type: Entity | Enum | (() => IType)): () => IType {
  const generic = type instanceof Entity || type instanceof Enum ? type : type()
  return () => ({
    tsType: 'Array',
    javaType: 'java.List',
    generic: [generic],
  })
}

export function Set(type: Entity | Enum | (() => IType)): () => IType {
  const generic = type instanceof Entity || type instanceof Enum ? type : type()
  return () => ({
    tsType: 'Array',
    javaType: 'java.Set',
    generic: [generic],
  })
}

export function Collection(type: Entity | Enum | (() => IType)): () => IType {
  const generic = type instanceof Entity || type instanceof Enum ? type : type()
  return () => ({
    tsType: 'Array',
    javaType: 'java.Collection',
    generic: [generic],
  })
}

export function Iterator(type: Entity | Enum | (() => IType)): () => IType {
  const generic = type instanceof Entity || type instanceof Enum ? type : type()
  return () => ({
    tsType: 'Array',
    javaType: 'java.Iterator',
    generic: [generic],
  })
}

export function Enumeration(type: Entity | (() => IType)): () => IType {
  const generic = type instanceof Entity ? type : type()
  return () => ({
    tsType: 'Array',
    javaType: 'java.Iterator',
    generic: [generic],
  })
}

export function HashMap(
  leftType: Entity | (() => IType),
  rightType: Entity | Enum | (() => IType)
): () => IType {
  let rg: Entity | Enum | IType
  if (rightType instanceof Enum || rightType instanceof Entity) {
    rg = rightType
  } else {
    rg = rightType()
  }
  return () => ({
    tsType: 'Map',
    javaType: 'java.HashMap',
    generic: [leftType instanceof Entity ? leftType : leftType(), rg],
  })
}

export function Map(
  leftType: Entity | (() => IType),
  rightType: Entity | Enum | (() => IType)
): () => IType {
  let rg: Entity | Enum | IType
  if (rightType instanceof Enum || rightType instanceof Entity) {
    rg = rightType
  } else {
    rg = rightType()
  }
  return () => ({
    tsType: 'Map',
    javaType: 'java.Map',
    generic: [leftType instanceof Entity ? leftType : leftType(), rg],
  })
}

export function Dictionary(
  leftType: Entity | (() => IType),
  rightType: Entity | (() => IType)
): () => IType {
  return () => ({
    tsType: 'Map',
    javaType: 'java.Dictionary',
    generic: [
      leftType instanceof Entity ? leftType : leftType(),
      rightType instanceof Entity ? rightType : rightType(),
    ],
  })
}

export function Currency(): IType {
  return {
    tsType: 'string',
    javaType: 'java.Currency',
  }
}

export interface ITypeCallBack {
  onBasic(param: IType): void
  onEntity(param: Entity): void
  onEnum(parma: Enum): void
  onGenericOneBasic(param: {
    tsType: string
    javaType: string
    generic: { tsType: string; javaType: string }
  }): void
  onGenericOneEntity(param: {
    tsType: string
    javaType: string
    generic: Entity
  }): void
  onGenericOneEnum(param: {
    tsType: string
    javaType: string
    generic: Enum
  }): void

  onGenericTwoBasic(param: {
    tsType: string
    javaType: string
    generic: { tsType: string; javaType: string }
  }): void
  onGenericTwoEnum(param: {
    tsType: string
    javaType: string
    generic: Enum
  }): void
  onGenericTwoEntity(param: {
    tsType: string
    javaType: string
    generic: Entity
  }): void
}

export function parseTypeMeta(
  type: Entity | Enum | (() => IType),
  cb: ITypeCallBack
) {
  if (type instanceof Entity) {
    cb.onEntity(type)
    return
  }

  if (type instanceof Enum) {
    cb.onEnum(type)
    return
  }

  const { tsType, javaType, generic } = type()

  if (!generic || generic.length === 0) {
    cb.onBasic({ tsType, javaType })
    return
  }

  if (generic.length === 1) {
    const g = generic[0]
    if (g instanceof Entity) {
      cb.onGenericOneEntity({ tsType, javaType, generic: g })
    } else if (g instanceof Enum) {
      cb.onGenericOneEnum({ tsType, javaType, generic: g })
    } else {
      cb.onGenericOneBasic({ tsType, javaType, generic: g })
    }
    return
  }

  if (generic.length === 2) {
    const [lg, rg] = generic

    if (
      lg instanceof Entity ||
      lg instanceof Enum ||
      lg.javaType !== 'java.String'
    ) {
      throw new Error(
        'Map/HashMap/Dictionary left generic type only support java.String'
      )
    }

    if (rg instanceof Entity) {
      cb.onGenericTwoEntity({
        tsType,
        javaType,
        generic: rg,
      })
    } else if (rg instanceof Enum) {
      cb.onGenericTwoEnum({
        tsType,
        javaType,
        generic: rg,
      })
    } else {
      cb.onGenericTwoBasic({
        tsType,
        javaType,
        generic: rg,
      })
    }
  }
}
