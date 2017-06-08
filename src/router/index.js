import Vue from 'vue'
import Router from 'vue-router'
import Stock from '@/components/Stock/Stock'
import Setting from '@/components/Stock/Setting'
import Edit from '@/components/Stock/Edit'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'StockMain',
      component: Stock
    },
    {
      path: '/Setting',
      name: 'StockSetting',
      component: Setting
    },
    {
      path: '/EA',
      name: 'StockEdit',
      component: Edit
    }
  ]
})
