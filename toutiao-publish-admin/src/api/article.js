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

// 删除文章
export const deleteArticles = target => {
  return request({
    method: 'DELETE',
    // 路径参数需要在url中传递，
    // 凡事看到接口路径中有 :xxx 格式的字段，都需要传递路径参数
    url: `/mp/v1_0/articles/${target}`,
  })
}
