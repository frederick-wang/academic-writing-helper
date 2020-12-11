<template>
  <div class="subpage subpage-analyzed-result">
    <el-tabs v-model="tabName" type="card">
      <el-tab-pane label="原文" name="article" class="tab-article">
        <div class="word-class-indicators">
          <el-tag
            class="word-class-tag"
            :color="wordBackgroundColor.cet4"
            :disable-transitions="true"
            >四级词汇</el-tag
          >
          <el-tag
            class="word-class-tag"
            :color="wordBackgroundColor.cet6"
            :disable-transitions="true"
            >六级词汇</el-tag
          >
          <el-tag
            class="word-class-tag"
            :color="wordBackgroundColor.toefl"
            :disable-transitions="true"
            >托福词汇</el-tag
          >
          <el-tag
            class="word-class-tag"
            :color="wordBackgroundColor.gre"
            :disable-transitions="true"
            >GRE词汇</el-tag
          >
        </div>
        <div class="typo" style="font-weight: bolder;">
          <div
            is="p"
            v-for="(para, paraIndex) in analyzedResult"
            :key="paraIndex"
          >
            <div
              class="sentence"
              :class="{
                'sentence-important': sentenceItem.score >= importanceStandard
              }"
              v-for="(sentenceItem, sentenceIndex) in para"
              :key="sentenceIndex"
            >
              <span
                v-for="(word, wordIndex) in sentenceItem.sentence"
                :key="wordIndex"
                :style="getWordStyle(word)"
                >{{ word }}
              </span>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="重点句" name="sentence" class="tab-sentence">
        <div class="word-class-indicators">
          <el-tag
            class="word-class-tag"
            :color="wordBackgroundColor.cet4"
            :disable-transitions="true"
            >四级词汇</el-tag
          >
          <el-tag
            class="word-class-tag"
            :color="wordBackgroundColor.cet6"
            :disable-transitions="true"
            >六级词汇</el-tag
          >
          <el-tag
            class="word-class-tag"
            :color="wordBackgroundColor.toefl"
            :disable-transitions="true"
            >托福词汇</el-tag
          >
          <el-tag
            class="word-class-tag"
            :color="wordBackgroundColor.gre"
            :disable-transitions="true"
            >GRE词汇</el-tag
          >
          <el-button
            type="primary"
            size="small"
            @click="exportImportantSentences"
            style="float: right;"
            >导出为 TXT 格式文本文档</el-button
          >
        </div>
        <div class="typo" style="font-weight: bolder;">
          <div
            class="sentence-item"
            v-for="(sentenceItem, sentenceIndex) in importantSentences"
            :key="sentenceIndex"
          >
            <div is="p" class="sentence no-indent">
              <span>{{ sentenceIndex + 1 }}. </span>
              <span
                class="related-sentence-word"
                v-for="(word, wordIndex) in sentenceItem.revlevance.before"
                :key="sentenceIndex + '' + wordIndex + word + Math.random()"
                >{{ word }}
              </span>
              <span
                v-for="(word, wordIndex) in sentenceItem.sentence"
                :key="sentenceIndex + '' + wordIndex + word + Math.random()"
                :style="getWordStyle(word)"
                >{{ word }}
              </span>
              <span
                class="related-sentence-word"
                v-for="(word, wordIndex) in sentenceItem.revlevance.after"
                :key="sentenceIndex + '' + wordIndex + word + Math.random()"
                >{{ word }}
              </span>
            </div>
            <div class="words">
              <p
                class="no-indent"
                v-for="(word, wordIndex) in importantWordsOfSentences[
                  sentenceIndex
                ]"
                :key="wordIndex"
              >
                <strong>{{ word.word }}</strong
                >: {{ word.translation.join('、') }}
              </p>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="四级词汇" name="cet4" class="tab-cet4">
        <div class="words-container">
          <div
            class="word"
            v-for="(item, index) in cet4Words"
            :key="index"
            :style="{ 'border-color': wordBorderColor.cet4 }"
          >
            <span
              class="word-number"
              :style="{ 'border-right-color': wordBorderColor.cet4 }"
              >{{ index + 1 }}</span
            >
            <span class="word-title">{{ item }}</span>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="六级词汇" name="cet6" class="tab-cet6">
        <div class="words-container">
          <div
            class="word"
            v-for="(item, index) in cet6Words"
            :key="index"
            :style="{ 'border-color': wordBorderColor.cet6 }"
          >
            <span
              class="word-number"
              :style="{ 'border-right-color': wordBorderColor.cet6 }"
              >{{ index + 1 }}</span
            >
            <span class="word-title">{{ item }}</span>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="托福词汇" name="toefl" class="tab-toefl">
        <div class="words-container">
          <div
            class="word"
            v-for="(item, index) in toeflWords"
            :key="index"
            :style="{ 'border-color': wordBorderColor.toefl }"
          >
            <span
              class="word-number"
              :style="{ 'border-right-color': wordBorderColor.toefl }"
              >{{ index + 1 }}</span
            >
            <span class="word-title">{{ item }}</span>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="GRE词汇" name="gre" class="tab-gre">
        <div class="words-container">
          <div
            class="word"
            v-for="(item, index) in greWords"
            :key="index"
            :style="{ 'border-color': wordBorderColor.gre }"
          >
            <span
              class="word-number"
              :style="{ 'border-right-color': wordBorderColor.gre }"
              >{{ index + 1 }}</span
            >
            <span class="word-title">{{ item }}</span>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
