<template>
  <div style="height: 100%">
      <div class="scroll-page">
        <swipeout>
          <div v-for="(stock, $index) in stocks">
            <swipeout-item transition-mode="follow">
              <div slot="right-menu">
                <swipeout-button @click.native="goEdit(stock.id)" type="default">编辑</swipeout-button>
                <swipeout-button @click.native="delStock($index)" type="warn">删除</swipeout-button>
              </div>
              <div slot="content">
                <flexbox class="stock-item vux-1px-b">
                  <flexbox-item>
                    <p class="s_up">
                      <span class="s_c">{{ stock.name }}</span>
                      <span class="d_c">({{ stock.number }})</span>
                    </p>
                    <p class="s_down">
                    <span>
                      上限: {{ stock.upLimit }}
                    </span>
                      <span>
                      下限: {{ stock.downLimit }}
                    </span>
                    </p>
                  </flexbox-item>
                  <div>
                    <x-switch title="" v-model="stock.isRemind" @on-change="isRemind(stock.isRemind, $index)"></x-switch>
                  </div>
                </flexbox>
              </div>
            </swipeout-item>
          </div>
        </swipeout>
        <div class="load-more">
          点击加载更多!
        </div>
      </div>
    <div class="control-warp">
      <div class="control-group">
        <flexbox>
          <flexbox-item>
            <div class="control-btn vux-1px-r">
              <router-link to="/EA" class="link">
                <i class="fa fa-plus i-mc"></i>
                <div>新增</div>
              </router-link>
            </div>
          </flexbox-item>
          <flexbox-item>
            <div class="control-btn">
              <router-link to="/Setting" class="link">
                <i class="fa fa-cog i-mc"></i>
                <div>设置</div>
              </router-link>
            </div>
          </flexbox-item>
        </flexbox>
      </div>

    </div>
  </div>
</template>
<style lang="less">
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
</style>
<script>
  import { Swipeout, SwipeoutItem, SwipeoutButton, XButton, Flexbox, FlexboxItem, XSwitch } from 'vux'
  import config from '../../config'

  export default{
    data(){
      return{
        msg:'hello vue',
        stocks: []
      }
    },
    components:{
      Swipeout,
      SwipeoutItem,
      SwipeoutButton,
      XButton,
      Flexbox,
      FlexboxItem,
      XSwitch
    },
    methods: {
      isRemind (currentValue, index) {
        this.stocks[index].isRemind = currentValue
      },
      goEdit (id) {
        this.$router.push({ path: '/EA', query: { stockId: id } })
      },
      delStock(index) {
        this.stocks.splice(index, 1);
      }
    },
    mounted () {
      this.$ajax.get(config.baseUrl + '/spring/test').then(function(res) {
        console.log(res)
      })
      //模拟ajax请求数据
      this.stocks = [
        {
          id: 0,
          name: '上汽集团',
          number: '600104',
          upLimit: 5.5,
          downLimit: 2.3,
          isRemind: true
        },
        {
          id: 1,
          name: '城市传媒',
          number: '600229',
          upLimit: 3.5,
          downLimit: 1.3,
          isRemind: true
        },
        {
          id: 2,
          name: '欧派家居',
          number: '603833',
          upLimit: 10,
          downLimit: 7.2,
          isRemind: false
        }
      ]
    }
  }
</script>
