import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getWeatherNow, getWeather24h } from '@/api/weather'
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
  // 最佳时段
  const bestTimes = ref(getBestTimes())
  // 加载状态
  const loading = ref(false)

  // 加载天气数据
  async function loadWeather() {
    loading.value = true
    
    try {
      // 并行请求
      const [nowRes, hourlyRes] = await Promise.all([
        getWeatherNow(),
        getWeather24h()
      ])
      
      if (nowRes.code === 200) {
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
      
      if (hourlyRes.code === 200) {
        hourly.value = hourlyRes.hourly
      }
    } catch (e) {
      console.error('加载天气失败', e)
    }
    
    loading.value = false
  }

  return {
    weatherNow,
    indexResult,
    hourly,
    bestTimes,
    loading,
    loadWeather
  }
})