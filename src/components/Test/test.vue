<template>
  <div>
    <x-button @click.native="increment()">click</x-button>
    <div>{{count}}</div>
    <router-link to="/">跳转到stock</router-link>
    <x-button @click.native="dispatch()">dispatch</x-button>
  </div>
</template>
<style>
</style>
<script>
    import { XButton } from 'vux'
    export default{
        data(){
            return {

            }
        },
      computed: {
        count() {
            return this.$store.state.count
        }
      },
      methods: {
        increment () {
          this.$store.commit('increment');
        },
        dispatch () {
          this.$store.dispatch('incrementAsync');
        }
      },
      mounted () {
        this.$store.dispatch('requestUsers', {
          name: "Alfred",
          age: 24
        })
      },
        components: {
          XButton
        }
    }
</script>
