// AI 鱼种识别接口
// V1：mock（开发期）
// V2：百度动物识别 API（生产期）

export interface FishIdentifyResult {
  id?: string
  name: string
  confidence: number
  emoji: string
  scientific_name?: string
}

// 百度动物识别 API 配置（生产期）
const BAIDU_API_KEY = import.meta.env.VITE_BAIDU_API_KEY || ''
const BAIDU_SECRET_KEY = import.meta.env.VITE_BAIDU_SECRET_KEY || ''
const BAIDU_ENDPOINT = 'https://aip.baidubce.com/rest/2.0/image-classify/v1/animal'

// 鱼种 emoji 映射（mock 用）
const SPECIES_EMOJI: Record<string, string> = {
  '鲫鱼': '🐟',
  '鲤鱼': '🐠',
  '草鱼': '🐡',
  '鲈鱼': '🎏',
  '翘嘴': '🐟',
  '罗非': '🐠',
  '鲶鱼': '🐡',
  '鳊鱼': '🎏',
}

/**
 * V1：mock 识别（开发期）
 */
async function identifyByMock(_imagePath: string): Promise<FishIdentifyResult[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockResults: FishIdentifyResult[] = [
        { id: 'sp-001', name: '鲫鱼', confidence: 0.92, emoji: '🐟', scientific_name: 'Carassius auratus' },
        { id: 'sp-002', name: '鲤鱼', confidence: 0.78, emoji: '🐠', scientific_name: 'Cyprinus carpio' },
        { id: 'sp-003', name: '草鱼', confidence: 0.45, emoji: '🐡', scientific_name: 'Ctenopharyngodon idella' },
      ]
      const count = Math.floor(Math.random() * 3) + 1
      resolve(mockResults.slice(0, count))
    }, 1500) // 真实识别耗时模拟
  })
}

/**
 * V2：百度动物识别 API（生产期，需要配置 API Key）
 */
async function identifyByBaidu(imagePath: string): Promise<FishIdentifyResult[]> {
  if (!BAIDU_API_KEY || !BAIDU_SECRET_KEY) {
    console.warn('[AI] 百度 API Key 未配置，降级到 mock')
    return identifyByMock(imagePath)
  }

  try {
    // 1. 获取 access_token
    const tokenRes = await fetch(
      `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${BAIDU_API_KEY}&client_secret=${BAIDU_SECRET_KEY}`,
      { method: 'POST' }
    )
    const tokenData = await tokenRes.json()
    const accessToken = tokenData.access_token

    // 2. 图片转 base64
    // H5 环境
    const base64 = await imageToBase64(imagePath)

    // 3. 调用动物识别
    const formData = new FormData()
    formData.append('image', base64)
    formData.append('top_num', '3')
    formData.append('baike_num', '0')

    const res = await fetch(`${BAIDU_ENDPOINT}?access_token=${accessToken}`, {
      method: 'POST',
      body: formData,
    })
    const data = await res.json()

    if (data.error_code) {
      throw new Error(`百度 API 错误: ${data.error_msg}`)
    }

    // 4. 转换格式
    return (data.result || []).map((item: any) => ({
      name: item.name,
      confidence: item.score,
      emoji: SPECIES_EMOJI[item.name] || '🐟',
    }))
  } catch (e) {
    console.error('[AI] 百度识别失败，降级到 mock:', e)
    return identifyByMock(imagePath)
  }
}

/**
 * H5 环境图片转 base64
 */
function imageToBase64(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      resolve(canvas.toDataURL('image/jpeg', 0.8).split(',')[1])
    }
    img.onerror = reject
    img.src = filePath
  })
}

/**
 * 主入口：识别鱼种
 * - 有 API Key → 百度 API
 * - 无 API Key → mock
 */
export async function identifyFish(imagePath: string): Promise<FishIdentifyResult[]> {
  if (BAIDU_API_KEY && BAIDU_SECRET_KEY) {
    return identifyByBaidu(imagePath)
  }
  return identifyByMock(imagePath)
}
