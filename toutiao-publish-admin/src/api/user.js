/* 用户相关的请求，登陆，个人信息，个人信息修改等 */
import request from "@/utils/require"

export const login = data => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/authorizations',
    data
  })
}