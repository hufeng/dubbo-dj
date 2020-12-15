#!/usr/bin/env node

import { spawn } from 'child_process'
import mm from 'minimist'
import { help } from './djc-help'
import { init } from './djc-init'
import { version } from './djc-version'

const argv = mm(process.argv.slice(2))

switch (true) {
  case argv.V || argv.version:
    version()
    break
  case argv.i || argv.init:
    init('')
    break
  case argv.b || argv.build:
    spawn('npx', ['ts-node', './index.ts'], {
      stdio: 'inherit',
    })
    break
  default:
    help()
}
