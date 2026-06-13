// 天气相关 API（和风天气）

const API_KEY = '' // 需要填写和风天气 API Key
const BASE_URL = 'https://devapi.qweather.com'

interface HourlyData {
  fxTime: string
  temp: string
  text: string
  humidity: string
  pressure: string
  windScale: string
}

// 获取实时天气
export async function getWeatherNow(city: string = '101020100') {
  // 模拟数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        now: {
          temp: '26',
          feelsLike: '28',
          humidity: '65',
          pressure: '1009',
          windDir: '南风',
          windScale: '2',
          windSpeed: '12',
          text: '多云',
          icon: '101'
        },
        fxLink: 'https://www.qweather.com'
      })
    }, 300)
  })
}

// 获取未来 24 小时天气
export async function getWeather24h(city: string = '101020100') {
  return new Promise((resolve) => {
    const hours: HourlyData[] = []
    const now = new Date()
    for (let i = 0; i < 24; i++) {
      const h = new Date(now.getTime() + i * 3600000)
      hours.push({
        fxTime: h.toISOString(),
        temp: String(Math.round(20 + Math.random() * 10)),
        text: i % 3 === 0 ? '多云' : '晴',
        humidity: String(Math.round(50 + Math.random() * 30)),
        pressure: String(Math.round(1000 + Math.random() * 20)),
        windScale: String(Math.round(1 + Math.random() * 3))
      })
    }
    setTimeout(() => {
      resolve({
        code: 200,
        hourly: hours
      })
    }, 300)
  })
}

// 获取未来 7 天天气
export async function getWeather7d(city: string = '101020100') {
  return new Promise((resolve) => {
    const days = ['今天', '明天', '后天']
    const daily = days.map((d, i) => ({
      fxDate: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
      tempMax: String(Math.round(25 + Math.random() * 8)),
      tempMin: String(Math.round(15 + Math.random() * 5)),
      textDay: '多云',
      textNight: '晴',
      humidity: String(Math.round(50 + Math.random() * 30)),
      pressure: String(Math.round(1000 + Math.random() * 20))
    }))
    
    setTimeout(() => {
      resolve({
        code: 200,
        daily
      })
    }, 300)
  })
}