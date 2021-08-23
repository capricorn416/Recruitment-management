import axios from 'axios'
import { MessageBox } from 'element-ui'
import $router from '@/router'

const request = axios.create({
    baseURL: '/api/manage'
})

request.interceptors.request.use(
  // 所有请求会经过这里
  // config是当前请求相关的配置信息对象
  function(config) {
    // console.log(config);
    const user = window.localStorage.getItem('user');
    // 如果有用户登录信息，则统一设置token
    if(user) {
      config.headers.Authorization = `Bearer ${user}`
    }
    // 当这里return config之后，请求才会真正地发出去
    return config;
}, 
  function (error) {
    // 请求失败，会经过这里
    return Promise.reject(error);
});

request.interceptors.response.use(
  response => {
    return response
  },
  error => {
    // 登录过期
    console.log(error.response.status);
    if(error.response.status == 401) {
      if(sessionStorage.getItem('isLogOut') == undefined) {
        sessionStorage.setItem('isLogOut', true);
        MessageBox.confirm('登录已过期，请重新登录！', '提示', {
          confirmButtonText: '确定',
          showClose: false,
          showCancelButton: false,
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          sessionStorage.clear();
          $router.push({
            path: '/login'
          })
        })
      }
    }
    return Promise.reject(error)
  }
)
export default request
