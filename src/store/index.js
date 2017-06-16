/**
 * Created by shenalfred on 17/5/14.
 */
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userInfo: {}                //存储用户信息方便各模块调用
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

export default store
