<template>
  <div class="subpage subpage-original-article">
    <div class="action-bar">
      <el-button type="primary" size="small" @click="analyzeText"
        >开始分析</el-button
      >
      <el-button type="danger" size="small" @click="clearText"
        >清空文本</el-button
      >
    </div>
    <div class="import-external-file">
      <p class="tip">
        您可以导入一个文本文件，或者直接在下面的文本框中输入需要分析的文章
      </p>
      <el-upload
        ref="uploadDocument"
        class="upload-document"
        drag
        action="/"
        :http-request="mockHttpRequest"
        :limit="1"
        :on-success="onFileUploadSuccess"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击导入</em></div>
        <div class="el-upload__tip" slot="tip">注意，只能导入文本文件</div>
      </el-upload>
    </div>
    <el-input
      type="textarea"
      :autosize="{ minRows: 3 }"
      placeholder="如果不想导入文件，也可以直接在这里输入需要分析的文章"
      v-model="originalText"
    >
    </el-input>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { StartRouter } from '@/router'

@Component({
  beforeRouteEnter(to, from, next) {
    next((vm) => (vm as OriginalArticle).clearText())
  }
})
export default class OriginalArticle extends Vue {
  private originalText = ''

  @Watch('originalText')
  private originalTextWatcher() {
    this.$store.commit('setOriginalText', this.originalText)
  }

  private analyzeText() {
    if (this.originalText) {
      this.$router.replace(StartRouter.ANALYZED_RESULT)
    } else {
      this.$message.error('抱歉，您还没有输入内容！')
    }
  }

  /**
   * Empty the textarea.
   */
  private clearText() {
    this.originalText = ''
  }

  /**
   * After the file contents have been read successfully, clear the list of files.
   */
  private onFileUploadSuccess() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uploadDocument: any = this.$refs.uploadDocument
    setTimeout(uploadDocument.clearFiles, 3000)
  }

  /**
   * Overrides the default upload behavior and reads the contents of the file directly locally.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mockHttpRequest({ file }: { file: any }) {
    return new Promise((resolve, reject) => {
      if (file.type === 'text/plain') {
        // eslint-disable-next-line
        const reader = new FileReader()
        reader.onload = () => {
          const result = (reader.result as string) || ''
          this.originalText = result
          resolve(result)
        }
        // 以DataURL的形式读取文件:
        reader.readAsText(file)
      } else {
        reject(new Error('无法导入非文本文件！'))
      }
    })
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
