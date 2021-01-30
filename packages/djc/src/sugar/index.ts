import java from 'js-to-java'

const typeMapper = {
  'java.Boolean': java.Boolean,
  'java.boolean': java.boolean,
  'java.Integer': java.Integer,
  'java.int': java.int,
  'java.Short': java.Short,
  'java.short': java.short,
  'java.Byte': java.Boolean,
  'java.byte': java.Byte,
  'java.Long': java.Long,
  'java.long': java.long,
  'java.Double': java.Double,
  'java.double': java.double,
  'java.Float': java.Float,
  'java.float': java.float,
  'java.String': java.String,
  'java.char': java.char,
  'java.Character': java.Character,
  'java.chars': java.chars,
}

function mapJavaList(arr: Array<any>, cb: (v: any, i: number) => any) {
  return java.List(arr.map(cb))
}

export default function $hs(val: any, schema: any): any {
  console.log('entry=>', val, schema)
  const { type, item } = schema
  // 如果下一层是精确的类型
  if (item && item.item === null) {
    return mapJavaList(val, (v) => {
      switch (true) {
        case type === 'entity':
          return v.__fields2java()

        case typeof type === 'object' && 'enum' in type:
          return new Function(
            `return java.enum('${type.enum.fullClsName}', ${type.enum.clsName}(arguments[0]))`
          ).call(null, v)

        default:
          // @ts-ignore
          return typeMapper[item.type](v)
      }
    })
  } else {
    if (type === 'list') {
      return mapJavaList(val, (v) => $hs(v, item))
    } else if (type === 'map' || type === 'hashmap') {
      // TODO fixed map
      return java.Map({})
    }
  }
}
