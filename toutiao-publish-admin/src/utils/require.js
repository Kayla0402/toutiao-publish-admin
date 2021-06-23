// 基于axios封装的请求模块
import axios from 'axios';
import JSONbig from 'json-bigint'
import router from 'vue-router'

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
  
// 响应拦截器  use(两个参数)  
request.interceptors.response.use(res => {
  // 请求成功对响应数据做处理 所有响应码为2xxx都进入这里
  // 该返回的数据则是axios.then(res)中接收的数据
  // res为响应数据，一定要把响应结果return，否则真正发请求的地方拿不到数据
  return Promise.resolve(res)
}, err => {
  // 在请求错误时要做的事儿 不是2xx的响应码都会进入这里
 console.log(err);
  // 该返回的数据则是axios.catch(err)中接收的数据
  if(err&&err.response&&err.response.status === 401) {
    // 跳转至登录页面，只有组件中有router对象，
    // 不可以通过this.$router进行页面的调整
    // 重新在该页面加载路由组件，import
    window.localStorage.removeItem('user')
    router.push('/login')
  } else if(err.response.status === 400) {
    // 客户端参数报错
  } else if(err.response.status === 403) {
    // 没有操作权限
  } else if(err.response.status >= 500) {
    // 服务器报错
  }
  return Promise.reject(err)
})

// 到处请求方法
export default request;
/* 在使用axios的地方导入进去即可，import request from ‘路径/require.js’;使用： request.xxxx */
// 登录默认账号，不能注册：13911111111   密码：246810
// vue-toutiao-m.lipengzhou.com/#/login