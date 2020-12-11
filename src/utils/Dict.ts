/**
 * 处理分级词汇表的辅助类
 *
 * @export
 * @class Dict
 */
export default class Dict {
  private static junior = Dict.importWordsData(
    require('@/assets/dict/junior.json')
  )
  private static cet4 = Dict.importWordsData(require('@/assets/dict/cet4.json'))
  private static cet6 = Dict.importWordsData(require('@/assets/dict/cet6.json'))
  private static toefl = Dict.importWordsData(
    require('@/assets/dict/toefl.json')
  )
  private static gre = Dict.importWordsData(require('@/assets/dict/gre.json'))
  public static wordBorderColor = {
    cet4: '#DCDFE6',
    cet6: '#E6A23C',
    toefl: '#67C23A',
    gre: '#409EFF'
  }
  public static wordBackgroundColor = {
    none: 'transparent',
    cet4: '#DCDFE680',
    cet6: '#E6A23C80',
    toefl: '#67C23A80',
    gre: '#409EFF80'
  }

  private static importWordsData(data: string[]): Map<string, boolean> {
    if (Dict.junior) {
      return new Map(
        data
          .filter((v) => !Dict.junior.has(v))
          .map((v: string): [string, boolean] => [v, true])
      )
    }
    return new Map(data.map((v: string): [string, boolean] => [v, true]))
  }

  public static isCET4(word: string) {
    return Dict.cet4.has(word.toLowerCase())
  }

  public static isCET6(word: string) {
    return Dict.cet6.has(word.toLowerCase())
  }

  public static isToefl(word: string) {
    return Dict.toefl.has(word.toLowerCase())
  }

  public static isGRE(word: string) {
    return Dict.gre.has(word.toLowerCase())
  }
  public static isCET4UniquelyDownward(word: string) {
    return Dict.isCET4(word)
  }

  public static isCET6UniquelyDownward(word: string) {
    return Dict.isCET6(word) && !Dict.isCET4(word)
  }

  public static isToeflUniquelyDownward(word: string) {
    return Dict.isToefl(word) && !Dict.isCET4(word) && !Dict.isCET6(word)
  }

  public static isGREUniquelyDownward(word: string) {
    return (
      Dict.isGRE(word) &&
      !Dict.isCET4(word) &&
      !Dict.isCET6(word) &&
      !Dict.isToefl(word)
    )
  }

  public static getWordScore(word: string) {
    if (Dict.isCET4(word)) {
      return 1
    }
    if (Dict.isCET6(word)) {
      return 9
    }
    if (Dict.isToefl(word)) {
      return 25
    }
    if (Dict.isGRE(word)) {
      return 49
    }
    return 0
  }

  public static getWordBackgroundColor(word: string) {
    word = word.toLowerCase()
    if (Dict.isCET4(word)) {
      return Dict.wordBackgroundColor.cet4
    }
    if (Dict.isCET6(word)) {
      return Dict.wordBackgroundColor.cet6
    }
    if (Dict.isToefl(word)) {
      return Dict.wordBackgroundColor.toefl
    }
    if (Dict.isGRE(word)) {
      return Dict.wordBackgroundColor.gre
    }
    return Dict.wordBackgroundColor.none
  }
}
