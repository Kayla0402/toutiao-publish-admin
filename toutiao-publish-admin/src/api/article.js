// 文章请求
import request from "@/utils/require"

// 文章列表
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/articles',
    /* 
    body 参数使用data设置
    query参数使用params设置
    hearders参数使用headers设置
     */
    params
  })
}

// 文章频道数据
export const getArticlesChannels = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/channels',
  })
}