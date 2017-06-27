<template>
  <div style="height: 100%" v-h5-title="$route.meta.title">
    <div class="fixed-tips">
      您好，我们{{delayTime}}秒取一次数据，最长会有{{delayTime+10}}秒延迟
    </div>
    <div class="scroll-page">
      <div v-show="getData">
        <swipeout>
        <div v-for="(stock, $index) in stocks">
          <swipeout-item transition-mode="follow">
            <div slot="right-menu">
              <swipeout-button @click.native="goEdit(stock.id)" type="default">编辑</swipeout-button>
              <swipeout-button @click.native="delStock($index, stock.id)" type="warn">删除</swipeout-button>
            </div>
            <div slot="content">
              <flexbox class="stock-item" :class="{ 'vux-1px-b': $index != (stocks.length-1) }">
                <flexbox-item>
                  <p class="s_up">
                    <span class="s_c">{{ stock.name }}</span>
                    <span class="d_c">({{ stock.code }})</span>
                  </p>
                  <p class="s_down">
                  <span>
                    上限: {{ stock.maxP == null ? '--' :  stock.maxP }}
                  </span>
                    <span>
                    下限: {{ stock.minP == null ? '--' :  stock.minP }}
                  </span>
                  </p>
                </flexbox-item>
                <div>
                  <x-switch title="" v-model="stock.remind" @on-change="isRemind(stock.remind, $index, stock.id)"></x-switch>
                </div>
              </flexbox>
            </div>
          </swipeout-item>
        </div>
      </swipeout>
      </div>
      <div class="no-content" v-if="error">
        没有您要关注的股票,<br />
        请点击新增您的股票！！
      </div>
    </div>
    <div class="control-warp">
      <div class="control-group">
        <flexbox>
          <flexbox-item>
            <div class="control-btn">
              <router-link to="/EA" class="link">
                <i class="fa fa-plus i-mc"></i>
                <div>新增</div>
              </router-link>
            </div>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
    <div v-transfer-dom>
      <confirm v-model="confirmDelData.confirmIsShow" :title="confirmDelData.title" @on-confirm="delConfirm()">
        <p style="text-align:center;">{{ confirmDelData.content }}</p>
      </confirm>
      <loading v-model="showLoading" :text="loadText"></loading>
    </div>
    <toast v-bind:tip-text="tipsText" v-model="showTips" close-time="5"></toast>
  </div>
</template>
<style lang="less" scoped>
  @import '~vux/src/styles/1px.less';
  .fixed-tips {
    position: fixed;
    padding: 5px 0;
    background: #f5cb6e;
    color: #333;
    font-size: 14px;
    text-align: center;
    width: 100%;
    z-index: 10;
  }
  .stock-item {
    padding: 10px 15px;
    background: #fff;
  }
  .s_c {
    color: #333;
    font-size: 20px;
  }
  .d_c {
    padding-left: 15px;
    color: #999;
    font-size: 14px;
  }
  .s_up {
    padding-bottom: 5px;
  }
  .s_down {
    font-size: 14px;
    color: #666;
  }
  .s_down span {
    padding-right: 10px;
  }
  .scroll-page {
    height: 100%;
    padding-bottom: 60px;
    padding-top: 32px;
    overflow-y: scroll;
    -webkit-overflow-scrolling : touch;
  }
  .control-warp {
    position: fixed;
    bottom: 0;
    left:0;
    width: 100%;
    height: 60px;
    text-align: center;
    background: #fff;
  }
  .control-group {
    margin: 0 auto 20px;
    width: 60%;
    height: 40px;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 40px;
    box-shadow: 0 5px 10px #ccc;
  }
  .control-btn {
    text-align: center;
    padding: 2px 0;
  }
  .control-btn {
    font-size: 14px;
    color: #999;
  }
  .control-btn .link {
    display: block;
    color: #333;
    line-height: 1.3;
    text-decoration: none;
  }
  .i-mc {
    color: #ff5454;
  }
  .no-content {
    padding: 20px 0;
    text-align: center;
    line-height: 1.5;
  }
