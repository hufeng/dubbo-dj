import glob from 'glob'

export function defer<T>(): Promise<T> & {
  resolve: (value: T | PromiseLike<T>) => void
  reject: (reason?: any) => void
} {
  let resolve: any
  let reject: any
  const p = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  ;(p as any).resolve = resolve
  ;(p as any).reject = reject
  return p as any
}

export async function search(pattern: string) {
  const searching = defer<string[]>()
  glob(pattern, (err, files) => {
    if (err) {
      searching.reject(err)
      return
    }
    searching.resolve(files)
  })
  return searching
}
