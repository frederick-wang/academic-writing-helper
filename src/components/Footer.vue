<template>
  <el-footer class="footer">
    <p>English Reading Assistant {{ version }}</p>
    <p>Copyright &copy; {{ year }} Frederick Wang</p>
  </el-footer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Footer extends Vue {
  get version(): string {
    return process.env.VUE_APP_VERSION || ''
  }
  get year(): number {
    return new Date().getFullYear()
  }
}
</script>

<style scoped lang="scss">
.footer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-top: solid 1px #e6e6e6;
  user-select: none;

  p {
    font-size: 0.75em;
  }
}
</style>
