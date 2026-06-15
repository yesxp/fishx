/**
 * 和风天气API封装 - 通过BFF代理
 * 文档: https://dev.qweather.com/docs/api/
 */

// BFF代理地址（Vercel Serverless Function）
const API_BASE = '/api/weather'

// 默认城市 - 广州
const DEFAULT_LOCATION = '101280101'

// 和风潮汐站点 - 黄埔（广州）
const TIDE_LOCATION = 'P2951'

/**
 * 通过BFF代理请求和风天气API
 */
async function qweatherFetch(endpoint: string, params: Record<string, string>) {
  const qs = new URLSearchParams({ endpoint, ...params }).toString()
  const res = await fetch(`${API_BASE}?${qs}`)
  return res.json()
}

/**
 * 获取实时天气
 */
export async function getWeatherNow(location = DEFAULT_LOCATION) {
  return qweatherFetch('/v7/weather/now', { location })
}

/**
 * 获取24小时逐时天气
 */
export async function getWeather24h(location = DEFAULT_LOCATION) {
  return qweatherFetch('/v7/weather/24h', { location })
}

/**
 * 获取7天天气预报
 */
export async function getWeather7d(location = DEFAULT_LOCATION) {
  return qweatherFetch('/v7/weather/7d', { location })
}

/**
 * 获取生活指数
 * @param type 指数类型: 1=运动, 2=洗车, 3=紫外线, 5=穿衣, 6=防晒, 9=晾晒, 14=钓鱼
 */
export async function getIndices(location = DEFAULT_LOCATION, type = '1,2,3,9,14') {
  return qweatherFetch('/v7/indices/1d', { location, type })
}

/**
 * 获取月相和日出日落
 */
export async function getAstronomy(location = DEFAULT_LOCATION) {
  return qweatherFetch('/v7/astronomy/sun', { location })
}

/**
 * 获取潮汐数据
 * @param date 日期格式 yyyyMMdd
 */
export async function getTide(date: string) {
  return qweatherFetch('/v7/ocean/tide', { location: TIDE_LOCATION, date })
}
