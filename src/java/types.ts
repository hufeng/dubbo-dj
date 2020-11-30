import { JavaClazz } from './core/clazz'

export interface IType {
  tsType: string
  javaType: string
  generic?: Array<JavaClazz | IType>
}

export interface IJavaClazzField {
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
