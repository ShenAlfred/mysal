<template>
  <div id="app">
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import config from './config'
import api from './api'
import store from './store'

export default {
  name: 'app',
  created () {
    const that = this;
    const query = {
      ticket: this.$route.query.ticket
    }
    if(config.isDevEnv) {
      this.$ajax.get(config.baseUrl + "/stock/test", {
        params: {
          ticket: query.ticket
        }
      }).then(function(result) {
        if(result.data.code == 0) {
          that.$ajax.get(config.baseUrl + api.getUserInfo, {
          }).then(function(result) {
            if(result.data.code === "0") {
              store.state.userInfo = result.data.data;
            }
          });
        }
      });
    }else {
      this.$ajax.get(config.baseUrl + api.getUserInfo, {
      }).then(function(result) {
        if(result.data.code === "0") {
          store.state.userInfo = result.data.data;
        }
      });
    }
  }
}
</script>

<style>
@import 'assets/style/myanimate.scss';
@import 'assets/style/common.css';
@import 'assets/FontAwesome-4.7.0/css/font-awesome.min.css';

#app {
  color: #2c3e50;
  background: #fff;
  height: 100%;
}
.load-more {
  padding: 15px 0;
  text-align: center;
}
</style>
