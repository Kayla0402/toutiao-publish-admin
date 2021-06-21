// 上传图片
import request from "@/utils/require"

export const uploadImg = data => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/user/images',
    data,
    // 一般文件上传的接口都需要把请求头中的Content-type设置为multipart/form-data,
    // 但是我们使用axios上传文件的话不需要手动设置，只需要给data一个FormDate对象即可。
    // new FormData()
  })
} 

// 获取用户图片素材
export const getImages = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/images',
    params
  })
} 

// 收藏取消收藏
export const collectImages = (imgId, collect) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/user/images/${imgId}`,
    data: {
      collect
    }
  })
} 

// 删除图片
export const deleteImages = imgId => {
  return request({
    method: 'DELETE',
    url: `/mp/v1_0/user/images/${imgId}`,
  })
}