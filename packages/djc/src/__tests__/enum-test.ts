import * as dl from '../dlang'
import EnumEmitter from '../emitter/enum'

it('test color number enum', () => {
  const color = dl
    .enumer('org.apache.dubbo.entity.Color')
    .field('Red', 0, '红色')
    .field('Green', 1, '绿色')
    .field('Blue', 2, '蓝色')
    .ok()
  const emitter = new EnumEmitter(color, 'ts')
  expect(emitter.prettyCode).toMatchSnapshot()
})

it('test string enum', () => {
  const fileType = dl
    .enumer('org.apache.dubbo.entity.FileType')
    .field('PDF', 'PDF', 'PDF')
    .field('MP3', 'MP3', 'mp3')
    .ok()

  const emitter = new EnumEmitter(fileType, 'ts')
  expect(emitter.prettyCode).toMatchSnapshot()
})
