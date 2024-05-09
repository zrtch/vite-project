import { defineConfig, normalizePath } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import checker from "vite-plugin-checker";
import svgr from "vite-plugin-svgr";
import imagemin from "unplugin-imagemin/vite";
import virtual from "./src/plugins/virtual-module";
import inspect from "vite-plugin-inspect";
import { visualizer } from "rollup-plugin-visualizer";
import ViteRestart from "vite-plugin-restart";
import viteCompression from "vite-plugin-compression";

// 全局 scss 文件的路径
// 用 normalizePath 解决 window 下的路径问题
const variablePath = normalizePath(path.resolve("./src/variable.scss"));

// 是否为生产环境，在生产环境一般会注入 NODE_ENV 这个环境变量，见下面的环境变量文件配置
const isProduction = process.env.NODE_ENV === "production";
// 填入项目的 CDN 域名地址
const CDN_URL = "https://sanyuan.cos.ap-beijing.myqcloud.com";

export default defineConfig({
  base: isProduction ? CDN_URL : "/",
  css: {
    // 预处理器配置
    preprocessorOptions: {
      scss: {
        // additionalData 的内容会在每个 scss 文件的开头自动注入
        additionalData: `@import "${variablePath}";`
      }
    },
    // css module配置
    modules: {
      // 一般我们可以通过 generateScopedName 属性来对生成的类名进行自定义
      // 其中，name 表示当前文件名，local 表示类名
      generateScopedName: "[name]__local___[hash:base64:5]"
    },
    // PostCSS 配置
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer({
          // 指定目标浏览器
          overrideBrowserslist: ["Chrome > 40", "ff > 31", "ie 11"]
        })
      ]
    }
  },
  plugins: [
    react({
      babel: {
        // 加入 babel 插件
        plugins: [
          // 适配 styled-component
          "babel-plugin-styled-components"
        ]
      }
    }),
    checker({
      // e.g. use TypeScript check
      typescript: true
      // eslint: {
      //   // for example, lint .ts and .tsx
      //   lintCommand: 'eslint "./src/**/*.{ts,tsx}"'
      // }
    }),
    // SVG 组件方式加载
    svgr(),
    // 图片压缩
    imagemin(),
    virtual(),
    // 开发调试
    inspect(),
    // 打包分析插件
    visualizer(),
    // 监听文件修改，自动重启vite
    ViteRestart({
      restart: ["my.config.[jt]s"]
    }),
    // 压缩资源
    viteCompression()
  ],
  resolve: {
    // 别名配置
    alias: {
      "@/assets": path.join(__dirname, "src/assets")
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // 让每个插件都打包成独立的文件
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        }
      }
    },
    // 4 KB即为提取成单文件的临界值
    assetsInlineLimit: 4 * 1024
  },
  optimizeDeps: {
    exclude: ["@loadable/component"],
    include: [
      // 间接依赖的声明语法，通过`>`分开, 如`a > b`表示 a 中依赖的 b
      "@loadable/component > hoist-non-react-statics"
    ],
    esbuildOptions: {
      plugins: [
        // 加入 Esbuild 插件
      ]
    }
  }
});
