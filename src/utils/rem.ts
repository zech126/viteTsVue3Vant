// 自定义设置, 此次设置需要和 vite.coonfig.js 中的 rootValue 的值一致
const rootValue = 37.5;
// 最大倍数
const amplification = 2;
// 设置 rem 函数
const setRem = () => {
  // 当前缩放比例，可根据自己需要修改。
  const scale = document.documentElement.clientWidth / (rootValue * 10);
  // 设置页面根节点字体大小
  document.documentElement.style.fontSize = rootValue * Math.min(scale, amplification) + 'px';
  // document.querySelector('body').style.fontSize = rootValue * Math.min(scale, 2) + 'px';
}
// 初始化
setRem();
// 改变窗口大小时重新设置 rem
window.onresize = () => {
  setRem();
}
