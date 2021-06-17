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


// 到处请求方法
export default request;
/* 在使用axios的地方导入进去即可，import request from ‘路径/require.js’;使用： request.xxxx */
// 登录默认账号，不能注册：13911111111   密码：246810
// vue-toutiao-m.lipengzhou.com/#/login