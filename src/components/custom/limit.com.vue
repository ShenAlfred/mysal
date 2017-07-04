<template>
  <div class="sl-ip-com">
    <flexbox style="height: 100%;">
      <flexbox-item style="height: 100%;">
        <input type="text" class="sl-ip" v-model="limitData.value">
      </flexbox-item>
      <div class="sl-unit">
        {{limitData.unit}}
      </div>
      <div class="sl-del" v-on:click="del(limitData, limitData.type)">-</div>
    </flexbox>
  </div>
</template>
<style scope>
  .sl-unit {
    width: 40px;
    line-height: 40px;
    text-align: center;
    height: 100%;
    color: #aaa;
    font-size: 14px;
    border-left: 1px solid #ddd;
  }
  .sl-ip-com {
    position: relative;
    margin: 5px 0;
    border-radius: 4px;
    height: 40px;
    width: 100%;
    border: 1px solid #ddd;
    overflow: hidden;
  }
  .sl-ip-com .sl-ip {
    position: relative;
    top: 0;
    margin: 0;
    width: 100%;
    padding-left: 10px;
    border: none;
    height: 100%;
    outline: 0;
    border-radius: 4px 0 4px 0;
  }
  .sl-ip-com .sl-del {
    height: 40px;
    width: 40px;
    border-radius: 0 4px 4px 0;
    line-height: 40px;
    color: #fff;
    text-align: center;
    background: #E64340;
  }
</style>
<script>
    import { Flexbox,FlexboxItem} from 'vux'
    import store from '@/store/index'
    export default{
        data(){
          return {
            count: 0,
            arr: []
          }
        },
        props: ['limitData'],
        methods: {
          del (item, type) {
            if(type == 'up') {
              this.count = store.state.countUpLimitNumber;
              this.arr = store.state.upLimitArr;
              this.count = ++store.state.countUpLimitNumber;
              this.$emit('refUpLimitNumber', this.count);
            }else {
              this.count = store.state.countDownLimitNumber;
              this.arr = store.state.downLimitArr;
              this.count = ++store.state.countDownLimitNumber;
              this.$emit('refDownLimitNumber', this.count);
            }
            const $index = this.arr.indexOf(item);
            this.arr.splice($index, 1);

          }
        },
        mounted () {},
        components: {
          Flexbox,
          FlexboxItem
        }
    }
</script>
