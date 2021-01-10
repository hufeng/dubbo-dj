export abstract class Node {
  isPrimitive() {
    return this instanceof Primitive
  }

  isArray() {
    return this instanceof ArrayTypeSignature
  }

  isClassType() {
    return this instanceof ClassTypeSignature
  }

  isClass() {
    return this instanceof ClassSignature
  }

  isTypeVar() {
    return this instanceof TypeVar
  }

  as<T extends Node>() {
    return (this as any) as T
  }

  abstract collectRefClasses(): Set<string>
  abstract collectDirectRefClasses(): Set<string>
}

export class Primitive extends Node {
  binaryName = ''

  collectRefClasses(): Set<string> {
    return new Set([this.binaryName])
  }

  collectDirectRefClasses(): Set<string> {
    return new Set<string>()
  }

  toJSON() {
    return {
      name: this.binaryName.replace('/', '.'),
    }
  }
}

export class ClassSignature extends Node {
  jar = ''
  jrt = ''

  binaryName = ''
  isInterface = false
  isAbstract = false
  isEnum = false

  typeParams: TypeParam[] = []
  appliedTypeArgs: TypeArg[] = []
  superClasses: ClassTypeSignature[] = []

  fields: TypeSignature[] = []
  methods: MethodTypeSignature[] = []
  privateFields: string[] = []

  collectRefClasses(): Set<string> {
    const refs = new Set<string>()
    this.typeParams.forEach((tp) => addAll(refs, tp.collectRefClasses()))
    this.superClasses.forEach((sp) => addAll(refs, sp.collectRefClasses()))
    this.fields.forEach((f) => addAll(refs, f.collectRefClasses()))
    this.methods.forEach((f) => addAll(refs, f.collectRefClasses()))
    return refs
  }

  collectDirectRefClasses(): Set<string> {
    const refs = new Set<string>()
    this.typeParams.forEach((tp) => addAll(refs, tp.collectRefClasses()))
    // FIXME:
    // this.collectFinalFields().forEach((f) =>
    //   addAll(refs, f.collectRefClasses())
    // )
    this.fields.forEach((f) => addAll(refs, f.collectRefClasses()))
    this.methods.forEach((f) => addAll(refs, f.collectDirectRefClasses()))
    return refs
  }
}

export class TypeParam extends Node {
  name = ''
  types: TypeSignature[] = []

  collectRefClasses(): Set<string> {
    const refs = new Set<string>()
    for (const ts of this.types) {
      addAll(refs, ts.collectRefClasses())
    }
    return refs
  }

  collectDirectRefClasses(): Set<string> {
    const refs = new Set<string>()
    for (const ts of this.types) {
      addAll(refs, ts.collectDirectRefClasses())
    }
    return refs
  }
}

export class ArrayTypeSignature extends Node {
  collectRefClasses(): Set<string> {
    throw new Error('Method not implemented.')
  }
  collectDirectRefClasses(): Set<string> {
    throw new Error('Method not implemented.')
  }
}
export class ClassTypeSignature extends Node {
  collectRefClasses(): Set<string> {
    throw new Error('Method not implemented.')
  }
  collectDirectRefClasses(): Set<string> {
    throw new Error('Method not implemented.')
  }
}
export class MethodTypeSignature extends Node {
  collectRefClasses(): Set<string> {
    throw new Error('Method not implemented.')
  }
  collectDirectRefClasses(): Set<string> {
    throw new Error('Method not implemented.')
  }
}

export class TypeSignature extends Node {
  collectRefClasses(): Set<string> {
    throw new Error('Method not implemented.')
  }
  collectDirectRefClasses(): Set<string> {
    throw new Error('Method not implemented.')
  }
}
export class TypeArg extends Node {
  collectRefClasses(): Set<string> {
    throw new Error('Method not implemented.')
  }
  collectDirectRefClasses(): Set<string> {
    throw new Error('Method not implemented.')
  }
}
export class TypeVar extends Node {
  collectRefClasses(): Set<string> {
    throw new Error('Method not implemented.')
  }
  collectDirectRefClasses(): Set<string> {
    throw new Error('Method not implemented.')
  }
}

function addAll<T>(to: Set<T>, from: Set<T>) {
  from.forEach((item) => to.add(item))
}
