#!/usr/bin/env node

import { exec } from 'child_process'
import mm from 'minimist'
import { help } from './djc-help'
import { init } from './djc-init'
import { version } from './djc-version'

const argv = mm(process.argv.slice(2))

// output current version
if (argv.V || argv.version) {
  version()
}

// init  project
else if (argv.i) {
  const dir = typeof argv.i === 'boolean' ? '' : argv.i
  init(dir)
}

// build
else if (argv.b) {
  const cmd =
    argv.b === 'verbose' ? 'DEBUG=dubbo* ts-node index.ts' : 'ts-node index.ts'
  // 先去build当前的文件
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      throw err
    }
    console.log(stdout, stderr)
  })
}

// help
else {
  help()
}
