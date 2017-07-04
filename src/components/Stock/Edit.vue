<template>
    <div v-h5-title="$route.meta.title">
      <div class="stock-code">
        <x-input type="text" placeholder="股票代码/股票名称" v-model="stockData.stockNumber" :show-clear="false"
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
          <div v-show="stockData.stockNumber && isError ">
            <div class="stock-undata">
              没有你要查询的股票~~~
            </div>
          </div>
        </div>
      </div>
      <div class="bd-warp vux-1px-t">
        <flexbox>
          <div>&nbsp;&nbsp;波动上限:</div>
          <flexbox-item style="margin-right: 8px;">
            <div class="sl-ip-com">
              <flexbox style="height: 100%;">
                <flexbox-item style="height: 100%;">
                  <input type="text" class="sl-ip" v-model="stockData.upLimit">
                </flexbox-item>
                <div class="sl-unit">
                  {{unit}}
                </div>
              </flexbox>
            </div>
            <div v-for="upLimit in stockData.upLimits">
              <limit :limit-data="upLimit" @refUpLimitNumber="refreshUpLimitNumber"></limit>
            </div>
            <div class="sl-add-btn" v-on:click="addUpLimit()" v-show="maxUpLimit != 1">+</div>
          </flexbox-item>
        </flexbox>
      </div>
      <div class="bd-warp vux-1px-t">
        <flexbox>
          <div>&nbsp;&nbsp;波动下限:</div>
          <flexbox-item style="margin-right: 8px;">
            <div class="sl-ip-com">
              <flexbox style="height: 100%;">
                <flexbox-item style="height: 100%;">
                  <input type="text" class="sl-ip" v-model="stockData.downLimit">
                </flexbox-item>
                  <div class="sl-unit">
                    {{unit}}
                  </div>
              </flexbox>
            </div>
            <div v-for="downLimit in stockData.downLimits">
              <limit :limit-data="downLimit" @refDownLimitNumber="refreshDownLimitNumber"></limit>
            </div>
            <div class="sl-add-btn" v-on:click="addDownLimit()" v-show="maxDownLimit != 1">+</div>
          </flexbox-item>
        </flexbox>
      </div>
      <x-input type="text" placeholder="请输入" v-model="stockData.zf">
        <div slot="label" class="custom-label">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;涨幅:</div>
        <span slot="right" class="coin_unit">%</span>
      </x-input>
      <x-input type="text" placeholder="请输入" v-model="stockData.df">
        <div slot="label" class="custom-label">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;跌幅:</div>
        <span slot="right" class="coin_unit">%</span>
      </x-input>
      <div class="bd-warp vux-1px-t">
        <flexbox>
          <div>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;平台
          </div>
          <flexbox-item>
            <div class="select-wp">
              <select v-model="stockData.plant">
                <option>111</option>
                <option>222</option>
                <option>333</option>
                <option>444</option>
              </select>
            </div>
          </flexbox-item>
        </flexbox>
      </div>
      <x-input type="text" placeholder="请输入" v-model="stockData.remind_time">
        <div slot="label" class="custom-label">&nbsp;&nbsp;提醒周期:</div>
      </x-input>
      <x-textarea v-model="stockData.remark">
        <div slot="label" class="custom-label">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;备注:</div>
      </x-textarea>
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

