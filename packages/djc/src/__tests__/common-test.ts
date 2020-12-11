import { getWithDef } from '../common'

it('test getWithDef', () => {
  const obj = {
    id: 1,
  }
  const id = getWithDef(obj, 'id')
  expect(id).toEqual(1)

  const obj1 = {} as { name: string }
  const name = getWithDef(obj1, 'name')
  expect(name).toEqual(undefined)

  const obj2 = {} as { age: number }
  const age = getWithDef(obj2, 'age', 10)
  expect(age).toEqual(10)
  expect(obj2.age).toEqual(10)
})
