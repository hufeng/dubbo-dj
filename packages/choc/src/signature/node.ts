import assert from 'assert'

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

  abstract clone(): TypeNode
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

  clone() {
    return new Primitive(this.binaryName)
  }
}

export class ClassSignature extends TypeNode {
  binaryName = ''
  isInterface = false
  isAbstract = false
  isEnum = false

  typeParams: TypeParam[] = []
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

  clone(): never {
    throw new Error('method not implemented')
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

  toTypeArg() {
    const ta = new TypeArg()
    ta.type = new TypeVar(this.name)
    return ta
  }

  clone(): never {
    throw new Error('method not implemented')
  }
}

export class ArrayTypeSignature extends TypeNode {
  constructor(public elementType: TypeNode) {
    super()
  }

  collectRefClasses(): Set<string> {
    return this.elementType.collectRefClasses()
  }

  clone() {
    return new ArrayTypeSignature(this.elementType.clone())
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

  applyTypeArgs(args: Map<string, TypeArg>) {
    this.typeArgs.forEach((ta, i) => {
      if (!ta.type) return
      if (ta.type.isTypeVar) {
        this.typeArgs[i] = args.get((ta.type as TypeVar).name)!
      } else {
        assert(ta.type.isClassType)
        ;(ta.type as ClassTypeSignature).applyTypeArgs(args)
      }
    })
  }

  clone() {
    const t = new ClassTypeSignature()
    t.isStatic = this.isStatic
    t.binaryName = this.binaryName
    t.typeArgs = this.typeArgs.map((t) => t.clone() as TypeArg)
    t.nestedTypes = this.nestedTypes.map(
      (n) => n.clone() as NestedClassTypeSignature
    )
    return t
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

  clone() {
    const t = new NestedClassTypeSignature()
    t.isStatic = this.isStatic
    t.name = this.name
    t.typeArgs = this.typeArgs.map((t) => t.clone() as TypeArg)
    return t
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

  clone(): never {
    throw new Error('method not implemented')
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

  clone() {
    const t = new TypeArg()
    t.isWildcard = this.isWildcard
    t.prefix = this.prefix
    t.type = this.type?.clone()
    return t
  }
}
export class TypeVar extends TypeNode {
  constructor(public name = '') {
    super()
  }

  collectRefClasses(): Set<string> {
    return new Set()
  }

  clone() {
    return new TypeVar(this.name)
  }
}

function addAll<T>(to: Set<T>, from: Set<T>) {
  from.forEach((item) => to.add(item))
}
