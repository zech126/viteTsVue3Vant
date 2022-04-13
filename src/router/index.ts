import { createRouter, createWebHashHistory } from "vue-router";
import NProgress from "nprogress";
import pageRouter from "./pageRouter";
import common from '@/utils/common';
import "nprogress/nprogress.css";
import store from "@/store";

const router = createRouter({
  /* 
    history 配置： createWebHashHistory 使用 hash 模式， createWebHistory html5 历史模式, 
    均需在 import vue-router 时定义方法名称
  */
  history: createWebHashHistory(), // 使用 hash 模式
  routes: [
    {
      name: "首页",
      path: "/",
      redirect: "test1",
    },
    ...pageRouter,
  ],
});
const tool = {
  // 获取所有路由地址
  getRoutersPath: (arr:any, newRoute:Array<string | number> = []) => {
    arr.forEach((item:any) => {
      newRoute.push(item.path);
      !common.isEmpty(item.children) && tool.getRoutersPath(item.children, newRoute)
    })
    return newRoute;
  }
}
// 路由跳转前
router.beforeEach((to, from, next) => {
  // 路由加载状态
  store.commit('routerModel/routerLoading', true);
  NProgress.start();
  const routePath = tool.getRoutersPath(pageRouter);
  // 不需要验证登录状态
  if (common.isEmpty(to.meta) || to.meta && typeof to.meta.requireAuth === 'boolean' && !to.meta.requireAuth) {
    store.commit('layout/nonExist', !routePath.includes(to.path));
    next();
    return;
  }
  next();
});

// 路由跳转后
router.afterEach((to, from) => {
  // 改变路由加载状态
  store.commit('routerModel/routerLoading', false);
  NProgress.done();
  // tool.refreshToken();
});

export default router;
