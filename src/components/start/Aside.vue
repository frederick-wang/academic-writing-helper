<template>
  <el-aside
    width="200px"
    class="aside"
  >
    <el-menu
      :default-active="router"
      class="aside-menu"
      @select="asideMenuSelectHandler"
    >
      <el-menu-item :index="StartRouter.ORIGINAL_ARTICLE">
        <i class="el-icon-document"></i>
        <span slot="title">原始文章</span>
      </el-menu-item>
      <el-menu-item :index="StartRouter.ANALYZED_RESULT">
        <i class="el-icon-menu"></i>
        <span slot="title">分析结果</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Router, StartRouter } from '@/router';
import { Logger } from '@/Tools';

@Component
export default class Aside extends Vue {
  get router() {
    const regExpResult = this.$route.path.match(
      new RegExp(`^/${Router.START}/(\\S+?)(?:/|$)`)
    );
    return regExpResult ? regExpResult[1] : StartRouter.ORIGINAL_ARTICLE;
  }

  get StartRouter() {
    return StartRouter;
  }

  private asideMenuSelectHandler(key: string) {
    this.$router.replace(`${key}`);
  }
}
</script>

<style lang="scss" scoped>
.aside {
  position: relative;
  border-right: solid 1px #e6e6e6;
  user-select: none;

  > .aside-menu {
    position: fixed;
    width: inherit;
    height: inherit;

    a {
      text-decoration: none;
    }
  }
}
</style>
