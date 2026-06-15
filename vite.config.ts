import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import { cloudflare } from "@cloudflare/vite-plugin"

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		// Vue 主插件，负责解析 .vue 单文件组件。
		vue(),
		// 本地开发时的 Vue DevTools 支持。
		vueDevTools(),
		// 让 Vite 开发环境和 Cloudflare Worker 入口协同工作。
		cloudflare()
	],
	resolve: {
		alias: {
			// 使用 @ 指向 src，减少相对路径层级。
			'@': fileURLToPath(new URL('./src', import.meta.url))
		},
	},
})
