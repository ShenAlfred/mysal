<template>
  <div style="height: 100%" v-h5-title="$route.meta.title">
    <div class="scroll-page">
      <loading v-model="isLoading"></loading>
      <div v-if="getData">
        <swipeout>
        <div v-for="(stock, $index) in stocks">
          <swipeout-item transition-mode="follow">
            <div slot="right-menu">
              <swipeout-button @click.native="goEdit(stock.id)" type="default">编辑</swipeout-button>
              <swipeout-button @click.native="delStock($index, stock.id)" type="warn" v-if="stock.fixed == 0">删除</swipeout-button>
            </div>
            <div slot="content">
              <flexbox class="stock-item vux-1px-b">
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
  </div>
</template>
<style lang="less" scoped>
  @import '~vux/src/styles/1px.less';
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
    padding-bottom: 10px;
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
    overflow-y: scroll;
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
  import { Loading , Swipeout, SwipeoutItem, SwipeoutButton, XButton, Flexbox, FlexboxItem, XSwitch } from 'vux'
  import config from '../../config'
  import api from '../../api'
  import store from '../../store'

  export default{
    data(){
      return{
        stocks: [],           //存放股票数据列表数组
        isLoading: false,   //显示loading
        getData: null,     //获取到数据
        error: null       //没有获取到数据
      }
    },
    components:{
      Swipeout,
      SwipeoutItem,
      SwipeoutButton,
      XButton,
      Flexbox,
      FlexboxItem,
      XSwitch,
      Loading
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
      delStock(index, _id) {
        const that = this;
        this.$ajax.get(config.baseUrl + api.delStock, {
          params: {
            id: _id
          }
        }).then(function(result) {
          if(result.data.code === "0") {
            that.stocks.splice(index, 1);
          }
        });
      },
      fetchData() {
        const that = this;
        this.isLoading = true;
        that.$ajax.get(config.baseUrl + api.attentionStocks).then(function(result) {
          that.isLoading = false;
          if(result.data.code === "0") {
              that.error = false;
              setTimeout(function() {
                that.stocks = result.data.data;
                that.getData = true;
              }, 500);
          }
        });
      }
    },
    created () {
      this.fetchData();
    }
  }
</script>
