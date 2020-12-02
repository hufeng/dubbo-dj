export function help() {
  console.log(`Usage: dj [options]

A dsl tool that generates dubbojs code ❤️

Options:
  -V, --version       output the version number
  -i, --init <path>   init dsl project
  -b, --build <verbose>        support generete language such as java, go, ts (default: "ts")
  -h, --help          display help for command
  `)
}
