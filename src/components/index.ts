// 获取所有组件文件
const tsFiles = import.meta.globEager('../components/*/index.ts');
const jsFiles = import.meta.globEager('../components/*/index.js');
const tsxFiles = import.meta.globEager('../components/*/index.tsx');
const jsxFiles = import.meta.globEager('../components/*/index.jsx');
const vueFiles = import.meta.globEager('../components/*/index.vue');
const files = {...tsFiles, ...jsFiles, ...tsxFiles, ...jsxFiles, ...vueFiles};
const start = '/components/';
const end = '/index.';
let fileCont:{ name?:string; '__name'?:string } = {};
let comKey:{[key:string]:string} = {};
let componentName:{[key:string]:boolean} = {};
const install = (app:any) => {
  Object.keys(files).forEach((key) => {
    fileCont = files[key].default;
    if (!fileCont) return;
    comKey[key] = fileCont.name ? fileCont.name : key.substring(key.lastIndexOf(start) + start.length, key.lastIndexOf(end));
    if (componentName[comKey[key]]) {
      console.error(`${key} 导入名为 ${comKey[key]} 组件名但 ${comKey[key]} 已被注册，请将重新命名`);
      return;
    }
    componentName[comKey[key]] = true;
    // 注册组件
    app.component(comKey[key], fileCont);
  })
};
export default install;