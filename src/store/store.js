/**
 * Created by admin on 2017/6/28.
 */
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
  user: {},
  count: 1
};

const mutations = {
  increment (state) {
    state.count++
  },
  setUser (state, obj) {
    state.user = obj
  }
};

const actions = {
  incrementAsync (context) {
    setTimeout(function() {
      context.commit('increment')
    }, 5000);
  },
  requestUsers (context, obj) {
      setTimeout(function() {
        context.commit('setUser', obj);
      }, 3000);
  }
};

const store = new Vuex.Store({
  state,
  mutations,
  actions
})

export default store;
