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

// Mock 数据（丰富的测试数据）
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
    description: '风景优美，水质清澈，适合休闲垂钓。周末人较多，建议工作日前往。西湖醋鱼的原产地，据说这里的鲫鱼特别鲜美。',
    fish_types: ['鲫鱼', '鲤鱼', '草鱼', '鳊鱼'],
    images: [],
    tags: ['免费', '风景好', '停车方便', '适合新手'],
    emoji: '🏞️',
    rating: 4.8,
    review_count: 256,
    catch_count: 1280,
    is_paid: false,
    is_pit: false,
    created_at: new Date('2026-01-15'),
  },
  {
    _id: 'mock_2',
    name: '老王钓场',
    type: 'pond',
    lat: 30.28,
    lng: 120.18,
    address: '浙江省杭州市余杭区良渚街道老王路88号',
    province: '浙江',
    city: '杭州',
    district: '余杭区',
    description: '开了十年的老钓场，老板实在，鱼口好。每周三放新鱼，大物池有10斤以上青鱼。提供午饭，钓位费含鱼竿租赁。',
    fish_types: ['鲤鱼', '草鱼', '鲢鱼', '鳙鱼', '青鱼'],
    images: [],
    tags: ['收费', '黑坑', '有午饭', '大物池', '提供装备'],
    emoji: '🐟',
    rating: 4.6,
    review_count: 189,
    catch_count: 892,
    is_paid: true,
    is_pit: true,
    created_at: new Date('2026-02-20'),
  },
  {
    _id: 'mock_3',
    name: '千岛湖大坝',
    type: 'wild',
    lat: 29.6,
    lng: 119.0,
    address: '浙江省杭州市淳安县千岛湖镇大坝路',
    province: '浙江',
    city: '杭州',
    district: '淳安县',
    description: '野钓圣地，水质一流，大物频出。去年有人在这里钓到38斤青鱼！需要自带装备，没有商店，建议带足干粮和水。',
    fish_types: ['鲤鱼', '草鱼', '青鱼', '翘嘴', '鳜鱼', '鲶鱼'],
    images: [],
    tags: ['免费', '野钓', '大物', '风景绝美', '需自带装备'],
    emoji: '⛰️',
    rating: 4.9,
    review_count: 423,
    catch_count: 2034,
    is_paid: false,
    is_pit: false,
    created_at: new Date('2026-01-01'),
  },
  {
    _id: 'mock_4',
    name: '龙王塘路亚基地',
    type: 'pond',
    lat: 30.32,
    lng: 120.22,
    address: '浙江省杭州市萧山区党湾镇龙王路66号',
    province: '浙江',
    city: '杭州',
    district: '萧山区',
    description: '专业路亚基地，鲈鱼密度高，新手也能上鱼。定期放鱼，鱼口稳定。提供路亚装备租赁，有教练指导。',
    fish_types: ['鲈鱼', '翘嘴', '鳜鱼', '黑鱼'],
    images: [],
    tags: ['收费', '路亚', '新手友好', '提供装备', '有教练'],
    emoji: '🎣',
    rating: 4.7,
    review_count: 156,
    catch_count: 678,
    is_paid: true,
    is_pit: false,
    created_at: new Date('2026-03-10'),
  },
  {
    _id: 'mock_5',
    name: '钱塘江入海口',
    type: 'sea',
    lat: 30.4,
    lng: 121.0,
    address: '浙江省杭州市萧山区河庄街道钱塘江大堤',
    province: '浙江',
    city: '杭州',
    district: '萧山区',
    description: '海钓好去处，涨潮时鱼口活跃。主要目标鱼种为鲈鱼和黑鲷。注意安全，大堤湿滑。最佳钓点在3号闸口附近。',
    fish_types: ['鲈鱼', '黑鲷', '黄鱼', '梭鱼'],
    images: [],
    tags: ['免费', '海钓', '注意安全', '涨潮口好'],
    emoji: '🌊',
    rating: 4.3,
    review_count: 87,
    catch_count: 345,
    is_paid: false,
    is_pit: false,
    created_at: new Date('2026-04-05'),
  },
  {
    _id: 'mock_6',
    name: '富春江钓场',
    type: 'river',
    lat: 29.9,
    lng: 119.95,
    address: '浙江省杭州市桐庐县富春江镇',
    province: '浙江',
    city: '杭州',
    district: '桐庐县',
    description: '富春江畔，山水相依。江水清澈，野生鱼种丰富。推荐使用蚯蚓钓鲫鱼，效果极佳。附近有农家乐可以吃饭。',
    fish_types: ['鲫鱼', '鲤鱼', '鳊鱼', '白条', '黄颡鱼'],
    images: [],
    tags: ['免费', '河流', '风景好', '有农家乐'],
    emoji: '🏞️',
    rating: 4.5,
    review_count: 134,
    catch_count: 567,
    is_paid: false,
    is_pit: false,
    created_at: new Date('2026-02-14'),
  },
  {
    _id: 'mock_7',
    name: '临安天目山钓场',
    type: 'wild',
    lat: 30.2,
    lng: 119.7,
    address: '浙江省杭州市临安区天目山镇',
    province: '浙江',
    city: '杭州',
    district: '临安区',
    description: '山泉水钓场，水质极佳，鱼肉紧实鲜美。主要钓溪流鱼，适合喜欢清静的钓友。山路较陡，建议开SUV。',
    fish_types: ['石斑鱼', '溪哥', '马口', '白条'],
    images: [],
    tags: ['免费', '野钓', '山泉', '清静', '需越野车'],
    emoji: '🏔️',
    rating: 4.8,
    review_count: 67,
    catch_count: 234,
    is_paid: false,
    is_pit: false,
    created_at: new Date('2026-05-01'),
  },
  {
    _id: 'mock_8',
    name: '滨江黑坑之王',
    type: 'pond',
    lat: 30.21,
    lng: 120.2,
    address: '浙江省杭州市滨江区长河街道',
    province: '浙江',
    city: '杭州',
    district: '滨江区',
    description: '杭州最大的黑坑，每周五放鱼1000斤。高密度放鱼，爆护概率高。提供夜钓服务，灯光齐全。',
    fish_types: ['鲤鱼', '草鱼', '青鱼', '鲢鱼'],
    images: [],
    tags: ['收费', '黑坑', '高密度', '夜钓', '爆护率高'],
    emoji: '🏆',
    rating: 4.4,
    review_count: 312,
    catch_count: 1567,
    is_paid: true,
    is_pit: true,
    created_at: new Date('2026-03-20'),
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
        '河流': 'river',
        '湖泊': 'lake',
        '黑坑': 'pond',
        '野钓': 'wild',
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
