import v7 from './v7'
import v8 from './v8'
import v9 from './v9'
import v10 from './v10'

export default { v7, v8, v9, v10 }

export function isBuiltin(binaryName: string) {
  return (
    v7.has(binaryName) ||
    v8.has(binaryName) ||
    v9.has(binaryName) ||
    v10.has(binaryName)
  )
}
