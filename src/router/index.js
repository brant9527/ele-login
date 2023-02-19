import Vue from 'vue'
import VueRouter from 'vue-router'
import ViewsIndex from '../views/index.vue'

import Index from '../components/index.vue'
import List from '../components/user/List.vue'
import Login from '../components/login/index.vue'
import Order from '../components/order/orders.vue'
import A1 from '../components/order/1.vue'
import A2 from '../components/order/2.vue'
import Puppeteer from '../components/puppeteer/index.vue'
import Xlsx from '../components/xlsx/index.vue'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/index',
    component: ViewsIndex,
    redirect:'/home',
    children: [
      {
        path: '/home',
        component: Index
      },
      {
        path: '/users',
        component: List
      },

      {
        path: '/orders',
        component: Order,
        children: [
          {
            path: '',
            component: A1
          },
          {
            path: '1',
            component: A1
          },
          {
            path: '2',
            component: A2
          }
        ]
      },
      {
        path: '/puppeteer',
        meta:{
          keepAlive:false //不需要缓存的
        },
        component: Puppeteer
      },
      {
        path: '/xlsx',
        component: Xlsx
      },
    ]
  },

  {
    path: '/login',
    component: Login
  },
]

const router = new VueRouter({
  routes
})

export default router
