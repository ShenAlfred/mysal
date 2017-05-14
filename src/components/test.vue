<template>
  <div>
    <h1>子组件:</h1>
    <span>{{ number }}</span>
  </div>
</template>
<style>

</style>
<script>
    export default {
      components: {},
      computed: {
        number () {
          return this.$store.state.count
        }
      }
    }
</script>
