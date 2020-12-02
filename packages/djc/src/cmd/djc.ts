#!/usr/bin/env node

import { spawn } from 'child_process'
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
  spawn('npx', ['ts-node', './index.ts'], {
    stdio: 'inherit',
  })
}

// help
else {
  help()
}
