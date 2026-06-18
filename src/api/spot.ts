/**
 * 钓点 API
 * 
 * H5 端：mock 数据（开发调试用）
 * 小程序/App：真实 CloudBase
 */

// 判断运行环境
function isH5(): boolean {
  // #ifdef H5
  return true
  // #endif
  // #ifndef H5
  return false
  // #endif
}

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

// Mock 数据
const mockSpots: Spot[] = [
  {
    _id: 'mock_1',
    name: '西湖钓点',
    type: 'lake',
    lat: 30.25,
    lng: 120.15,
    address: '浙江省杭州市西湖区西湖风景区',
    province: '浙江',
    city: '杭州',
    district: '西湖区',
    description: '风景优美，适合休闲垂钓',
    fish_types: ['鲫鱼', '鲤鱼', '草鱼'],
    images: [],
    tags: ['免费', '风景好'],
    emoji: '🏞️',
    rating: 4.8,
    review_count: 25,
    catch_count: 128,
    is_paid: false,
    is_pit: false,
  },
  {
    _id: 'mock_2',
    name: '老王钓场',
    type: 'pond',
    lat: 30.28,
    lng: 120.18,
    address: '浙江省杭州市余杭区良渚街道',
    province: '浙江',
    city: '杭州',
    district: '余杭区',
    description: '专业黑坑，鱼种丰富',
    fish_types: ['鲤鱼', '草鱼', '鲢鱼', '鳙鱼'],
    images: [],
    tags: ['收费', '黑坑'],
    emoji: '🐟',
    rating: 4.5,
    review_count: 18,
    catch_count: 89,
    is_paid: true,
    is_pit: true,
  },
  {
    _id: 'mock_3',
    name: '千岛湖大坝',
    type: 'wild',
    lat: 29.6,
    lng: 119.0,
    address: '浙江省杭州市淳安县千岛湖镇',
    province: '浙江',
    city: '杭州',
    district: '淳安县',
    description: '野钓胜地，大物频出',
    fish_types: ['鲤鱼', '草鱼', '青鱼', '翘嘴'],
    images: [],
    tags: ['免费', '野钓', '大物'],
    emoji: '⛰️',
    rating: 4.9,
    review_count: 42,
    catch_count: 203,
    is_paid: false,
    is_pit: false,
  },
  {
    _id: 'mock_4',
    name: '龙王塘',
    type: 'pond',
    lat: 30.32,
    lng: 120.22,
    address: '浙江省杭州市萧山区党湾镇',
    province: '浙江',
    city: '杭州',
    district: '萧山区',
    description: '老字号钓场，老板人好',
    fish_types: ['鲫鱼', '鲤鱼'],
    images: [],
    tags: ['收费', '黑坑', '老字号'],
    emoji: '🎣',
    rating: 4.2,
    review_count: 12,
    catch_count: 56,
    is_paid: true,
    is_pit: true,
  },
]

// H5 端使用 mock 数据
function mockGetSpotList(params?: { type?: string; city?: string; page?: number; pageSize?: number }) {
  let data = [...mockSpots]
  
  // 类型筛选
  if (params?.type && params.type !== '全部') {
    const typeMap: Record<string, string> = {
      '路亚': 'lure',
      '台钓': 'float',
      '海钓': 'sea',
    }
    const dbType = typeMap[params.type] || params.type
    data = data.filter(s => s.type === dbType)
  }
  
  return { code: 0, data, total: data.length }
}

function mockGetSpotDetail(id: string) {
  const spot = mockSpots.find(s => s._id === id) || mockSpots[0]
  return { code: 0, data: spot }
}

// 真实 CloudBase（小程序/App 端）
async function realGetSpotList(params?: { type?: string; city?: string; page?: number; pageSize?: number }) {
  try {
    const { getDB } = await import('@/lib/cloudbase')
    const db = await getDB()
    const collection = db.collection('spots')
    let query = collection

    if (params?.type && params.type !== '全部') {
      const typeMap: Record<string, string> = {
        '路亚': 'lure',
        '台钓': 'float',
        '海钓': 'sea',
      }
      const dbType = typeMap[params.type] || params.type
      query = query.where({ type: dbType })
    }

    if (params?.city) {
      query = query.where({ city: params.city })
    }

    const page = params?.page || 1
    const pageSize = params?.pageSize || 20
    const skip = (page - 1) * pageSize

    const result = await query
      .orderBy('created_at', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get()

    return { code: 0, data: result.data as Spot[], total: result.total }
  } catch (error) {
    console.error('[SpotAPI] CloudBase 查询失败:', error)
    // 降级到 mock 数据
    return mockGetSpotList(params)
  }
}

async function realGetSpotDetail(id: string) {
  try {
    const { getDB } = await import('@/lib/cloudbase')
    const db = await getDB()
    const result = await db.collection('spots').doc(id).get()
    return { code: 0, data: result.data as Spot }
  } catch (error) {
    console.error('[SpotAPI] CloudBase 查询失败:', error)
    return mockGetSpotDetail(id)
  }
}

// 导出统一接口
export async function getSpotList(params?: { type?: string; city?: string; page?: number; pageSize?: number }) {
  // #ifdef H5
  console.log('[SpotAPI] H5 模式，使用 mock 数据')
  return mockGetSpotList(params)
  // #endif
  
  // #ifndef H5
  console.log('[SpotAPI] 小程序/App 模式，使用 CloudBase')
  return realGetSpotList(params)
  // #endif
}

export async function getSpotDetail(id: string) {
  // #ifdef H5
  return mockGetSpotDetail(id)
  // #endif
  
  // #ifndef H5
  return realGetSpotDetail(id)
  // #endif
}

export async function createSpot(data: Omit<Spot, '_id' | 'created_at' | 'updated_at'>) {
  // #ifdef H5
  return { code: 0, data: { _id: 'mock_new_' + Date.now() }, message: '创建成功（mock）' }
  // #endif
  
  // #ifndef H5
  try {
    const { getDB } = await import('@/lib/cloudbase')
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
    return { code: 0, data: { _id: result._id }, message: '创建成功' }
  } catch (error) {
    return { code: -1, message: '创建失败' }
  }
  // #endif
}

export async function updateSpot(id: string, data: Partial<Spot>) {
  // #ifdef H5
  return { code: 0, message: '更新成功（mock）' }
  // #endif
  
  // #ifndef H5
  try {
    const { getDB } = await import('@/lib/cloudbase')
    const db = await getDB()
    await db.collection('spots').doc(id).update({
      ...data,
      updated_at: new Date(),
    })
    return { code: 0, message: '更新成功' }
  } catch (error) {
    return { code: -1, message: '更新失败' }
  }
  // #endif
}

export async function deleteSpot(id: string) {
  // #ifdef H5
  return { code: 0, message: '删除成功（mock）' }
  // #endif
  
  // #ifndef H5
  try {
    const { getDB } = await import('@/lib/cloudbase')
    const db = await getDB()
    await db.collection('spots').doc(id).remove()
    return { code: 0, message: '删除成功' }
  } catch (error) {
    return { code: -1, message: '删除失败' }
  }
  // #endif
}

export async function checkIn(spotId: string) {
  // #ifdef H5
  return { code: 0, message: '打卡成功（mock）' }
  // #endif
  
  // #ifndef H5
  try {
    const { getDB } = await import('@/lib/cloudbase')
    const db = await getDB()
    await db.collection('spots').doc(spotId).update({
      catch_count: db.command.inc(1),
      updated_at: new Date(),
    })
    return { code: 0, message: '打卡成功' }
  } catch (error) {
    return { code: -1, message: '打卡失败' }
  }
  // #endif
}