/**
 * 2019-2-11 23:54:47
 * TODO: 在单词上方显示释义，类似kindle的生词提示功能
 * 只选取最主要的释义，但是鼠标移上后可以有悬浮菜单显示其他释义并切换
 * 如果多个单词在同一行距离过近，则应该尽量位移避开，如果避不开就截断内容
 * 2019-2-13 23:55:00
 * TODO: 解决渲染时过卡的问题，可以引入分页渲染，或者惰性渲染，前者实现更加简单。
 */
import { ipcRenderer as ipc } from 'electron'
import { Component, Vue } from 'vue-property-decorator'
import Dict from '@/utils/Dict'
import Logger from '@/utils/Logger'
import Translation from '@/utils/Translation'
import Punctuation from '@/utils/Punctuation'
import Text from '@/utils/Text'
import { SentenceItem, WordItem, SentenceItemWithRelevance } from '@/interface'
import { mapLimit } from 'async'

@Component
export default class AnalyzedResult extends Vue {
  private tabName = 'article'
  private importantWordsOfSentences: WordItem[][] = []

  get settings() {
    return this.$store.state.settings
  }

  get version() {
    return process.env.VUE_APP_VERSION
  }

  get originalText(): string {
    return this.$store.state.originalText
  }

  get wordBorderColor() {
    return Dict.wordBorderColor
  }

  get wordBackgroundColor() {
    return Dict.wordBackgroundColor
  }

