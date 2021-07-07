import path from 'path'
import debug from 'debug'
import fsx from 'fs-extra'
import inrequirer from 'inquirer'
import * as code from './djc-init-code'

const cwd = process.cwd()
const log = debug(`dubbo:dj:say ~`)

export async function init(dir: string) {
  const codeDir = path.join(dir || cwd, 'dubbo-dj')
  // 如果当前目录已经存在提示用户是否覆盖
  if (fsx.pathExistsSync(codeDir)) {
    const { answer } = await inrequirer.prompt([
      {
        type: 'confirm',
        name: 'answer',
        message: 'dsl dir already exists, overwrite it?',
        default: false,
      },
    ])
    if (!answer) {
      return
    }
  }

  log(`create dir [%s]`, codeDir)
  // create language folder
  await fsx.ensureDir(codeDir)

  // create model
  log(`create model file [%s]`, `${codeDir}/entity.ts`)

  for (let meta of Object.values(code)) {
    const filepath = path.join(codeDir, meta.filename)
    console.log(filepath)
    fsx.writeFileSync(filepath, meta.code)
  }

  console.log(`dubbo-dsl project init successfully`)
  console.log(`please cd dubbo-dsl dir and install dependencies`)
}
