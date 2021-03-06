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
      },
      {
        path: '/article',
        name: 'Article',
        component: () => import(/* webpackChunkName: "home" */ '@/views/article'),
      },
      {
        path: '/publish',
        name: 'Publish',
        component: () => import(/* webpackChunkName: "home" */ '@/views/publish'),
      },
      {
        path: '/image',
        name: 'Image',
        component: () => import(/* webpackChunkName: "home" */ '@/views/images'),
      },
      {
        path: '/comment',
        name: 'Comment',
        component: () => import(/* webpackChunkName: "home" */ '@/views/comment'),
      },
      {
        path: '/settings',
        name: 'Setting',
        component: () => import(/* webpackChunkName: "home" */ '@/views/setting'),
      },
      {
        path: '/fans',
        name: 'Fans',
        component: () => import(/* webpackChunkName: "home" */ '@/views/fans'),
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})
// 路由导航守卫（拦截器）的作用就是控制页面的访问状态
// beforeEach 是全局前置守卫，任何页面的访问都要经过这里
// 路由导航守卫：说白了所有页面的导航都会经过这里
// 守卫页面的导航的
// to：要去的路由信息
// from：来自哪里的路由信息
// next：放行方法
router.beforeEach((to, from, next) => {
  // 如果要访问的页面不是 /login，校验登录状态
  // 如果没有登录，则跳转到登录页面
  // 如果登录了，则允许通过
  // 允许通过
  // next()

  const user = JSON.parse(window.localStorage.getItem('user'))

  // 校验非登录页面的登录状态
  if (to.path !== '/login') {
    /**
     * 可以伪造token值，直接localstorage输入user {} ，
     */
    if (user) {
      // 已登录，允许通过
      next()
    } else {
      // 没有登录，跳转到登录页面
      next('/login')
    }
  } else {
    // 登录页面，正常允许通过
    next()
  }
})

// 我们在组件中使用的this.$router其实就是这个模块中的router
// 非组件中使用router路由对象，必须加载router对象，import
export default router
