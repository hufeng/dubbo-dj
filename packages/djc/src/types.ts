import { Entity } from './dlang/entity'
import { Service } from './dlang/service'

export interface IType {
  tsType: string
  javaType: string
  generic?: Array<Entity | IType>
}

export interface IEntityField {
  name: string
  type: IType
  comment?: string
}

export type TServiceMethod = {
  [k in string]: IMethodMeta
}

export type IMethodArgs = {
  name: string
  type: string
}

export interface IMethodMeta {
  args: Array<IMethodArgs>
  ret: string
}

export interface IBuildParam {
  buildEntry: {
    entity: { [k in string]: Entity }
    service: { [k in string]: Service }
  }
  config: {
    lang: Array<'ts' | 'java' | 'go'>
  }
}
