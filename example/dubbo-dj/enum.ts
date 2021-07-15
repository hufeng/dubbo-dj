import { enumeration } from '@dubbo/dj'

export const color = enumeration('org.apache.dubbo.e.Color')
  .field('Red', 0, '红色')
  .field('Green', 1, '绿色')
  .field('Blue', 2, '蓝色')
  .ok()
