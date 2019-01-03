<template>
  <el-container class="page page-start">
    <Aside />
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Logger } from '@/Tools';
import Aside from '@/components/start/Aside.vue';

@Component({
  components: {
    Aside
  }
})
export default class Start extends Vue {
  get version() {
    return this.$store.state.basic.version;
  }
}
</script>

<style lang="scss">
</style>
