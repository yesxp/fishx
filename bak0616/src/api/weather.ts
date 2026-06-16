/**
 * 和风天气API封装 - 通过BFF代理
 * 文档: https://dev.qweather.com/docs/api/
 */

// BFF代理地址
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
 */
export async function getIndices(location = DEFAULT_LOCATION, type = '14') {
  return qweatherFetch('/v7/indices/1d', { location, type })
}

/**
 * 获取潮汐数据
 * @param date 日期格式 yyyyMMdd
 */
export async function getTide(date: string) {
  return qweatherFetch('/v7/ocean/tide', { location: TIDE_LOCATION, date })
}

/**
 * 获取多天潮汐数据（用于潮汐日历）
 * @param dates 日期数组
 */
export async function getTideMultiDay(dates: string[]) {
  const results = await Promise.allSettled(dates.map(d => getTide(d)))
  return results.map((r, i) => ({
    date: dates[i],
    data: r.status === 'fulfilled' ? r.value : null
  }))
}

/**
 * 获取台风列表
 * @param year 年份
 */
export async function getTyphoonList(year: number) {
  return qweatherFetch('/v7/tropical/storm-list', { basin: 'NP', year: String(year) })
}

/**
 * 获取台风路径
 * @param stormId 台风ID
 */
export async function getTyphoonTrack(stormId: string) {
  return qweatherFetch('/v7/tropical/storm-track', { stormid: stormId })
}
