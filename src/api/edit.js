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

// 批量通过
export const pass = (data) => {
  return request({
    method: 'POST',
    url: '/recruit/assessment/pass',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 批量最终通过
export const finalPass = (data) => {
  return request({
    method: 'POST',
    url: '/recruit/assessment/finalPass',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 批量淘汰
export const disuse = (data) => {
  return request({
    method: 'POST',
    url: '/recruit/assessment/disuse',
    data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}