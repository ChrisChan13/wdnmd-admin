import axios from 'axios';
import { Message } from 'element-ui';

const prefix = 'http://localhost:1213/admin';

const service = axios.create({
  baseURL: prefix,
  timeout: 5000,
});

service.interceptors.request.use((config) => {
  if (config.method === 'get' && config.data) {
    const querys: string[] = [];
    Object.entries(config.data).map((item) => {
      if (item[1]) {
        querys.push(`${item[0]}=${encodeURIComponent((item[1] as string))}`);
      }
      return item;
    });
    config.url = `${config.url}?${querys.join('&')}`;
  }
  return config;
}, (error) => {
  Message({
    message: error.message,
    type: 'error',
    duration: 5000,
  });
  return Promise.reject(error);
});

service.interceptors.response.use((response) => {
  const res = response.data;
  if (res.code !== 200) {
    Message({
      message: res.message || '请求失败',
      type: 'error',
      duration: 5000,
    });
    return Promise.reject(res);
  }
  Message({
    message: res.message || '请求成功',
    type: 'success',
    duration: 1000,
  });
  return res.data;
}, (error) => {
  Message({
    message: error.message,
    type: 'error',
    duration: 5000,
  });
  return Promise.reject(error);
});

export default service;
