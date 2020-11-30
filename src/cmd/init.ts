import fsx from 'fs-extra'
import debug from 'debug'
import commander from 'commander'

const log = debug(`dubbo:dj:say ~`)

// work-flow
;(async () => {
  commander.parse(process.argv)
  const dir = commander.args[0] || process.cwd()
  const langdir = `${dir}/dsl`

  log(`create dir [%s]`, langdir)

  // create language folder
  await fsx.ensureDir(langdir)

  // create model
  log(`create model file [%s]`, `${langdir}/model.ts`)
  await fsx.writeFile(`${langdir}/model.ts`, ``)

  // create service
  log(`create service file [%s]`, `${langdir}/service.ts`)
  await fsx.writeFile(`${langdir}/service.ts`, ``)

  // create index.ts
})()
