<template>
  <div>
    <x-input type="number" placeholder="请输入股票代码" v-model="stockData.stockNumber">
      <div slot="label" class="custom-label"><b>*</b>股票代码:</div>
    </x-input>
    <x-input type="number" placeholder="请输入" v-model="stockData.upLimit">
      <div slot="label" class="custom-label"><b>*</b>波动上限:</div>
    </x-input>
    <x-input type="number" placeholder="请输入" v-model="stockData.downLimit">
      <div slot="label" class="custom-label"><b>*</b>波动下限:</div>
    </x-input>
    <x-switch title="&nbsp;&nbsp;是否提醒:" v-model="stockData.isRemind"></x-switch>
    <div class="fixed-bottom">
      <x-button type="warn" @click.native="save()">保存</x-button>
    </div>

    <div v-transfer-dom>
      <confirm v-model="confirmSaveData.confirmIsShow" :title="confirmSaveData.title" @on-confirm="saveConfirm()">
        <p style="text-align:center;">确定保存吗?</p>
      </confirm>
      <loading v-model="showLoading"></loading>
    </div>
    <toast v-bind:tip-text="tipsText" v-model="showTips" close-time="5"></toast>
  </div>
</template>
<style>
  .custom-label {
    padding-right: 15px;
  }
  .custom-label b {
    color: #ff5454;
    padding-right: 2px;
  }
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
  import { Loading,XInput,XSwitch,XButton,Alert,Confirm,TransferDomDirective as TransferDom } from 'vux'
  import Toast from '@/components/custom/toast.com'

  export default{
    data(){
      return{
        showTips: false,
        tipsText: "",
        showLoading: false,
        stockData: {
          stockNumber: '',
          upLimit: '',
          downLimit: '',
          isRemind: true
        },
        confirmSaveData: {
          title: '保存股票',
          confirmIsShow: false
        }
      }
    },
    methods: {
      save () {
        if(this.stockData.stockNumber == "") {
          this.tipsText = "股票代码不能为空!"
          this.showTips = true;
        }else if(this.stockData.upLimit == "") {
          this.tipsText = "波动上限不能为空!"
          this.showTips = true;
        }else if(this.stockData.downLimit == "") {
          this.tipsText = "波动下限不能为空!"
          this.showTips = true;
        }else {
          this.confirmSaveData.confirmIsShow = true;
        }
      },
      saveConfirm () {
        var that = this;
        this.showLoading = true;
        setTimeout(() => {
          this.showLoading = false;
          this.tipsText = "保存成功!"
          this.showTips = true;
        }, 5000);
      }
    },
    mounted () {
      console.log(this.$route.query.stockId)
    },
    directives: {
      TransferDom
    },
    components:{
      XInput,
      XSwitch,
      XButton,
      Confirm,
      Alert,
      Toast,
      Loading
    }
  }
</script>
