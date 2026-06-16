// AI 鱼种识别接口（腾讯云图像识别）

export interface FishIdentifyResult {
  name: string
  confidence: number
  emoji: string
}

// 识别鱼种
export async function identifyFish(imagePath: string): Promise<FishIdentifyResult[]> {
  // 模拟 AI 识别结果
  return new Promise((resolve) => {
    setTimeout(() => {
      // 随机返回 1-3 个识别结果
      const mockResults: FishIdentifyResult[] = [
        { name: '鲫鱼', confidence: 0.92, emoji: '🐟' },
        { name: '鲤鱼', confidence: 0.78, emoji: '🐠' },
        { name: '草鱼', confidence: 0.45, emoji: '🐟' },
      ]
      
      const count = Math.floor(Math.random() * 3) + 1
      resolve(mockResults.slice(0, count))
    }, 800)
  })
}