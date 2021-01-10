// Parsing the syntax of method signature defined at here:
// https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html#jvms-4.3.3

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
    return s.join()
  }

  _readId() {
    let c = this._peek()
    if (!isIdStart(c)) return null

    const s: string[] = []
    while (isIdChar(c)) {
      s.push(this._read())
      c = this._peek()
    }
    return s.join()
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
}

function isIdStart(c: string) {
  return (
    (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_' || c === '$'
  )
}

function isIdChar(c: string) {
  return isIdStart(c) || (c >= '0' && c <= '9')
}
