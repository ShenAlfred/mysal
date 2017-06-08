<template>
  <div>
    <x-input title="股票代码：" type="number" placeholder="请输入股票代码" v-model="stockData.stockNumber"></x-input>
    <div :show="validateTips.stockCode.valid">{{validateTips.stockCode.msg}}</div>
    <x-input title="波动上限：" type="number" placeholder="请输入" v-model="stockData.upLimit"></x-input>
    <x-input title="波动下限：" type="number" placeholder="请输入" v-model="stockData.downLimit"></x-input>
    <x-switch title="是否提醒：" v-model="stockData.isRemind"></x-switch>
    <div class="fixed-bottom">
      <x-button type="warn" @click.native="save()">保存</x-button>
    </div>
    <div v-transfer-dom>
      <confirm v-model="confirmSaveData.confirmIsShow" :title="confirmSaveData.title" @on-confirm="saveConfirm()">
        <p style="text-align:center;">确定保存吗?</p>
      </confirm>
      <alert v-model="alertSaveData.alertIsShow">
        <p style="text-align:center;">{{ alertSaveData.tipsText }}</p>
      </alert>
    </div>
  </div>
</template>
<style>
  .fixed-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 10px;
    background: #fff;
  }
</style>
<script>
  import { XInput,XSwitch,XButton,Alert,Confirm,TransferDomDirective as TransferDom } from 'vux'
  import Vue from 'vue'
  import { ConfirmPlugin } from 'vux'
  Vue.use(ConfirmPlugin)

  export default{
    data(){
      return{
        validateTips: {
          stockCode: {},
          stockUp: {},
          stockDown: {}
        },
        stockData: {
          stockNumber: '',
          upLimit: '',
          downLimit: '',
          isRemind: true
        },
        confirmSaveData: {
          title: '保存股票',
          confirmIsShow: false,
        },
        alertSaveData: {
          alertIsShow: false,
          tipsText: '保存成功!'
        }
      }
    },
    methods: {
      save () {
        this.confirmSaveData.confirmIsShow = true;
      },
      saveConfirm () {
        var that = this;
      },
      validateStock () {

      }
    },
    directives: {
      TransferDom
    },
    components:{
      XInput,
      XSwitch,
      XButton,
      Confirm,
      Alert
    }
  }
</script>
