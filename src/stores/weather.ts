import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getWeatherNow, getWeather24h, getWeather7d, getIndices, getTide } from '@/api/weather'
import { calculateIndex, getBestTimes, type WeatherData, type IndexResult } from '@/utils/weather-index'

export const useWeatherStore = defineStore('weather', () => {
  // 实时天气
  const weatherNow = ref<any>(null)
  // 钓鱼指数
  const indexResult = ref<IndexResult>({
    score: 0,
    level: '',
    levelColor: '',
    suggestion: ''
  })
  // 24 小时天气
  const hourly = ref<any[]>([])
  // 7天预报
  const daily = ref<any[]>([])
  // 钓鱼生活指数
  const fishIndex = ref<any>(null)
  // 生活指数列表
  const indices = ref<any[]>([])
  // 潮汐数据
  const tide = ref<any>(null)
  // 最佳时段
  const bestTimes = ref(getBestTimes())
  // 加载状态
  const loading = ref(false)

  // 获取今天日期 yyyyMMdd
  function getTodayStr() {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}${m}${day}`
  }

  // 加载天气数据
  async function loadWeather() {
    loading.value = true
    
    try {
      // 并行请求
      const [nowRes, hourlyRes, dailyRes, fishRes, tideRes] = await Promise.allSettled([
        getWeatherNow(),
        getWeather24h(),
        getWeather7d(),
        getIndices('101280101', '14'), // 钓鱼指数
        getTide(getTodayStr())         // 潮汐数据
      ])
      
      // 实时天气
      if (nowRes.status === 'fulfilled' && nowRes.value.code === '200' && nowRes.value.now) {
        weatherNow.value = nowRes.value.now
        
        // 计算钓鱼指数
        const weatherData: WeatherData = {
          temp: Number(nowRes.value.now.temp),
          humidity: Number(nowRes.value.now.humidity),
          pressure: Number(nowRes.value.now.pressure),
          windLevel: Number(nowRes.value.now.windScale),
          weather: nowRes.value.now.text
        }
        indexResult.value = calculateIndex(weatherData)
      }
      
      // 24小时逐时
      if (hourlyRes.status === 'fulfilled' && hourlyRes.value.code === '200' && hourlyRes.value.hourly) {
        hourly.value = hourlyRes.value.hourly.map((h: any) => ({
          time: h.fxTime.slice(11, 16),
          temp: h.temp,
          icon: h.icon,
          text: h.text,
          windDir: h.windDir,
          windSpeed: h.windSpeed,
          windScale: h.windScale,
          humidity: h.humidity,
          pressure: h.pressure,
          cloud: h.cloud,
          pop: h.pop,
          dewPoint: h.dew
        }))
      }
      
      // 7天预报
      if (dailyRes.status === 'fulfilled' && dailyRes.value.code === '200' && dailyRes.value.daily) {
        daily.value = dailyRes.value.daily.map((d: any) => ({
          date: d.fxDate,
          week: getWeekDay(d.fxDate),
          tempDay: d.tempDay,
          tempNight: d.tempNight,
          iconDay: d.iconDay,
          iconNight: d.iconNight,
          textDay: d.textDay,
          textNight: d.textNight,
          humidity: d.humidity,
          windDirDay: d.windDirDay,
          windScaleDay: d.windScaleDay,
          sunrise: d.sunrise,
          sunset: d.sunset,
          moonrise: d.moonrise,
          moonset: d.moonset,
          moonPhase: d.moonPhase
        }))
      }
      
      // 钓鱼生活指数
      if (fishRes.status === 'fulfilled' && fishRes.value.code === '200' && fishRes.value.daily) {
        fishIndex.value = fishRes.value.daily[0]
        indices.value = fishRes.value.daily
      }
      
      // 潮汐数据
      if (tideRes.status === 'fulfilled' && tideRes.value.code === '200') {
        tide.value = tideRes.value
      }
      
    } catch (e) {
      console.error('加载天气失败', e)
    }
    
    loading.value = false
  }

  // 获取星期几
  function getWeekDay(dateStr: string) {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const d = new Date(dateStr)
    return days[d.getDay()]
  }

  return {
    weatherNow,
    indexResult,
    hourly,
    daily,
    fishIndex,
    indices,
    tide,
    bestTimes,
    loading,
    loadWeather
  }
})
