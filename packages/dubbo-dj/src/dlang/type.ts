import { IType, TDataType } from '../types'
import { DubboDep } from './lang-deps'
import { DubboEntity } from './lang-entity'
import { DubboEnum } from './lang-enum'

export interface IProject {
  name: string
  version: string
  description: string
}

// ~~~~~~~~~ factory ~~~~~~~~~~~~~~~~~~~~~~~~~~
export function universalType(dep: DubboDep, type: TDataType) {
  if (type instanceof DubboEntity) {
    dep.add({
      fromModule: type.fullName,
      importModule: type.shortName,
    })
    return {
      tsType: type.infName,
      javaType: `((v:any) => v.__fields2java())`,
    }
  } else if (type instanceof DubboEnum) {
    dep.add({
      fromModule: type.fullName,
      importModule: type.shortName,
    })
    return {
      tsType: type.shortName,
      javaType: `((v:any) => java.enum('${type.fullName}', ${type.shortName}[v]))`,
    }
  } else {
    return type(dep)
  }
}

// ~~~~~~~~~ Boolean && boolean ~~~~~~~~~~~~~~~
export function Boolean(): IType {
  return {
    tsType: 'boolean',
    javaType: 'java.Boolean',
  }
}

export function boolean(): IType {
  return {
    tsType: 'boolean',
    javaType: 'java.boolean',
  }
}

// ~~~~~~~~~ each number type ~~~~~~~~~~~~~~
export function Integer(): IType {
  return {
    tsType: 'number',
    javaType: 'java.Integer',
  }
}

export function int(): IType {
  return {
    tsType: 'number',
    javaType: 'java.int',
  }
}

export function short(): IType {
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
export function List(
  type: TDataType
): (() => IType) | ((dep: DubboDep) => IType) {
  if (type instanceof DubboEntity) {
    const { infName } = type
    return (dep: DubboDep) => {
      dep.add({
        fromModule: type.fullName,
        importModule: type.infName,
      })
      return {
        tsType: `Array<${infName}>`,
        javaType: `(function withList(val:Array<any>=[]) {return java.List(val.map(v => v.__fields2java()))})`,
      }
    }
  }

  if (type instanceof DubboEnum) {
    const { shortName, fullName } = type
    return (dep: DubboDep) => {
      dep.add({
        fromModule: type.fullName,
        importModule: type.shortName,
      })
      return {
        tsType: `Array<${shortName}>`,
        javaType: `(function withList(val:Array<any>=[]) {return java.List(val.map(v => java.enum('${fullName}')))})})`,
      }
    }
  }

  return (dep: DubboDep) => {
    const t = type(dep)
    return {
      tsType: `Array<${t.tsType}>`,
      javaType: `(function withList(val:Array<any>=[]){return java.List(val.map(v => ${t.javaType}(v)))})`,
    }
  }
}

/*
export function Set(type: Entity | LangEnum | (() => IType)): () => IType {
  return () => ({
    tsType: 'Array',
    javaType: 'java.Set',
    generic: [type],
  })
}

export function Collection(type: Entity | LangEnum | (() => IType)): () => IType {
  return () => ({
    tsType: 'Array',
    javaType: 'java.Collection',
    generic: [type],
  })
}

export function Iterator(type: Entity | LangEnum | (() => IType)): () => IType {
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
  rightType: Entity | LangEnum | (() => IType)
): () => IType {
  return () => ({
    tsType: 'Map',
    javaType: 'java.HashMap',
    generic: [leftType, rightType],
  })
}

export function Map(
  leftType: Entity | (() => IType),
  rightType: Entity | LangEnum | (() => IType)
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
*/

export function Currency(): IType {
  return {
    tsType: 'string',
    javaType: 'java.Currency',
  }
}
