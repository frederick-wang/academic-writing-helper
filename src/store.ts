import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export interface State {
  originalText: string
  setting: Setting
  key: number
}

export interface WordWise {
  cet4: boolean
  cet6: boolean
  toefl: boolean
  gre: boolean
}

export interface Setting {
  wordWise: WordWise
}

export default new Vuex.Store<State>({
  state: {
    originalText: '',
    setting: {
      wordWise: {
        cet4: false,
        cet6: true,
        toefl: true,
        gre: true
      }
    },
    key: 1
  },
  mutations: {
    setOriginalText(state, payload) {
      state.originalText = payload
    },
    setSettingWordWise(state, payload) {
      state.setting.wordWise = payload
    }
  },
  actions: {}
})
