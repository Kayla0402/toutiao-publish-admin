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

// 新建文章
// 有默认值参数，且不是必传的，则必须放在最后
export const addArticle = (data, draft = false) => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/articles',
    data,
    params: {
      draft // 是否存为草稿
    }
  })
}

// 编辑文章
export const updateArticle = (target, data, draft=false) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/articles/${target}`,
    data,
    params: {
      draft // 是否存为草稿
    }
  })
}

// 获取指定的文章
export const getArticle = target => {
  return request({
    method: 'GET',
    url: `/mp/v1_0/articles/${target}`
  })
}

// 修改文章评论状态
export const updateCommentStatus = (articleId, allow_comment) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/comments/status`,
    params: {
      article_id: articleId
    },
    data: {
      allow_comment
    }
  })
}