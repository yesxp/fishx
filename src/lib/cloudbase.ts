/**
 * 腾讯云开发 SDK 初始化
 */

let app: any = null
let db: any = null
let auth: any = null
let storage: any = null
let isLoggedIn = false

const ENV_ID = 'fishx-d4gd8ef9uc92d3227'

// 延迟初始化，确保 uni 已定义
async function initCloud() {
  if (app) return app
  
  try {
    // 动态导入，避免 SSR 报错
    const cloudbase = require('@cloudbase/js-sdk').default
    const adapter = require('@cloudbase/adapter-uni-app').default
    
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
    // 创建 mock 对象，避免页面报错
    db = createMockDB()
  }
  
  return app
}

// 匿名登录
async function anonymousLogin() {
  if (isLoggedIn || !auth) return
  
  try {
    // 检查是否已登录
    const loginState = await auth.getLoginState()
    if (loginState) {
      console.log('[CloudBase] 已登录')
      isLoggedIn = true
      return
    }
    
    // 匿名登录
    await auth.signInAnonymously()
    console.log('[CloudBase] 匿名登录成功')
    isLoggedIn = true
  } catch (error) {
    console.error('[CloudBase] 匿名登录失败:', error)
    // 登录失败不影响数据读取（如果权限允许）
  }
}

// Mock 数据库对象（CloudBase 失败时使用）
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

// 懒加载 getter
export function getDB() {
  if (!db) initCloud()
  return db
}

export function getAuth() {
  if (!auth) initCloud()
  return auth
}

export function getStorage() {
  if (!storage) initCloud()
  return storage
}

export function getApp() {
  if (!app) initCloud()
  return app
}

// 云函数调用
export async function callFunction(name: string, data?: any) {
  try {
    const cloudApp = getApp()
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
