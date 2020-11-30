export function $lhs(val: Array<any>, type?: (val: any) => Object) {
  if (!val || val.length === 0) {
    return []
  }
  return val.map((v) => (type ? type(v) : v['__field2Java'])())
}

export function $mhs(map: Map<any, any>, type?: (val: any) => Object) {
  if (!map) {
    return new Map()
  }

  for (let [k, v] of map.values()) {
    map.set(k, type ? type(v) : v['__field2Java']())
  }
}
