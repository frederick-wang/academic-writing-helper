<template>
  <div class="subpage subpage-analyzed-result">
    <el-tabs
      v-model="tabName"
      type="card"
    >
      <el-tab-pane
        label="原文"
        name="article"
        class="tab-article"
      >
        <div class="word-class-indicators">
          <el-tag
            class="word-class-tag"
            :color="wordBackgroundColor.cet4"
            :disable-transitions="true"
          >四级词汇</el-tag>
          <el-tag
            class="word-class-tag"
            :color="wordBackgroundColor.cet6"
            :disable-transitions="true"
          >六级词汇</el-tag>
          <el-tag
            class="word-class-tag"
            :color="wordBackgroundColor.toefl"
            :disable-transitions="true"
          >托福词汇</el-tag>
          <el-tag
            class="word-class-tag"
            :color="wordBackgroundColor.gre"
            :disable-transitions="true"
          >GRE词汇</el-tag>
        </div>
        <div
          class="typo"
          style="font-weight: bolder;"
        >
          <div
            is="p"
            v-for="(para, paraIndex) in analyzedResult"
            :key="paraIndex"
          >
            <div
              class="sentence"
              :class="{ 'sentence-important': sentenceItem.score >= importanceStandard }"
              v-for="(sentenceItem, sentenceIndex) in para"
              :key="sentenceIndex"
            >
              <span
                v-for="(word, wordIndex) in sentenceItem.sentence"
                :key="wordIndex"
                :style="getWordStyle(word)"
              >{{word}}</span>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="重点句"
        name="sentence"
        class="tab-sentence"
      >
        <div class="word-class-indicators">
          <el-tag
            class="word-class-tag"
            :color="wordBackgroundColor.cet4"
            :disable-transitions="true"
          >四级词汇</el-tag>
          <el-tag
            class="word-class-tag"
            :color="wordBackgroundColor.cet6"
            :disable-transitions="true"
          >六级词汇</el-tag>
          <el-tag
            class="word-class-tag"
            :color="wordBackgroundColor.toefl"
            :disable-transitions="true"
          >托福词汇</el-tag>
          <el-tag
            class="word-class-tag"
            :color="wordBackgroundColor.gre"
            :disable-transitions="true"
          >GRE词汇</el-tag>
          <el-button
            type="primary"
            size="small"
            @click="exportImportantSentences"
            style="float: right;"
          >导出为 TXT 格式文本文档</el-button>
        </div>
        <div
          class="typo"
          style="font-weight: bolder;"
        >
          <div
            class="sentence-item"
            v-for="(sentenceItem, sentenceIndex) in importantSentences"
            :key="sentenceIndex"
          >
            <div
              is="p"
              class="sentence no-indent"
            >
              <span>{{sentenceIndex + 1}}. </span>
              <span
                v-for="(word, wordIndex) in sentenceItem.sentence"
                :key="wordIndex"
                :style="getWordStyle(word)"
              >{{word}}</span>
            </div>
            <div class="words">
              <p
                class="no-indent"
                v-for="(word, wordIndex) in importantWordsOfSentences[sentenceIndex]"
                :key="wordIndex"
              >
                <strong>{{word.word}}</strong>: {{word.translation.join('、')}}
              </p>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="四级词汇"
        name="cet4"
        class="tab-cet4"
      >
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
            >{{index + 1}}</span>
            <span class="word-title">{{item}}</span>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="六级词汇"
        name="cet6"
        class="tab-cet6"
      >
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
            >{{index + 1}}</span>
            <span class="word-title">{{item}}</span>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="托福词汇"
        name="toefl"
        class="tab-toefl"
      >
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
            >{{index + 1}}</span>
            <span class="word-title">{{item}}</span>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="GRE词汇"
        name="gre"
        class="tab-gre"
      >
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
            >{{index + 1}}</span>
            <span class="word-title">{{item}}</span>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { ipcRenderer as ipc } from 'electron';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { StartRouter } from '@/router';
