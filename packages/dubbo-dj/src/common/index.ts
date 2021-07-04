import p from 'prettier'

export function fmt(str: string) {
  return p.format(str, {
    trailingComma: 'es5',
    tabWidth: 2,
    semi: false,
    singleQuote: true,
    parser: 'typescript',
  })
}

export function fmtJSON(str: string) {
  return p.format(str, {
    trailingComma: 'es5',
    tabWidth: 2,
    semi: false,
    singleQuote: true,
    parser: 'json',
  })
}
