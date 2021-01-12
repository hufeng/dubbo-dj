fs = require "fs"
os = require "os"
path = require "path"
chalk = require "chalk"
glob = require "glob"
AdmZip = require "adm-zip"
commandExists = require "command-exists"
mkdirp = require "mkdirp"
{ exec } = require "child_process"

###
this script is used to grab all the builtin packages which are shipped by 
JDK installations(Oracle JDK).

it aims to run on MacOS out-of-box by its automatically JDK detecting under the
the directory `/Library/Java/JavaVirtualMachines/` which is used by the official 
JDK installer, however this automatical detecting process is not promised to be 
always worked since current system could use various JDK version manager and they 
could use different directories to hold their JDK installations

for the automatical JDK detecting can not work or running this script on other
platform, try specify JDK path via ENV variables(eg. `export JAVA_HOME_V7=jdk_path`): 

- `JAVA_HOME_V7`
- `JAVA_HOME_V8`
- `JAVA_HOME_V9`
- `JAVA_HOME_V10`
### 

processv7v8 = (jdkPath, v) ->
  zipPath = jdkPath[v]
  distDir =  path.join(os.homedir(), ".dj-choc", v) + "/"
  await mkdirp(distDir)
  ext = ".class".length

  zip = new AdmZip(zipPath)
  zip.extractAllTo distDir, true
  
  toFile = path.resolve __dirname, "../src/rt-list/#{v}.ts"
  listAllFiles = defer()
  glob "#{distDir}**/*.class", {}, (err, files) ->
    return listAllFiles.reject(err) if err;
    listAllFiles.resolve(files);

  format = (f) -> "  '#{f.replace(distDir, "").slice(0, -ext)}'"
  files = await listAllFiles
  code = """
export default new Set<string>([
#{files.map(format).join(",\n")}
])
  """
  await fs.promises.writeFile toFile, code

###
from v9 JDK introduces a new term `module-info` to organize their
class files and the bundle cannot be extracted simply by using zip
tools a new tool `jimage` is installed to do that work

the new term `module-info` cause the class' full qualifier does
not equal their filesystem path since classes are encapsulated in
modules

in v8:

`com/sun/activation/registries/LineTokenizer`

from v9:

`java.activation/com/sun/activation/registries/LineTokenizer`
###
processv9v10 = (jdkPath, v) ->
  zipPath = jdkPath[v]
  ext = ".class".length

  jimageExists = false
  try
    await commandExists("jimage")
    jimageExists = true
  fatal "jimage does not exist" if not jimageExists

  distDir =  path.join(os.homedir(), ".dj-choc", v) + "/"
  await mkdirp(distDir)
  cmd = "jimage extract --dir=#{distDir} #{zipPath}"
  extracting = defer()
  exec cmd, (err) ->
    return extracting.reject(err) if err
    extracting.resolve()
  await extracting

  toFile = path.resolve __dirname, "../src/rt-list/#{v}.ts"
  listAllFiles = defer()
  glob "#{distDir}**/*.class", {}, (err, files) ->
    return listAllFiles.reject(err) if err;
    listAllFiles.resolve(files);

  removePrefix = (f) ->
    f = "#{f.replace(distDir, "").slice(0, -ext)}"
    firstSlash = f.indexOf "/"
    return f.slice(firstSlash + 1)

  format = (f) -> "  '#{f}'"
    
  files = await listAllFiles
  files = files.map(removePrefix).filter((f) -> f isnt "module-info")
  code = """
export default new Set<string>([
#{files.map(format).join(",\n")}
])
  """
  await fs.promises.writeFile toFile, code


resolveJDKPath = ->
  jdkHome = "/Library/Java/JavaVirtualMachines"
  patterns =
    v7: env "JAVA_HOME_V7", "#{jdkHome}/jdk1.7*.jdk/Contents/Home/jre/lib/rt.jar"
    v8: env "JAVA_HOME_V8", "#{jdkHome}/jdk1.8*.jdk/Contents/Home/jre/lib/rt.jar"
    v9: env "JAVA_HOME_V9", "#{jdkHome}/jdk-9*.jdk/Contents/Home/lib/modules"
    v10: env "JAVA_HOME_V10", "#{jdkHome}/jdk-10*.jdk/Contents/Home/lib/modules"

  ret = {}
  search = (v) ->
    deferred = defer()
    pattern = patterns[v];
    glob pattern, {}, (err, files) ->
      if not err and files.length is 0
        err = new Error("File does not exist at: #{pattern}")
      fatal("Failed to locate JDK #{v}:\n  #{err}") if err or files.length is 0
      ret[v] = files[0]
      deferred.resolve()
    return deferred

  searchings = Object.keys(patterns).map((v) -> search(v))
  await Promise.all(searchings)
  return ret

env = (key, defaultValue) ->
  v = process.env[key]
  return if !!v then v else defaultValue

fileExists = (file) ->
  fs.promises.access(file, fs.constants.R_OK)
    .then(() => true)
    .catch(() => false)

defer = ->
  res = rej = null
  p = new Promise (resolve, reject) ->
    res = resolve
    reject = reject
  p.resolve = res
  p.reject = rej;
  return p

fatal = (msg) ->
  console.log chalk.red msg
  process.exit 1
  
info = (msg) ->
  console.log chalk.cyan msg

main = ->
  jdkPath = await resolveJDKPath()
  info "processing v7..."
  await processv7v8(jdkPath, "v7")
  info "processing v8..."
  await processv7v8(jdkPath, "v8")
  info "processing v9..."
  await processv9v10(jdkPath, "v9")
  info "processing v10..."
  await processv9v10(jdkPath, "v10")

(->
  await main()
)()
