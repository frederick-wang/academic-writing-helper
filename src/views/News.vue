<template>
  <el-container class="page page-news">
    <el-main>
      <el-carousel :interval="4000" type="card" trigger="click" height="160px">
        <el-carousel-item>
          <h3 class="pic1" @click="onClick1"></h3>
        </el-carousel-item>
        <el-carousel-item>
          <h3 class="pic2" @click="onClick2"></h3>
        </el-carousel-item>
        <el-carousel-item>
          <h3 class="pic3" @click="onClick3"></h3>
        </el-carousel-item>
        <el-carousel-item>
          <h3 class="pic4" @click="onClick4"></h3>
        </el-carousel-item>
      </el-carousel>
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item
          title="Biden sharpens contrast with Trump: 'I won't traffic in fear and division'"
          name="1"
        >
          <div>
            In a speech in Philadelphia, the presumptive Democratic 2020
            presidential nominee addressed systemic racism and empathized with
            those who are protesting across the nation in the wake of the police
            killing of George Floyd in Minnesota in ways Trump has not.
          </div>
          <div>
            By Eric Bradner, CNN Updated 1755 GMT (0155 HKT) June 2, 2020
          </div>
        </el-collapse-item>
        <el-collapse-item
          title="Trump responds to protests with a strongman act"
          name="2"
        >
          <div>
            Trump on Monday turned security forces on peaceful protesters in
            front of the White House, as tear gas and rubber bullets flew,
            before declaring himself the "law and order" President. Then, in one
            of the most bizarre moments in modern presidential history, he
            strode across the park to stand in front of an iconic church holding
            a Bible aloft in a striking photo op.；
          </div>
          <div>
            Analysis by Stephen Collinson, CNN Updated 1231 GMT (2031 HKT) June
            2, 2020
          </div>
        </el-collapse-item>
        <el-collapse-item
          title="Restaurants restart, revamp business models"
          name="3"
        >
          <div>
            Many of Japan’s bars and restaurants are reopening after weeks of
            closure. Since the government lifted the nationwide state of
            emergency to curb the spread of the coronavirus, the Tokyo
            Metropolitan Government has begun withdrawing requests for
            businesses to stay closed. They’ve given the green light for
            drinking and dining establishments to stay open until 10 p.m. But
            ‘back in business’ doesn’t mean business as usual.
          </div>
        </el-collapse-item>
        <el-collapse-item
          title="Coronavirus complicates preparation for typhoon season"
          name="4"
        >
          <div>
            Authorities across Japan are bracing for the summer typhoon season,
            and this year there’s a challenge they’ve never had to consider
            before: how to offer emergency shelter without risking an explosion
            of coronavirus cases.
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-main>
  </el-container>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { StartRouter } from '@/router'

@Component
export default class News extends Vue {
  onClick1(): void {
    this.$store.commit(
      'setOriginalText',
      "In a speech in Philadelphia, the presumptive Democratic 2020 presidential nominee addressed systemic racism and empathized with those who are protesting across the nation in the wake of the police killing of George Floyd in Minnesota in ways Trump has not.\nHis remarks offered a striking contrast to Trump that came about 16 hours after peaceful protesters in a park outside the White House were hit with tear gas so that Trump could cross the park and visit St. John's Church for a photo opportunity -- a move that the Episcopal bishop that oversees the church later condemned.\n\"I won't traffic in fear and division. I won't fan the flames of hate. I'll seek to heal the racial wounds that have long plagued our country, not use them for political gain. I'll do my job and I'll take responsibility -- I won't blame others,\" Biden said."
    )
    this.$router.replace('/')
    this.$router.replace(StartRouter.ANALYZED_RESULT)
  }
  onClick2(): void {
    this.$store.commit(
      'setOriginalText',
      "Trump on Monday turned security forces on peaceful protesters in front of the White House, as tear gas and rubber bullets flew. Then, in one of the most bizarre moments in modern presidential history, he strode across the park to stand in front of an iconic church holding a Bible aloft in a striking photo op. \nIt was a moment of vanity and bravado -- orchestrated for the cameras and transparently political -- as Trump struggles to cope with protests sweeping the country after the killing of George Floyd and tries to cover up his botched leadership during the coronavirus pandemic. Overnight, the White House's official Twitter account released a triumphant video of the moment set to music but omitting any signs of the mayhem unleashed on the protesters.\nTrump appeared to be trying to project strength at a moment when his presidency seems feckless and as the nation spins out of control. If it occurred abroad and not in the White House, Americans might perceive a ridiculous self-deluding act of a wanna-be strongman."
    )
    this.$router.replace('/')
    this.$router.replace(StartRouter.ANALYZED_RESULT)
  }
  onClick3(): void {
    this.$store.commit(
      'setOriginalText',
      'Authorities across Japan are bracing for the summer typhoon season, and this year there’s a challenge they’ve never had to consider before: how to offer emergency shelter without risking an explosion of coronavirus cases.\nIn March, heavy rains sparked flooding in Shibecha Town, Hokkaido, and officials were forced to issue an evacuation order to residents. It couldn’t have come at a worse time for a community already in the grip of the coronavirus outbreak.\nHokkaido’s Governor had already declared a state of emer-gency over the outbreak, so when people needed to flee their homes, Shibecha officials had to improvise.\nAt a gymnasium that was being used as a shelter, the offi-cials marked two-meter intervals on the floor with tape and asked evacuees to maintain the distance from each other at all times.\nIto Masaaki, who oversaw the operation, said they were lucky that only a small number of people turned up, and no-body was infected. But he says the experience was a wakeup call that revealed the challenges ahead.“I realized that just installing normal shelters won’t be enoughto prevent the spread of infections.”'
    )
    this.$router.replace('/')
    this.$router.replace(StartRouter.ANALYZED_RESULT)
  }
  onClick4(): void {
    this.$store.commit(
      'setOriginalText',
      'Many of Japan’s bars and restaurants are reopening after weeks of closure. Since the government lifted the nationwide state of emergency to curb the spread of the coronavirus, the Tokyo Metropolitan Government has begun withdrawing requests for businesses to stay closed. They’ve given the green light for drinking and dining establishments to stay open until 10 p.m. But ‘back in business’ doesn’t mean business as usual.\nThe Kichiri restaurant in Tokyo’s Shinjuku district was closed for more than a month. It began serving again on May 14, but managers have introduced a raft of changes in an effort to reduce contact between staff and customers by 80%.\nBefore the coronavirus outbreak, staff members would welcome customers at the entrance and usher them to a table. Now, greetings are conducted through a monitor and guests find their own way using a printed floor map.'
    )
    this.$router.replace('/')
    this.$router.replace(StartRouter.ANALYZED_RESULT)
  }
}
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
