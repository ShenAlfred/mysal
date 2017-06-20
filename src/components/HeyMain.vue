<template>
</template>
<style>
</style>
<script>
    import api from '../api'
    import config from '../config'
    import store from '../store'

    export default{
        data(){
            return {

            }
        },
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
                    that.$router.push({path: 'stock'});
                  }
                });
              }
            });
          }else {
            this.$ajax.get(config.baseUrl + api.getUserInfo, {
            }).then(function(result) {
              if(result.data.code === "0") {
                store.state.userInfo = result.data.data;
                that.$router.push({path: 'stock'});
              }
            });
          }
        },
        components: {}
    }
</script>
