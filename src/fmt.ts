import p from 'prettier'

export default function fmt(str: string) {
  return p.format(str, {
    trailingComma: 'es5',
    tabWidth: 2,
    semi: false,
    singleQuote: true,
    parser: 'typescript',
  })
}
