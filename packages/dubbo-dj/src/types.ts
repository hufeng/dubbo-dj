import { Dep } from './dlang/lang-deps'
import { DubboEntity } from './dlang/lang-entity'
import { DubboEnum } from './dlang/lang-enum'
import { DubboService, Func } from './dlang/lang-service'

export type TFromModule = string
export interface IDepValue {
  is3rdModule: boolean
  defaultModule: string
  noneDefaultModules: Set<string>
}
export interface IDepAdd {
  fromModule: string
  importModule: string
  is3rdModule: boolean
  isDefaultModule?: boolean
}

export type TDataType =
  | DubboEntity
  | DubboEnum
  | (() => IType)
  | ((dep: Dep) => IType)
export type TFuncOption = (func: Func, deps: Dep) => void

export interface IArg {
  name: string
  type: TDataType
  comment?: string
}

export interface IFuncArg {
  name: string
  type: IType
  comment?: string
}

export interface IDubboEnumFiled {
  name: string
  val: number | string
  comment: string
}

export interface IType {
  tsType: string
  tsInit?: string
  javaType: string
}

export interface IDubboEntityField {
  name: string
  type: IType
  comment?: string
}

export type TServiceMethod = {
  [k in string]: IMethodMeta
}

export type IMethodArgs = {
  name: string
  tsType: string
  javaType: string
}

export interface IMethodMeta {
  args: Array<IMethodArgs>
  ret: { tsType: string; javaType: string }
}

export interface IConfigure {
  entry: {
    entity: { [name: string]: DubboEntity | DubboEnum }
    service: { [name: string]: DubboService }
  }
  output?: {
    langs?: Array<'ts' | 'java' | 'go' | 'swagger'>
    types?: Array<'consumer' | 'service' | 'serviceImpl' | 'entity'>
    dir?: string
  }
}
