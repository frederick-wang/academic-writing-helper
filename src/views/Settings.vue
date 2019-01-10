<template>
  <el-container class="page page-settings">
    <el-main>
      <div
        class="typo"
        style="padding: 0 20px;"
      >
        <h3>生词提示</h3>
        <el-row>
          <p class="no-indent">请在下面选择阅读时「生词提示」的显示级别</p>
          <el-col
            :xs="24"
            :sm="12"
            :lg="8"
            class="option"
          >
            <span class="pre-switch">四级单词</span>
            <el-switch
              v-model="wordWise.cet4"
              @change="onWordWiseChange"
              active-text="显示"
              inactive-text="不显示"
            >
            </el-switch>
          </el-col>
          <el-col
            :xs="24"
            :sm="12"
            :lg="8"
            class="option"
          >
            <span class="pre-switch">六级单词</span>
            <el-switch
              v-model="wordWise.cet6"
              @change="onWordWiseChange"
              active-text="显示"
              inactive-text="不显示"
            >
            </el-switch>
          </el-col>
          <el-col
            :xs="24"
            :sm="12"
            :lg="8"
            class="option"
          >
            <span class="pre-switch">托福单词</span>
            <el-switch
              v-model="wordWise.toefl"
              @change="onWordWiseChange"
              active-text="显示"
              inactive-text="不显示"
            >
            </el-switch>
          </el-col>
          <el-col
            :xs="24"
            :sm="12"
            :lg="8"
            class="option"
          >
            <span class="pre-switch">GRE 单词</span>
            <el-switch
              v-model="wordWise.gre"
              @change="onWordWiseChange"
              active-text="显示"
              inactive-text="不显示"
            >
            </el-switch>
          </el-col>
        </el-row>
      </div>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue} from 'vue-property-decorator';
import { Logger } from '@/Tools';

@Component
export default class Settings extends Vue {
  get wordWise() {
    return this.$store.state.settings.wordWise;
  }

  private onWordWiseChange() {
    this.$store.commit('setSettingWordWise', this.wordWise);
  }
}
</script>

<style lang="scss" scoped>
.page-settings {
  .option {
    margin-bottom: 20px;

    .pre-switch {
      vertical-align: middle;
      font-weight: bolder;
      margin-right: 20px;
    }
  }
}
</style>
