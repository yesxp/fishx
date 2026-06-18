/**
 * 钓点 API - 腾讯云开发版
 */

import { getDB, getAuth } from '@/lib/cloudbase'

// 钓点类型定义
export interface Spot {
  _id?: string
  name: string
  type: 'lake' | 'river' | 'pond' | 'wild' | 'sea'
  lat: number
  lng: number
  address: string
  province?: string
  city?: string
  district?: string
  description?: string
  fish_types: string[]
  images: string[]
  tags: string[]
  emoji: string
  rating: number
  review_count: number
  catch_count: number
  is_paid: boolean
  is_pit: boolean
  created_by?: string
  created_at?: Date
  updated_at?: Date
}

// 获取钓点列表
export async function getSpotList(params?: {
  lat?: number
  lng?: number
  radius?: number
  type?: string
  city?: string
  page?: number
  pageSize?: number
}) {
  try {
    const db = await getDB()
    const collection = db.collection('spots')
    let query = collection

    // 类型筛选
    if (params?.type && params.type !== '全部') {
      const typeMap: Record<string, string> = {
        '路亚': 'lure',
        '台钓': 'float',
        '海钓': 'sea',
      }
      const dbType = typeMap[params.type] || params.type
      query = query.where({ type: dbType })
    }

    // 城市筛选
    if (params?.city) {
      query = query.where({ city: params.city })
    }

    // 分页
    const page = params?.page || 1
    const pageSize = params?.pageSize || 20
    const skip = (page - 1) * pageSize

    const result = await query
      .orderBy('created_at', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get()

    console.log('[SpotAPI] 获取钓点成功:', result.data?.length, '条')
    return {
      code: 0,
      data: result.data as Spot[],
      total: result.total,
    }
  } catch (error) {
    console.error('[SpotAPI] 获取钓点列表失败:', error)
    return { code: -1, data: [], message: '获取失败' }
  }
}

// 获取钓点详情
export async function getSpotDetail(id: string) {
  try {
    const db = await getDB()
    const result = await db.collection('spots').doc(id).get()
    return {
      code: 0,
      data: result.data as Spot,
    }
  } catch (error) {
    console.error('[SpotAPI] 获取钓点详情失败:', error)
    return { code: -1, data: null, message: '获取失败' }
  }
}

// 创建钓点
export async function createSpot(data: Omit<Spot, '_id' | 'created_at' | 'updated_at'>) {
  try {
    const db = await getDB()
    const now = new Date()
    const result = await db.collection('spots').add({
      ...data,
      rating: 0,
      review_count: 0,
      catch_count: 0,
      created_at: now,
      updated_at: now,
    })
    return {
      code: 0,
      data: { _id: result._id },
      message: '创建成功',
    }
  } catch (error) {
    console.error('[SpotAPI] 创建钓点失败:', error)
    return { code: -1, message: '创建失败' }
  }
}

// 更新钓点
export async function updateSpot(id: string, data: Partial<Spot>) {
  try {
    const db = await getDB()
    await db.collection('spots').doc(id).update({
      ...data,
      updated_at: new Date(),
    })
    return { code: 0, message: '更新成功' }
  } catch (error) {
    console.error('[SpotAPI] 更新钓点失败:', error)
    return { code: -1, message: '更新失败' }
  }
}

// 删除钓点
export async function deleteSpot(id: string) {
  try {
    const db = await getDB()
    await db.collection('spots').doc(id).remove()
    return { code: 0, message: '删除成功' }
  } catch (error) {
    console.error('[SpotAPI] 删除钓点失败:', error)
    return { code: -1, message: '删除失败' }
  }
}

// 打卡（增加渔获数）
export async function checkIn(spotId: string) {
  try {
    const db = await getDB()
    await db.collection('spots').doc(spotId).update({
      catch_count: db.command.inc(1),
      updated_at: new Date(),
    })
    return { code: 0, message: '打卡成功' }
  } catch (error) {
    console.error('[SpotAPI] 打卡失败:', error)
    return { code: -1, message: '打卡失败' }
  }
}

// 上传钓点图片
export async function uploadSpotImage(filePath: string, spotId: string) {
  try {
    const { getStorage } = await import('@/lib/cloudbase')
    const storage = await getStorage()
    const cloudPath = `spots/${spotId}/${Date.now()}.jpg`
    const result = await storage.upload({
      cloudPath,
      filePath,
    })
    return {
      code: 0,
      data: { fileID: result.fileID },
    }
  } catch (error) {
    console.error('[SpotAPI] 上传图片失败:', error)
    return { code: -1, message: '上传失败' }
  }
}
