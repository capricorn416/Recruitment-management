import request from "../utils/request"

// 删除流程
export const deleteStage = (params) => {
  return request({
    method: 'DELETE',
    url: '/recruit/deleteStage',
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 增加流程
export const addStage = (data) => {
  return request({
    method: 'POST',
    url: '/recruit/addStage',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 获取短信模板
export const getTemplate = (params) => {
  return request({
    method: 'GET',
    url: '/recruit/assessment/getTemplate',
    params
  })
}