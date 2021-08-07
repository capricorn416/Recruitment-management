import request from "../utils/request"

// 组别人数统计
export const getGroupCount = (params) => {
  return request({
    method: 'GET',
    url: '/recruit/groupCount',
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 阶段人数统计
export const getStageCount = (params) => {
  return request({
    method: 'GET',
    url: '/recruit/stageCount',
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 候选人表单
export const getCandidate = (params) => {
  return request({
    method: 'GET',
    url: '/recruit/candidate',
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}