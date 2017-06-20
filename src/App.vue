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
  name: 'app'
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