  get importanceStandard(): number {
    /**
     * Temporarily store the scores of all sentences， in order from largest to smallest.
     */
    const allScores = this.analyzedResult
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

  get analyzedResult(): SentenceItem[][] {
    Logger.time('analyzedResult')
    if (!this.originalText) {
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

    const paragraphs = preProcessText(this.originalText)

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

  get greWords(): string[] {
    return this.allWords.filter((v) => Dict.isGRE(v))
  }
  get toeflWords(): string[] {
    return this.allWords.filter((v) => Dict.isToefl(v))
  }
  get cet6Words(): string[] {
    return this.allWords.filter((v) => Dict.isCET6(v))
  }
  get cet4Words(): string[] {
    return this.allWords.filter((v) => Dict.isCET4(v))
  }
  get allWords(): string[] {
    return [
      ...new Set(
        this.analyzedResult.reduce(
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

  /**
   * Get translations of important words.
   */
  private getImportantSentenceTranslations() {
    this.importantWordsOfSentences = Array.from({
      length: this.importantSentences.length
    }).map(() => [])
    const { cet4, cet6, toefl, gre } = this.settings.wordWise
    setTimeout(() => {
      mapLimit(
        this.importantSentences.map(({ sentence }, index) => ({
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
              this.importantWordsOfSentences[index].splice(0, 0, ...data)
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

  /**
   * Get all sentences whose score is above the standard.
   */
  get importantSentences(): SentenceItem[] {
    return this.analyzedResult.reduce(
      (accPara, curPara) => [
        ...accPara,
        ...curPara.reduce(
          (acc, cur, i, src) =>
            cur.score >= this.importanceStandard
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

  private getSentenceScore(convertedSentence: string[]) {
    const sentenceWords = convertedSentence.filter((v) => !Text.isSeparator(v))

    /**
     * 2019-1-8 04:35:48
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
  private getWordStyle(word: string) {
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
  private exportImportantSentences() {
    const header =
      `本文件由【English Reading Assistant ${
        this.version
      }】于 ${new Date().toLocaleString()} 导出\r\n` +
      `Copyright (C) ${new Date().getFullYear()} Frederick Wang\r\n` +
      '----------------------------------------\r\n\r\n'
    const convertSentenceWords = (item: WordItem[]) =>
      item.reduce(
        (acc, cur, i, arr) =>
          acc +
          `\t${cur.word}: ${cur.translation.join('、')}` +
          (arr.length - i - 1 ? '\r\n' : ''),
        item.length ? '\r\n' : ''
      )
    const content = this.importantSentences.reduce(
      (acc, cur, i, arr) =>
        acc +
        `${i + 1}. ${cur.sentence.join(' ')}` +
        convertSentenceWords(this.importantWordsOfSentences[i]) +
        (arr.length - i - 1 ? '\r\n\r\n' : '\r\n'),
      ''
    )
    this.exportFileTxt(header + content)
  }
  private exportFileTxt(data: string) {
    ipc.once(
      'saved-file-txt',
      (event: unknown, { error, path }: { error: Error; path: string }) => {
        if (error) {
          this.$message.error(error.message)
        } else {
          if (path) {
            this.$message({
              message: `文件已保存至：${path}`,
              type: 'success'
            })
          } else {
            this.$message('没有选择保存文件的位置')
          }
        }
      }
    )
    ipc.send('save-dialog-txt', data)
  }

  private created() {
    this.getImportantSentenceTranslations()
  }
}
</script>

<style lang="scss" scoped>
.subpage-analyzed-result {
  .sentence {
    text-indent: 0;
    display: inline;

    &.sentence-important {
      border-left: 2px dashed #f56c6c;
      border-right: 2px dashed #f56c6c;
      border-bottom: 2px solid #f56c6c;
    }

    > span {
      line-height: 2;
      display: inline-block;
      white-space: pre;
      text-align: center;
      margin-bottom: 10px;
      padding: 0 5px;
    }
  }
  .tab-sentence {
    .sentence-item {
      border-bottom: 1px dashed #f56c6c;
      padding: 0.6em 0;
      .sentence {
        border-left: 2.5px solid #f56c6c;
        padding-left: 0.5em;

        .related-sentence-word {
          opacity: 0.5;
          font-size: 0.8em;
        }
      }
      .words {
        font-size: 0.8em;
        font-weight: lighter;
        border-left: 1px dashed #909399;
        padding-left: 1.25em;
        margin-top: 0.6em;

        p {
          &:last-child {
            margin-bottom: 0.6em;
          }

          strong {
            font-weight: normal;
          }
        }
      }
    }
  }

  .word-class-indicators {
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
    user-select: none;

    > .word-class-tag {
      color: #000000;
      border: 1px solid rgba(0, 0, 0, 0);
      font-weight: bolder;
      margin-right: 5px;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .words-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .word {
      border: 1px solid #dcdfe6;
      margin-right: 20px;
      margin-bottom: 25px;

      .word-number {
        display: inline-block;
        padding: 5px 10px;
        border-right: 1px solid #dcdfe6;
      }

      .word-title {
        display: inline-block;
        padding: 5px 10px;
        font-weight: bolder;
      }
    }
  }
}
</style>
