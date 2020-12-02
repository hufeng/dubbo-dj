/**
 * dl: dubbo lang
 *
 * 通过设计fluent javascript api来构建一个DSL style的代码描述language
 *
 * entity => object entity => java/js [class]
 *                         => go struct
 *
 * service => dubbo service
 *
 * enumer => js/java/go => enumeration
 *
 */

import entity from './entity'
import enumer from './enum'
import service from './service'
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
} from './type'

export {
  // model entity
  entity,
  service,
  enumer,
  // data type
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
  // container data type
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
