<template>
  <div class="start">
    <el-container>
      <el-header>
        <el-menu
          :default-active="page"
          class="nav-menu"
          mode="horizontal"
          @select="navMenuSelectHandler"
        >
          <el-menu-item index="1">学术英语写作助手</el-menu-item>
          <el-menu-item index="2">使用帮助</el-menu-item>
          <el-menu-item index="3">关于</el-menu-item>
        </el-menu>
      </el-header>
      <el-container
        class="page page-start"
        v-show="page === '1'"
      >
        <el-aside width="200px">
          <el-menu
            :default-active="subPage"
            class="aside-menu"
            @select="asideMenuSelectHandler"
          >
            <el-menu-item index="1">
              <i class="el-icon-document"></i>
              <span slot="title">原始文章</span>
            </el-menu-item>
            <el-menu-item index="2">
              <i class="el-icon-menu"></i>
              <span slot="title">分析结果</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <div
            class="sub-page sub-page-original"
            v-show="subPage === '1'"
          >
            <div style="margin-bottom: 15px;">
              <el-button
                type="primary"
                size="small"
                @click="analyzeText"
              >开始分析</el-button>
              <el-button
                type="danger"
                size="small"
                @click="clearText"
              >清空文本</el-button>
            </div>
            <div style="margin-bottom: 10px;">
              <p style="margin-bottom: 10px;">您可以导入一个文本文件，或者直接在下面的文本框中输入需要分析的文章</p>
              <el-upload
                ref="uploadDocument"
                class="upload-document"
                drag
                action="/"
                :http-request="handleHttpRequest"
                :limit="1"
                :on-success="HandleSuccess"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击导入</em></div>
                <div
                  class="el-upload__tip"
                  slot="tip"
                >注意，只能导入文本文件</div>
              </el-upload>
            </div>
            <el-input
              type="textarea"
              :autosize="{ minRows: 3}"
              placeholder="如果不想导入文件，也可以直接在这里输入需要分析的文章"
              v-model="originalText"
            >
            </el-input>
          </div>
          <div
            class="sub-page sub-page-analysis"
            v-show="subPage === '2'"
          >
            <el-tabs
              v-model="tabName"
              type="card"
            >
              <el-tab-pane
                label="原文"
                name="article"
                class="tab-article"
              >
                <div style="padding-bottom: 20px; margin-bottom: 20px; border-bottom: 1px solid #eee;">
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
                <div style="padding-bottom: 20px; margin-bottom: 20px; border-bottom: 1px solid #eee;">
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
        </el-main>
      </el-container>
      <el-container
        class="page page-help"
        v-show="page === '2'"
      >
        <el-main>
          <div
            class="typo"
            style="padding: 0 20px;"
          >
            <h3>快速上手</h3>
            <p>第一步：复制要分析的文本内容</p>
            <p>第二步：导入一个「文本文件」，或者直接粘贴「原始文章」到到页面的大文本框中</p>
            <p>第三步：点击「开始分析」按钮，快乐使用吧！</p>
            <h3>功能介绍</h3>
            <p>※ 「学术英语写作助手」是一个有趣的软件，它可以自动分析文本内容，标注出其中的分级词汇，用直观的着色方式显示在页面上。</p>
            <p>※ 并且，「学术英语写作助手」还可以自动分析文本中每一句话的价值，并选取文章中价值最高的 20% 句子，用下划线的方式标注出来。</p>
            <p>※ 如果您想专门查看文章中的重点句和词汇，您也可以在分析结果页面点选选项卡，在「原文」、「重点句」、「分级词汇」之间切换。</p>
            <p>※ 在「重点句」选项卡中，您还可以将所有重点句一键导出为 TXT 格式的文本文档，方便之后查阅。</p>
          </div>
        </el-main>
      </el-container>
      <el-container
        class="page page-about"
        v-show="page === '3'"
      >
        <el-main>
          <div
            class="typo"
            style="padding: 0 20px;"
          >
            <h3>关于我</h3>
            <p>王兆基，男，九十年代生人，可能是一个程序员。</p>
            <p>个人博客：https://zhaoji.wang</p>
            <p>Github：https://github.com/frederick-wang</p>
            <p>码云：https://gitee.com/zhaoji</p>
            <p>电子邮箱：zhaoji.wang@scujs.net</p>
            <p>腾讯 QQ：1095875055</p>
            <h3>鸣谢</h3>
            <p>谨在此感激遇尔与卢指导在半夜提供的灵感，以及大壮提供的测试与资料。</p>
            <h3>Bug 反馈与功能提交</h3>
            <p>联系我 QQ 或发邮件都可以，如果关注了 Github 或码云上的 repository，也可以提 issue 或直接发 PR ~</p>
          </div>
        </el-main>
      </el-container>
      <el-footer>
        <p><small>Copyright (C) 2018-{{new Date().getFullYear()}}</small></p>
        <p><small>Powered By Frederick Wang</small></p>
      </el-footer>
    </el-container>
  </div>
</template>

<script lang="ts">
import { ipcRenderer as ipc } from 'electron';
import { Logger } from '@/Tools';
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

const cet4 = importWordsData(require('@/assets/dict/cet4.json'));
const cet6 = importWordsData(require('@/assets/dict/cet6.json'));
const toefl = importWordsData(require('@/assets/dict/toefl.json'));
const gre = importWordsData(require('@/assets/dict/gre.json'));

