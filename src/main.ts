import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// 初始化腾讯云开发
import '@/lib/cloudbase'

export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()
  app.use(pinia)
  return { app }
}
