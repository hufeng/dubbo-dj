import mkdirp from 'mkdirp'
import chalk from 'chalk'
import tempy from 'tempy'
import path from 'path'
import { search } from './util'
import AdmZip from 'adm-zip'
import { ClassResolver } from './resolver'

export interface Options {
  // it's a namespace to start exposing rather than a full qualifier
  // of certain class
  //
  // exposing will start from that namespace(directory) by a filter combined
  // with `suffix`, `include` and `exclude`:
  //
  // ```coffeescript
  // is_filename_matched = (filename) ->
  //   (suffix(filename) or include(filename)) and not exclude(filename)`
  // ```
  entry: string
  // the target jar contains the entry point
  target: string
  // dir contains dependencies of target jar
  deps?: string
  // suffix of provider name
  suffix?: string
  // regexp for including files
  include?: RegExp
  // regexp for excluding files
  exclude?: RegExp
  // dir to hold the outputs, if it's absent then an random temporary directory
  // will be picked up
  out?: string
}

export class Deflator {
  opts: Options
  distDir = ''
  extractedDir = ''
  outputDir = ''

  providers: string[] = []
  providerResolvers = new Map<string, ClassResolver>()

  constructor(opts: Options) {
    this.opts = opts
  }

  async prepare() {
    await this._makeOutputDir()
    await this._extractAndMergeJars()
    await this._scanProviders()
    return this
  }

  async run() {
    await this._doResolve()
  }

  async _makeOutputDir() {
    this.distDir = this.opts.out || tempy.directory()
    console.log(chalk.cyan('Output at: ' + this.distDir))
    await mkdirp(this.distDir)

    this.extractedDir = path.join(this.distDir, 'extracted')
    await mkdirp(this.extractedDir)

    this.outputDir = path.join(this.distDir, 'output')
    await mkdirp(this.outputDir)
  }

  async _searchJars(dir?: string): Promise<string[]> {
    if (!dir) return []
    return search(path.join(dir, '**/*.jar'))
  }

  async _extractAndMergeJars() {
    const jars = await this._searchJars(this.opts.deps)
    jars.push(this.opts.target)
    jars.forEach((jar) => new AdmZip(jar).extractAllTo(this.extractedDir, true))
  }

  // convert the entry namespace to its equivalent filesystem
  // path then search the path under extractedDir
  async _scanProviders() {
    const entryPath = this.opts.entry.replace(/\./g, path.sep)
    const entryDir = path.join(this.extractedDir, entryPath)
    const pattern = path.join(
      entryDir,
      `**/*${this.opts.suffix ? this.opts.suffix + '.class' : ''}`
    )
    const files = await search(pattern)
    const extLen = '.class'.length
    this.providers = files
      .filter((f) => {
        let isWhite = true
        if (this.opts.include) {
          isWhite = this.opts.include.test(f)
        }
        let isBlack = false
        if (this.opts.exclude) {
          isBlack = this.opts.exclude.test(f)
        }
        return isWhite && !isBlack
      })
      .map((f) => path.relative(this.extractedDir, f).slice(0, -extLen))
  }

  async _doResolve() {
    this.providers.forEach((p) => {
      this.providerResolvers.set(p, new ClassResolver(this.extractedDir, p))
    })
    await Promise.all(
      [...this.providerResolvers.values()].map((r) => r.resolve())
    )
  }
}
