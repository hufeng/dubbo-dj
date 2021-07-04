#!/usr/bin/env node

import { Command } from 'commander'
import { version } from './djc-version'
import { init } from './djc-init'

new Command()
  .version(version())
  .command('init [path]')
  .description('init dubbo-dj project in path')
  .action(async (path = '.') => {
    await init(path)
  })
  .command('build')
  .description('build dubbo dj gen source code')
  .action(() => {
    // 检查当前路径有无package.json
    // 执行npm build
  })
  .parse(process.argv)
