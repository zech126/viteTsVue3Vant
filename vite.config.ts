import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'; // 用于支持 vueJsx 文件打包
import viteCompression from 'vite-plugin-compression'; // 用于支持压缩代表， 即生成 gzip 文件
import styleImport, { VantResolve } from 'vite-plugin-style-import'; // 自动按需引入 Vant 组件
import postCssPxToRem from 'postcss-pxtorem';

const path = require('path');
// 输出目录
const projectName = 'dist';
const assetsName = 'static';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(), vueJsx(), viteCompression(),
    styleImport({
      libs: [
        {
          libraryName: 'vant',
          esModule: true,
          resolveStyle: (name) => `vant/es/${name}/style/index`,
        }
      ],
      resolves: [VantResolve()],
    })
  ],
  root: process.cwd(),
  base: "./",
  //控制台输出的级别 info 、warn、error、silent
  logLevel: "info",
  // 设为false 可以避免 vite 清屏而错过在终端中打印某些关键信息
  // clearScreen:true,
  // 用于加载 env 文件的目录。可以是一个绝对路径，也可以是相对于项目根的路径。默认 root
  envDir: './evnConfig/',
  // 自定义 env 变量的前缀
  // envPrefix: [],
  // 配置文件别名
  resolve: {
    // 忽略文件导入后缀名称（设置之将覆盖默认设置，建议使用默认）
    // extensions: ['.js', '.vue', '.json', 'jsx'],
    // 使用别名并且TS框架时，需要到到 tsconfig.js 文件配置 path 属性自定义引入的路径
    alias: [
      // 图片文件别名
      { find: '@images', replacement: path.resolve(__dirname, './src/assets/images') },
      // src 根目录别名
      { find: '@', replacement: path.resolve(__dirname, './src') },
      { find: '@views', replacement: path.resolve(__dirname, './src/views') },
      { find: '$api', replacement: path.resolve(__dirname, './src/api/APIConfig.ts') },
      { find: '$common', replacement: path.resolve(__dirname, './src/utils/common.ts') },
      { find: '$request', replacement: path.resolve(__dirname, './src/utils/request.ts') }
    ]
  },
  // 打包配置
  build: {
    //浏览器兼容性  "esnext"|"modules"
    target: "modules",
    outDir: `${projectName}`, //指定输出路径
    assetsDir: assetsName, // 指定生成静态资源的存放路径
    // 打包文件设置
    rollupOptions: {
      // 入口文件配置
      input: {
        index: path.resolve(__dirname, "index.html"),
        // project: path.resolve(__dirname,"project.html")
      },
      // 输出
      output: {
        // 用于命名代码拆分时创建的共享块的输出命名
        chunkFileNames: `${assetsName}/js/[name]-[hash].js`,
        // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
        entryFileNames: `${assetsName}/js/[name]-[hash].js`,
        // 用于输出静态资源的命名，[ext]表示文件扩展名
        assetFileNames: `${assetsName}/[name]-[hash].[ext]`,
        // 拆分依赖包
        manualChunks(directory) {
          if (directory.includes('node_modules')) {
            return directory.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    },
    // @rollup/plugin-commonjs 插件的选项
    commonjsOptions: {},
    //当设置为 true，构建后将会生成 manifest.json 文件
    // manifest: false,
    /* 
      设置为 false 可以禁用最小化混淆，
      或是用来指定使用哪种混淆器, terser 构建后文件体积更小
      boolean | 'terser' | 'esbuild'
    */
    minify: "terser",
    //传递给 Terser 的更多 minify 选项。
    terserOptions: {},
  },
  server: {
    host: '0.0.0.0',
    port: 8457,
    // https: false, // 是否启用 http 2
    cors: true, // 为开发服务器配置 CORS , 默认启用并允许任何源
    open: true, // 在服务器启动时自动在浏览器中打开应用程序
    strictPort: false, // 设为true时端口被占用则直接退出，不会尝试下一个可用端口
    // force: true, // 是否强制依赖预构建
    hmr: { overlay: true },
    // 传递给 chockidar 的文件系统监视器选项
    // watch: {
    //   ignored:["!**/node_modules/your-package-name/**"]
    // },
    // 反向代理配置，注意 rewrite 写法
    // proxy: {
    //     '/api': {
    //     target: 'http://192.168.0.2:8080', 
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, '')
    //   }
    // }
  },
  // 强制预构建插件包
  optimizeDeps: {
    // 检测需要预构建的依赖项
    entries: [],
    // 默认情况下，不在 node_modules 中的，链接的包不会预构建
    // include: [
    //   'vue', 'axios', 'nprogress', 'vue-router', 'vuex', 'element-plus', 'js-cookie', '@element-plus/icons-vue',
    //   'dayjs'
    // ],
    include: [],
    // exclude:['your-package-name'] //排除在优化之外
  },
  css: {
    // 在开发过程中是否启用 sourcemap。
    // devSourcemap: true,
    // 配置 css modules 的行为, 需要安装 postcss-modules 依赖
    modules: {
      // generateScopedName: function (name, filename, css) {
      //   const i = css.indexOf(`.${name}`);
      //   const line = css.substring(0, i).split(/[\r\n]/).length;
      //   const file = path.basename(filename, ".css");
      //   return `${file}_${line}_${name}`;
      // }
    },
    // postCss 配置
    postcss: {
      plugins: [
        // 前缀追加
        require('autoprefixer')({
          overrideBrowserslist: [
            'Android 4.1',
            'iOS 7.1',
            'Chrome > 31',
            'ff > 31',
            'ie >= 8',
            '> 1%',
            // 所有主流浏览器最近10版本用
            'last 10 versions',
          ],
          grid: true,
        }),
        postCssPxToRem({
          // 1rem的大小
          rootValue: 37.5,
          // rootValue({ file }) { // 当设计稿的尺寸不是 375，而是 750 或其他大小时
          //   return file.indexOf('vant') !== -1 ? 37.5 : 75;
          // },
          // 转rem精确到小数点多少位
          unitPrecision: 8,
          // 需要进行转换的css属性的值，可以使用通配符。如：*意思是将全部属性单位都进行转换；
          propList: ['*'],
          // 不进行单位转换的选择器。如设置为字符串body，则所有含有body字符串的选择器都不会被该插件进行转换；若设置为[/^body$/]，则body会被匹配到而不是.body
          selectorBlackList: [],
          // 不需要进行单位转换的文件
          exclud: [],
          // 是否允许像素在媒体查询中进行转换
          mediaQuery: true,
          // 小于指定数值的px不转换
          minPixelValue: 0
        })
      ]
    },
    //指定传递给 css 预处理器的选项
    preprocessorOptions: {
      // less 全局变量
      less: {
        javascriptEnabled: true,
        additionalData: `@import "${path.resolve(__dirname, 'src/assets/style/variable.less')}";`
      }
    }
  },
  json: {
    //是否支持从 .json 文件中进行按名导入
    namedExports: true,
    //若设置为 true 导入的json会被转为 export default JSON.parse("..") 会比转译成对象字面量性能更好
    stringify: false
  },
   //继承自 esbuild 转换选项，最常见的用例是自定义 JSX/TSX
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment",
    jsxInject:`import Vue from 'vue'`
  },
})
