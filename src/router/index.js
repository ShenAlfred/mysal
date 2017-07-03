import Vue from 'vue'
import Router from 'vue-router'
import Stock from '@/components/Stock/Stock'
import Setting from '@/components/Stock/Setting'
import Edit from '@/components/Stock/Edit'
import Test from '@/components/Test/test'
import NotFoundComponent from '@/components/other/404'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '*', component: NotFoundComponent },
    {
      path: '/Test',
      component: Test
    },
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
