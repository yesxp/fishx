/**
 * 腾讯云开发 SDK 初始化
 * 
 * 使用方法：
 * 1. 在腾讯云开发控制台获取环境ID
 * 2. 替换下方 ENV_ID
 * 3. 在 main.ts 中 import 并调用 initCloud()
 */

import cloudbase from '@cloudbase/js-sdk'
import adapter from '@cloudbase/adapter-uni-app'

// 云开发环境ID - 从腾讯云开发控制台获取
const ENV_ID = 'fishx-d4gd8ef9uc92d3227'

// 初始化适配器
const options = {
  uni: uni, // UniApp 全局对象
}

cloudbase.useAdapters(adapter, options)

// 初始化云开发
const app = cloudbase.init({
  env: ENV_ID,
})

// 导出常用模块
export const db = app.database()
export const auth = app.auth()
// @ts-ignore - storage 类型不完整
export const storage = app.storage()

// 导出云函数调用方法
export async function callFunction(name: string, data?: any) {
  try {
    const result = await app.callFunction({
      name,
      data,
    })
    return result
  } catch (error) {
    console.error(`云函数 ${name} 调用失败:`, error)
    throw error
  }
}

export default app
