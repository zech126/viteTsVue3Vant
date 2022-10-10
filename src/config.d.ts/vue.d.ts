/// <reference types="vite/client" />
import { AxiosInstance } from "axios";
import type { commonClass } from "../utils/common";
import dayjs from 'dayjs';
import { ComponentInternalInstance, getCurrentInstance } from 'vue';
import { Router, RouteLocationNormalizedLoaded } from "vue-router";
import { Store } from "vuex";
import type lodash from 'lodash';

type apiValType = string & {readonly[key:string]: apiValType};
type PluginFunc<T = unknown> = (option: T, c: typeof dayjs.Dayjs, d: typeof dayjs) => void;

interface RouteOptions extends RouteLocationNormalizedLoaded {
  herf: string;
}

//全局配置（typescript使用）
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    readonly $http: Readonly<AxiosInstance>;
    readonly $common: Readonly<commonClass>;
    readonly $dayjs: {
      readonly extend:<T = unknown>(plugin: PluginFunc<T>, option?: T) => dayjs.Dayjs;
      readonly locale:(preset?: string | ILocale, object?: Partial<ILocale>, isLocal?: boolean) => string;
      readonly isDayjs: (d: any) => d is dayjs.Dayjs;
      readonly unix: (t: number) => dayjs.Dayjs;
      (date?: dayjs.ConfigType, format?: dayjs.OptionType, locale?: string, strict?: boolean): dayjs.Dayjs;
    };
    readonly $route: RouteOptions;
    readonly $router: Router;
    readonly $store: Store<any>;
    readonly api: apiValType;
    readonly $api: apiValType;
    readonly $refs: Array<any> | {[key: string]: any};
    readonly lodash: typeof lodash;
    // [key:string]: any;
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

