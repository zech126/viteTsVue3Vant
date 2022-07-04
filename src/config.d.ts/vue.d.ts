/// <reference types="vite/client" />
import { AxiosInstance } from "axios";
// import { Router } from 'vue-router'

//全局配置（typescript使用）
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $http: AxiosInstance;
    $dayjs: any;
    $common: {[key:string]: any};
    $toast: any;
    $dialog: any;
    $notify: any;
    api: {[key:string]: any};
    $api: {[key:string]: any};
    $refs: any;
    $attrs: any;
    $emit: any;
    $parent: any;
    [key:string]: any;
  }
}
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}
// 新增 axios 配置
declare module 'axios' {
  interface AxiosRequestConfig {
    removeEmpty?: boolean;
    hiddenError?: boolean;
    [key:string]: any;
  }
}
// 环境变量

declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';

