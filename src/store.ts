import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    originalText: ''
  },
  mutations: {
    setOriginalText(state, payload) {
      state.originalText = payload;
    }
  },
  actions: {

  },
});
