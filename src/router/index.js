import Vue from 'vue'
import Router from 'vue-router'
import Stock from '@/components/Stock/Stock'
import Edit from '@/components/Stock/Edit'
import config from '@/config'

Vue.use(Router)

const routes = [
    {
      path: '/',
      name: 'StockList',
      meta: {
        title: '股票',
      },
      component: resolve => require(['@/components/Stock/Stock'], resolve)
    },
    {
      path: '/EA',
      name: 'StockAdd',
      meta: {
        title: '新增',
      },
      component: resolve => require(['@/components/Stock/Edit'], resolve)
    },
    {
      path: '/EA/:stockId',
      name: 'StockEdit',
      meta: {
        title: '编辑',
      },
      component: resolve => require(['@/components/Stock/Edit'], resolve)
    }
  ];

let router = new Router({
  mode: config.isDevEnv ? 'history' : 'hash',
  routes: routes
});

export default router;
