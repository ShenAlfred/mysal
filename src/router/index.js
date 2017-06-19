import Vue from 'vue'
import Router from 'vue-router'
import Stock from '@/components/Stock/Stock'
import Setting from '@/components/Stock/Setting'
import Edit from '@/components/Stock/Edit'

Vue.use(Router)

const routes = [
    {
      path: '/',
      name: 'StockMain',
      meta: {
        title: '股票',
      },
      component: Stock
    },
    {
      path: '/Setting',
      name: 'StockSetting',
      meta: {
        title: '设置',
      },
      component: Setting
    },
    {
      path: '/EA',
      name: 'StockAdd',
      meta: {
        title: '新增',
      },
      component: Edit
    },
    {
      path: '/EA/:stockId',
      name: 'StockEdit',
      meta: {
        title: '编辑',
      },
      component: Edit
    }
  ];

let router = new Router({
  mode: 'history',
  routes: routes
});

export default router;
