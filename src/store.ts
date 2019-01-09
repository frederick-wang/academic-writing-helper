import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    originalText: '',
    settings: {
      wordWise: {
        cet4: false,
        cet6: true,
        toefl: true,
        gre: true
      }
    }
  },
  mutations: {
    setOriginalText(state, payload) {
      state.originalText = payload;
    },
    setSettingWordWise(state, payload) {
      state.settings.wordWise = payload;
    }
  },
  actions: {

  },
});
