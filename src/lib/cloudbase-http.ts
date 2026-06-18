/**
 * 腾讯云开发 HTTP API 客户端
 * 
 * H5 端不走 SDK，直接调 HTTP API
 * 小程序/App 端走 SDK
 */

const ENV_ID = 'fishx-d4gd8ef9uc92d3227'
const API_BASE = `https://${ENV_ID}.service.tcloudbase.com`

let accessToken: string | null = null
let tokenExpiry = 0

// 获取 access_token（通过云函数）
async function getAccessToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken
  }
  
  try {
    // 调用云函数获取 token
    const res = await uni.request({
      url: `${API_BASE}/api/getToken`,
      method: 'POST',
    })
    
    if (res.data && (res.data as any).access_token) {
      accessToken = (res.data as any).access_token
      tokenExpiry = Date.now() + ((res.data as any).expires_in || 7200) * 1000 - 60000
      return accessToken!
    }
  } catch (error) {
    console.error('[CloudBase HTTP] 获取 token 失败:', error)
  }
  
  return ''
}

// 数据库查询
export async function dbQuery(collection: string, query?: any): Promise<any[]> {
  try {
    const token = await getAccessToken()
    if (!token) {
      console.warn('[CloudBase HTTP] 无 token，返回空数据')
      return []
    }
    
    // 构建查询条件
    let whereClause = ''
    if (query?.type && query.type !== '全部') {
      const typeMap: Record<string, string> = {
        '路亚': 'lure',
        '台钓': 'float',
        '海钓': 'sea',
      }
      const dbType = typeMap[query.type] || query.type
      whereClause = `where.type == "${dbType}"`
    }
    
    const res = await uni.request({
      url: `${API_BASE}/api/databaseQuery`,
      method: 'POST',
      header: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        collection,
        where: whereClause || undefined,
        orderBy: [['created_at', 'desc']],
        limit: query?.pageSize || 20,
        offset: query?.page ? (query.page - 1) * (query.pageSize || 20) : 0,
      },
    })
    
    if (res.data && (res.data as any).data) {
      return (res.data as any).data
    }
  } catch (error) {
    console.error('[CloudBase HTTP] 查询失败:', error)
  }
  
  return []
}

// 数据库插入
export async function dbAdd(collection: string, data: any): Promise<string | null> {
  try {
    const token = await getAccessToken()
    if (!token) return null
    
    const res = await uni.request({
      url: `${API_BASE}/api/databaseAdd`,
      method: 'POST',
      header: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        collection,
        data,
      },
    })
    
    if (res.data && (res.data as any).id) {
      return (res.data as any).id
    }
  } catch (error) {
    console.error('[CloudBase HTTP] 插入失败:', error)
  }
  
  return null
}

// 数据库更新
export async function dbUpdate(collection: string, docId: string, data: any): Promise<boolean> {
  try {
    const token = await getAccessToken()
    if (!token) return false
    
    await uni.request({
      url: `${API_BASE}/api/databaseUpdate`,
      method: 'POST',
      header: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        collection,
        docId,
        data,
      },
    })
    
    return true
  } catch (error) {
    console.error('[CloudBase HTTP] 更新失败:', error)
    return false
  }
}

// 数据库删除
export async function dbDelete(collection: string, docId: string): Promise<boolean> {
  try {
    const token = await getAccessToken()
    if (!token) return false
    
    await uni.request({
      url: `${API_BASE}/api/databaseDelete`,
      method: 'POST',
      header: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        collection,
        docId,
      },
    })
    
    return true
  } catch (error) {
    console.error('[CloudBase HTTP] 删除失败:', error)
    return false
  }
}

export default {
  dbQuery,
  dbAdd,
  dbUpdate,
  dbDelete,
}
