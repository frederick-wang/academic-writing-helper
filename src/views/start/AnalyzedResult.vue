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
              >{{word}}</span>
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
import { Component, Vue } from 'vue-property-decorator';
import { StartRouter } from '@/router';
import { Logger, Dict, Punctuation } from '@/Tools';

interface SentenceItem {
  score: number;
  sentence: string[];
}

@Component
export default class AnalyzedResult extends Vue {
  private tabName = 'article';

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

    const tidyCRLF = (str: string) =>
      str
        .replace(/\r/g, '\n')
        .replace(/\n\s+\n/g, '\n\n')
        .replace(/\n{2,}/g, '\n')
        .replace(/^\n/, '');

    const splitParagraph = (str: string) =>
      str
        .split('\n')
        .map(v => v.trim())
        .filter(v => v);

    const splitSentence = (str: string) =>
      str
        .trim()
        .split(Punctuation.wordPunctuationRegExp)
        .filter(v => v);

    /**
     * 文本预处理函数
     * @param text 需要预处理的文本
     * @returns 处理好的文本，为一个按照段落分开的 string[]
     */
    const preProcessText = (text: string) =>
      splitParagraph(tidyCRLF(Punctuation.normalizeText(text)));

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
    return this.analyzedResult.reduce(
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
    );
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
    const sentenceWords = convertedSentence.filter(
      v => !v.match(Punctuation.wordPunctuationRegExp)
    );

    // const f = (v: number) => Math.log(v) / v;
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
    if (word.match(Punctuation.wordPunctuationRegExp)) {
      return {
        padding: '0'
      };
    }
    const getStyle = (w: string) => ({
      backgroundColor: Dict.getWordBackgroundColor(w)
    });
    return getStyle(word);
  }
  private exportFileTxt() {
    let data =
      `本文件由【Academic Writing Helper ${
        this.version
      }】于 ${new Date().toLocaleString()} 导出\r\n` +
      `Copyright (C) ${new Date().getFullYear()} | Powered By Frederick Wang\r\n` +
      '----------------------------------------\r\n\r\n';
    /**
     * Time: 2019-1-6 06:07:40
     * TODO: Need to replace the for-loop here with reduce() methods.
     */
    for (let i = 0; i < this.importantSentences.length; i++) {
      const s = this.importantSentences[i];
      const sentence = `${i + 1}. ${s.sentence.join('')}`;
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
      white-space: pre;
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
