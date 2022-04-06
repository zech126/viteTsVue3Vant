const routes = [
  {
    name: "测试1",
    path: "/test1",
    component: () => import("./page/myPage.vue"),
    meta: { requireAuth: false, keepAlive: false }
  },
  {
    name: "测试2",
    path: "/test2",
    component: () => import("./page/test.vue"),
    meta: { requireAuth: false,keepAlive: false }
  }
];
export default routes;
