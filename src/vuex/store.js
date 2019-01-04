import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    article_list: [],
    config: {
      list_scroll: { x: 0, y: 0 }
    }
  },
  mutations: {
    setArticleList (state, data) {
      state.article_list = data
    },
    setListScroll(state, data) {
      state.config.list_scroll = data
    }
  }
})

export default store
