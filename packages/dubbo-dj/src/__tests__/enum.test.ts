import { enumeration } from '../dlang'
import { DubboEnumEmitter } from '../emitter'

describe('enumeration test suite', () => {
  it('test color number enum', () => {
    const color = enumeration('org.apache.dubbo.e.Color')
      .field('Red', 0, '红色')
      .field('Green', 1, '绿色')
      .field('Blue', 2, '蓝色')
      .ok()

    expect(color.fullName).toEqual('org.apache.dubbo.e.Color')
    expect(color.comment).toEqual('')
    expect(color.fields.length).toEqual(3)
    expect(color.fields.map((c) => ({ name: c.name, val: c.val }))).toEqual([
      { name: 'Red', val: 0 },
      { name: 'Green', val: 1 },
      { name: 'Blue', val: 2 },
    ])
    expect(color).toMatchSnapshot()
  })

  it('test string enum', () => {
    const fileType = enumeration('org.apache.dubbo.e.FileType')
      .field('PDF', 'PDF', 'PDF')
      .field('MP3', 'MP3', 'mp3')
      .ok()
    expect(fileType.fullName).toEqual('org.apache.dubbo.e.FileType')
    expect(fileType.comment).toEqual('')
    expect(fileType.fields.length).toEqual(2)
    expect(fileType.fields.map((c) => ({ name: c.name, val: c.val }))).toEqual([
      { name: 'PDF', val: 'PDF' },
      { name: 'MP3', val: 'MP3' },
    ])
    expect(fileType).toMatchSnapshot()
    expect(new DubboEnumEmitter(fileType, 'ts').prettyCode).toMatchSnapshot()
  })
})
