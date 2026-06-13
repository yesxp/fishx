// 钓鱼指数算法
// 基于：气压、温度、风力、天气、湿度等多因素加权评分

interface WeatherData {
  temp: number       // 气温 °C
  humidity: number   // 湿度 %
  pressure: number   // 气压 hPa
  windLevel: number  // 风力等级 0-12
  weather: string    // 天气状况
  waterTemp?: number // 水温 °C（可选）
}

interface IndexResult {
  score: number      // 0-100
  level: string      // 极佳/良好/一般/较差/不宜
  levelColor: string
  suggestion: string
}

// 气压评分（气压越高越好，稳定最重要）
function pressureScore(p: number): number {
  if (p >= 1010 && p <= 1025) return 90
  if (p >= 1000 && p <= 1030) return 75
  if (p >= 990 && p <= 1035) return 60
  if (p >= 980 && p <= 1040) return 40
  return 20
}

// 温度评分（15-28°C 最佳）
function tempScore(t: number): number {
  if (t >= 18 && t <= 25) return 95
  if (t >= 15 && t <= 28) return 80
  if (t >= 10 && t <= 32) return 60
  if (t >= 5 && t <= 35) return 40
  return 20
}

// 风力评分（微风最佳，无风或大风不好）
function windScore(w: number): number {
  if (w >= 1 && w <= 3) return 90
  if (w === 0 || w === 4) return 70
  if (w === 5) return 50
  if (w >= 6) return 20
  return 30
}

// 天气评分
function weatherScore(w: string): number {
  const good = ['多云', '阴', '晴间多云']
  const ok = ['晴', '小雨']
  const bad = ['中雨', '大雨', '暴雨', '雷阵雨', '雪', '雾', '霾']
  
  if (good.some(g => w.includes(g))) return 85
  if (bad.some(b => w.includes(b))) return 25
  return 65
}

// 湿度评分（60-80% 最佳）
function humidityScore(h: number): number {
  if (h >= 60 && h <= 80) return 85
  if (h >= 50 && h <= 90) return 70
  return 50
}

// 综合评分
export function calculateIndex(weather: WeatherData): IndexResult {
  const pScore = pressureScore(weather.pressure)
  const tScore = tempScore(weather.temp)
  const wScore = windScore(weather.windLevel)
  const weatherSc = weatherScore(weather.weather)
  const hScore = humidityScore(weather.humidity)
  
  // 加权：气压 30% + 温度 25% + 风力 15% + 天气 20% + 湿度 10%
  const score = Math.round(
    pScore * 0.3 +
    tScore * 0.25 +
    wScore * 0.15 +
    weatherSc * 0.2 +
    hScore * 0.1
  )
  
  let level: string
  let levelColor: string
  let suggestion: string
  
  if (score >= 80) {
    level = '极佳'
    levelColor = '#4CAF50'
    suggestion = '🎣 气压稳定，鱼口活跃，快去钓鱼！'
  } else if (score >= 65) {
    level = '良好'
    levelColor = '#8BC34A'
    suggestion = '👍 天气不错，适合出钓'
  } else if (score >= 50) {
    level = '一般'
    levelColor = '#FFC107'
    suggestion = '😐 可以试试，但别期望太高'
  } else if (score >= 35) {
    level = '较差'
    levelColor = '#FF9800'
    suggestion = '⚠️ 鱼口不好，改天再战'
  } else {
    level = '不宜'
    levelColor = '#F44336'
    suggestion = '🚫 天气条件差，不建议出钓'
  }
  
  return { score, level, levelColor, suggestion }
}

// 获取最佳出钓时段
export function getBestTimes(): Array<{ time: string; score: number; level: string }> {
  return [
    { time: '05:00 - 07:00', score: 85, level: 'good' },
    { time: '07:00 - 09:00', score: 75, level: 'ok' },
    { time: '09:00 - 11:00', score: 55, level: 'ok' },
    { time: '11:00 - 14:00', score: 35, level: 'bad' },
    { time: '14:00 - 16:00', score: 50, level: 'ok' },
    { time: '16:00 - 19:00', score: 90, level: 'good' },
    { time: '19:00 - 21:00', score: 70, level: 'ok' },
  ]
}