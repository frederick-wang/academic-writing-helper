<template>
  <el-container class="page page-about">
    <el-main>
      <div class="typo" style="padding: 0 20px">
        <h3>关于我们</h3>
        <p>开发团队： 王兆基 张楠 龙雁翎 王秋雨</p>
        <p>负责人： 王兆基，男，九十年代生人，可能是一个程序员。</p>
        <p>个人博客：<a href="https://zhaoji.wang">https://zhaoji.wang</a></p>
        <p>
          Github：<a href="https://github.com/frederick-wang"
            >https://github.com/frederick-wang</a
          >
        </p>
        <p>
          码云：<a href="https://gitee.com/frederick-wang"
            >https://gitee.com/frederick-wang</a
          >
        </p>
        <p>
          电子邮箱：<a href="mailto:zhaoji.wang@scujs.net"
            >zhaoji.wang@scujs.net</a
          >
        </p>
        <p>
          腾讯 QQ：<a
            href="https://wpa.qq.com/msgrd?v=3&uin=1095875055&site=qq&menu=yes"
            >1095875055</a
          >
        </p>
        <h3>鸣谢</h3>
        <p>谨在此感谢遇尔与卢指导在半夜提供的灵感，以及大壮提供的测试资料。</p>
        <h3>Bug 反馈与功能提交</h3>
        <p>
          联系我 QQ 或发邮件都可以，如果关注了 Github 或码云上的 repo，也可以提
          issue 或直接发 PR ~
        </p>
      </div>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { shell } from 'electron'
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class About extends Vue {
  private mounted() {
    const $links = [...document.querySelectorAll('a[href]')]
    for (const $link of $links) {
      const url = $link.getAttribute('href') || 'about:blank'
      $link.addEventListener('click', (e) => {
        e.preventDefault()
        shell.openExternal(url)
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
