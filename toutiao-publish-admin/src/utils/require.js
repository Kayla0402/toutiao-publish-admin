// 基于axios封装的请求模块
import axios from 'axios';
import JSONbig from 'json-bigint'

// const str = '{ "id": 12345678901234567890 }'
// // JSONbig.stringify()
// // JSONbig.parse()
// let aaa =JSON.parse(str).id
// console.log(aaa); // 12345678901234567000
// console.log(JSONbig.parse(str));
// console.log(JSONbig.parse(str).id.toString()); //12345678901234567890

/* 
创建一个axios实例，说白了就是复制了一个axios
我们通过这个实例去发请求，把需要的配置配置个这个实例来发请求
*/
const request = axios.create({
    // baseURL: 'http://ttapi.research.itcast.cn'
    baseURL: 'http://api-toutiao-web.itheima.net',
    // 定义后端返回的原始数据的处理
    // 参数data就是后端返回的原始数据（未经处理的JSON格式）
    transformResponse: [function(data) {
      
      // axios默认在内部使用JSON.parse来转换处理原始数据。
      // return JSON.parse(data)

      // 后端返回的数据可能不是JSON格式字符串，
      // 如果不是的话，那么JSONbig.parse调用会报错，
      // 所以我们用try-catch捕获异常，处理异常的发生
      try {
        return JSONbig.parse(data)
      } catch {
        return data
      }
      // return JSONbig.parse(data)
    }]
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