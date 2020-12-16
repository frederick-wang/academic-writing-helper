import Vue from 'vue'
import VueRouter from 'vue-router'
// 首页
import Start from './views/Start.vue'
import AnalyzedResult from './views/start/AnalyzedResult.vue'
import OriginalArticle from './views/start/OriginalArticle.vue'
import News from './views/start/News.vue'
// 设置
import Setting from './views/Setting.vue'
// 帮助
import Help from './views/Help.vue'
// 关于
import About from './views/About.vue'

Vue.use(VueRouter)

export const StartRouter = {
  ORIGINAL_ARTICLE: `original_article`,
  ANALYZED_RESULT: `analyzed_result`,
  NEWS: 'news'
}

export const Router = {
  START: 'start',
  SETTING: 'setting',
  HELP: 'help',
  ABOUT: 'about',
  start: StartRouter
}

export default new VueRouter({
  routes: [
    {
      path: `/`,
      redirect: `/${Router.START}`
    },
    {
      path: `/${Router.START}`,
      component: Start,
      children: [
        {
          path: '',
          redirect: StartRouter.ORIGINAL_ARTICLE
        },
        {
          path: StartRouter.ORIGINAL_ARTICLE,
          name: StartRouter.ORIGINAL_ARTICLE,
          component: OriginalArticle
        },
        {
          path: StartRouter.NEWS,
          name: StartRouter.NEWS,
          component: News
        },
        {
          path: StartRouter.ANALYZED_RESULT,
          name: StartRouter.ANALYZED_RESULT,
          component: AnalyzedResult
        }
      ]
    },
    {
      path: `/${Router.SETTING}`,
      name: Router.SETTING,
      component: Setting
    },
    {
      path: `/${Router.HELP}`,
      name: Router.HELP,
      component: Help
    },
    {
      path: `/${Router.ABOUT}`,
      name: Router.ABOUT,
      component: About
    }
  ]
})