import { Logger, Dict, Punctuation, Translation, Text } from '@/Utils';

interface SentenceItem {
  score: number;
  sentence: string[];
}

interface WordItem {
  word: string;
  translation: string[];
  addition: string;
}

@Component
export default class AnalyzedResult extends Vue {
  private tabName = 'article';
  private importantWordsOfSentences: WordItem[][] = [];

  get settings() {
    return this.$store.state.settings;
  }

  get version() {
    return process.env.VUE_APP_VERSION;
  }

  get originalText(): string {
    return this.$store.state.originalText;
  }

  get wordBorderColor() {
    return Dict.wordBorderColor;
  }

  get wordBackgroundColor() {
    return Dict.wordBackgroundColor;
  }

  get importanceStandard() {
    /**
     * 临时存放所有句子的得分，按从大到小排列
     */
    const allScores = this.analyzedResult
      .reduce(
        (accPara, curPara) => [
          ...accPara,
          ...curPara.reduce((acc, cur) => [...acc, cur.score], [] as number[])
        ],
        [] as number[]
      )
      .sort((a, b) => b - a);
    // 取 20% 处的得分为重点句的标准，如果当前没有句子的话，就返回 0
    return allScores[Math.floor(allScores.length * 0.2)] || 0;
  }

  get analyzedResult() {
    Logger.time('analyzedResult');
    if (!this.originalText) {
      Logger.timeEnd('analyzedResult');
      return [];
    }

    const splitParagraph = (str: string) => Text.split(str, '\n');

    const splitSentence = (str: string) =>
      Text.split(str, Text.separatorRegExp);

    /**
     * 文本预处理函数
     * @param text 需要预处理的文本
     * @returns 处理好的文本，为一个按照段落分开的 string[]
     */
    const preProcessText = (text: string) =>
      splitParagraph(Text.tidyCRLF(Punctuation.normalizeText(text)));

    const paragraphs = preProcessText(this.originalText);

    const splitParagraphToSentences = (text: string) =>
      (text.match(Punctuation.sentencePunctuationRegExpG) || [])
        .map(v => v.trim())
        .map(sentence => {
          const convertedSentence = splitSentence(sentence);
          const score = this.getSentenceScore(convertedSentence);
          return {
            score,
            sentence: convertedSentence
          };
        });
    const result = paragraphs.map(splitParagraphToSentences);
    Logger.timeEnd('analyzedResult');
    return result;
  }

