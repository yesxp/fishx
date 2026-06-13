// 钓点相关 API

export interface Spot {
  id: string
  name: string
  type: string
  lat: number
  lng: number
  rating: number
  catchCount: number
  fishTypes: string[]
  distance?: string
}

// 获取钓点列表
export async function getSpotList(params?: {
  lat?: number
  lng?: number
  radius?: number
}) {
  // 模拟数据
  const mockSpots: Spot[] = [
    {
      id: '1',
      name: '崇明东滩',
      type: '野钓',
      lat: 31.45,
      lng: 121.95,
      rating: 4.8,
      catchCount: 128,
      fishTypes: ['鲫鱼', '鲤鱼', '鲈鱼']
    },
    {
      id: '2',
      name: '淀山湖',
      type: '湖泊',
      lat: 31.12,
      lng: 120.95,
      rating: 4.6,
      catchCount: 89,
      fishTypes: ['鲤鱼', '草鱼', '鲢鱼']
    },
    {
      id: '3',
      name: '松江鲈鱼湾',
      type: '黑坑',
      lat: 31.05,
      lng: 121.22,
      rating: 4.3,
      catchCount: 56,
      fishTypes: ['鲈鱼', '黑鱼']
    },
    {
      id: '4',
      name: '青浦野河浜',
      type: '河流',
      lat: 31.15,
      lng: 121.12,
      rating: 4.5,
      catchCount: 203,
      fishTypes: ['鲫鱼', '翘嘴', '草鱼']
    },
    {
      id: '5',
      name: '宝山滨江',
      type: '海钓',
      lat: 31.38,
      lng: 121.48,
      rating: 4.1,
      catchCount: 34,
      fishTypes: ['鲈鱼', '黄鱼']
    },
  ]
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: mockSpots
      })
    }, 300)
  })
}

// 获取钓点详情
export async function getSpotDetail(id: string) {
  const mockSpots: Record<string, Spot> = {
    '1': {
      id: '1',
      name: '崇明东滩',
      type: '野钓',
      lat: 31.45,
      lng: 121.95,
      rating: 4.8,
      catchCount: 128,
      fishTypes: ['鲫鱼', '鲤鱼', '鲈鱼'],
      distance: '3.2km'
    },
  }
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: mockSpots[id] || mockSpots['1']
      })
    }, 300)
  })
}

// 创建钓点
export async function createSpot(data: Partial<Spot>) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: {
          id: 'spot_' + Date.now(),
          ...data,
          rating: 0,
          catchCount: 0
        }
      })
    }, 300)
  })
}

// 打卡
export async function checkIn(spotId: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: '打卡成功'
      })
    }, 300)
  })
}