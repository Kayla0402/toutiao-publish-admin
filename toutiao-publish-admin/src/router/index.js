import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '@/views/login')
  },
  {
    /* 命名路由layout有一个默认子路由，则它定义name没有意义
    正确的做法是：如果有默认子路由，就不要给父路由起名字了 */
    path: '/',
    // name: 'Layout',
    component: () => import(/* webpackChunkName: "home" */ '@/views/layout'),
    children: [
      {
        /* path为‘ ’，会作为默认子路由渲染 */
        path: '',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ '@/views/home'),
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
