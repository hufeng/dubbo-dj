import { IType, Model } from './java-model'

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

export function List(type: Model | (() => IType)): () => IType {
  return () => {
    if (type instanceof Model) {
      return {
        tsType: 'Array',
        javaType: 'java.List',
        generic: type,
      }
    } else {
      return {
        tsType: 'Array',
        javaType: `java.List`,
        generic: type(),
      }
    }
  }
}

export function Set(type: Model | (() => IType)): () => IType {
  return () => {
    if (type instanceof Model) {
      return {
        tsType: 'Array',
        javaType: 'java.Set',
        generic: type,
      }
    } else {
      return {
        tsType: 'Array',
        javaType: `java.Set`,
        generic: type(),
      }
    }
  }
}

export function Collection(type: Model | (() => IType)): () => IType {
  return () => {
    if (type instanceof Model) {
      return {
        tsType: 'Array',
        javaType: 'java.Collection',
        generic: type,
      }
    } else {
      return {
        tsType: 'Array',
        javaType: `java.Collection`,
        generic: type(),
      }
    }
  }
}

export function Iterator(): IType {
  return {
    tsType: '',
    javaType: 'java.Iterator',
  }
}

export function Enumeration(): IType {
  return {
    tsType: '',
    javaType: 'java.Enumeration',
  }
}

export function HashMap(): IType {
  return {
    tsType: '',
    javaType: '',
  }
}

export function Map(): IType {
  return {
    tsType: '',
    javaType: '',
  }
}

export function Dictionary(): IType {
  return {
    tsType: '',
    javaType: '',
  }
}

export function Currency(): IType {
  return {
    tsType: '',
    javaType: '',
  }
}
