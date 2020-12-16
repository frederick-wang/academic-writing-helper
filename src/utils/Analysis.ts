/**
 * 处理文本的辅助类
 *
 * @export
 * @class Analysis
 */
import { SentenceItem, WordItem, SentenceItemWithRelevance } from '@/interface'
import Logger from '@/utils/Logger'
import Text from '@/utils/Text'
import Punctuation from '@/utils/Punctuation'
import Dict from '@/utils/Dict'
import Translation from '@/utils/Translation'
import { mapLimit } from 'async'
import { WordWise } from '@/store'
export default class Analysis {
  public static version(): string {
    return process.env.VUE_APP_VERSION || ''
  }
  public static wordBorderColor(): {
    cet4: string
    cet6: string
    toefl: string
    gre: string
  } {
    return Dict.wordBorderColor
  }
  public static wordBackgroundColor(): {
    none: string
    cet4: string
    cet6: string
    toefl: string
    gre: string
  } {
    return Dict.wordBackgroundColor
  }
  public static getSentenceScore(convertedSentence: string[]): number {
    const sentenceWords = convertedSentence.filter((v) => !Text.isSeparator(v))

    /**
     * NOTE: Maybe I need to consider to reuse the old algorithm to evaluate scores, but it's unnecessary.
     */

    // The old algorithm: f(x) = ln(x)^2 / x.
    // const f = (v: number) => Math.log(v) ** 2 / v;
    // const getLengthScore = f;

    // The current algorithm: normal distribution, which μ equals 20 and σ equals 6.25.
    const normpdf = (v: number, mu: number, sigma: number) =>
      (1 / (sigma * Math.sqrt(2 * Math.PI))) *
      Math.E ** -((v - mu) ** 2 / (2 * sigma ** 2))
    const getLengthScore = (v: number) => normpdf(v, 20, 6.25)

    const getWordsScore = (words: string[]) =>
      words
        .map((word) => word.toLowerCase())
        .reduce((acc, cur) => acc + Dict.getWordScore(cur), 0)

    const getTotalScore = (words: string[]) => (length: number) =>
      getWordsScore(words) * getLengthScore(length)

    return getTotalScore(sentenceWords)(sentenceWords.length)
  }
  public static analyzedResult(originalText: string): SentenceItem[][] {
    Logger.time('analyzedResult')
    if (!originalText) {
      Logger.timeEnd('analyzedResult')
      return []
    }
    const splitParagraph = (str: string) => Text.split(str, '\n')

    const splitSentence = (str: string) => Text.split(str, Text.separatorRegExp)

    /**
     * Text preprocessing.
     * @param text Text that needs to be preprocessed
     * @returns Processed text separated by paragraph, as a string[].
     */
    const preProcessText = (text: string) =>
      splitParagraph(Text.tidyCRLF(Punctuation.normalizeText(text)))

    const paragraphs = preProcessText(originalText)

    const splitParagraphToSentences = (text: string) =>
      (text.match(Punctuation.sentencePunctuationRegExpG) || [])
        .map((v) => v.trim())
        .map((sentence) => {
          const convertedSentence = splitSentence(sentence)
          const score = this.getSentenceScore(convertedSentence)
          return {
            score,
            sentence: convertedSentence
          }
        })
    const result = paragraphs.map(splitParagraphToSentences)
    Logger.timeEnd('analyzedResult')
    return result
  }
  public static importanceStandard(analyzedResult: SentenceItem[][]): number {
    /**
     * Temporarily store the scores of all sentences， in order from largest to smallest.
     */
    const allScores = analyzedResult
      .reduce(
        (accPara, curPara) => [
          ...accPara,
          ...curPara.reduce((acc, cur) => [...acc, cur.score], [] as number[])
        ],
        [] as number[]
      )
      .sort((a, b) => b - a)
    // Take the score of 20% as the standard of important sentences.
    // If there is no sentence at present, return 0.
    return allScores[Math.floor(allScores.length * 0.2)] || 0
  }
  public static allWords(analyzedResult: SentenceItem[][]): string[] {
    return [
      ...new Set(
        analyzedResult.reduce(
          (accPara, curPara) => [
            ...accPara,
            ...curPara.reduce(
              (accS, curS) => [
                ...accS,
                ...curS.sentence.reduce(
                  (acc, cur) =>
                    Punctuation.is(cur) || accPara.includes(cur)
                      ? acc
                      : [...acc, cur],
                  [] as string[]
                )
              ],
              [] as string[]
            )
          ],
          [] as string[]
        )
      )
    ]
  }
  public static greWords(allWords: string[]): string[] {
    return allWords.filter((v) => Dict.isGRE(v))
  }
  public static toeflWords(allWords: string[]): string[] {
    return allWords.filter((v) => Dict.isToefl(v))
  }
  public static cet6Words(allWords: string[]): string[] {
    return allWords.filter((v) => Dict.isCET6(v))
  }
  public static cet4Words(allWords: string[]): string[] {
    return allWords.filter((v) => Dict.isCET4(v))
  }
  public static importantSentences(
    analyzedResult: SentenceItem[][]
  ): SentenceItem[] {
    return analyzedResult.reduce(
      (accPara, curPara) => [
        ...accPara,
        ...curPara.reduce(
          (acc, cur, i, src) =>
            cur.score >= this.importanceStandard(analyzedResult)
              ? [
                  ...acc,
                  {
                    ...cur,
                    revlevance: {
                      before: [src[i - 2], src[i - 1]]
                        .filter((v) => v)
                        .map((v) => v.sentence)
                        // 只保留一句前文
                        .slice(0, 1)
                        .flat(),
                      after: [src[i + 1], src[i + 2]]
                        .filter((v) => v)
                        .map((v) => v.sentence)
                        // 只保留一句后文
                        .slice(0, 1)
                        .flat()
                    }
                  }
                ]
              : acc,
          [] as SentenceItemWithRelevance[]
        )
      ],
      []
    )
  }
  public static getImportantSentenceTranslations(
    importantWordsOfSentences: WordItem[][],
    wordWise: WordWise,
    importantSentences: SentenceItem[]
  ): void {
    importantWordsOfSentences.splice(
      0,
      0,
      ...Array.from({
        length: importantSentences.length
      }).map(() => [])
    )
    const { cet4, cet6, toefl, gre } = wordWise
    setTimeout(() => {
      mapLimit(
        importantSentences.map(({ sentence }, index) => ({
          words: [...new Set(sentence)].filter(
            (word) =>
              (cet4 && Dict.isCET4UniquelyDownward(word)) ||
              (cet6 && Dict.isCET6UniquelyDownward(word)) ||
              (toefl && Dict.isToeflUniquelyDownward(word)) ||
              (gre && Dict.isGREUniquelyDownward(word))
          ),
          index
        })),
        5,
        ({ words, index }, callback) => {
          Translation.getWordCollectionTranslation(words, 10)
            .then((data) => {
              importantWordsOfSentences[index].splice(0, 0, ...data)
              callback(null, data)
            })
            .catch((err) => callback(err))
        },
        (err) => {
          if (err) {
            Logger.error(err)
            return
          }
          Translation.saveWordsTranslation()
        }
      )
    }, 1000)
  }
  public static getWordStyle(
    word: string
  ):
    | {
        backgroundColor: string
      }
    | {
        padding: string
      } {
    if (Text.isSeparator(word)) {
      return {
        padding: '0'
      }
    }
    const getStyle = (w: string) => ({
      backgroundColor: Dict.getWordBackgroundColor(w)
    })
    return getStyle(word)
  }
}
