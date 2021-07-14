import path from 'path'
import fsx from 'fs-extra'
import chalk from 'chalk'
import inrequirer from 'inquirer'
import * as code from './djc-init-code'

const cwd = process.cwd()

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

  console.log(chalk.green(`create dir ${codeDir}`))
  // create language folder
  await fsx.ensureDir(codeDir)

  for (let meta of Object.values(code)) {
    const filepath = path.join(codeDir, meta.filename)
    console.log(chalk.green(`create file ${filepath}`))
    fsx.writeFileSync(filepath, meta.code)
  }

  console.log(chalk.green(`dubbo-dsl project init successfully`))
  console.log(chalk.green(`please cd dubbo-dsl dir and install dependencies`))
}
