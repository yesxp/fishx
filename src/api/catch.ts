// 渔获相关 API
// 底层：storage 抽象层（开发期 LocalStorage / 生产期可替换 SQLite/TCB）

import { catchStore } from '@/utils/storage'

export interface CatchRecord {
  id: string
  fishName: string
  fishEmoji: string
  imagePath: string
  location: string
  weather: string
  temperature: string
  time: string
  isPrivate: boolean
  userId: string
}

// 新版鱼获 payload（与 schema.dev.sql 对齐）
export interface CatchPayload {
  species_name: string
  species_emoji: string
  species_confidence: number
  photo_urls: string[]
  primary_photo_index: number
  weight_estimated_g: number
  weight_g: number | null
  weight_confirmed: 0 | 1
  spot_geo_lat: number
  spot_geo_lng: number
  spot_name: string
  method: string
  bait: string[]
  mood_tags: string[]
  note: string
}

// 创建渔获记录（旧接口，向后兼容）
export async function createCatch(data: Partial<CatchRecord>) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: {
          id: 'catch_' + Date.now(),
          ...data,
          time: data.time || new Date().toISOString()
        }
      })
    }, 300)
  })
}

/**
 * 保存鱼获（新接口，匹配 schema.dev.sql）
 */
export async function saveCatch(payload: CatchPayload): Promise<{ id: string }> {
  return new Promise((resolve, reject) => {
    try {
      const newRecord = {
        id: 'catch_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
        user_id: 'dev_user',
        species_id: null, // TODO: 用 species_name 查 sp-001 ~ sp-008
        ...payload,
        caught_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      catchStore.save(newRecord)
      // 模拟网络延迟
      setTimeout(() => resolve({ id: newRecord.id }), 200)
    } catch (e) {
      reject(e)
    }
  })
}

// 获取渔获列表（mock，保留旧接口）
export async function getCatchList(params?: {
  page?: number
  pageSize?: number
  userId?: string
}) {
  const mockList: CatchRecord[] = [
    {
      id: '1',
      fishName: '鲫鱼',
      fishEmoji: '🐟',
      imagePath: '',
      location: '崇明东滩',
      weather: '多云',
      temperature: '26°',
      time: new Date().toISOString(),
      isPrivate: false,
      userId: 'user1'
    },
    {
      id: '2',
      fishName: '鲤鱼',
      fishEmoji: '🐠',
      imagePath: '',
      location: '淀山湖',
      weather: '晴',
      temperature: '28°',
      time: new Date(Date.now() - 3600000).toISOString(),
      isPrivate: false,
      userId: 'user1'
    },
  ]
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: {
          list: mockList,
          total: mockList.length
        }
      })
    }, 300)
  })
}

/**
 * 从 storage 获取所有鱼获
 */
export function getLocalCatches(): any[] {
  return catchStore.list()
}

// 删除渔获
export async function deleteCatch(id: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      catchStore.remove(id)
      resolve({ code: 0, message: '删除成功' })
    }, 300)
  })
}
