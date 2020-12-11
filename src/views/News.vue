<template>
  <el-container class="page page-news">
    <el-main> </el-main>
  </el-container>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class News extends Vue {}
</script>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 0px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.pic1 {
  width: 100%;
  height: 100%;
  background: url('../../pic/11.jpg') center center/100% 100%;
}
.pic2 {
  width: 100%;
  height: 100%;
  background: url('../../pic/22.jpg') center center/100% 100%;
}
.pic3 {
  width: 100%;
  height: 100%;
  background: url('../../pic/33.jpeg') center center/100% 100%;
}
.pic4 {
  width: 100%;
  height: 100%;
  background: url('../../pic/44.jpeg') center center/100% 100%;
}
</style>
