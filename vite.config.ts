import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock'
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 各个环境下的变量,第一个参数环境模式,第二个参数根地址index.html
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [
      vue(),
      viteMockServe({
        localEnabled: command === 'serve',
        mockPath: './src/mock',
      }),
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // Specify symbolId format
        symbolId: 'icon-[dir]-[name]',
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve('./src'), // 相对路径别名配置，使用 @ 代替 src
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/style/variable.scss";',
        },
      },
    },
    server: {
      // 代理跨域
      proxy: {
        // 等于/api,/prod-api,/test-api
        [env.VITE_APP_BASE_API]: {
          // 服务器地址
          target: env.VITE_SERVE,
          // 是否代理跨域
          changeOrigin: true,
          // 是否路径重写,把api替换为空串
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
