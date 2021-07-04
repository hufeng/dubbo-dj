import { DubboDep } from './dlang/lang-deps'
import { DubboEntity } from './dlang/lang-entity'
import { DubboEnum } from './dlang/lang-enum'
import { Func } from './dlang/lang-service'

export type TDataType =
  | DubboEntity
  | DubboEnum
  | (() => IType)
  | ((dep: DubboDep) => IType)
export type TFuncOption = (func: Func, deps: DubboDep) => void

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
  buildEntry: {
    entity: {
      [k in string]: DubboEntity
    }
    service: {
      [k in string]: LangService
    }
  }
  output?: {
    lang?: Array<'ts' | 'java' | 'go'> | 'ts' | 'java' | 'go'
    type?:
      | Array<'consumer' | 'service' | 'serviceImpl' | 'entity'>
      | 'consumer'
      | 'service'
      | 'serviceImpl'
      | 'entity'
  }
}
