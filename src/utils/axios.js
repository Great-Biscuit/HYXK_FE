import axios from 'axios'
import router from "../router/router"

// 创建axios实例
const instance = axios.create({
  baseURL: 'http://127.0.0.1:4523/mock/741820',
  timeout: 10000 // 十秒就算请求超时
})

// 响应拦截
instance.interceptors.response.use(
  response => {
    switch (response.data.code) {
        case 200:
          return response;
        case 401:
          // 未登录则拦截到登录界面
          router.push('/Login')
          return response;
        default:
          return response;
    }
  },
  error => {
      return Promise.reject(error)
  }
);

// 封装请求函数
export const get = (url, params = {}) => {
  return new Promise((resolve, reject) => {
    instance.get(url, params).then((response) => {
      resolve(response.data)
    }, (err) => {
      reject(err)
    })
  })
}

export const post = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    instance.post(url, data, {
      headers: {
        'Content-Type': 'application/json' // 请求后端数据时，Content-Type类型为json
      }
    }).then((response) => {
      resolve(response.data)
    }, (err) => {
      reject(err)
    })
  })
}
