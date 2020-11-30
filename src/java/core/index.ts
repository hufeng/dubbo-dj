/**
 * 通过构造Java Style code的DSL来自动生成 ts，java， go的dubbo框架的调用代码
 */

import Clazz from './clazz'
import Service from './service'
import {
  Integer,
  String,
  Boolean,
  List,
  Set,
  Collection,
  Map,
  boolean,
  int,
  short,
  Short,
  byte,
  Byte,
  long,
  Long,
  double,
  Double,
  float,
  Float,
  char,
  Char,
  chars,
  Character,
  Enumeration,
  Iterator,
  Currency,
  Dictionary,
  HashMap,
} from './java-type'

import Enum from './enum'

export default {
  Enum,
  Clazz,
  Service,

  Boolean,
  boolean,

  Integer,
  int,

  short,
  Short,

  byte,
  Byte,

  long,
  Long,

  double,
  Double,

  float,
  Float,

  String,
  char,
  Char,
  chars,
  Character,

  List,
  Set,
  Collection,
  Iterator,
  Enumeration,
  Map,
  HashMap,
  Dictionary,
  Currency,
}