<style lang="less" scoped>
  @import '~vux/src/styles/1px.less';
  select {
    border: none;
    width: 100%;
    outline: 0;
  }
  .select-wp {
    margin-left: 8px;
    height: 100%;
    margin-right: 20px;
  }
  .bd-warp {
    padding: 10px 0;
    margin-left: 15px;
  }
  .sl-add-btn {
    height: 40px;
    width: 100%;
    border: 1px dashed #ddd;
    color: #ddd;
    line-height: 40px;
    text-align: center;
  }
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
  import { InlineLoading,Loading,XInput,XTextarea,XSwitch,XButton,Alert,Confirm,Flexbox,FlexboxItem,TransferDomDirective as TransferDom } from 'vux'
  import Toast from '@/components/custom/toast.com'
  import Limit from '@/components/custom/limit.com'
  import config from '../../config'
  import api from '../../api'
  import store from '@/store/index'

  export default{
    data(){
      return{
        searchStocks: [],                                                                     //查到的股票数据
        isSelected: false,                                                                    //是否选择股票了
        isGetData: null,                                                                      //是否获取到数据了
        showTips: false,                                                                      //是否显示toast提示框
        tipsText: "",                                                                         //toast提示框动态提示文本
        loadText: "处理中...",                                                                //全局loading提示文本
        showLoading: false,                                                                   //是否显示全局loading,
        isError: false,                                                                       //没有获取到股票数据
        isNumber: new RegExp("^[0-9]+\.?[0-9]*$"),
        unit: "元",                                                                           //货币符号
        query: {                                                                              //提交参数
          id: '',
          maxP: '',
          minP: '',
          remind: ''
        },
        isEdit: false,                                                                             //是否是编辑页面
        stockData: {
          stockNumber: '',
          query_StockId: '',
          upLimits: [],
          downLimits: [],
          upLimit: '',
          downLimit: '',
          zf: '',
          df: '',
          remark: '',
          plant: '',
          remind_time: 60,
          isRemind: true
        },                                                                                    //保存股票数据对象
        confirmSaveData: {                                                                          //弹出框配置
          title: '保存股票',
          confirmIsShow: false
        },
        isStartSearch: false,                                                                 //是否开始查询
        corpId: '',                                                                            //选中股票corpId
        maxAddNum: 5,
        maxUpLimit: 5,
        maxDownLimit: 5
      }
    },
    methods: {
      selectStock (_code, _id, _market) {
        this.stockData.stockNumber = _code;
        this.stockData.query_StockId = _id;
        this.corpId = _id;
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
        this.isSelected = false;
        this.isStartSearch = false;
        this._getStockList(this.stockData.stockNumber);
      },
      getStockList (_code) {
        const that = this;
        if(!this.isSelected) {
          this.corpId = ""
          this.isStartSearch = true;
          this._getStockList(_code);
        }
        this.isSelected = false;
      },
      _getStockList (_code) {
        const that = this;
        if(this.stockData.stockNumber != "") {
          if(!this.isSelected) {
            this.$ajax.get(config.baseUrl + api.getStockList, {
                params: {
                  code: encodeURI(_code)
                }
            }).then(function(result) {
                if(result.data.data) {
                  that.isGetData = true;
                  that.isStartSearch = false;
                  that.searchStocks = result.data.data;
                }else {
                  that.isGetData = false;
                  that.isError = true;
                }

            });
          }
        }else {
          that.isGetData = false;
          that.isStartSearch = false;
          that.searchStocks = [];
        }
      },
      //保存股票触发事件
      save () {
        var pass = true;
        if(!(this.concatArr(this.stockData.downLimit, store.state.downLimitArr).length) && !(this.concatArr(this.stockData.upLimit, store.state.upLimitArr).length)) {
          this.tipsText = "必需填写上限或者下限值";
          this.showTips = true;
          pass = false;
          return;
        }
        if(!(this.verdictWaveGroup('up', this.stockData.upLimit, store.state.upLimitArr))){
          this.tipsText = "上限必须是数字";
          this.showTips = true;
          pass = false;
          return;
        }
        if(!(this.verdictWaveGroup('down', this.stockData.downLimit, store.state.downLimitArr))) {
          this.tipsText = '下限必须是数字';
          this.showTips = true;
          pass = false;
          return;
        }
        if(!(this.verdictArrayRepeat(this.concatArr(this.stockData.upLimit, store.state.upLimitArr)))) {
          this.tipsText = '上限不能有重复值';
          this.showTips = true;
          pass = false;
          return;
        }
        if(!(this.verdictArrayRepeat(this.concatArr(this.stockData.downLimit, store.state.downLimitArr)))) {
          this.tipsText = '下限不能有重复值';
          this.showTips = true;
          pass = false;
          return;
        }
        if(!(this.compareValue(this.concatArr(this.stockData.upLimit, store.state.upLimitArr), this.concatArr(this.stockData.downLimit, store.state.downLimitArr)))) {
          this.tipsText = '下限不能大于上限';
          this.showTips = true;
          pass = false;
          return;
        }
//        if(this.stockData.stockNumber == "") {
//          this.tipsText = "股票代码不能为空!";
//          this.showTips = true;
//          return;
//        }
//        if(!this.corpId) {
//          this.tipsText = "请选择一只股票";
//          this.showTips = true;
//          return;
//        }
        if(this.stockData.zf && !(this.isNumber.test(Number(this.stockData.zf)))) {
            this.tipsText = "涨幅必须是数字";
            this.showTips = true;
            pass = false;
            return;
        }
        if(this.stockData.df && !(this.isNumber.test(Number(this.stockData.df)))) {
            this.tipsText = "跌幅必须是数字";
            this.showTips = true;
            pass = false;
            return;
        }
        if(this.stockData.remind_time && !(this.isNumber.test(Number(this.stockData.remind_time)))) {
          this.tipsText = "提醒周期必须是数字";
          this.showTips = true;
          pass = false;
          return;
        }
        if(pass) {
          this.confirmSaveData.confirmIsShow = true;
        }
      },
      //链接两个数组
      concatArr (arr1, arr2) {
        const arr = [];
        var result = [];
        arr1 ? arr.push({
            value: arr1
          }) : arr;
        result = arr.concat(arr2);
        return result;
      },
      //判断波动组的值是否合法和值是否相同
      verdictWaveGroup (type, _default, group) {
        var result = [];
        result = this.concatArr(_default, group);
        for(var i=0, len=result.length; i < len; i++) {
          if(!(this.isNumber.test(Number(result[i].value)))) {
            return false;
          }
        }
        return true;
      },
      //判断数组里的数据是否有重复
      verdictArrayRepeat (_arr) {
        var flag = true, arr = [], arr_sort = [];
        for(var i=0; i<_arr.length; i++) {
          arr.push(Number(_arr[i].value))
        }
        arr_sort = arr.sort();
        for(var i=0;i<arr_sort.length;i++) {
          if (arr_sort[i] == arr_sort[i+1]) {
            flag = false;
            return flag;
          }
        }
        return flag;
      },
      //比较下限值不能大于上限值
      compareValue (_upArr, _downArr) {
        var upArr = [], downArr = [];
        if(_upArr.length && _downArr.length) {
          for(var i=0; i<_upArr.length; i++) {
            upArr.push(Number(_upArr[i].value));
          }
          for(var j=0; j<_downArr.length; j++) {
            downArr.push(Number(_downArr[j].value));
          }
          var up_min = Math.min.apply(null, upArr);
          var down_max = Math.max.apply(null, downArr);
          if(down_max > up_min) {
              return false;
          }
        }
        return true;
      },
      //确定保存触发事件
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
      },
      //添加多个下限事件
      addDownLimit() {
        this.maxDownLimit--;
        store.state.downLimitArr.push({
          type: 'down',
          value: '',
          unit: this.unit
        });
        store.state.countDownLimitNumber = this.maxDownLimit;
        this.stockData.downLimits = store.state.downLimitArr;
      },
      addUpLimit () {
        this.maxUpLimit--;
        store.state.upLimitArr.push({
          type: 'up',
          value: '',
          unit: this.unit
        });
        store.state.countUpLimitNumber = this.maxUpLimit;
        this.stockData.upLimits = store.state.upLimitArr;
      },
      //刷新波动下限计数值
      refreshDownLimitNumber (count) {
          this.maxDownLimit = count;
      },
      refreshUpLimitNumber (count) {
          this.maxUpLimit = count;
      }
    },
    mounted () {
//      store.state.countUpLimitNumber = 0;
//      store.state.countDownLimitNumber = 0;
//      store.state.upLimitArr = [];
//      store.state.downLimitArr = [];

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
          that.corpId = result.id;
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
      InlineLoading,
      XTextarea,
      Flexbox,
      FlexboxItem,
      Limit
    }
  }
</script>