  get greWords() {
    return this.allWords.filter(v => Dict.isGRE(v));
  }
  get toeflWords() {
    return this.allWords.filter(v => Dict.isToefl(v));
  }
  get cet6Words() {
    return this.allWords.filter(v => Dict.isCET6(v));
  }
  get cet4Words() {
    return this.allWords.filter(v => Dict.isCET4(v));
  }
  get allWords() {
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
    ];
  }

  @Watch('importantSentences')
  private importantSentencesWatcher() {
    Logger.log('importantSentencesWatcher');
    Logger.time('importantSentencesWatcher');
    this.importantWordsOfSentences = Array.from({
      length: this.importantSentences.length
    }).map(v => []);
    const { cet4, cet6, toefl, gre } = this.settings.wordWise;
    Promise.all(
      this.importantSentences.map(({ sentence }, index) =>
        Promise.all(
          [...new Set(sentence)]
            .filter(
              word =>
                (cet4 && Dict.isCET4(word)) ||
                (cet6 && Dict.isCET6(word) && !Dict.isCET4(word)) ||
                (toefl &&
                  Dict.isToefl(word) &&
                  !Dict.isCET4(word) &&
                  !Dict.isCET6(word)) ||
                (gre &&
                  Dict.isGRE(word) &&
                  !Dict.isCET4(word) &&
                  !Dict.isCET6(word) &&
                  !Dict.isToefl(word))
            )
            .map(word =>
              Translation.getWordTranslation(word).then(data => {
                return Object.assign({ word }, data) as WordItem;
              })
            )
        ).then(data => {
          // Logger.log(index, data);
          this.importantWordsOfSentences[index].splice(0, 0, ...data);
          return data;
        })
      )
    )
      .then(data => {
        // Logger.log(data);
      })
      .catch(err => {
        Logger.error(err);
      })
      .finally(() => {
        Translation.saveWordsTranslation();
        Logger.timeEnd('importantSentencesWatcher');
      });
  }

  get importantSentences(): SentenceItem[] {
    return this.analyzedResult.reduce(
      (accPara, curPara) => [
        ...accPara,
        ...curPara.reduce(
          (acc, cur) =>
            cur.score >= this.importanceStandard ? [...acc, cur] : acc,
          [] as SentenceItem[]
        )
      ],
      [] as SentenceItem[]
    );
  }

  private getSentenceScore(convertedSentence: string[]) {
    const sentenceWords = convertedSentence.filter(v => !Text.isSeparator(v));

    /**
     * 2019-1-8 04:35:48
     * NOTE: Maybe I need to consider to reuse the old algorithm to evaluate scores, but it's unnecessary.
     */

    // The old algorithm: f(x) = ln(x)^2 / x.
    // const f = (v: number) => Math.log(v) ** 2 / v;
    // const getLengthScore = f;

    // The current algorithm: normal distribution, which μ equals 17.5 and 2 * σ equals (17.5 - 7).
    const normpdf = (v: number, mu: number, sigma: number) =>
      (1 / (sigma * Math.sqrt(2 * Math.PI))) *
      Math.E ** -((v - mu) ** 2 / (2 * sigma ** 2));
    const getLengthScore = (v: number) => normpdf(v, 17.5, (17.5 - 7) / 2);

    const getWordsScore = (words: string[]) =>
      words
        .map(word => word.toLowerCase())
        .reduce((acc, cur) => acc + Dict.getWordScore(cur), 0);

    const getTotalScore = (words: string[]) => (length: number) =>
      getWordsScore(words) * getLengthScore(length);

    return getTotalScore(sentenceWords)(sentenceWords.length);
  }
  private getWordStyle(word: string) {
    if (Text.isSeparator(word)) {
      return {
        padding: '0'
      };
    }
    const getStyle = (w: string) => ({
      backgroundColor: Dict.getWordBackgroundColor(w)
    });
    return getStyle(word);
  }
  private exportImportantSentences() {
    const header =
      `本文件由【Academic Writing Helper ${
        this.version
      }】于 ${new Date().toLocaleString()} 导出\r\n` +
      `Copyright (C) ${new Date().getFullYear()} Frederick Wang\r\n` +
      '----------------------------------------\r\n\r\n';
    const convertSentenceWords = (item: WordItem[]) =>
      item.reduce(
        (acc, cur, i, arr) =>
          acc +
          `\t${cur.word}: ${cur.translation.join('、')}` +
          (arr.length - i - 1 ? '\r\n' : ''),
        item.length ? '\r\n' : ''
      );
    const content = this.importantSentences.reduce(
      (acc, cur, i, arr) =>
        acc +
        `${i + 1}. ${cur.sentence.join('')}` +
        convertSentenceWords(this.importantWordsOfSentences[i]) +
        (arr.length - i - 1 ? '\r\n\r\n' : '\r\n'),
      ''
    );
    this.exportFileTxt(header + content);
  }
  private exportFileTxt(data: string) {
    ipc.once(
      'saved-file-txt',
      (event: any, { error, path }: { error: Error; path: string }) => {
        if (error) {
          this.$message.error(error.message);
        } else {
          if (path) {
            this.$message({
              message: `文件已保存至：${path}`,
              type: 'success'
            });
          } else {
            this.$message('没有选择保存文件的位置');
          }
        }
      }
    );
    ipc.send('save-dialog-txt', data);
  }

  private created() {
    this.importantSentencesWatcher();
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
