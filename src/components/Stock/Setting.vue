<template>
  <div>
    <x-input type="number" placeholder="提醒次数">
      <div slot="label" class="custom-label">提醒次数:</div>
    </x-input>
  </div>
</template>
<style>
</style>
<script>
  import { Loading,XInput,XButton,Alert,Confirm,TransferDomDirective as TransferDom } from 'vux'

  export default{
    data(){
      return{
        msg:'hello vue'
      }
    },
    directives: {
      TransferDom
    },
    components:{
      Loading,
      XInput,
      XButton,
      Alert,
      Confirm
    }
  }
</script>