const sentencePunctuationRegExp = /.+?(;|\.|\?|!|…|\.{3}|$)/;
const wordPunctuationRegExp = /(:|,|"|'|~|`|-|\\|\/|<|>|\{|\}|\[|\]|\+|-|\*|_|\(|\)|&|\^|%|\$|#|@|\||’|…)/g;
const punctuations = new Map([
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
]);

function importWordsData(data: string[]) {
  return new Map(data.map((v: string): [string, boolean] => [v, true]));
}

@Component({
  components: {
    HelloWorld
  }
})
export default class Home extends Vue {
  public name = 'start';
  private version = '0.3.1';
  private page = '1';
  private subPage = '1';
  private tabName = 'article';
  private originalText = '';
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

  get greWords() {
    Logger.log('greWords');
    return this.allWords.filter(v => gre.has(v));
  }
  get toeflWords() {
    Logger.log('toeflWords');
    return this.allWords.filter(v => toefl.has(v));
  }
  get cet6Words() {
    Logger.log('cet6Words');
    return this.allWords.filter(v => cet6.has(v));
  }
  get cet4Words() {
    Logger.log('cet4Words');
    return this.allWords.filter(v => cet4.has(v));
  }
  get allWords() {
    const result: string[] = [];
    for (const para of this.analyzedResult) {
      for (const s of para) {
        for (const w of s.sentence) {
          if (!this.isPunctuation(w) && !result.includes(w)) {
            result.push(w);
          }
        }
      }
    }
    Logger.log('allWords');
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
  get analyzedResult() {
    Logger.log('analyzedResult: Begin');
    Logger.time('analyzedResult');
    if (!this.originalText) {
      Logger.timeEnd('analyzedResult');
      return [];
    }
    const allScores: number[] = [];
    const textFormatted = this.originalText
      // 中文标点转英文标点
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
      // 文本处理
      .replace(/\r/g, '\n')
      .replace(/\n\s+\n/g, '\n\n')
      .replace(/\n{2,}/g, '\n')
      .replace(/^\n/, '');
    const paragraphs = textFormatted.split('\n').map(v => v.trim());
    Logger.log(paragraphs);
    const result = paragraphs.map(paragraph => {
      const splitSentence = (sentence: string) =>
        sentence
          .trim()
          .replace(wordPunctuationRegExp, ' $1 ')
          .replace(/ {2}/, ' ')
          .split(/\s+/);
      const tmp = [];
      while (paragraph.match(sentencePunctuationRegExp)) {
        console.log(paragraph);
        const paraRegExpResult = paragraph.match(sentencePunctuationRegExp);
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
      Logger.log(tmp);
      return tmp;
    });
    allScores.sort((a, b) => b - a);
    this.importanceStandard = allScores[Math.floor(allScores.length * 0.2)];
    Logger.timeEnd('analyzedResult');
    Logger.log('analyzedResult: End');
    return result;
  }
  private exportFileTxt() {
    let data =
      `本文件由【Academic Writing Helper ${
        this.version
      }】于 ${new Date().toLocaleString()} 导出\r\n` +
      'Copyright (C) 2018 | Powered By Frederick Wang\r\n' +
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
  private HandleSuccess(file: any, fileList: any[]) {
    setTimeout((this.$refs.uploadDocument as any).clearFiles, 3000);
  }
  private handleHttpRequest({ file }: { file: any }) {
    return new Promise((resolve, reject) => {
      if (file.type === 'text/plain') {
        // eslint-disable-next-line
        const reader = new FileReader();
        reader.onload = () => {
          const result = (reader.result as string) || '';
          this.originalText = result;
          resolve(result);
        };
        // 以DataURL的形式读取文件:
        reader.readAsText(file);
      } else {
        reject(new Error('无法导入非文本文件！'));
      }
    });
  }
  private asideMenuSelectHandler(key: number) {
    this.subPage = key.toString();
  }
  private navMenuSelectHandler(key: number) {
    this.page = key.toString();
  }
  private analyzeText() {
    this.subPage = '2';
  }
  private clearText() {
    this.originalText = '';
  }
  private getSentenceScore(convertedSentence: any) {
    let score = 0;
    for (let word of convertedSentence) {
      word = word.toLowerCase();
      if (cet4.has(word)) {
        score += 1;
      } else if (cet6.has(word)) {
        score += 2;
      } else if (toefl.has(word)) {
        score += 4;
      } else if (gre.has(word)) {
        score += 8;
      }
    }
    score =
      (score * Math.log(convertedSentence.length)) / convertedSentence.length;
    return score;
  }
  private isPunctuation(word: string) {
    return punctuations.has(word);
  }
  private getWordText(
    word: string,
    wordIndex: number,
    { sentence, punctuation }: any
  ) {
    let result = '';
    if (wordIndex !== 0) {
      if (!this.isPunctuation(word)) {
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
    if (!this.isPunctuation(word)) {
      if (cet4.has(word)) {
        result.backgroundColor = this.backgroundColor.cet4;
      } else if (cet6.has(word)) {
        result.backgroundColor = this.backgroundColor.cet6;
      } else if (toefl.has(word)) {
        result.backgroundColor = this.backgroundColor.toefl;
      } else if (gre.has(word)) {
        result.backgroundColor = this.backgroundColor.gre;
      }
    } else {
      result.padding = 0;
    }
    return result;
  }
}
</script>

<style lang="scss">
.start {
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

  .word-class-tag {
    color: #000000;
    border: 1px solid rgba(0, 0, 0, 0);
    font-weight: bolder;
    margin-right: 5px;

    &:last-child {
      margin-right: 0;
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

  .upload-document {
    > .el-upload {
      width: 100%;

      > .el-upload-dragger {
        width: 100%;
      }
    }
  }
}
</style>
