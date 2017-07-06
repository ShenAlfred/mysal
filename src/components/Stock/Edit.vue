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
          <div class="custom-label">&nbsp;&nbsp;波动上限:</div>
          <flexbox-item style="margin-left: 0;margin-right: 8px;">
            <div class="sl-ip-com">
              <flexbox style="height: 100%;">
                <flexbox-item style="height: 100%;">
                  <input type="text" class="sl-ip" v-model="stockData.upLimit">
                </flexbox-item>
                <div class="sl-unit">
                  {{stockData.unit}}
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
          <div class="custom-label">&nbsp;&nbsp;波动下限:</div>
          <flexbox-item style="margin-left: 0; margin-right: 8px;">
            <div class="sl-ip-com">
              <flexbox style="height: 100%;">
                <flexbox-item style="height: 100%;">
                  <input type="text" class="sl-ip" v-model="stockData.downLimit">
                </flexbox-item>
                  <div class="sl-unit">
                    {{stockData.unit}}
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
      <x-input type="text" placeholder="请输入" v-model="stockData.zf" :show-clear="false">
        <div slot="label" class="custom-label">&nbsp;&nbsp;涨幅阈值:</div>
        <span slot="right" class="coin_unit">%</span>
      </x-input>
      <x-input type="text" placeholder="请输入" v-model="stockData.df" :show-clear="false">
        <div slot="label" class="custom-label">&nbsp;&nbsp;跌幅阈值:</div>
        <span slot="right" class="coin_unit">%</span>
      </x-input>
      <div class="bd-warp vux-1px-t">
        <flexbox>
          <div class="custom-label">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>*</b>平台:
          </div>
          <flexbox-item style="margin-left: 0">
            <div class="select-wp">
              <select v-model="stockData.plant">
                <option :value="plant.platCode" v-for="plant in plants">
                  {{plant.platName}}
                </option>
              </select>
            </div>
          </flexbox-item>
        </flexbox>
      </div>
      <x-input type="text" placeholder="请输入" v-model="stockData.remind_time" :show-clear="false">
        <div slot="label" class="custom-label"><b>*</b>提醒周期:</div>
        <span slot="right">分钟</span>
      </x-input>
      <x-textarea v-model="stockData.remark" :max="200">
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
    background: transparent;
    appearance:none;
    -moz-appearance:none;
    -webkit-appearance:none;
  }
  .select-wp {
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
  import utils from '@/util'

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
        zeroFirst: new RegExp("^(0+[1-9][0-9]*)$"),
        zeroFirst1: new RegExp("^(0[1-9][0-9]*)$"),
        plants: [],                                                                           //平台数组
        query: {                                                                              //提交参数
          id: '',
          maxP: '',
          minP: '',
          remind: '',
          emsRemind: true,
          period: '',
          maxW: '',
          minW: '',
          platCode: '',
          remark: ''
        },
        isEdit: false,                                                                             //是否是编辑页面
        stockData: {
          stockNumber: '',
          query_StockId: '',
          upLimits: [],
          downLimits: [],
          upLimit: '',
          downLimit: '',
          unit: "元",                                                                                //货币符号
          zf: '',
          df: '',
          remark: '',
          plant: '',
          remind_time: 60,
          isRemind: true
        },                                                                                          //保存股票数据对象
        confirmSaveData: {                                                                          //弹出框配置
          title: '保存股票',
          confirmIsShow: false
        },
        isStartSearch: false,                                                                       //是否开始查询
        corpId: '',                                                                                 //选中股票corpId
        maxAddNum: 5,
        maxUpLimit: 5,
        maxDownLimit: 5
      }
    },
    methods: {
      whatUnit (_market) {
        var unit = "";
        if(_market == 'sh' || _market == 'sz') {
          unit = '元'
        }else {
          unit = '港币'
        }
        return unit;
      },
      selectStock (_code, _id, _market) {
        this.stockData.stockNumber = _code;
        this.stockData.query_StockId = _id;
        this.corpId = _id;
        this.stockData.unit = this.whatUnit(_market);
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
            this.$ajax.post(config.baseUrl + api.getStockList, {
              code: _code
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
        if(this.stockData.stockNumber == "") {
          this.tipsText = "股票代码不能为空!";
          this.showTips = true;
          pass = false;
          return;
        }
        if(!this.corpId) {
          this.tipsText = "请选择一只股票";
          this.showTips = true;
          pass = false;
          return;
        }
        if(!(this.concatArr(this.stockData.downLimit, store.state.downLimitArr).length) && !(this.concatArr(this.stockData.upLimit, store.state.upLimitArr).length) && this.stockData.zf == "" && this.stockData.df == "") {
          this.tipsText = "上限、下限或阈值至少填一个";
          this.showTips = true;
          pass = false;
          return;
        }
        if(!(this.verdictWaveGroup('up', this.stockData.upLimit, store.state.upLimitArr))){
          this.tipsText = "上限必须是数值";
          this.showTips = true;
          pass = false;
          return;
        }
        if(!(this.verdictWaveGroup('down', this.stockData.downLimit, store.state.downLimitArr))) {
          this.tipsText = '下限必须是数值';
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
          this.tipsText = '下限必须小于上限';
          this.showTips = true;
          pass = false;
          return;
        }
        if(this.stockData.zf && !(this.isNumber.test(Number(this.stockData.zf)))) {
          this.tipsText = "涨幅必须是大于零的数值";
          this.showTips = true;
          pass = false;
          return;
        }
        if(this.stockData.df && !(this.isNumber.test(Number(this.stockData.df)))) {
          this.tipsText = "跌幅必须是大于零的数值";
          this.showTips = true;
          pass = false;
          return;
        }
        if(this.stockData.remind_time == "") {
          this.tipsText = "提醒周期不能为空";
          this.showTips = true;
          pass = false;
          return;
        }
        if(this.stockData.remind_time && !(this.isNumber.test(Number(this.stockData.remind_time))) || !(utils.isInteger(Number(this.stockData.remind_time))) || this.zeroFirst.test(this.stockData.remind_time) ) {
          this.tipsText = "提醒周期必须是整数";
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
        var result = [], arr2_cl = [];
        arr1 ? arr.push({
            value: arr1
        }) : arr;
        for(var i=0; i<arr2.length; i++) {
          if(arr2[i].value !== "") {
            arr2_cl.push(arr2[i])
          }
        }
        result = arr.concat(arr2_cl);
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
            if(_arr[i].value !== "") {
              arr.push(Number(_arr[i].value))
            }
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
          if(down_max >= up_min) {
              return false;
          }
        }
        return true;
      },
      //數組轉換字符串
      changeArrToString (arr) {
        var result = "", temp = [];
        if(arr) {
          for(var i=0; i< arr.length; i++) {
            temp.push(Number(arr[i].value));
          }
          result = temp.join();
        }
        return result;
      },
      //字符串转换数组
      changeStrToArr (str) {
        var arr = [];
        if(str) {
          arr = str.split(',');
        }
        return arr;
      },
      //确定保存触发事件
      saveConfirm () {
        const that = this;
        var upLimitStr = this.changeArrToString(this.concatArr(this.stockData.upLimit, store.state.upLimitArr)),
            downLimitStr = this.changeArrToString(this.concatArr(this.stockData.downLimit, store.state.downLimitArr));
        this.showLoading = true;
        this.query["maxP"] = upLimitStr ? upLimitStr: null;
        this.query["minP"] = downLimitStr ? downLimitStr : null;
        this.query["remind"] = this.stockData.isRemind;
        this.query["period"] = this.stockData.remind_time;
        this.query["maxW"] = this.stockData.zf ? Number(this.stockData.zf) : null;
        this.query["minW"] = this.stockData.df ? Number(this.stockData.df) : null;
        this.query["platCode"] = this.stockData.plant;
        this.query["remark"] = this.stockData.remark ? this.stockData.remark : null;
        if(this.isEdit) {
          this.$ajax.post(config.baseUrl + api.editStock, this.query).then(function(result) {
              that.showLoading = false;
              if(result.data.code == "0") {
                that.$router.push({ name: 'StockList' })
              }else {
                that.tipsText = result.data.msg;
                that.showTips = true;
              }
           });
        }else {
          this.query["corpId"] =  this.stockData.query_StockId;
          this.$ajax.post(config.baseUrl + api.addStock, this.query).then(function(result) {
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
          unit: this.stockData.unit
        });
        store.state.countDownLimitNumber = this.maxDownLimit;
        this.stockData.downLimits = store.state.downLimitArr;
      },
      addUpLimit () {
        this.maxUpLimit--;
        store.state.upLimitArr.push({
          type: 'up',
          value: '',
          unit: this.stockData.unit
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
      },
      //请求平台数据
      requestPlant () {
          this.$ajax.get(config.baseUrl + api.getPlant, {}).then((result) => {
            if(result.data.data) {
                this.plants = result.data.data;
                this.stockData.plant = result.data.data[0].platCode;
            }
          });
      },
      //封装上下限数据
      packagingUData (_type, arr, _unit) {
        var count = 0;
        if(arr.length) {
          _type == "upLimits" ? this.stockData.upLimit = arr[0] : this.stockData.downLimit = arr[0];
          for(var i=1; i<arr.length; i++) {
            this.stockData[_type].push({
                value: arr[i],
                unit: _unit,
                type: _type == "upLimits" ? "up" : "down"
            })
          }
          count = this.maxAddNum - arr.length + 1;
        }else {
          count = this.maxAddNum
        }
        if(_type == "upLimits") {
          store.state.upLimitArr = this.stockData[_type];
          store.state.countUpLimitNumber = this.maxUpLimit = count;
        } else {
          store.state.downLimitArr = this.stockData[_type];
          store.state.countDownLimitNumber = this.maxDownLimit = count;
        }
      }
    },
    mounted () {
      this.requestPlant();
      const stockId = this.$route.params.stockId;
      const that = this;
      if(stockId >=0) {                                                               //进入的是编辑页面
        this.isEdit = true;
        this.$ajax.get(config.baseUrl + api.getStockInfo, {
          params: {
            id: stockId
          }
        }).then(function(result) {
          var result = result.data.data;
          that.stockData.stockNumber = result.code;
          that.stockData.unit = that.whatUnit(result.market);
          that.packagingUData("upLimits", that.changeStrToArr(result.maxP), that.stockData.unit);
          that.packagingUData("downLimits", that.changeStrToArr(result.minP), that.stockData.unit);
          that.stockData.zf = result.maxW;
          that.stockData.df = result.minW;
          that.stockData.plant = result.platCode;
          that.stockData.remark = result.remark;
          that.stockData.isRemind = result.remind;
          that.stockData.remind_time = result.period;
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
    destroyed () {
      store.state.downLimitArr = [];
      store.state.upLimitArr = [];
      store.state.countDownLimitNumber = '';
      store.state.countUpLimitNumber = '';
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
