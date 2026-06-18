/**
 * 腾讯云开发 SDK 初始化
 */

let app: any = null
let db: any = null
let auth: any = null
let storage: any = null
let initPromise: Promise<any> | null = null

const ENV_ID = 'fishx-d4gd8ef9uc92d3227'

// 初始化（只执行一次）
async function initCloud() {
  if (app) return app
  if (initPromise) return initPromise
  
  initPromise = (async () => {
    try {
      // 动态导入（浏览器兼容）
      const cloudbaseModule = await import('@cloudbase/js-sdk')
      const adapterModule = await import('@cloudbase/adapter-uni-app')
      
      const cloudbase = cloudbaseModule.default
      const adapter = adapterModule.default
      
      // 初始化适配器
      const options = {
        uni: typeof uni !== 'undefined' ? uni : {},
      }
      
      cloudbase.useAdapters(adapter, options)
      
      // 初始化云开发
      app = cloudbase.init({
        env: ENV_ID,
      })
      
      db = app.database()
      auth = app.auth()
      storage = app.storage()
      
      console.log('[CloudBase] SDK 初始化成功')
      
      // 自动匿名登录
      await anonymousLogin()
      
    } catch (error) {
      console.error('[CloudBase] 初始化失败:', error)
      // 创建 mock 对象
      db = createMockDB()
    }
    
    return app
  })()
  
  return initPromise
}

// 匿名登录
async function anonymousLogin() {
  if (!auth) return
  
  try {
    const loginState = await auth.getLoginState()
    if (loginState) {
      console.log('[CloudBase] 已登录')
      return
    }
    
    await auth.signInAnonymously()
    console.log('[CloudBase] 匿名登录成功')
  } catch (error) {
    console.error('[CloudBase] 匿名登录失败:', error)
  }
}

// Mock 数据库
function createMockDB() {
  return {
    collection: (name: string) => ({
      where: (query: any) => createMockQuery([]),
      orderBy: () => createMockQuery([]),
      skip: () => createMockQuery([]),
      limit: () => createMockQuery([]),
      get: async () => ({ data: [], total: 0 }),
      count: async () => ({ total: 0 }),
      add: async () => ({ _id: 'mock_id' }),
      doc: (id: string) => ({
        get: async () => ({ data: null }),
        update: async () => ({}),
        remove: async () => ({}),
      }),
    }),
    command: {
      inc: (n: number) => n,
    },
  }
}

function createMockQuery(data: any[]) {
  return {
    where: () => createMockQuery(data),
    orderBy: () => createMockQuery(data),
    skip: () => createMockQuery(data),
    limit: () => createMockQuery(data),
    get: async () => ({ data, total: data.length }),
    count: async () => ({ total: data.length }),
  }
}

// 导出（确保初始化完成）
export async function getDB() {
  if (!db) await initCloud()
  return db
}

export async function getAuth() {
  if (!auth) await initCloud()
  return auth
}

export async function getStorage() {
  if (!storage) await initCloud()
  return storage
}

export async function getApp() {
  if (!app) await initCloud()
  return app
}

// 云函数调用
export async function callFunction(name: string, data?: any) {
  try {
    const cloudApp = await getApp()
    const result = await cloudApp.callFunction({
      name,
      data,
    })
    return result
  } catch (error) {
    console.error(`云函数 ${name} 调用失败:`, error)
    throw error
  }
}

export default { getDB, getAuth, getStorage, getApp, callFunction }
