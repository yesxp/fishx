// 渔获相关 API
// 底层：SQLite (sql.js) + IndexedDB Blob

import { bootstrap, catchStore, speciesStore } from '@/utils/storage'
import * as resource from '@/utils/resource'

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

export interface CatchPayload {
  species_name: string
  species_emoji: string
  species_confidence: number
  photo_blobs: Blob[]           // 原始图片（待上传到 resource）
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
  await bootstrap()
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
 * 保存鱼获（新接口，SQLite + IndexedDB）
 * 1. 上传图片到 IndexedDB → 拿 resource_id
 * 2. INSERT INTO catches (photo_urls = [resource_id])
 */
export async function saveCatch(payload: CatchPayload): Promise<{ id: string }> {
  await bootstrap()

  // 1. 上传所有图片
  const resourceIds: string[] = []
  for (const blob of payload.photo_blobs || []) {
    const id = await resource.upload(blob, 'image')
    resourceIds.push(id)
  }

  // 2. 查鱼种 ID（如果名称匹配）
  const species = speciesStore.getByName(payload.species_name)

  // 3. INSERT
  const id = `catch_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  catchStore.save({
    id,
    species_id: species?.id || null,
    species_name: payload.species_name,
    species_emoji: payload.species_emoji,
    species_confidence: payload.species_confidence,
    photo_urls: resourceIds,
    primary_photo_index: payload.primary_photo_index,
    weight_estimated_g: payload.weight_estimated_g,
    weight_g: payload.weight_g,
    weight_confirmed: payload.weight_confirmed,
    spot_geo_lat: payload.spot_geo_lat,
    spot_geo_lng: payload.spot_geo_lng,
    spot_name: payload.spot_name,
    method: payload.method,
    bait: payload.bait,
    mood_tags: payload.mood_tags,
    note: payload.note,
    caught_at: new Date().toISOString(),
  })

  return { id }
}

// 获取渔获列表（mock，保留旧接口）
export async function getCatchList() {
  await bootstrap()
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: {
          list: [],
          total: 0
        }
      })
    }, 300)
  })
}

/**
 * 从 SQLite 读取所有鱼获
 */
export async function getLocalCatches(): Promise<any[]> {
  await bootstrap()
  return catchStore.list()
}

/**
 * 按月分组
 */
export async function getCatchesByMonth(): Promise<Array<{ month: string; items: any[] }>> {
  await bootstrap()
  return catchStore.groupByMonth()
}

// 删除渔获
export async function deleteCatch(id: string) {
  await bootstrap()
  catchStore.remove(id)
  return { code: 0, message: '删除成功' }
}
