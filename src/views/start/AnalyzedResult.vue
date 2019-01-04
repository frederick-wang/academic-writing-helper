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
            :color="backgroundColor.cet4"
            :disable-transitions="true"
          >四级词汇</el-tag>
          <el-tag
            class="word-class-tag"
            :color="backgroundColor.cet6"
            :disable-transitions="true"
          >六级词汇</el-tag>
          <el-tag
            class="word-class-tag"
            :color="backgroundColor.toefl"
            :disable-transitions="true"
          >托福词汇</el-tag>
          <el-tag
            class="word-class-tag"
            :color="backgroundColor.gre"
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
              >
                {{getWordText(word, wordIndex, sentenceItem)}}
              </span>
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
            :color="backgroundColor.cet4"
            :disable-transitions="true"
          >四级词汇</el-tag>
          <el-tag
            class="word-class-tag"
            :color="backgroundColor.cet6"
            :disable-transitions="true"
          >六级词汇</el-tag>
          <el-tag
            class="word-class-tag"
            :color="backgroundColor.toefl"
            :disable-transitions="true"
          >托福词汇</el-tag>
          <el-tag
            class="word-class-tag"
            :color="backgroundColor.gre"
            :disable-transitions="true"
          >GRE词汇</el-tag>
          <el-button
            type="primary"
            size="small"
            @click="exportFileTxt"
            style="float: right;"
          >导出为 TXT 格式文本文档</el-button>
        </div>
        <div
          class="typo"
          style="font-weight: bolder;"
        >
          <div
            is="p"
            v-for="(sentenceItem, sentenceIndex) in importantSentences"
            :key="sentenceIndex"
          >
            <div class="sentence">
              <span>{{sentenceIndex + 1}}. </span>
              <span
                v-for="(word, wordIndex) in sentenceItem.sentence"
                :key="wordIndex"
                :style="getWordStyle(word)"
              >
                {{getWordText(word, wordIndex, sentenceItem)}}
              </span>
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
            :style="{ 'border-color': borderColor.cet4 }"
          >
            <span
              class="word-number"
              :style="{ 'border-right-color': borderColor.cet4 }"
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
            :style="{ 'border-color': borderColor.cet6 }"
          >
            <span
              class="word-number"
              :style="{ 'border-right-color': borderColor.cet6 }"
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
            :style="{ 'border-color': borderColor.toefl }"
          >
            <span
              class="word-number"
              :style="{ 'border-right-color': borderColor.toefl }"
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
            :style="{ 'border-color': borderColor.gre }"
          >
            <span
              class="word-number"
              :style="{ 'border-right-color': borderColor.gre }"
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
import { Component, Vue } from 'vue-property-decorator';
import { StartRouter } from '@/router';
import { Logger, Dict, Punctuation } from '@/Tools';

@Component
export default class AnalyzedResult extends Vue {
  private tabName = 'article';
  private importanceStandard = 0;
  private borderColor = {
    cet4: '#DCDFE6',
    cet6: '#E6A23C',
    toefl: '#67C23A',
    gre: '#409EFF'
  };
  private backgroundColor = {
    cet4: '#DCDFE680',
    cet6: '#E6A23C80',
    toefl: '#67C23A80',
    gre: '#409EFF80'
  };

  get version() {
    return process.env.VUE_APP_VERSION;
  }

  get originalText(): string {
    return this.$store.state.originalText;
  }

  get analyzedResult() {
    Logger.log('analyzedResult: Begin');
    Logger.time('analyzedResult');
    if (!this.originalText) {
      Logger.timeEnd('analyzedResult');
      return [];
    }
    /**
     * 临时存放所有句子的得分，用于之后找出前20%的重点句子
     */
    const allScores: number[] = [];
    /**
     * 文本预处理函数
     * @param text 需要预处理的文本
     * @returns 处理好的文本，为一个按照段落分开的 string[]
     */
    const preProcessText = (text: string) => {
      const tidyCRLF = (str: string) =>
        str
          .replace(/\r/g, '\n')
          .replace(/\n\s+\n/g, '\n\n')
          .replace(/\n{2,}/g, '\n')
          .replace(/^\n/, '');
      const split = (str: string) => str.split('\n').map(v => v.trim());
      return split(tidyCRLF(Punctuation.normalizeText(text)));
    };
    const paragraphs = preProcessText(this.originalText);
    const result = paragraphs.map(paragraph => {
      const splitSentence = (sentence: string) =>
        sentence
          .trim()
          .replace(Punctuation.wordPunctuationRegExp, ' $1 ')
          .replace(/ {2}/, ' ')
          .split(/\s+/);
      const tmp = [];
      while (paragraph.match(Punctuation.sentencePunctuationRegExp)) {
        const paraRegExpResult = paragraph.match(
          Punctuation.sentencePunctuationRegExp
        );
        if (paraRegExpResult) {
          const sentence = paraRegExpResult[0];
          const punctuation = paraRegExpResult[1];
          const convertedSentence = splitSentence(
            sentence.slice(
              0,
              punctuation !== '' ? sentence.length - 1 : sentence.length
            )
          );
          const score = this.getSentenceScore(convertedSentence);
          allScores.push(score);
          tmp.push({
            score,
            sentence: convertedSentence,
            punctuation
          });
          paragraph = paragraph.slice(
            paraRegExpResult.index || 0 + sentence.length,
            paragraph.length
          );
        }
      }
      // Logger.log(tmp);
      return tmp;
    });
    allScores.sort((a, b) => b - a);
    this.importanceStandard = allScores[Math.floor(allScores.length * 0.2)];
    Logger.timeEnd('analyzedResult');
    Logger.log('analyzedResult: End');
    return result;
  }

