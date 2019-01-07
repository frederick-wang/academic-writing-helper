<template>
  <div class="subpage subpage-original-article">
    <div class="action-bar">
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
    <div class="import-external-file">
      <p class="tip">您可以导入一个文本文件，或者直接在下面的文本框中输入需要分析的文章</p>
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
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { StartRouter } from '@/router';
import { Logger, Dict, Punctuation } from '@/Tools';
import { NavigationGuard, Route } from 'vue-router/types/router';

@Component({
  beforeRouteEnter(to, from, next) {
    next(vm => vm.$store.commit('setOriginalText', ''));
  }
})
export default class OriginalArticle extends Vue {
  private originalText = '';

  @Watch('originalText')
  private originalTextWatcher() {
    this.$store.commit('setOriginalText', this.originalText);
  }
  private analyzeText() {
    this.$router.replace(StartRouter.ANALYZED_RESULT);
  }
  private clearText() {
    this.originalText = '';
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
}
</script>

<style lang="scss">
.subpage-original-article {
  .action-bar {
    margin-bottom: 15px;
    user-select: none;
  }

  .import-external-file {
    margin-bottom: 10px;
    user-select: none;

    .tip {
      margin-bottom: 10px;
    }

    .upload-document {
      // 这里的 el-upload 和 el-upload-dragger 都是组件自己渲染的，所以这个页面的样式不能加 scoped.
      > .el-upload {
        width: 100%;

        > .el-upload-dragger {
          width: 100%;
        }
      }
    }
  }
}
</style>