</style>
<script>
  import { Confirm, Loading , Swipeout, SwipeoutItem, SwipeoutButton, XButton, Flexbox, FlexboxItem, XSwitch, TransferDomDirective as TransferDom } from 'vux'
  import Toast from '@/components/custom/toast.com'
  import when from 'when'
  import config from '../../config'
  import api from '../../api'
  import store from '../../store'

  export default{
    data(){
      return{
        stocks: [],                                     //存放股票数据列表数组
        getData: null,                                  //获取到数据
        error: null,                                    //没有获取到数据
        loadText: "处理中...",                          //全局loading提示文本
        showLoading: false,                             //是否显示全局loading
        confirmDelData: {                               //弹出框配置
          title: '刪除股票',
          content: '確定刪除?',
          confirmIsShow: false
        },
        delId: '',                                      //獲取當前點擊刪除股票的id,
        delIndex: '',                                   //獲取當前點擊刪除股票的下標,
        tipsText: '',
        showTips: false,
        delayTime: ''
      }
    },
    directives: {
      TransferDom
    },
    components:{
      Swipeout,
      SwipeoutItem,
      SwipeoutButton,
      XButton,
      Flexbox,
      FlexboxItem,
      XSwitch,
      Loading,
      Confirm,
      Toast
    },
    methods: {
      isRemind (currentValue, index, _id) {
        this.stocks[index].isRemind = currentValue;
        this.$ajax.get(config.baseUrl + api.remindStock, {
          params: {
            id: _id,
            remind: currentValue
          }
        }).then(function(result) {
        });
      },
      goEdit (id) {
        this.$router.push({ name: 'StockEdit', params: { stockId: id } })
      },
      delStock(_index, _id) {
        this.delId = _id;
        this.delIndex = _index;
        this.confirmDelData.confirmIsShow = true;
      },
      fetchData() {
        const that = this;
        this.showLoading = true;
        that.$ajax.get(config.baseUrl + api.attentionStocks).then(function(result) {
          that.showLoading = false;
          if(result.data.code === "0") {
            that.error = false;
            that.stocks = result.data.data;
            that.getData = true;
          }else {
            that.error = true;
          }
        });
      },
      delConfirm () {
        const that = this;
        this.$ajax.get(config.baseUrl + api.delStock, {
          params: {
            id: that.delId
          }
        }).then(function(result) {
          if(result.data.code === "0") {
              that.stocks.splice(that.delIndex, 1);
              that.tipsText = result.data.msg;
              that.showTips = true;
          }
        });
      },
      getDevTicket () {
        const deferred = when.defer();
        const promise = deferred.promise;
        const query = {
          ticket: this.$route.query.ticket
        };
        this.$ajax.get(config.baseUrl + "/stock/test", {
            params: {
                ticket: query.ticket
            }
        }).then((response) => {
          deferred.resolve(response);
        }).catch((response) => {
          deferred.reject(response);
        });
        return promise;
      },
      getUser () {
        const deferred = when.defer();
        const promise = deferred.promise;
        this.$ajax.get(config.baseUrl + api.getUserInfo, {})
          .then((response) => {
            deferred.resolve(response);
          }).catch((response) => {
            deferred.reject(response);
          });
        return promise;
      }
    },
    mounted () {
      if(config.isDevEnv) {
          this.getDevTicket().then((result) => {
              if(result.data.code == "0") {
                  this.getUser().then((result) => {
                      if(result.data.code == "0") {
                          store.state.userInfo = result.data.data;
                          this.delayTime = result.data.data.time;
                          this.fetchData();
                      }
                  });
              }
          });
      }else {
        this.getUser().then((result) => {
          if(result.data.code == "0") {
            store.state.userInfo = result.data.data;
            this.delayTime = result.data.data.time;
            this.fetchData();
          }
        });
      }
    }
  }
</script>
