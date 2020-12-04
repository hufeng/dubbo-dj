import fs from 'fs'
import path from 'path'
import dot from 'dot'

export const entityDot = dot.template(
  fs.readFileSync(path.join(__dirname, './entity.dot')).toString()
)

export const enumDot = dot.template(
  fs.readFileSync(path.join(__dirname, './enum.dot')).toString()
)

export const serviceDot = dot.template(
  fs.readFileSync(path.join(__dirname, './service.dot')).toString()
)

export const abstractServiceDot = dot.template(
  fs.readFileSync(path.join(__dirname, './service-abstract.dot')).toString()
)

export const consumerServiceDot = dot.template(
  fs.readFileSync(path.join(__dirname, './service-consumer.dot')).toString()
)
