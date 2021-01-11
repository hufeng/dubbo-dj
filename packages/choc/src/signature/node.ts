export abstract class TypeNode {
  get isPrimitive(): boolean {
    return this instanceof Primitive
  }

  get isArray(): boolean {
    return this instanceof ArrayTypeSignature
  }

  get isClassType(): boolean {
    return this instanceof ClassTypeSignature
  }

  get isClass(): boolean {
    return this instanceof ClassSignature
  }

  get isTypeVar(): boolean {
    return this instanceof TypeVar
  }

  isStatic = false

  as<T extends TypeNode>() {
    return (this as any) as T
  }

  abstract collectRefClasses(): Set<string>
}

export class Primitive extends TypeNode {
  constructor(public readonly binaryName = '') {
    super()
  }

  collectRefClasses(): Set<string> {
    return new Set([this.binaryName])
  }

  toJSON() {
    return {
      name: this.binaryName.replace('/', '.'),
    }
  }
}

export class ClassSignature extends TypeNode {
  binaryName = ''
  isInterface = false
  isAbstract = false
  isEnum = false

  typeParams: TypeParam[] = []
  appliedTypeArgs: TypeArg[] = []
  superClasses: ClassTypeSignature[] = []

  fields = new Map<string, TypeNode>()
  methods = new Map<string, MethodTypeSignature>()
  privateFields: string[] = []

  get classTypeSignature() {
    const node = new ClassTypeSignature()
    node.binaryName = this.binaryName
    return node
  }

  get superClass() {
    if (this.superClasses.length) return this.superClasses[0]
    return undefined
  }

  collectRefClasses(): Set<string> {
    const refs = new Set<string>()
    this.typeParams.forEach((tp) => addAll(refs, tp.collectRefClasses()))
    this.superClasses.forEach((sp) => addAll(refs, sp.collectRefClasses()))
    this.fields.forEach((f) => addAll(refs, f.collectRefClasses()))
    this.methods.forEach((f) => addAll(refs, f.collectRefClasses()))
    return refs
  }
}

export class TypeParam extends TypeNode {
  name = ''
  types: TypeNode[] = []

  collectRefClasses(): Set<string> {
    const refs = new Set<string>()
    for (const ts of this.types) {
      addAll(refs, ts.collectRefClasses())
    }
    return refs
  }
}

export class ArrayTypeSignature extends TypeNode {
  constructor(public elementType: TypeNode) {
    super()
  }

  collectRefClasses(): Set<string> {
    return this.elementType.collectRefClasses()
  }
}
export class ClassTypeSignature extends TypeNode {
  binaryName = ''
  typeArgs: TypeArg[] = []
  nestedTypes: NestedClassTypeSignature[] = []

  collectRefClasses(): Set<string> {
    const refs = new Set<string>()
    refs.add(this.binaryName)
    this.typeArgs.forEach((ta) => addAll(refs, ta.collectRefClasses()))
    this.nestedTypes.forEach((nt) => addAll(refs, nt.collectRefClasses()))
    return refs
  }
}

export class NestedClassTypeSignature extends TypeNode {
  name = ''
  typeArgs: TypeArg[] = []

  collectRefClasses(): Set<string> {
    const refs = new Set<string>()
    this.typeArgs.forEach((ta) => addAll(refs, ta.collectRefClasses()))
    return refs
  }
}

export class MethodTypeSignature extends TypeNode {
  isOverride = false
  typeParams: TypeParam[] = []
  formalParams: string[] = []

  constructor(
    public params: TypeNode[],
    public ret: TypeNode,
    public exceptions: TypeNode[]
  ) {
    super()
  }

  collectRefClasses(): Set<string> {
    const refs = new Set<string>()
    this.typeParams.forEach((tp) => addAll(refs, tp.collectRefClasses()))
    this.params.forEach((p) => addAll(refs, p.collectRefClasses()))
    addAll(refs, this.ret.collectRefClasses())
    // exceptions is ignored
    return refs
  }
}

export class TypeArg extends TypeNode {
  static wildcard = new TypeArg(true)

  prefix = ''
  type?: TypeNode

  constructor(public isWildcard = false) {
    super()
  }

  collectRefClasses(): Set<string> {
    if (!this.type) return new Set()
    return this.type.collectRefClasses()
  }
}
export class TypeVar extends TypeNode {
  name = ''

  collectRefClasses(): Set<string> {
    return new Set()
  }
}

function addAll<T>(to: Set<T>, from: Set<T>) {
  from.forEach((item) => to.add(item))
}
