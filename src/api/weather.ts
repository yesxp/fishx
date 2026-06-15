/**
 * 和风天气API封装
 * 文档: https://dev.qweather.com/docs/api/
 */

// API配置 (开发者专属Host)
const QWEATHER_API = 'https://pa3qqtg6ym.re.qweatherapi.com/v7'
const QWEATHER_GEO = 'https://pa3qqtg6ym.re.qweatherapi.com/geo/v2' // 地理位置API
const QWEATHER_KEY = '26dffedc888848e0a69978a8d0fe04f2'

// 默认城市 - 先用杭州测试
const DEFAULT_LOCATION = '101280101'  // 广州

/**
 * 获取实时天气
 * @param location 城市ID，默认厦门
 */
export async function getWeatherNow(location = DEFAULT_LOCATION) {
  const url = `${QWEATHER_API}/weather/now?location=${location}&key=${QWEATHER_KEY}`
  
  try {
    const res = await fetch(url)
    return await res.json()
  } catch (e) {
    console.error('获取实时天气失败', e)
    return { code: 'error', now: null }
  }
}

/**
 * 获取24小时逐时预报
 */
export async function getWeather24h(location = DEFAULT_LOCATION) {
  const url = `${QWEATHER_API}/weather/24h?location=${location}&key=${QWEATHER_KEY}`
  
  try {
    const res = await fetch(url)
    return await res.json()
  } catch (e) {
    console.error('获取逐时预报失败', e)
    return { code: 'error', hourly: [] }
  }
}

/**
 * 获取7天预报
 */
export async function getWeather7d(location = DEFAULT_LOCATION) {
  const url = `${QWEATHER_API}/weather/7d?location=${location}&key=${QWEATHER_KEY}`
  
  try {
    const res = await fetch(url)
    return await res.json()
  } catch (e) {
    console.error('获取7天预报失败', e)
    return { code: 'error', daily: [] }
  }
}

/**
 * 获取生活指数
 * @param type 指征类型: 1=运动, 2=洗车, 3=穿衣, 4=钓鱼, 5=紫外线, 6=旅游, 7=过敏
 */
export async function getIndices(location = DEFAULT_LOCATION, type = '4') {
  const url = `${QWEATHER_API}/indices/1d?type=${type}&location=${location}&key=${QWEATHER_KEY}`
  
  try {
    const res = await fetch(url)
    return await res.json()
  } catch (e) {
    console.error('获取生活指数失败', e)
    return { code: 'error', daily: [] }
  }
}