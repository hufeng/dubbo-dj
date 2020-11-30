import commander from 'commander'

commander
  .version(require('../../package.json'))
  .command('init <dir>', 'init dj dsl project')
  .command('build', 'build code from dj dsl')
  .parse(process.argv)
