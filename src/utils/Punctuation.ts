/**
 * 处理标点的辅助类
 *
 * @export
 * @class Punctuation
 */
export default class Punctuation {
  private static regExpPattern = `.+?(;|(\\\.{3}|\\\.)|\\\?|!|…|$)`
  public static sentencePunctuationRegExp = new RegExp(
    Punctuation.regExpPattern
  )
  public static sentencePunctuationRegExpG = new RegExp(
    Punctuation.regExpPattern,
    'g'
  )
  private static punctuations = new Map([
    [':', true],
    [',', true],
    [';', true],
    ['"', true],
    ['`', true],
    ['~', true],
    [`'`, true],
    ['-', true],
    ['--', true],
    ['\\', true],
    ['/', true],
    ['<', true],
    ['>', true],
    ['{', true],
    ['}', true],
    ['[', true],
    [']', true],
    ['+', true],
    ['-', true],
    ['*', true],
    ['_', true],
    ['(', true],
    [')', true],
    ['&', true],
    ['^', true],
    ['%', true],
    ['$', true],
    ['#', true],
    ['@', true],
    ['.', true],
    ['?', true],
    ['!', true],
    ['|', true],
    ['...', true],
    ['…', true]
  ])

  public static is(v: string) {
    return Punctuation.punctuations.has(v)
  }

  /**
   * 将文本中的中文标点转化为英文标点
   */
  public static normalizeText(text: string) {
    return text
      .replace(/“|”/g, '"')
      .replace(/‘|’/g, `'`)
      .replace(/，/g, ',')
      .replace(/。/g, '.')
      .replace(/！/g, '!')
      .replace(/？/g, '?')
      .replace(/；/g, ';')
      .replace(/：/g, ':')
      .replace(/【/g, '[')
      .replace(/】/g, ']')
      .replace(/（/g, '(')
      .replace(/）/g, ')')
    // 看起来好看点，虽然这两个实际上不是一个符号
    // .replace(/’/g, '\'')
  }
}
