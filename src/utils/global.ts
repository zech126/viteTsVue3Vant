import type { commonClass } from "./common";
import { AxiosInstance } from "axios";
import dayjs from 'dayjs';
import { ComponentInternalInstance, getCurrentInstance } from 'vue';
import { Router, RouteLocationNormalizedLoaded } from "vue-router";
import { Store } from "vuex";

type apiValType = string & {readonly[key:string]: apiValType};
type PluginFunc<T = unknown> = (option: T, c: typeof dayjs.Dayjs, d: typeof dayjs) => void;

interface RouteOptions extends RouteLocationNormalizedLoaded {
  herf: string;
}

const getGlobal = () => {
  const { appContext } = getCurrentInstance() as ComponentInternalInstance
  return appContext.config.globalProperties as  {
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
    // [key:string]:any;
  }
}
export default getGlobal;