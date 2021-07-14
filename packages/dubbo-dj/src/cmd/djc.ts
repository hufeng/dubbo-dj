// #!/usr/bin/env node

import { Command } from 'commander'
import { version } from './djc-version'
import { init } from './djc-init'

const program = new Command()

program
  .version('1.0.0')
  .description('A dsl tool that generate dubbo ecosystem code ❤️')
  .version(version(), '-v, --version', 'output the current version')

program
  .command('init [path]')
  .description('init dubbo dj scaffold project')
  .action(async (path = '.') => {
    await init(path)
  })

program
  .command('build')
  .description('cd dubbo dj scaffold directory and compile code gen')
  .action(() => {
    // 检查当前路径有无package.json
    // 执行npm build
  })

program.parse(process.argv)
