<template>
  <div id="app">
      <router-view></router-view>
  </div>
</template>

<script>
import config from './config'
import api from './api'
import store from './store'

export default {
  name: 'app',
  beforeCreate () {
    const that = this;
    const query = {
      ticket: this.$route.query.ticket
    }
    this.$ajax.get(config.baseUrl + "/stock/test", {
      params: {
        ticket: "5c5045ca67d17a392861b2beb31286ab"
      }
    }).then(function(result) {
      if(result.data.code == 0) {
        that.$ajax.get(config.baseUrl + api.getUserInfo, {
        }).then(function(result) {
          if(result.data.code === "0") {
            store.state.userInfo = result.data.data
          }
        });
      }
    });
  }
}
</script>

<style>
@import 'assets/style/myanimate.scss';
@import 'assets/style/common.css';
@import 'assets/FontAwesome-4.7.0/css/font-awesome.min.css';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background: #fff;
  height: 100%;
}
body{
  margin: 0;
}
html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.load-more {
  padding: 15px 0;
  text-align: center;
}
</style>
