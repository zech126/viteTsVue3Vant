import axios from 'axios';
import common from '@/utils/common';
import requestHand from './requestHand'
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import cookieConfig from '@/utils/cookieConfig';

// axios 默认配置
const instance = axios.create({
  headers: {
    withCredentials: true,
    'Accept-Language': 'zh-CN'
  }
});

// axios 其他自定义配置
instance.interceptors.request.use((config:any) => {
  //配置发送请求的信息
  NProgress.start();
  const requestConfig = () => {
    let headersConfig:any = {};
    const token = common.getCookie(cookieConfig.tokenName);
    if (!common.isEmpty(token)) {
      headersConfig.Authorization = token;
    }
    config.headers = {...headersConfig, ...config.headers};
    config.baseURL = requestHand.baseHand(config.url);
    config.timeout = typeof config.timeout === 'number' && config.timeout > 1000 ? config.timeout : 1000 * 120;
    // 当非 FormData 或 默认提交时对参数处理
    if (Object.prototype.toString.call(config.data) != '[object FormData]' && Object.prototype.toString.call(config.params) != '[object FormData]') {
      // 移除参数中的空值
      if(common.isEmpty(config.removeEmpty) || (common.isBoolean(config.removeEmpty) && config.removeEmpty)) {
        config.data = !common.isEmpty(config.data) ? common.removeEmpty(config.data) : undefined;
        config.params = !common.isEmpty(config.params) ? common.removeEmpty(config.params) : undefined;
      }
    }
    return config;
  }
  return new Promise((resolve, reject) => {
    resolve(requestConfig());
  })
});

// 添加响应拦截器
instance.interceptors.response.use((response: any) => {
  NProgress.done();
  const responseData = response.data || {};
  const code = responseData.status || responseData.code || response.status;
  let newMsg = responseData.msg;
  // 状态码处理
  if (requestHand.hand[code]) {
    return requestHand.hand[code](response, response.data);
  }
  // 错误处理
  if(common.isEmpty(newMsg)) {
    if (requestHand.tipsTxt[code]) {
      newMsg = typeof requestHand.tipsTxt[code] === 'function' ? requestHand.tipsTxt[code](response, response.data) : requestHand.tipsTxt[code];
    } else {
      newMsg = requestHand.other.unknown;
    }
  }
  // !response.config.hiddenError && ElMessage({
  //   message: newMsg,
  //   duration: 3000,
  //   showClose: true,
  //   type: 'error'
  // });
  console.error(response);
  return Promise.reject(responseData);
}, (error:any) => {
  NProgress.done();
  if (error.response) {
    const responseData = error.response.data || {};
    const code = responseData.status || responseData.code || error.response.status;
    let newMsg = responseData.msg;
    // 状态码处理
    if (requestHand.hand[code]) {
      return requestHand.hand[code](error.response, responseData);
    }
    // 错误处理
    if(common.isEmpty(newMsg)) {
      if (requestHand.tipsTxt[code]) {
        newMsg = typeof requestHand.tipsTxt[code] === 'function' ? requestHand.tipsTxt[code](error.response, error.response.data) : requestHand.tipsTxt[code];
      } else {
        newMsg = requestHand.other.unknown;
      }
    }
    // !error.config.hiddenError && ElMessage({
    //   message: newMsg || '未知错误，请检查网络是否可用或反馈给管理员!',
    //   duration: 3000,
    //   showClose: true,
    //   type: 'error'
    // });
    console.error(error.response);
    return Promise.reject(responseData);
  }
  // !error.config.hiddenError && ElMessage({
  //   message: requestHand.other.unknown,
  //   duration: 3000,
  //   showClose: true,
  //   type: 'error'
  // });
  console.error('请求错误: ', error);
  return Promise.reject(error);
});
export default instance;
