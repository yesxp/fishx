// 渔获相关 API

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

// 创建渔获记录
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

// 获取渔获列表
export async function getCatchList(params?: {
  page?: number
  pageSize?: number
  userId?: string
}) {
  // 模拟数据
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

// 删除渔获
export async function deleteCatch(id: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 0, message: '删除成功' })
    }, 300)
  })
}