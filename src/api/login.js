import request from "../utils/request"

// 发送验证码
export const sendVerifyCode = (data) => {
  return request({
    method: 'POST',
    url: '/sendVerifyCode',
    data
  })
}

// 登录
export const signIn = (data) => {
  return request({
    method: 'POST',
    url: '/signin',
    data
  })
}