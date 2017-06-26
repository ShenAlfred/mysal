<template>
    <div v-h5-title="$route.meta.title">
      <div class="stock-code">
        <x-input type="text" placeholder="请输入股票代码" v-model="stockData.stockNumber" :show-clear="false"
                 :debounce="500" :disabled="isEdit"
                 @on-change="getStockList(stockData.stockNumber)" @on-focus="stockFocus">
          <div slot="label" class="custom-label"><b>*</b>股票代码:</div>
        </x-input>
        <div class="stock-list">
          <div class="ac loading-text" v-show="!isGetData && isStartSearch && !isSelected">
            <inline-loading></inline-loading><span>加载中...</span>
          </div>
          <div v-show="searchStocks.length && isGetData">
            <div class="stock-tips">请选择一个股票:</div>
            <div class="stock-item" v-for="(stock, $index) in searchStocks">
              <a href="javascript:;" @click="selectStock(stock.code, stock.corpId, stock.market)">
                {{stock.name}}({{stock.code}})
              </a>
            </div>
          </div>
          <div v-show="searchStocks.length == 0 && stockData.stockNumber != '' && !isSelected && isGetData ">
            <div class="stock-undata">
              没有你要查询的股票~~~
            </div>
          </div>
        </div>
      </div>
      <x-input type="text" placeholder="请输入" v-model="stockData.upLimit">
        <div slot="label" class="custom-label">&nbsp;&nbsp;波动上限:</div>
        <span slot="right" class="coin_unit">{{unit}}</span>
      </x-input>
      <x-input type="text" placeholder="请输入" v-model="stockData.downLimit">
        <div slot="label" class="custom-label">&nbsp;&nbsp;波动下限:</div>
        <span slot="right" class="coin_unit">{{unit}}</span>
      </x-input>
      <x-switch title="&nbsp;&nbsp;是否提醒:" v-model="stockData.isRemind"></x-switch>
      <div class="fixed-bottom">
        <x-button type="warn" @click.native="save()">保存</x-button>
      </div>

      <div v-transfer-dom>
        <confirm v-model="confirmSaveData.confirmIsShow" :title="confirmSaveData.title" @on-confirm="saveConfirm()">
          <p style="text-align:center;">确定保存吗?</p>
        </confirm>
        <loading v-model="showLoading" :text="loadText"></loading>
      </div>
      <toast v-bind:tip-text="tipsText" v-model="showTips" close-time="5"></toast>
    </div>
</template>
<style scoped>
  .coin_unit {
    display: inline-block;
    vertical-align: middle;
    width: 30px;
    text-align: center;
    font-size: 14px;
  }
  .loading-text {
    font-size: 12px;
  }
  .stock-undata {
    color: #666;
    font-size: 14px;
    padding: 5px 0;
    text-align: center;
  }
  .stock-col {
    float: left;
    padding-left: 5px;
  }
  .stock-tips {
    position: relative;
    font-size: 12px;
    color: #fd6d6d;
    margin-bottom: 5px;
  }
  .stock-list {
    background: #fff;
    padding: 0 5px 0 15px;
    text-align: left;
  }
  .stock-item {
    border-left: 2px solid #ff5454;
    margin-bottom: 5px;
    font-size: 14px;
    color: #666;
  }
  .stock-item a {
    display: block;
    text-decoration: none;
    padding: 5px 10px;
    color: #666;
  }
  .stock-item a:active {
    color: #fff;
    background: #E64340;
  }
  .stock-item:after {
    content: '';
    display: table;
    clear: both;
  }
  .stock-code {
    position: relative;
  }
  .custom-label {
    padding-right: 15px;
  }
  .custom-label b {
    color: #ff5454;
    padding-right: 2px;
  }
  .fixed-bottom {
    margin-top: 20px;
    width: 100%;
    padding: 10px;
    background: #fff;
  }
  .weui-input {
    height: auto;
    line-height: 1.5;
  }
