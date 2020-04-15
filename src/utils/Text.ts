/**
 * 处理文本的辅助类
 *
 * @export
 * @class Text
 */
export default class Text {
  private static regExpPattern = `(\\s+|:|,|"|~|\`|(?:--|-)|\\\\|\\/|<|>|\\{|\\}|\\[|\\]|\\+|\\*|_|\\(|\\)|&|\\^|%|\\$|#|@|\\||’|;|(?:\\.{3}|\\.)|\\?|!|…)`
  public static separatorRegExp = new RegExp(Text.regExpPattern)
  public static separatorRegExpG = new RegExp(Text.regExpPattern, 'g')

  public static isSeparator(word: string) {
    return !!word.match(Text.separatorRegExp)
  }

  public static tidyCRLF(str: string) {
    return str
      .replace(/\r/g, '\n')
      .replace(/\n\s+\n/g, '\n\n')
      .replace(/\n{2,}/g, '\n')
      .replace(/^\n/, '')
  }

  public static split(str: string, separator: string | RegExp) {
    return str
      .trim()
      .split(separator)
      .map((v) => v.trim())
      .filter((v) => v)
  }
}
