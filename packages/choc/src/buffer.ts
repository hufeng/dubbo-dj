export class AutoOffsetBuffer {
  _buf: Buffer
  _offset: number

  get offset() {
    return this._offset
  }

  constructor(buf: Buffer, offset: number) {
    this._buf = buf
    this._offset = offset
  }

  readUInt8() {
    const n = this._buf.readUInt8(this._offset)
    this._offset += 1
    return n
  }

  readUInt16BE() {
    const n = this._buf.readUInt16BE(this._offset)
    this._offset += 2
    return n
  }

  readUInt32BE() {
    const n = this._buf.readUInt32BE(this._offset)
    this._offset += 4
    return n
  }

  forward(cnt: number) {
    // does not use a Buffer.slice here
    // since we need a boundary check
    const r = Buffer.allocUnsafe(cnt)
    for (let i = 0; i < cnt; ++i) {
      r.writeUInt8(this.readUInt8(), i)
    }
    return r
  }
}
