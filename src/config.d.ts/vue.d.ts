/// <reference types="vite/client" />
import { AxiosInstance } from "axios";
import type { commonClass } from "../utils/common";
import dayjs from 'dayjs';
import { ComponentInternalInstance, getCurrentInstance } from 'vue';
import { Router, RouteLocationNormalizedLoaded } from "vue-router";
import { Store } from "vuex";

type PluginFunc<T = unknown> = (option: T, c: typeof dayjs.Dayjs, d: typeof dayjs) => void;

interface RouteOptions extends RouteLocationNormalizedLoaded {
  herf: string;
}

//全局配置（typescript使用）
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $http: Readonly<AxiosInstance>;
    $common: Readonly<commonClass>;
    $dayjs: {
      extend:<T = unknown>(plugin: PluginFunc<T>, option?: T) => dayjs.Dayjs;
      locale:(preset?: string | ILocale, object?: Partial<ILocale>, isLocal?: boolean) => string;
      isDayjs: (d: any) => d is dayjs.Dayjs;
      unix: (t: number) => dayjs.Dayjs;
      (date?: dayjs.ConfigType, format?: dayjs.OptionType, locale?: string, strict?: boolean): dayjs.Dayjs;
    };
    $route: RouteOptions;
    $router: Router;
    $store: Store<any>;
    api: {[key:string]: any};
    $api: {[key:string]: any};
    $refs: any;
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

