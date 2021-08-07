import axios from 'axios'

const request = axios.create({
    baseURL: 'http://101.200.227.216:8888/api/manage'
})

request.interceptors.request.use(
  // 所有请求会经过这里
  // config是当前请求相关的配置信息对象
  function(config) {
    // console.log(config);
    const user = window.localStorage.getItem('user');
    console.log(user)
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

export default request
