import Deps from '../dlang/deps'
import { parseGenericType } from '../dlang/type'
import * as dl from '../dlang'

import { $hs } from '../sugar/index'

const deps = new Deps()

const { tsType, schema } = parseGenericType(dl.List(dl.List(dl.String)), deps)
console.log(tsType)
console.log(JSON.stringify(schema, null, 2))

// console.log(
//   JSON.stringify(
//     parseGenericType(dl.List(dl.Map(dl.String, dl.String)), deps),
//     null,
//     2
//   )
// )

const val = [['hello'], ['world']]

console.log(JSON.stringify($hs(val, schema), null, 2))
console.log('==>', val)

// const user = dl
//   .entity('org.apache.dubbo.domain.User')
//   .field('id', dl.Integer)
//   .field('name', dl.String)
//   .field('email', dl.String)
//   .ok()

// console.log(
//   JSON.stringify(parseGenericType(dl.List(dl.List(user)), deps), null, 2)
// )

// const color = dl
//   .enumer('org.apache.dubbo.domain.Color')
//   .field('red', 0)
//   .field('green', 1)
//   .field('blue', 2)
//   .ok()

// console.log(
//   JSON.stringify(parseGenericType(dl.List(dl.List(color)), deps), null, 2)
// )
