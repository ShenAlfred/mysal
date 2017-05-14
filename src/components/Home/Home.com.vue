<template>
  <transition name="fade">
    <div>
      <h1 class="test">{{ msg }}</h1>
      <i class="fa fa-camera-retro"></i>
    </div>
  </transition>
</template>
<style>
</style>
<script>
  export default{
    data(){
      return{
        msg:'hello vue'
      }
    },
    components:{},
    created () {
      console.log(this.$store)
    }
  }
</script>
