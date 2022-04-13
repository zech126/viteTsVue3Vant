// 自定义设置, 此次设置需要和 vite.coonfig.js 中的 rootValue 的值一致
const rootValue = 37.5;
// 缩放最大倍数, 默认最小为1(该处缩放倍数建议与 index.html 设置的一致)
const amplification = 2;
const addClassName = (element:any, name:string) => {
  // const body:any = document.querySelector('body');
  let className = element.className.split(' ');
  if (!element.className.includes(name)) {
    className.push(name);
    element.className = className.join(' ').trim();
  }
}
const removeClassName = (element:any, name:string) => {
  let className:any = element.className.split(' ');
  if (className.includes(name)) {
    className.splice(className.indexOf(name), 1);
    element.className = className.join(' ').trim();
  }
}
// 设置 rem 函数
const setRem = ( isDirection:string = 'auto') => {
  const clientWidth = document.documentElement.clientWidth;
  const clientHeight = document.documentElement.clientHeight;
  const vWidth =  isDirection === 'vertical' ? Math.min(clientWidth, clientHeight) : isDirection === 'cross' ? Math.max(clientWidth, clientHeight) : clientWidth;
  // 当前缩放比例，可根据自己需要修改。
  const scale = vWidth / (rootValue * 10);
  // 设置页面根节点字体大小
  document.documentElement.style.fontSize = rootValue * Math.min(scale, amplification) + 'px';
}
const detectOrient = (isDirection:string = 'auto') => {
  if (isDirection === 'auto') {
    setRem();
    return;
  }
  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;
  const $html:any = document.querySelector('html');
  let  style = "";
  if (width <= height) {
    // 当前为竖屏时
    if (isDirection === 'cross') {
      addClassName(document.querySelector('body'), `app-view-${isDirection}`);
      // 竖屏转为横屏
      style += "width: 100vmax;";
      style += "height: 100vmin;";
      style += "-webkit-transform: rotate(-90deg); transform: rotate(-90deg);";
      // 注意旋转中点的处理
      style += "-webkit-transform-origin: " + height / 2 + "px " + (height / 2) + "px;";
      style += "transform-origin: " + height / 2 + "px " + (height / 2) + "px;";
      style += "overflow-y: hidden;";
      $html.style.cssText = style;
      setRem(isDirection);
      return;
    }
    $html.style.cssText = style;
    removeClassName(document.querySelector('body'), 'app-view-vertical');
    removeClassName(document.querySelector('body'), 'app-view-cross');
    setRem(isDirection);
  } else {
    // 当前为横屏时
    if (isDirection === 'vertical') {
      addClassName(document.querySelector('body'), `app-view-${isDirection}`);
      // 横屏转为竖屏
      style += "width: 100vmin;";
      style += "height: 100vmax;";
      style += "-webkit-transform: rotate(-90deg); transform: rotate(-90deg);";
      // 注意旋转中点的处理
      style += "-webkit-transform-origin: " + height / 2 + "px " + (height / 2) + "px;";
      style += "transform-origin: " + height / 2 + "px " + (height / 2) + "px;";
      style += "overflow-y: hidden;";
      $html.style.cssText = style;
      setRem(isDirection);
      return;
    }
    $html.style.cssText = style;
    removeClassName(document.querySelector('body'), 'app-view-vertical');
    removeClassName(document.querySelector('body'), 'app-view-cross');
    setRem(isDirection);
  }
}

const initRem = (isDirection:string = 'auto') => {
  // 初始化
  detectOrient(isDirection);
  // 监听窗口改变
  window.addEventListener('resize', () => {
    detectOrient( isDirection);
  });
}

export default initRem;