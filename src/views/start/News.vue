<template>
  <div class="subpage subpage-news">
    <div class="news-list" v-for="(v, i) in newsList" :key="i">
      <div class="news-item-wrapper">
        <div class="news-item" @click="openNews(v.content)">
          <div class="left">
            <div class="news-img">
              <img :src="v.imgSrc" :alt="v.title" />
            </div>
          </div>
          <div class="right">
            <div class="news-title">
              {{ v.title }}
            </div>
            <div class="news-time">
              <el-tag size="mini">{{ v.time }}</el-tag>
              <el-tag type="success" size="mini" style="margin-left: 5px">
                {{ v.content.split(' ').length }} 词
              </el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ipcRenderer as ipc } from 'electron'
import { StartRouter } from '@/router'

interface NewsItem {
  href: string
  title: string
  time: string
  imgSrc: string
  content: string
}

@Component({})
export default class News extends Vue {
  private newsList: NewsItem[] = []

  async created(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      text: '加载新闻列表中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    ipc.once(
      'news-list',
      (
        event: unknown,
        { error, newsList }: { error: Error; newsList: NewsItem[] }
      ) => {
        if (error) {
          this.$message.error(error.message)
        } else {
          this.newsList = newsList
          loading.close()
          this.$message.success('加载新闻列表成功')
          console.log(this.newsList)
        }
      }
    )
    ipc.send('get-news-list')
  }

  private openNews(content: string) {
    this.$store.commit('setOriginalText', content)
    this.$router.replace(StartRouter.ANALYZED_RESULT)
  }
}
</script>

<style lang="scss" scoped>
.subpage-news {
  .news-list {
    .news-item-wrapper {
      padding: 20px;
      border-bottom: 1px solid #dcdfe6;
      &:last-child {
        border-bottom: none;
      }

      .news-item {
        display: flex;
        cursor: pointer;

        .left {
          flex: 1;
          display: flex;
          align-items: center;
          height: 100%;

          .news-img {
            width: 100%;
            padding: 5px 0;

            img {
              width: 100%;
            }
          }
        }

        .right {
          flex: 3;
          padding: 0 20px;
          height: 100%;

          .news-title {
            font-size: 1.25em;
            line-height: 1.5em;
            margin-bottom: 5px;
          }

          .news-time {
            font-size: 0.75em;
          }
        }
      }
    }
  }
}
</style>