  get greWords() {
    // Logger.log('greWords');
    return this.allWords.filter(v => Dict.isGRE(v));
  }
  get toeflWords() {
    // Logger.log('toeflWords');
    return this.allWords.filter(v => Dict.isToefl(v));
  }
  get cet6Words() {
    // Logger.log('cet6Words');
    return this.allWords.filter(v => Dict.isCET6(v));
  }
  get cet4Words() {
    // Logger.log('cet4Words');
    return this.allWords.filter(v => Dict.isCET4(v));
  }
  get allWords() {
    const result: string[] = [];
    for (const para of this.analyzedResult) {
      for (const s of para) {
        for (const w of s.sentence) {
          if (!Punctuation.is(w) && !result.includes(w)) {
            result.push(w);
          }
        }
      }
    }
    // Logger.log('allWords');
    return result;
  }
  get importantSentences() {
    Logger.log('importantSentences: Begin');
    Logger.time('importantSentences');
    const result = [];
    for (const para of this.analyzedResult) {
      for (const s of para) {
        if (s.score >= this.importanceStandard) {
          result.push(s);
        }
      }
    }
    Logger.timeEnd('importantSentences');
    Logger.log('importantSentences: End');
    return result;
  }

  private getSentenceScore(convertedSentence: any) {
    let score = 0;
    for (let word of convertedSentence) {
      word = word.toLowerCase();
      if (Dict.isCET4(word)) {
        score += 1;
      } else if (Dict.isCET6(word)) {
        score += 4;
      } else if (Dict.isToefl(word)) {
        score += 16;
      } else if (Dict.isCET4(word)) {
        score += 25;
      }
    }
    // const f = (v: number) => Math.log(v) / v;
    const normalDistributionPDF = (v: number, mu: number, sigma: number) =>
      (1 / (sigma * Math.sqrt(2 * Math.PI))) *
      Math.E ** -((v - mu) ** 2 / (2 * sigma ** 2));
    const getSentenceLengthScore = (v: number) =>
      normalDistributionPDF(v, 17.5, (17.5 - 7) / 2);
    // console.log(score, h(convertedSentence.length), convertedSentence);
    score = score * getSentenceLengthScore(convertedSentence.length);
    return score;
  }
  private getWordText(
    word: string,
    wordIndex: number,
    { sentence, punctuation }: any
  ) {
    let result = '';
    if (wordIndex !== 0) {
      if (!Punctuation.is(word)) {
        // 因为换成了inline-block，这里添加的空格已经失效了。
        result += ' ';
      }
    }
    result += word;
    if (wordIndex === sentence.length - 1) {
      result += punctuation;
    }
    return result;
  }
  private getWordStyle(word: string) {
    word = word.toLowerCase();
    const result: any = {};
    if (!Punctuation.is(word)) {
      if (Dict.isCET4(word)) {
        result.backgroundColor = this.backgroundColor.cet4;
      } else if (Dict.isCET6(word)) {
        result.backgroundColor = this.backgroundColor.cet6;
      } else if (Dict.isToefl(word)) {
        result.backgroundColor = this.backgroundColor.toefl;
      } else if (Dict.isGRE(word)) {
        result.backgroundColor = this.backgroundColor.gre;
      }
    } else {
      result.padding = 0;
    }
    return result;
  }
  private exportFileTxt() {
    let data =
      `本文件由【Academic Writing Helper ${
        this.version
      }】于 ${new Date().toLocaleString()} 导出\r\n` +
      `Copyright (C) ${new Date().getFullYear()} | Powered By Frederick Wang\r\n` +
      '----------------------------------------\r\n\r\n';
    for (let i = 0; i < this.importantSentences.length; i++) {
      const s = this.importantSentences[i];
      let sentence = `${i + 1}. `;
      for (let j = 0; j < s.sentence.length; j++) {
        const word = s.sentence[j];
        sentence += this.getWordText(word, j, s);
      }
      data += `${sentence}\r\n`;
      if (i < this.importantSentences.length - 1) {
        data += '\r\n';
      }
    }
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
      text-align: center;
      margin-bottom: 10px;
      padding: 0 5px;
    }
  }
  .tab-sentence {
    p {
      border-bottom: 1px dashed #f56c6c;
      padding-bottom: 0.6em;
    }
  }

  .word-class-indicators {
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;

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
