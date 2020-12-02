import { IType } from '../types'
import { Entity } from './entity'

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
export function List(type: Entity | (() => IType)): () => IType {
  const generic = type instanceof Entity ? type : type()
  return () => ({
    tsType: 'Array',
    javaType: 'java.List',
    generic: [generic],
  })
}

export function Set(type: Entity | (() => IType)): () => IType {
  const generic = type instanceof Entity ? type : type()
  return () => ({
    tsType: 'Array',
    javaType: 'java.Set',
    generic: [generic],
  })
}

export function Collection(type: Entity | (() => IType)): () => IType {
  const generic = type instanceof Entity ? type : type()
  return () => ({
    tsType: 'Array',
    javaType: 'java.Collection',
    generic: [generic],
  })
}

export function Iterator(type: Entity | (() => IType)): () => IType {
  const generic = type instanceof Entity ? type : type()
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
  rightType: Entity | (() => IType)
): () => IType {
  return () => ({
    tsType: 'Map',
    javaType: 'java.HashMap',
    generic: [
      leftType instanceof Entity ? leftType : leftType(),
      rightType instanceof Entity ? rightType : rightType(),
    ],
  })
}

export function Map(
  leftType: Entity | (() => IType),
  rightType: Entity | (() => IType)
): () => IType {
  return () => ({
    tsType: 'Map',
    javaType: 'java.Map',
    generic: [
      leftType instanceof Entity ? leftType : leftType(),
      rightType instanceof Entity ? rightType : rightType(),
    ],
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
