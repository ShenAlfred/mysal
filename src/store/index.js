/**
 * Created by shenalfred on 17/5/14.
 */
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    downLimitArr: [],
    upLimitArr: [],
    countDownLimitNumber: 0,
    countUpLimitNumber: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

export default store
