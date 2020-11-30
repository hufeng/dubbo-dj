import java from '../../java/core'

export const color = java
  .Enum('org.apache.dubbo.domain.Color')
  .field('RED', 0)
  .field('GREEN', 1)
  .field('BLUE', 1)
  .ok()

export const foo = java
  .Clazz('org.apache.dubbo.domain.Foo')
  .field('name', java.String)
  .ok()

export const user = java
  .Clazz('org.apache.dubbo.domain.User')
  .field('id', java.Integer, '用户ID')
  .field('name', java.String)
  .field('int', java.int)
  .field('short', java.short)
  .field('short_', java.Short)
  .field('byte', java.Byte)
  .field('byte_', java.byte)
  .field('long', java.long)
  .field('long_', java.Long)
  .field('double', java.double)
  .field('double_', java.Double)
  .field('float', java.float)
  .field('float_', java.Float)
  .field('test', java.String)
  .field('test1', java.Boolean, '优化test')
  .field('fooList', java.List(foo))
  .field('foom', java.Map(java.String, java.String))
  .ok()
