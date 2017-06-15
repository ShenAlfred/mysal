<template>
  <div>
    <popup-picker title="提醒次数" :data=notifyNumber v-model="notifyValue"></popup-picker>
  </div>
</template>
<style>
</style>
<script>
  import { PopupPicker, Cell, Picker } from 'vux'

  export default{
    data(){
      return{
        notifyValue: [1],
        notifyNumber: [[1, 2, 3, 4, 5]]
      }
    },
    components:{
       PopupPicker,
       Cell,
       Picker
    }
  }
</script>
