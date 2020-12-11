export function getWithDef<T extends Object, K extends keyof T>(
  obj: T,
  key: K,
  defaultVal?: T[K]
) {
  const val = obj[key]
  if (typeof val === 'undefined' && defaultVal) {
    obj[key] = defaultVal
    return defaultVal
  } else {
    return val
  }
}
