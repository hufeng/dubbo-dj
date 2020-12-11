export function getWithDef<T extends Object, K extends keyof T>(
  obj: T,
  key: K,
  defaultVal?: T[K]
) {
  const val = obj[key]
  if (undef(val) && !undef(defaultVal)) {
    obj[key] = defaultVal
    return defaultVal
  } else {
    return val
  }
}

export function undef(param: unknown): param is undefined {
  return typeof param === 'undefined'
}
