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
        <div class="typo" style="font-weight: bolder">
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
            style="float: right"
            >导出为 TXT 格式文本文档</el-button
          >
        </div>
        <div class="typo" style="font-weight: bolder">
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
import { ipcRenderer as ipc } from 'electron'
import { Component, Vue } from 'vue-property-decorator'
import Analysis from '@/utils/Analysis'
// import Dict from '@/utils/Dict'
// import Logger from '@/utils/Logger'
// import Translation from '@/utils/Translation'
// import Punctuation from '@/utils/Punctuation'
// import Text from '@/utils/Text'
import { SentenceItem, WordItem } from '@/interface'
import { Setting } from '@/store'
// import { mapLimit } from 'async'

@Component
export default class AnalyzedResult extends Vue {
  private tabName = 'article'
  private importantWordsOfSentences: WordItem[][] = []

  get setting(): Setting {
    return this.$store.state.setting
  }
  get wordBorderColor(): {
    cet4: string
    cet6: string
    toefl: string
    gre: string
  } {
    return Analysis.wordBorderColor()
  }
  get wordBackgroundColor(): {
    none: string
    cet4: string
    cet6: string
    toefl: string
    gre: string
  } {
    return Analysis.wordBackgroundColor()
  }
  get analyzedResult(): SentenceItem[][] {
    return Analysis.analyzedResult(this.originalText)
  }
  get importanceStandard(): number {
    return Analysis.importanceStandard(this.analyzedResult)
  }
  get importantSentences(): SentenceItem[] {
    return Analysis.importantSentences(this.analyzedResult)
  }
  get allWords(): string[] {
    return Analysis.allWords(this.analyzedResult)
  }
  get greWords(): string[] {
    return Analysis.greWords(this.allWords)
  }
  get toeflWords(): string[] {
    return Analysis.toeflWords(this.allWords)
  }
  get cet6Words(): string[] {
    return Analysis.cet6Words(this.allWords)
  }
  get cet4Words(): string[] {
    return Analysis.cet4Words(this.allWords)
  }
  get originalText(): string {
    return this.$store.state.originalText
  }
  private getWordStyle(word: string) {
    return Analysis.getWordStyle(word)
  }
  private exportImportantSentences() {
    const header =
      `本文件由【English Reading Assistant ${Analysis.version()}】于 ${new Date().toLocaleString()} 导出\r\n` +
      `Copyright (C) ${new Date().getFullYear()} Frederick Wang\r\n` +
      '----------------------------------------\r\n\r\n'
    console.log('nmsl')
    console.log(this.importantWordsOfSentences)
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
    Analysis.getImportantSentenceTranslations(
      this.importantWordsOfSentences,
      this.setting.wordWise,
      this.importantSentences
    )
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
