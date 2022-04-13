import { createApp } from 'vue'
/* 
  自定义设置根元素大小, 用于 px 转换 rem (如果页面始终需要竖屏、横屏)
  也可以安装 amfe-flexible 进行处理，amfe-flexible 不支持始终横竖屏显示设置
*/
import initRem from "@/utils/rem";
import App from './App.vue'
import "@/assets/style/index.less";
import "@/utils/loadIconFont"; // 字体全部引入
import dayjs from 'dayjs';
import $common from "$common";
import $http from "$request";
import $api from '$api';
import store from "@/store/index";
import router from "@/router/index";
import customComponents from './components/index'; // 全局组件注册
import * as vant from 'vant'; // 全局引入 vant 也可以注释, 使用按需引入
import 'vant/lib/index.css'; // vant 样式全局引入
// console.log(import.meta.env);
// 设置页面始终横屏(cross)、竖屏(vertical)、自动(auto)
initRem('auto');

const app = createApp(App);
// 全局注册 vant 也可以注释, 按需引入
app.use(vant);
app.config.globalProperties.$dayjs = dayjs;
// 注册全局对象
app.config.globalProperties.$common = $common;
app.config.globalProperties.api = $api;
app.config.globalProperties.$http = $http;

// 注册 store
app.use(store);
// 注册 router
app.use(router);
// 注册自定义全局组件
app.use(customComponents);

app.mount('#app');
// console.log(import.meta.env);

// 使用 setup 时, 获取全局挂载方式, 获取当前组件的实例、上下文来操作router和vuex等
// 注意的点：千万不要在 getCurrentInstance() 中获取 ctx; 在生产环境下， 获取到的 ctx 为空
// import getGlobal from "@/utils/global";
// const global =  getGlobal();