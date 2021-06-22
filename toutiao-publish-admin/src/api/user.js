/* 用户相关的请求，登陆，个人信息，个人信息修改等 */
import request from "@/utils/require"

export const login = data => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/authorizations',
    data
  })
}

// 获取用户信息
export const getUserProfile = () => {
  // const user = JSON.parse(window.localStorage.getItem('user'))

  return request({
    method: 'GET',
    url: '/mp/v1_0/user/profile'
    // 后端要求把需要授权的用户身份放到请求头中
    // axios 可以通过 headers 选项设置请求头
    // headers: {
    //   // 属性名和值都得看接口的要求
    //   // 属性名：Authorization，接口要求的
    //   // 属性值：Bearer空格token数据
    //   // Bearer 就是持票人的意思，就好比你的学生证上写了学生证三个字
    //   Authorization: `Bearer ${user.token}`
    // }
  })
}

// 修改头像 ,data是FormData（）对象，这样会自动设置content-type格式
export const updateUserPhoto = data => {
  return request({
    method: 'PATCH',
    url: '/mp/v1_0/user/photo',
    data
  })
}

// 修改头像基本资料
export const updateUserProfile = data => {
  return request({
    method: 'PATCH',
    url: '/mp/v1_0/user/profile',
    data
  })
}