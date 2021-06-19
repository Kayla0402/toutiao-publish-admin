// 基于axios封装的请求模块
import axios from 'axios';
/* 
创建一个axios实例，说白了就是复制了一个axios
我们通过这个实例去发请求，把需要的配置配置个这个实例来发请求
*/
const request = axios.create({
    // baseURL: 'http://ttapi.research.itcast.cn'
    baseURL: 'http://api-toutiao-web.itheima.net'
})

// 请求拦截器
request.interceptors.request.use(
    // 任何所有请求会经过这里
    // config 是当前请求相关的配置信息对象
    // config 是可以修改的
    function (config) {
      const user = JSON.parse(window.localStorage.getItem('user'))
  
      // 如果有登录用户信息，则统一设置 token
      if (user) {
        config.headers.Authorization = `Bearer ${user.token}`
      }
  
      // 然后我们就可以在允许请求出去之前定制统一业务功能处理
      // 例如：统一的设置 token
  
      // 当这里 return config 之后请求在会真正的发出去
      return config
    },
    // 请求失败，会经过这里
    function (error) {
      return Promise.reject(error)
    }
  )
  

// 到处请求方法
export default request;
/* 在使用axios的地方导入进去即可，import request from ‘路径/require.js’;使用： request.xxxx */
// 登录默认账号，不能注册：13911111111   密码：246810
// vue-toutiao-m.lipengzhou.com/#/login