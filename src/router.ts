import Vue from 'vue';
import VueRouter from 'vue-router';
import Start from './views/Start.vue';
import Help from './views/Help.vue';
import About from './views/About.vue';
import AnalyzedResult from './views/start/AnalyzedResult.vue';
import OriginalArticle from './views/start/OriginalArticle.vue';

Vue.use(VueRouter);

export const StartRouter = {
  ORIGINAL_ARTICLE: `original_article`,
  ANALYZED_RESULT: `analyzed_result`
};

export const Router = {
  START: 'start',
  HELP: 'help',
  ABOUT: 'about',
  start: StartRouter
};

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
          path: StartRouter.ANALYZED_RESULT,
          name: StartRouter.ANALYZED_RESULT,
          component: AnalyzedResult
        }
      ]
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
  ],
});
