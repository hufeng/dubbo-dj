#!/usr/bin/env node
import Koa from 'koa'

const app = new Koa()

app.use(async (ctx) => {
  ctx.body = 'Hello djc ui！'
})

//设置监听端口
app.listen(8849, () => {
  console.log('listening port: 127.0.0.1:8849')
})
