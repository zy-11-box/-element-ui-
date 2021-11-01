// 导入 NProgress 包对应的JS和CSS
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import axios from "axios";
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'

//创建拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  NProgress.start()
  return config
}, error => {
  return Promise.reject(error);
})

axios.interceptors.response.use(config => {
  NProgress.done()
  return config
}, error => {
  return Promise.reject(error);
})