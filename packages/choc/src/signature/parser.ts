// Parsing the syntax of method signature defined at here:
// https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html#jvms-4.3.3

import assert from 'assert'
import {
  TypeNode,
  ArrayTypeSignature,
  ClassSignature,
  ClassTypeSignature,
  MethodTypeSignature,
  NestedClassTypeSignature,
  Primitive,
  TypeArg,
  TypeParam,
  TypeVar,
} from './node'

export const Primitives = {
  B: 'java/lang/Byte',
  C: 'java/lang/Character',
  D: 'java/lang/Double',
  F: 'java/lang/Float',
  I: 'java/lang/Integer',
  J: 'java/lang/Long',
  S: 'java/lang/Short',
  Z: 'java/lang/Boolean',
  V: 'java/lang/Void',
}

export const EOF = -1

export class SignatureParser {
  _raw = ''
  _len = 0
  _cursor = 0
  _mrk = 0

  constructor(signature: string) {
    this._raw = signature
    this._len = this._raw.length
  }

  parseTypeSignature() {
    if (this._aheadIsPrimitive()) return this._parsePrimitive()

    const c = this._peek()
    if (c === 'L') return this._parseClassTypeSignature()
    if (c === '[') return this._parseArrayTypeSignature()
    if (c === 'T') return this._parseTypeVar()

    return null
  }

  parseClassSignature() {
    const node = new ClassSignature()
    node.typeParams = this._parseTypeParams()
    node.superClasses = this._parseClassTypeSignatures()
    return node
  }

  parseMethodTypeSignature() {
    const typeParams = this._parseTypeParams()
    const params = this._parseParams()
    const ret = this._parseReturn()
    const exceptions = this._parseExceptions()
    const node = new MethodTypeSignature(params, ret, exceptions)
    node.params = params
    node.typeParams = typeParams
    return node
  }

  _parseParams() {
    this._read() // consume '('
    const params: TypeNode[] = []
    while (true) {
      const node = this.parseTypeSignature()
      if (node === null) break
      params.push(node)
    }
    this._read() // consume ')'
    return params
  }

  _parseReturn() {
    const ret = this.parseTypeSignature()
    assert(ret, 'cannot parse return')
    return ret
  }

  _parseExceptions() {
    const nodes: TypeNode[] = []
    if (!this._ahead('^')) return nodes

    while (this._ahead('^')) {
      this._read()
      nodes.push(this._parseException())
    }
    return nodes
  }

  _parseException() {
    const c = this._peek()
    if (c === 'L') return this._parseClassTypeSignature()
    if (c === 'T') return this._parseTypeVar()
    throw new Error('cannot parse exception: ' + c)
  }

  _parsePrimitive() {
    const c = this._read()
    return new Primitive((Primitives as any)[c])
  }

  _parseTypeParams() {
    const typeParams: TypeParam[] = []
    if (!this._ahead('<')) return typeParams
    this._read() // consume '<'
    while (!this._ahead('>')) {
      typeParams.push(this._parseTypeParam())
    }
    this._read() // consume '>'
    return typeParams
  }

  _parseTypeParam() {
    const node = new TypeParam()
    node.name = this._readId()!
    node.types = []
    while (this._ahead(':')) {
      this._read()
      const n = this.parseTypeSignature()
      if (n !== null) node.types.push(n)
    }
    return node
  }

  _parseTypeVar() {
    this._read() // consume 'T'
    const node = new TypeVar()
    node.name = this._readId()!
    this._read() // consume ';'
    return node
  }

  _parseArrayTypeSignature(): ArrayTypeSignature {
    this._read() // consume '['
    const elementType = this.parseTypeSignature()
    assert(elementType, 'cannot parse elementType')
    return new ArrayTypeSignature(elementType)
  }

  _parseClassTypeSignatures() {
    const nodes: ClassTypeSignature[] = []
    while (this._peek() === 'L') {
      nodes.push(this._parseClassTypeSignature())
    }
    return nodes
  }

  _parseClassTypeSignature() {
    this._read() // consume 'L';
    const node = new ClassTypeSignature()
    node.binaryName = this._readBinaryName()
    node.typeArgs = this._parseTypeArgs()
    node.nestedTypes = this._parseNestedTypes()
    this._read() // consume ';'
    return node
  }

  _parseNestedTypes() {
    const nested: NestedClassTypeSignature[] = []
    while (true) {
      const next = this._peek()
      if (next !== '.') break

      this._read()
      const node = new NestedClassTypeSignature()
      node.name = this._readId()!
      node.typeArgs = this._parseTypeArgs()
      nested.push(node)
    }
    return nested
  }

  _parseTypeArgs() {
    const args: TypeArg[] = []
    if (!this._ahead('<')) return args

    this._read() // consume '<'
    while (!this._ahead('>')) {
      args.push(this._parseTypeArg())
    }
    this._read() // consume '>'
    return args
  }

  _parseTypeArg() {
    const c = this._peek()
    if (c === '*') {
      this._read() // consume '*'
      return TypeArg.wildcard
    }

    const arg = new TypeArg()
    if (c === '+' || c === '-') {
      this._read() // consume '+' or '-'
      arg.prefix = c
    }

    const type = this.parseTypeSignature()
    assert(type, 'cannot parse type')
    arg.type = type
    return arg
  }

  _readBinaryName() {
    const s: string[] = []
    while (true) {
      let c = this._readId()
      if (c === null) break

      s.push(c)
      if (this._peek() === '/') {
        s.push(this._read())
      }
    }
    return s.join('')
  }

  _readId() {
    let c = this._peek()
    if (!isIdStart(c)) return null

    const s: string[] = []
    while (isIdChar(c)) {
      s.push(this._read())
      c = this._peek()
    }
    return s.join('')
  }

  _read(cnt = 1) {
    if (this._cursor === EOF) return ''

    const start = this._cursor
    const end = Math.min(start + cnt, this._len)
    this._cursor = end === this._len ? EOF : end
    return this._raw.slice(start, end)
  }

  _mark() {
    this._mrk = this._cursor
  }

  _unmark() {
    this._cursor = this._mrk
  }

  _peek(cnt = 1) {
    this._mark()
    const ret = this._read(cnt)
    this._unmark()
    return ret
  }

  _ahead(c: string) {
    return this._peek() === c
  }

  _aheadIsPrimitive() {
    return !!(Primitives as any)[this._peek()]
  }
}

function isIdStart(c: string) {
  return (
    (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_' || c === '$'
  )
}

function isIdChar(c: string) {
  return isIdStart(c) || (c >= '0' && c <= '9')
}
