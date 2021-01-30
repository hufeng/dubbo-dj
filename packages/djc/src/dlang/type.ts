import { IType } from '../types'
import Deps from './deps'
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
  return () => ({
    tsType: 'Array',
    javaType: 'java.List',
    generic: [type],
  })
}

export function Set(type: Entity | Enum | (() => IType)): () => IType {
  return () => ({
    tsType: 'Array',
    javaType: 'java.Set',
    generic: [type],
  })
}

export function Collection(type: Entity | Enum | (() => IType)): () => IType {
  return () => ({
    tsType: 'Array',
    javaType: 'java.Collection',
    generic: [type],
  })
}

export function Iterator(type: Entity | Enum | (() => IType)): () => IType {
  return () => ({
    tsType: 'Array',
    javaType: 'java.Iterator',
    generic: [type],
  })
}

export function Enumeration(type: Entity | (() => IType)): () => IType {
  return () => ({
    tsType: 'Array',
    javaType: 'java.Iterator',
    generic: [type],
  })
}

export function HashMap(
  leftType: Entity | (() => IType),
  rightType: Entity | Enum | (() => IType)
): () => IType {
  return () => ({
    tsType: 'Map',
    javaType: 'java.HashMap',
    generic: [leftType, rightType],
  })
}

export function Map(
  leftType: Entity | (() => IType),
  rightType: Entity | Enum | (() => IType)
): () => IType {
  return () => ({
    tsType: 'Map',
    javaType: 'java.Map',
    generic: [leftType, rightType],
  })
}

export function Dictionary(
  leftType: Entity | (() => IType),
  rightType: Entity | (() => IType)
): () => IType {
  return () => ({
    tsType: 'Map',
    javaType: 'java.Dictionary',
    generic: [leftType, rightType],
  })
}

export function Currency(): IType {
  return {
    tsType: 'string',
    javaType: 'java.Currency',
  }
}

export interface ITypeMeta {}
export interface ITypeCallBack {
  onBasic(param: IType): void
  onEntity(param: Entity): void
  onEnum(parma: Enum): void
  onGenericOne(param: { tsType: string; schema: Object }): void
  onGenericTwo(param: {
    tsType: string
    javaType: string
    generic: [{ tsType: string }, { tsType: string }]
  }): void
}

export function parseTypeMeta(
  type: Entity | Enum | (() => IType),
  deps: Deps,
  cb: ITypeCallBack
) {
  // current is entity
  if (type instanceof Entity) {
    cb.onEntity(type)
    return
  }

  // current is Enum
  if (type instanceof Enum) {
    cb.onEnum(type)
    return
  }

  const { tsType, javaType, generic } = type()

  // basic type
  if (!generic || generic.length === 0) {
    cb.onBasic({ tsType, javaType })
    return
  }

  // root is one generic
  if (generic.length === 1) {
    // const g = generic[0]
    // cb.onGenericOne({ tsType, javaType, generic: parseGenericType(g, deps) })
    cb.onGenericOne({ ...parseGenericType(type, deps) })
    return
  }

  // root is two generics
  if (generic.length === 2) {
    const [lg, rg] = generic
    cb.onGenericTwo({
      tsType,
      javaType,
      generic: [parseGenericType(lg, deps), parseGenericType(rg, deps)],
    })
  }
}

interface IGenericScheme {
  type: string | { enum: { fullClsName: string; clsName: string } }
  item: IGenericScheme | null | [IGenericScheme, IGenericScheme]
}

export function parseGenericType(
  type: Entity | Enum | (() => IType),
  deps: Deps
): { tsType: string; schema: IGenericScheme } {
  let tsType = ''
  const schema = {} as IGenericScheme

  deps.add('@dubbo/sugar', 's')

  // 当前是Entity
  if (type instanceof Entity) {
    const infName = deps.add(type.fullClsName, type.infName, false)
    tsType += infName
    schema.type = 'entity'
    schema.item = null
  }

  // 当前是枚举类型
  else if (type instanceof Enum) {
    const clsName = deps.add(type.fullClsName, type.clsName)
    tsType += clsName
    schema.type = {
      enum: {
        fullClsName: type.fullClsName,
        clsName: type.clsName,
      },
    }
    schema.item = null
  }

  // 基本类型或者泛型
  else {
    let t = type()
    // 当前是普通类型
    if (!t.generic || t.generic.length === 0) {
      tsType += t.tsType
      schema.type = t.javaType
      schema.item = null
    }

    // 一个泛型
    else if (t.generic.length === 1) {
      const g = t.generic[0]
      const { tsType: _tsType, schema: _schema } = parseGenericType(g, deps)
      tsType += t.tsType + `<${_tsType}>`
      schema.type = 'list'
      schema.item = _schema
    }

    // 两个泛型
    else if (t.generic.length === 2) {
      const lg = t.generic[0]
      const rg = t.generic[1]
      const { tsType: ls, schema: lschema } = parseGenericType(lg, deps)
      const { tsType: rs, schema: rschema } = parseGenericType(rg, deps)
      tsType += t.tsType + `<${ls}, ${rs}>`
      schema.type = 'map'
      schema.item = [lschema, rschema]
    }
  }

  return {
    tsType,
    schema,
  }
}
