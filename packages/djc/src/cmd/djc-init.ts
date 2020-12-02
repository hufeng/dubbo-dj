import fsx from 'fs-extra'
import inrequirer from 'inquirer'
import debug from 'debug'
import { fmt } from '../emitter'

const log = debug(`dubbo:dj:say ~`)

export async function init(dir: string) {
  dir = dir || process.cwd()

  const langdir = `${dir}/dubbo-dsl`

  // 如果当前目录已经存在提示用户是否覆盖
  if (fsx.pathExistsSync(langdir)) {
    const { anwser } = await inrequirer.prompt([
      {
        type: 'confirm',
        name: 'anwser',
        message: 'dsl dir already exists, overwrite it?',
        default: true,
      },
    ])
    if (!anwser) {
      return
    }
  }

  log(`create dir [%s]`, langdir)

  // create language folder
  await fsx.ensureDir(langdir)

  // create model
  log(`create model file [%s]`, `${langdir}/entity.ts`)
  await fsx
    .writeFile(
      `${langdir}/entity.ts`,
      fmt(`
    import {dl} from "@dubbo/dj";

    export const user = dl
      .entity("org.apache.dubbo.entity.User")
      .field("id", dl.Integer)
      .field("name", dl.String)
      .field("age", dl.String)
      .ok();
  `)
    )
    .catch((err) => console.log(err))

  // create service
  log(`create service file [%s]`, `${langdir}/service.ts`)
  await fsx
    .writeFile(
      `${langdir}/service.ts`,
      fmt(`
    import {dl} from "@dubbo/dj";
    import {user} from './entity'

export const userService = dl
  .service("org.apache.dubbo.service.UserService")
  .group("")
  .version("1.0.0")
  .method("sayHello")
  .arg("user", user)
  .ret(user)
  .method("sayWorld")
  .arg("name", dl.String)
  .ret(dl.String)
  .ok();
  `)
    )
    .catch((err) => console.log(err))

  // create index.ts
  log(`create service file [%s]`, `${langdir}/index.ts`)
  await fsx
    .writeFile(
      `${langdir}/index.ts`,
      fmt(`
    import {djc} from '@dubbo/dj'
    import * as entity from './entity'
    import * as service from './service'

    djc({
      buildEntry: {entity, service}, config:{lang: ['ts']}
    })
  `)
    )
    .catch((err) => console.log(err))

  // create package.json
  log(`create service file [%s]`, `${langdir}/package.json`)
  await fsx
    .writeFile(
      `${langdir}/index.ts`,
      `
        {"dependencies": {"@dubbo/dj": "^1.0.0"}
      `
    )

    .catch((err) => console.log(err))

  console.log(`init successfully， please cd dubbo-dsl dir`)
}
