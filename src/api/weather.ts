/**
 * 和风天气API封装
 * 文档: https://dev.qweather.com/docs/api/
 */

// API配置
const QWEATHER_API = 'https://devapi.qweather.com/v7'
const QWEATHER_KEY = 'a80e1bd1ed504af1af77bd8adc304bb0'

// 默认城市 (厦门)
const DEFAULT_LOCATION = '101230201'

/**
 * 获取实时天气
 * @param location 城市ID，默认厦门
 */
export async function getWeatherNow(location = DEFAULT_LOCATION) {
  const url = `${QWEATHER_API}/weather/now?location=${location}&key=${QWEATHER_KEY}`
  
  const res = await fetch(url)
  const data = await res.json()
  
  return data
}

/**
 * 获取24小时逐时预报
 * @param location 城市ID
 */
export async function getWeather24h(location = DEFAULT_LOCATION) {
  const url = `${QWEATHER_API}/weather/24h?location=${location}&key=${QWEATHER_KEY}`
  
  const res = await fetch(url)
  const data = await res.json()
  
  return data
}

/**
 * 获取7天预报
 * @param location 城市ID
 */
export async function getWeather7d(location = DEFAULT_LOCATION) {
  const url = `${QWEATHER_API}/weather/7d?location=${location}&key=${QWEATHER_KEY}`
  
  const res = await fetch(url)
  const data = await res.json()
  
  return data
}

/**
 * 获取生活指数
 * @param location 城市ID
 * @param type 指数类型: 1=运动 2=洗车 3=穿衣 4=钓鱼 5=紫外线 6=旅游 7=过敏 8=紫外线
 */
export async function getIndices(
  location = DEFAULT_LOCATION,
  type = '4' // 默认钓鱼指数
) {
  const url = `${QWEATHER_API}/indices/1d?type=${type}&location=${location}&key=${QWEATHER_KEY}`
  
  const res = await fetch(url)
  const data = await res.json()
  
  return data
}

/**
 * 获取和风天气城市ID
 * @param city 城市名称
 */
export async function searchCity(city: string) {
  const url = `https://geoapi.qweather.com/v2/city/lookup?location=${encodeURIComponent(city)}&key=${QWEATHER_KEY}`
  
  const res = await fetch(url)
  const data = await res.json()
  
  return data
}