<template>
  <el-container class="page page-help">
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
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Help extends Vue {}
</script>

<style lang="scss" scoped>
</style>
