import type { commonClass } from "./common";
import { AxiosInstance } from "axios";
import dayjs from 'dayjs';
import { ComponentInternalInstance, getCurrentInstance } from 'vue';
import { Router, RouteLocationNormalizedLoaded } from "vue-router";
import { Store } from "vuex";

type PluginFunc<T = unknown> = (option: T, c: typeof dayjs.Dayjs, d: typeof dayjs) => void;

interface RouteOptions extends RouteLocationNormalizedLoaded {
  herf: string;
}

const getGlobal = () => {
  const { appContext } = getCurrentInstance() as ComponentInternalInstance
  return appContext.config.globalProperties as  {
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
    api: Readonly<{[key:string]: any}>;
    $api: Readonly<{[key:string]: any}>;
    [key:string]:any;
  }
}
export default getGlobal;