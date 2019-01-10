<template>
  <el-container class="page page-start">
    <Aside />
    <el-main class="page-start-main">
      <router-view />
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Aside from '@/components/start/Aside.vue';

@Component({
  components: {
    Aside
  }
})
export default class Start extends Vue {}
</script>

<style lang="scss">
.page-start {
  position: relative;
  display: flex;
  flex-direction: row-reverse;

  .page-start-main {
    flex: 1;
  }
}
</style>
