<template>
  <div style="height: 100%">
      <div class="scroll-page">
        <swipeout>
          <div v-for="stock in stocks">
            <swipeout-item @on-close="" @on-open="" transition-mode="follow">
              <div slot="right-menu">
                <swipeout-button @click.native="" type="default">编辑</swipeout-button>
                <swipeout-button @click.native="" type="warn">删除</swipeout-button>
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
                    <x-switch title="" v-model="stock.isRemind" @on-change="isRemind(stock.isRemind, stock.id)"></x-switch>
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
    <div class="control-group vux-1px-t">
      <flexbox>
        <flexbox-item>
          <div class="control-btn">
            <router-link to="/EA" class="link">
              <i class="fa fa-plus"></i>
              <span>新增</span>
            </router-link>
          </div>
        </flexbox-item>
        <flexbox-item>
            <div class="control-btn">
              <router-link to="/Setting" class="link">
                <i class="fa fa-cog"></i>
                <span>设置</span>
              </router-link>
            </div>
        </flexbox-item>
      </flexbox>
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
    padding-bottom: 40px;
    overflow-y: scroll;
  }
  .control-group {
    position: fixed;
    bottom: 0;
    left:0;
    width: 100%;
    height: 40px;
    background: #fff;
  }
  .control-btn {
    text-align: center;
    line-height: 40px;
  }
  .control-btn .link {
    display: block;
    color: #333;
    text-decoration: none;
  }
</style>
<script>
  import { Swipeout, SwipeoutItem, SwipeoutButton, XButton, Flexbox, FlexboxItem, XSwitch } from 'vux'

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
      isRemind (currentValue, id) {
        this.stocks[id].isRemind = currentValue
      }
    },
    mounted () {
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
