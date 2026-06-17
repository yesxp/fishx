import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getWeatherNow, getWeather24h, getWeather7d,
  getIndices, getTide, getTyphoonList, getTyphoonTrack
} from '@/api/weather'
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
  // 生活指数
  const indices = ref<any[]>([])
  // 潮汐数据
  const tide = ref<any>(null)
  // 多天潮汐（潮汐日历）
  const tideCalendar = ref<any[]>([])
  // 台风列表
  const typhoons = ref<any[]>([])
  // 当前台风路径
  const typhoonTrack = ref<any>(null)
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

  // 获取未来N天日期数组
  function getFutureDates(n: number) {
    const dates: string[] = []
    const d = new Date()
    for (let i = 0; i < n; i++) {
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      dates.push(`${y}${m}${day}`)
      d.setDate(d.getDate() + 1)
    }
    return dates
  }

  // 加载天气数据
  async function loadWeather() {
    loading.value = true
    
    try {
      const today = getTodayStr()
      
      // 并行请求天气数据
      const [nowRes, hourlyRes, dailyRes, fishRes, tideRes] = await Promise.allSettled([
        getWeatherNow(),
        getWeather24h(),
        getWeather7d(),
        getIndices(),
        getTide(today)
      ])
      
      // 实时天气
      if (nowRes.status === 'fulfilled' && nowRes.value.code === '200' && nowRes.value.now) {
        weatherNow.value = nowRes.value.now
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
          windScale: h.windScale,
          humidity: h.humidity,
          pop: h.pop,
          pressure: h.pressure
        }))
      }
      
      // 7天预报
      if (dailyRes.status === 'fulfilled' && dailyRes.value.code === '200' && dailyRes.value.daily) {
        daily.value = dailyRes.value.daily.map((d: any) => ({
          date: d.fxDate,
          week: getWeekDay(d.fxDate),
          tempDay: d.tempMax,
          tempNight: d.tempMin,
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
        indices.value = fishRes.value.daily
      }
      
      // 潮汐数据（今天）
      if (tideRes.status === 'fulfilled' && tideRes.value.code === '200') {
        tide.value = tideRes.value
      }
      
    } catch (e) {
      console.error('加载天气失败', e)
    }
    
    loading.value = false
  }

  // 加载潮汐日历（未来7天）
  async function loadTideCalendar() {
    const dates = getFutureDates(7)
    const results = await Promise.allSettled(dates.map(d => getTide(d)))
    tideCalendar.value = results.map((r, i) => ({
      date: dates[i],
      data: r.status === 'fulfilled' && r.value.code === '200' ? r.value : null
    }))
  }

  // 加载台风数据
  async function loadTyphoons() {
    const now = new Date()
    const year = now.getFullYear()
    
    try {
      const listRes = await getTyphoonList(year)
      if (listRes.code === '200' && listRes.storm) {
        // 只保留活跃台风
        typhoons.value = listRes.storm.filter((s: any) => s.isActive === '1')
        
        // 如果有活跃台风，加载第一个的路径
        if (typhoons.value.length > 0) {
          const trackRes = await getTyphoonTrack(typhoons.value[0].id)
          if (trackRes.code === '200') {
            typhoonTrack.value = trackRes
          }
        }
      }
    } catch (e) {
      console.error('加载台风数据失败', e)
    }
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
    indices,
    tide,
    tideCalendar,
    typhoons,
    typhoonTrack,
    bestTimes,
    loading,
    loadWeather,
    loadTideCalendar,
    loadTyphoons
  }
})
