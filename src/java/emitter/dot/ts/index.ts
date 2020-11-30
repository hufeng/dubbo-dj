import fs from 'fs'
import path from 'path'
import dot from 'dot'

export const clazzDot = dot.template(
  fs.readFileSync(path.join(__dirname, './cls.dot')).toString()
)

export const enumDot = dot.template(
  fs.readFileSync(path.join(__dirname, './enum.dot')).toString()
)

export const serviceDot = dot.template(
  fs.readFileSync(path.join(__dirname, './service.dot')).toString()
)

export const abstractServiceDot = dot.template(
  fs.readFileSync(path.join(__dirname, './abstract-service.dot')).toString()
)
