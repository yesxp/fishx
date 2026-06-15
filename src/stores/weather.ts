import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getWeatherNow, getWeather24h, getWeather7d, getIndices } from '@/api/weather'
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
  // 最佳时段
  const bestTimes = ref(getBestTimes())
  // 加载状态
  const loading = ref(false)

  // 加载天气数据
  async function loadWeather() {
    loading.value = true
    
    try {
      // 并行请求
      const [nowRes, hourlyRes, dailyRes, fishRes] = await Promise.all([
        getWeatherNow(),
        getWeather24h(),
        getWeather7d(),
        getIndices('101280101', '4') // 钓鱼指数，广州
      ])
      
      // 实时天气
      if (nowRes.code === '200' && nowRes.now) {
        weatherNow.value = nowRes.now
        
        // 计算钓鱼指数
        const weatherData: WeatherData = {
          temp: Number(nowRes.now.temp),
          humidity: Number(nowRes.now.humidity),
          pressure: Number(nowRes.now.pressure),
          windLevel: Number(nowRes.now.windScale),
          weather: nowRes.now.text
        }
        indexResult.value = calculateIndex(weatherData)
      }
      
      // 24小时逐时
      if (hourlyRes.code === '200' && hourlyRes.hourly) {
        hourly.value = hourlyRes.hourly.map((h: any) => ({
          time: h.fxTime.slice(11, 16), // HH:mm
          temp: h.temp,
          icon: h.icon,
          text: h.text,
          windDir: h.windDir,
          windScale: h.windScale,
          humidity: h.humidity,
          pop: h.pop // 降水概率
        }))
      }
      
      // 7天预报
      if (dailyRes.code === '200' && dailyRes.daily) {
        daily.value = dailyRes.daily.map((d: any) => ({
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
          windScaleDay: d.windScaleDay
        }))
      }
      
      // 钓鱼生活指数
      if (fishRes.code === '200' && fishRes.daily) {
        fishIndex.value = fishRes.daily[0]
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
    bestTimes,
    loading,
    loadWeather
  }
})