<template>
  <el-header class="nav">
    <el-menu
      :default-active="router"
      class="nav-menu"
      mode="horizontal"
      @select="navMenuSelectHandler"
    >
      <el-menu-item :index="Router.START">学术英语写作助手</el-menu-item>
      <el-menu-item :index="Router.SETTINGS">设置</el-menu-item>
      <el-menu-item :index="Router.HELP">使用帮助</el-menu-item>
      <el-menu-item :index="Router.ABOUT">关于</el-menu-item>
    </el-menu>
  </el-header>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Router } from '@/router';
import { Logger } from '@/Utils';

@Component
export default class Nav extends Vue {
  get router() {
    const regExpResult = this.$route.path.match(/^\/(\S+?)(?:\/|$)/);
    return regExpResult ? regExpResult[1] : Router.START;
  }

  get Router() {
    return Router;
  }

  private navMenuSelectHandler(key: string) {
    this.$router.replace(`/${key}`);
  }
}
</script>

<style lang="scss" scoped>
.nav {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 999;
  user-select: none;

  .nav-menu {
    a {
      text-decoration: none;
    }
  }
}
</style>
