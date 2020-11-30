import p from 'prettier'

/**
 * format generate code
 * @param str
 */
export default function fmt(str: string) {
  return p.format(str, {
    trailingComma: 'es5',
    tabWidth: 2,
    semi: false,
    singleQuote: true,
    parser: 'typescript',
  })
}