</style>
<script>
  import { InlineLoading,Loading,XInput,XSwitch,XButton,Alert,Confirm,Flexbox,FlexboxItem,TransferDomDirective as TransferDom } from 'vux'
  import Toast from '@/components/custom/toast.com'
  import config from '../../config'
  import api from '../../api'

  export default{
    data(){
      return{
        searchStocks: [],                                                                     //查到的股票数据
        isSelected: false,                                                                    //是否选择股票了
        isGetData: false,                                                                     //是否获取到数据了
        showTips: false,                                                                      //是否显示toast提示框
        tipsText: "",                                                                         //toast提示框动态提示文本
        loadText: "处理中...",                                                                //全局loading提示文本
        showLoading: false,                                                                   //是否显示全局loading
        isNumber: new RegExp("^[0-9]+\.?[0-9]*$"),
        unit: "元",                                                                           //货币符号
        query: {              //提交参数
          id: '',
          maxP: '',
          minP: '',
          remind: ''
        },                                                                    //请求参数
        isEdit: false,                                                                             //是否是编辑页面
        stockData: {
          stockNumber: '',
          query_StockId: '',
          upLimit: '',
          downLimit: '',
          isRemind: true
        },                                                      //保存股票数据对象
        confirmSaveData: {                                                                          //弹出框配置
          title: '保存股票',
          confirmIsShow: false
        },
        isStartSearch: false,                                                                 //是否开始查询
      }
    },
    methods: {
      selectStock (_code, _id, _market) {
        this.stockData.stockNumber = _code;
        this.stockData.query_StockId = _id;
        if(_market == 'sh' || _market == 'sz') {
            this.unit = '元'
        }else {
            this.unit = '港币'
        }
        this.searchStocks = [];
        this.isSelected = true;
        this.isGetData = true;
      },
      stockFocus () {
          console.log(this.stockData.stockNumber)
        this.isSelected = false;
        this.isStartSearch = false;
        this._getStockList(this.stockData.stockNumber);
      },
      getStockList (_code) {
        const that = this;
        this.isStartSearch = true;
        this._getStockList(_code);
      },
      _getStockList (_code) {
        const that = this;
        this.isGetData = false;
        if(this.stockData.stockNumber != "") {
          if(!this.isSelected) {
            this.$ajax.get(config.baseUrl + api.getStockList, {
              params: {
                code: _code
              }
            }).then(function(result) {
              that.isGetData = true;
              that.isStartSearch = false;
              that.searchStocks = result.data.data;
            });
          }
        }else {
          that.isGetData = false;
          that.isStartSearch = false;
          that.searchStocks = [];
        }
      },
      save () {
        if(this.stockData.upLimit && !(this.isNumber.test(Number(this.stockData.upLimit)))) {
            this.tipsText = "上限必须是数字";
            this.showTips = true;
            return;
        }if(this.stockData.downLimit && !(this.isNumber.test(Number(this.stockData.downLimit)))) {
            this.tipsText = "下限必须是数字";
            this.showTips = true;
            return;
        }
        if(this.stockData.stockNumber == "") {
          this.tipsText = "股票代码不能为空!";
          this.showTips = true;
        }else if( (this.stockData.upLimit  == "" || this.stockData.upLimit == null) && (this.stockData.downLimit == "" || this.stockData.downLimit == null) ) {
          this.tipsText = "必需填写上限或者下限值"
          this.showTips = true;
        }
        else if(Number(this.stockData.upLimit) && Number(this.stockData.downLimit)){
            if(Number(this.stockData.downLimit) > Number(this.stockData.upLimit)) {
              this.tipsText = "下限值不能大于上限值";
              this.showTips = true;
            }else {
              this.confirmSaveData.confirmIsShow = true;
            }
        }else {
          this.confirmSaveData.confirmIsShow = true;
        }
      },
      saveConfirm () {
        const that = this;
        this.showLoading = true;
        this.query["maxP"] =  this.stockData.upLimit;
        this.query["minP"] =  this.stockData.downLimit;
        this.query["remind"] =  this.stockData.isRemind;
        if(this.isEdit) {
          this.$ajax.get(config.baseUrl + api.editStock, {
            params: {
              id: that.query.id,
              maxP: that.query.maxP ? that.query.maxP : null,
              minP: that.query.minP ? that.query.minP : null ,
              remind: that.query.remind
            }
           }).then(function(result) {
              that.showLoading = false;
              if(result.data.code == "0") {
                that.$router.push({ name: 'StockList' })
              }else {
                that.tipsText = result.data.msg;
                that.showTips = true;
              }
           });
        }else {
          this.query["id"] =  this.stockData.query_StockId;
          this.$ajax.get(config.baseUrl + api.addStock, {
            params: {
              corpId: that.query.id,
              maxP: that.query.maxP ? that.query.maxP : null,
              minP: that.query.minP ? that.query.minP : null ,
              remind: that.query.remind
            }
          }).then(function(result) {
              that.showLoading = false;
              if(result.data.code == "0") {
                that.$router.push({ name: 'StockList' })
              }else {
                that.tipsText = result.data.msg;
                that.showTips = true;
              }
          });
        }
      }
    },
    mounted () {
      const stockId = this.$route.params.stockId;
      const that = this;
      if(stockId >=0) {
        this.isEdit = true;
        this.$ajax.get(config.baseUrl + api.getStockInfo, {
          params: {
            id: stockId
          }
        }).then(function(result) {
          var result = result.data.data;
          that.stockData.stockNumber = result.code;
          that.stockData.upLimit = result.maxP;
          that.stockData.downLimit = result.minP;
          that.stockData.isRemind = result.remind;
          that.isSelected = true;
          that.query["id"] = result.id;
        });
      }else {
        this.isEdit = false;
      }
      if(this.isEdit) {             //判断编辑页面默认已取到数据 不显示loading
        this.isGetData = true;
      }
    },
    updated () {
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
      Loading,
      InlineLoading
    }
  }
</script>
