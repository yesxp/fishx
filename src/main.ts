import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { bootstrap } from './utils/storage'

export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()
  app.use(pinia)

  // 启动时初始化数据库（异步，不阻塞渲染）
  bootstrap().catch(err => {
    console.error('[Storage] 初始化失败:', err)
  })

  return { app }
}
// rebuild at 1782479889
