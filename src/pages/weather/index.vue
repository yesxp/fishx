<template>
  <view class="page-weather">
    <!-- Header -->
    <view class="header">
      <view class="header-top">
        <view class="header-logo">
          <view class="logo-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
            </svg>
          </view>
          <view>
            <text class="header-title">天时</text>
            <text class="header-subtitle">天气 · 钓鱼指数</text>
          </view>
        </view>
        <view class="header-actions">
          <view class="header-btn">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </view>
        </view>
      </view>
    </view>

    <!-- Content -->
    <scroll-view scroll-y class="content" :enhanced="true" :show-scrollbar="false" :style="{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }">
      <view v-if="weatherStore.loading && !weatherStore.weatherNow" class="loading-state">
        <text class="loading-text">加载天气数据中...</text>
      </view>

      <template v-else>
        <!-- Hero -->
        <view class="hero">
          <view class="hero-top">
            <view>
              <text class="hero-city">📍 广州</text>
              <view class="hero-score-row">
                <text class="hero-score">{{ weatherStore.indexResult.score }}</text>
                <text class="hero-score-unit">分</text>
              </view>
              <text class="hero-label">{{ weatherStore.indexResult.level }}</text>
            </view>
            <view class="hero-weather-main">
              <text class="hero-icon">{{ getWeatherIcon(weatherStore.weatherNow?.icon || '100') }}</text>
              <text class="hero-temp-now">{{ weatherStore.weatherNow?.temp || '--' }}°</text>
            </view>
          </view>
          <view class="hero-desc">
            <text class="hero-desc-text">{{ weatherStore.weatherNow?.text || '' }}，体感 {{ weatherStore.weatherNow?.feelsLike || '--' }}°</text>
          </view>
          <view class="hero-grid">
            <view class="hero-item">
              <text class="hero-item-label">气压</text>
              <text class="hero-item-value">{{ weatherStore.weatherNow?.pressure || '--' }}</text>
              <text class="hero-item-unit">hPa</text>
            </view>
            <view class="hero-item">
              <text class="hero-item-label">湿度</text>
              <text class="hero-item-value">{{ weatherStore.weatherNow?.humidity || '--' }}%</text>
              <text class="hero-item-unit">RH</text>
            </view>
            <view class="hero-item">
              <text class="hero-item-label">风力</text>
              <text class="hero-item-value">{{ weatherStore.weatherNow?.windScale || '--' }}</text>
              <text class="hero-item-unit">{{ weatherStore.weatherNow?.windDir || '' }}</text>
            </view>
            <view class="hero-item">
              <text class="hero-item-label">能见度</text>
              <text class="hero-item-value">{{ weatherStore.weatherNow?.vis || '--' }}</text>
              <text class="hero-item-unit">km</text>
            </view>
          </view>
        </view>

        <!-- 24h Hourly -->
        <view class="card">
          <view class="card-title-row">
            <text class="card-title">逐小时预报</text>
            <view class="badge" :class="badgeClass">
              <text class="badge-text" :class="badgeTextClass">{{ weatherStore.indexResult.score >= 70 ? '鱼口活跃' : weatherStore.indexResult.score >= 40 ? '一般' : '鱼口较慢' }}</text>
            </view>
          </view>
          <scroll-view scroll-x class="hourly-scroll" :show-scrollbar="false">
            <view class="hourly-list">
              <view v-for="(h, i) in weatherStore.hourly.slice(0, 24)" :key="i" class="hourly-item" :class="{ 'hourly-item--now': i === 0 }">
                <text class="hourly-time">{{ i === 0 ? '现在' : h.time.slice(-5) }}</text>
                <text class="hourly-icon">{{ getWeatherIcon(h.icon) }}</text>
                <text class="hourly-temp">{{ h.temp }}°</text>
                <view class="hourly-bar-wrap">
                  <view class="hourly-bar" :style="{ height: getBarHeight(h.temp) + 'px' }" />
                </view>
                <text class="hourly-pop" v-if="Number(h.pop) > 0">💧{{ h.pop }}%</text>
              </view>
            </view>
          </scroll-view>
        </view>

        <!-- 日出日落 + 月相 -->
        <view class="card-row">
          <view class="card card--half">
            <view class="card-title-row">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#F0B232" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
              </svg>
              <text class="card-title card-title--sm">日出日落</text>
            </view>
            <view class="sun-arc">
              <view class="sun-arc-bg" />
              <view class="sun-arc-fill" :style="{ clipPath: sunClipPath }" />
              <view class="sun-dot" :style="{ left: sunPosition.left + '%', bottom: sunPosition.bottom + 'px' }">
                <text class="sun-dot-icon">☀️</text>
              </view>
            </view>
            <view class="sun-times">
              <view class="sun-time-item">
                <text class="sun-time-label">🌅 日出</text>
                <text class="sun-time-val">{{ today?.sunrise || '--:--' }}</text>
              </view>
              <view class="sun-time-item">
                <text class="sun-time-label">🌇 日落</text>
                <text class="sun-time-val">{{ today?.sunset || '--:--' }}</text>
              </view>
            </view>
          </view>

          <view class="card card--half">
            <view class="card-title-row">
              <text class="card-title card-title--sm">🌙 月相</text>
            </view>
            <view class="moon-display">
              <text class="moon-icon">{{ moonPhaseIcon }}</text>
              <text class="moon-phase-text">{{ today?.moonPhase || '未知' }}</text>
            </view>
            <view class="sun-times">
              <view class="sun-time-item">
                <text class="sun-time-label">月出</text>
                <text class="sun-time-val">{{ today?.moonrise || '--:--' }}</text>
              </view>
              <view class="sun-time-item">
                <text class="sun-time-label">月落</text>
                <text class="sun-time-val">{{ today?.moonset || '--:--' }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- ① 气压变化 -->
        <view class="card">
          <view class="card-title-row">
            <text class="card-title">气压变化</text>
            <view class="badge badge--info"><text class="badge-text badge-text--info">{{ pressureTrend }}</text></view>
          </view>
          <view class="pressure-chart">
            <view v-for="(h, i) in weatherStore.hourly.slice(0, 12)" :key="i" class="pressure-col">
              <text class="pressure-val">{{ h.pressure }}</text>
              <view class="pressure-bar" :style="{ height: getPressureHeight(h.pressure) + 'px', background: getPressureColor(h.pressure) }" />
              <text class="pressure-time">{{ i === 0 ? '现在' : h.time.slice(-5, -3) + '时' }}</text>
            </view>
          </view>
          <text class="chart-hint">气压稳定偏高(>1013)，鱼类呼吸代谢活跃</text>
        </view>

        <!-- ② 风力风向 -->
        <view class="card">
          <view class="card-title-row">
            <text class="card-title">风力风向</text>
            <view class="badge" :class="windBadge.class"><text class="badge-text" :class="windBadge.textClass">{{ windBadge.text }}</text></view>
          </view>
          <view class="wind-rose">
            <view v-for="(h, i) in weatherStore.hourly.slice(0, 8)" :key="i" class="wind-item">
              <view class="wind-arrow-wrap">
                <view class="wind-arrow" :style="{ transform: 'rotate(' + getWindDeg(h.windDir) + 'deg)' }">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" :stroke="getWindColor(h.windScale)"/>
                    <polyline :points="i===0?'8,9 12,5 16,9':'8,9 12,5 16,9'" :stroke="getWindColor(h.windScale)" fill="none"/>
                  </svg>
                </view>
                <text class="wind-dir-text">{{ h.windDir }}</text>
              </view>
              <text class="wind-scale">{{ h.windScale }}级</text>
              <text class="wind-time">{{ i === 0 ? '现在' : h.time.slice(-5) }}</text>
            </view>
          </view>
        </view>

        <!-- ③ 湿度/露点 -->
        <view class="card">
          <view class="card-title-row">
            <text class="card-title">湿度 · 露点</text>
            <text class="card-subtitle">当前 {{ weatherStore.weatherNow?.humidity || '--' }}%</text>
          </view>
          <view class="humidity-chart">
            <view v-for="(h, i) in weatherStore.hourly.slice(0, 12)" :key="i" class="humidity-col">
              <text class="humidity-val">{{ h.humidity }}%</text>
              <view class="humidity-bar-track">
                <view class="humidity-bar" :style="{ height: h.humidity + '%', background: getHumidityColor(Number(h.humidity)) }" />
              </view>
              <text class="humidity-time">{{ i === 0 ? '现在' : h.time.slice(-5, -3) + '时' }}</text>
            </view>
          </view>
          <text class="chart-hint">湿度>70%时蚯蚓活跃，鱼口较好</text>
        </view>

        <!-- ④ 云量/云高 -->
        <view class="card">
          <view class="card-title-row">
            <text class="card-title">云量 · 能见度</text>
            <text class="card-subtitle">能见度 {{ weatherStore.weatherNow?.vis || '--' }}km</text>
          </view>
          <view class="cloud-grid">
            <view class="cloud-item">
              <text class="cloud-emoji">☁️</text>
              <text class="cloud-label">云量</text>
              <text class="cloud-value">{{ weatherStore.weatherNow?.cloud || '--' }}%</text>
              <view class="cloud-bar-track">
                <view class="cloud-bar" :style="{ width: (Number(weatherStore.weatherNow?.cloud) || 0) + '%' }" />
              </view>
            </view>
            <view class="cloud-item">
              <text class="cloud-emoji">👁️</text>
              <text class="cloud-label">能见度</text>
              <text class="cloud-value">{{ weatherStore.weatherNow?.vis || '--' }}km</text>
              <view class="cloud-bar-track">
                <view class="cloud-bar cloud-bar--vis" :style="{ width: Math.min(100, (Number(weatherStore.weatherNow?.vis) || 0) * 5) + '%' }" />
              </view>
            </view>
          </view>
          <text class="chart-hint">阴天光线暗，鱼靠边觅食；晴天光线强，鱼下潜</text>
        </view>

        <!-- 7天预报 -->
        <view class="card">
          <view class="card-title-row">
            <text class="card-title">7天预报</text>
          </view>
          <view class="day-rows">
            <view v-for="(day, index) in weatherStore.daily" :key="day.date" class="day-row" :class="{ 'day-row--today': index === 0 }">
              <view class="day-left">
                <text class="day-label">{{ index === 0 ? '今天' : day.week }}</text>
                <text class="day-date">{{ day.date.slice(5) }}</text>
              </view>
              <view class="day-weather">
                <text class="day-icon">{{ getWeatherIcon(day.iconDay) }}</text>
                <text class="day-text">{{ day.textDay }}</text>
              </view>
              <view class="day-temp-bar">
                <text class="day-temp-lo">{{ day.tempNight }}°</text>
                <view class="day-temp-track">
                  <view class="day-temp-fill" :style="getTempBarStyle(day.tempNight, day.tempDay)" />
                </view>
                <text class="day-temp-hi">{{ day.tempDay }}°</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 潮汐 -->
        <view class="card" v-if="tideData">
          <view class="card-title-row">
            <text class="card-title">潮汐曲线</text>
            <view class="badge" :class="tideStatus.class"><text class="badge-text" :class="tideStatus.textClass">{{ tideStatus.text }}</text></view>
          </view>
          <view class="tide-chart-wrap">
            <svg viewBox="0 0 340 100" width="100%" height="100" class="tide-svg">
              <line v-for="i in 4" :key="'gl'+i" :x1="0" :y1="i*25" :x2="340" :y2="i*25" stroke="#E3E5E8" stroke-width="0.5" stroke-dasharray="4,4"/>
              <path :d="tidePath" fill="none" stroke="#5865F2" stroke-width="2"/>
              <path :d="tideAreaPath" fill="url(#tideFillGrad)" opacity="0.15"/>
              <g v-for="(pt, i) in tideMarkers" :key="'tm'+i">
                <circle :cx="pt.x" :cy="pt.y" r="3" :fill="pt.type === 'H' ? '#F0B232' : '#5865F2'"/>
                <text :x="pt.x" :y="pt.y - 8" text-anchor="middle" font-size="8" :fill="pt.type === 'H' ? '#F0B232' : '#5865F2'">{{ pt.height }}m</text>
              </g>
              <line v-if="tideNowX" :x1="tideNowX" :y1="0" :x2="tideNowX" :y2="100" stroke="#F23F43" stroke-width="1" stroke-dasharray="3,3"/>
              <defs>
                <linearGradient id="tideFillGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#5865F2"/>
                  <stop offset="100%" stop-color="#5865F2" stop-opacity="0"/>
                </linearGradient>
              </defs>
            </svg>
            <view class="tide-time-axis">
              <text class="tide-time-label">00:00</text>
              <text class="tide-time-label">06:00</text>
              <text class="tide-time-label">12:00</text>
              <text class="tide-time-label">18:00</text>
              <text class="tide-time-label">24:00</text>
            </view>
          </view>
          <view class="tide-info">
            <view v-for="(entry, i) in tideTable" :key="i" class="tide-info-item">
              <text class="tide-info-label">{{ entry.type === 'H' ? '🌊 满潮' : '🌊 干潮' }}</text>
              <text class="tide-info-time">{{ entry.time }}</text>
              <text class="tide-info-val">{{ entry.height }}m</text>
            </view>
          </view>
        </view>

        <!-- 鱼口预测 -->
        <view class="card">
          <view class="card-title-row">
            <text class="card-title">鱼口预测</text>
            <text class="card-subtitle">基于当前天气指数</text>
          </view>
          <view class="fish-list">
            <view v-for="fish in fishPredictions" :key="fish.name" class="fish-row">
              <view class="fish-left">
                <text class="fish-emoji">{{ fish.emoji }}</text>
                <view>
                  <text class="fish-name">{{ fish.name }}</text>
                  <text class="fish-desc">{{ fish.desc }}</text>
                </view>
              </view>
              <view class="fish-right">
                <view class="fish-badge" :class="'fish-badge--' + fish.variant">
                  <text class="fish-badge-text">{{ fish.status }}</text>
                </view>
                <text class="fish-trend">{{ fish.trend }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 钓法建议 -->
        <view class="card">
          <view class="card-title-row">
            <text class="card-title">钓法建议</text>
          </view>
          <view class="tips">
            <view class="tip">
              <view class="tip-icon tip-icon--b">🎣</view>
              <view class="tip-content">
                <text class="tip-title">饵料选择</text>
                <text class="tip-text">{{ fishingTips.bait }}</text>
              </view>
            </view>
            <view class="tip">
              <view class="tip-icon tip-icon--g">🐟</view>
              <view class="tip-content">
                <text class="tip-title">目标鱼种</text>
                <text class="tip-text">{{ fishingTips.target }}</text>
              </view>
            </view>
            <view class="tip">
              <view class="tip-icon tip-icon--o">⏰</view>
              <view class="tip-content">
                <text class="tip-title">最佳时段</text>
                <text class="tip-text">{{ fishingTips.timing }}</text>
              </view>
            </view>
            <view class="tip">
              <view class="tip-icon tip-icon--p">💡</view>
              <view class="tip-content">
                <text class="tip-title">注意事项</text>
                <text class="tip-text">{{ fishingTips.note }}</text>
              </view>
            </view>
          </view>
        </view>

        <view style="height: 120rpx;" />
      </template>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useWeatherStore } from '@/stores/weather'

const weatherStore = useWeatherStore()

// 天气图标映射
const weatherIconMap: Record<string, string> = {
  '100': '☀️', '101': '⛅', '102': '⛅', '103': '🌤️', '104': '☁️',
  '150': '🌙', '151': '⛅', '152': '⛅', '153': '🌤️', '154': '☁️',
  '300': '🌧️', '301': '🌧️', '302': '⛈️', '303': '⛈️', '304': '⛈️',
  '305': '🌧️', '306': '🌧️', '307': '🌧️', '308': '🌧️', '309': '🌦️',
  '310': '🌧️', '311': '🌧️', '312': '🌧️', '313': '🌧️',
  '314': '🌧️', '315': '🌧️', '316': '🌧️', '317': '🌧️',
  '318': '🌧️', '399': '🌧️',
  '400': '❄️', '401': '❄️', '402': '❄️', '403': '❄️', '404': '❄️',
  '405': '❄️', '406': '❄️', '407': '🌨️', '408': '❄️', '409': '❄️',
  '410': '❄️', '499': '❄️',
  '500': '🌫️', '501': '🌫️', '502': '🌫️', '503': '🌫️', '504': '🌫️',
  '507': '🌫️', '508': '🌫️', '509': '🌫️', '510': '🌫️',
  '511': '🌫️', '512': '🌫️', '513': '🌫️', '514': '🌫️', '515': '🌫️',
  '900': '🌡️', '901': '❄️', '999': '🌪️'
}

function getWeatherIcon(iconCode: string) {
  return weatherIconMap[iconCode] || '🌤️'
}

// 温度柱高度
function getBarHeight(temp: number) {
  const minTemp = 15, maxTemp = 35, minH = 20, maxH = 80
  const c = Math.max(minTemp, Math.min(maxTemp, temp))
  return minH + ((c - minTemp) / (maxTemp - minTemp)) * (maxH - minH)
}

// 7天温度条
function getTempBarStyle(lo: number, hi: number) {
  const allTemps = weatherStore.daily.flatMap(d => [Number(d.tempNight), Number(d.tempDay)])
  const min = Math.min(...allTemps), max = Math.max(...allTemps)
  const range = max - min || 1
  return { left: ((lo - min) / range) * 100 + '%', width: Math.max(((hi - lo) / range) * 100, 8) + '%' }
}

// Badge
const badgeClass = computed(() => {
  const s = weatherStore.indexResult.score
  return s >= 70 ? 'badge--ok' : s >= 40 ? 'badge--mid' : 'badge--low'
})
const badgeTextClass = computed(() => {
  const s = weatherStore.indexResult.score
  return s >= 70 ? 'badge-text--ok' : s >= 40 ? 'badge-text--mid' : 'badge-text--low'
})

// === ① 气压 ===
const pressureTrend = computed(() => {
  const hourly = weatherStore.hourly.slice(0, 6)
  if (hourly.length < 2) return '加载中'
  const first = Number(hourly[0].pressure), last = Number(hourly[hourly.length - 1].pressure)
  const diff = last - first
  if (diff > 3) return '↑ 上升'
  if (diff < -3) return '↓ 下降'
  return '→ 稳定'
})

function getPressureHeight(pressure: number) {
  const min = 990, max = 1040, minH = 10, maxH = 70
  const c = Math.max(min, Math.min(max, Number(pressure)))
  return minH + ((c - min) / (max - min)) * (maxH - minH)
}

function getPressureColor(pressure: number) {
  const p = Number(pressure)
  if (p >= 1015) return '#23A559'
  if (p >= 1005) return '#5865F2'
  return '#F0B232'
}

// === ② 风力 ===
const windBadge = computed(() => {
  const scale = Number(weatherStore.weatherNow?.windScale || 0)
  if (scale <= 2) return { text: '微风适宜', class: 'badge--ok', textClass: 'badge-text--ok' }
  if (scale <= 4) return { text: '有风注意', class: 'badge--mid', textClass: 'badge-text--mid' }
  return { text: '风力较大', class: 'badge--low', textClass: 'badge-text--low' }
})

const windDirMap: Record<string, number> = {
  '北': 0, '东北': 45, '东': 90, '东南': 135,
  '南': 180, '西南': 225, '西': 270, '西北': 315,
  '北风': 0, '东北风': 45, '东风': 90, '东南风': 135,
  '南风': 180, '西南风': 225, '西风': 270, '西北风': 315,
}

function getWindDeg(dir: string) {
  for (const [key, deg] of Object.entries(windDirMap)) {
    if (dir.includes(key)) return deg
  }
  return 0
}

function getWindColor(scale: string | number) {
  const s = Number(scale)
  if (s <= 2) return '#23A559'
  if (s <= 4) return '#F0B232'
  return '#F23F43'
}

// === ③ 湿度 ===
function getHumidityColor(h: number) {
  if (h >= 70) return '#23A559'
  if (h >= 50) return '#5865F2'
  return '#F0B232'
}

// === 月相 ===
const today = computed(() => weatherStore.daily[0] || null)

const moonPhaseIcon = computed(() => {
  const phase = today.value?.moonPhase || ''
  if (phase.includes('新月')) return '🌑'
  if (phase.includes('峨眉月') || phase.includes('残月')) return '🌒'
  if (phase.includes('上弦月')) return '🌓'
  if (phase.includes('盈凸月')) return '🌔'
  if (phase.includes('满月')) return '🌕'
  if (phase.includes('亏凸月')) return '🌖'
  if (phase.includes('下弦月')) return '🌗'
  return '🌙'
})

// === 日出日落弧线 ===
const sunPosition = computed(() => {
  const now = new Date()
  const sunrise = today.value?.sunrise
  const sunset = today.value?.sunset
  if (!sunrise || !sunset) return { left: 50, bottom: 20 }
  const [sh, sm] = sunrise.split(':').map(Number)
  const [eh, em] = sunset.split(':').map(Number)
  const sunriseMin = sh * 60 + sm, sunsetMin = eh * 60 + em
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const total = sunsetMin - sunriseMin
  const ratio = Math.max(0, Math.min(1, (nowMin - sunriseMin) / total))
  return { left: ratio * 100, bottom: Math.sin(Math.PI * ratio) * 40 + 5 }
})

const sunClipPath = computed(() => {
  const pos = sunPosition.value.left
  return `polygon(0 100%, 0 ${100 - Math.sin(Math.PI * pos / 100) * 80}%, ${pos}% ${100 - Math.sin(Math.PI * pos / 100) * 80}%, ${pos}% 100%)`
})

// === 潮汐 ===
const tideData = computed(() => weatherStore.tide)

const tideTable = computed(() => {
  if (!tideData.value?.tideTable) return []
  return tideData.value.tideTable.map((t: any) => ({ time: t.fxTime.slice(11, 16), height: t.height, type: t.type }))
})

const tideStatus = computed(() => {
  if (!tideData.value?.tideHourly) return { text: '加载中', class: 'badge--info', textClass: 'badge-text--info' }
  const hourly = tideData.value.tideHourly
  const now = new Date()
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const current = hourly.find((h: any) => {
    const hMin = parseInt(h.fxTime.slice(11, 13)) * 60 + parseInt(h.fxTime.slice(14, 16))
    return Math.abs(hMin - nowMin) < 30
  })
  if (!current) return { text: '正常', class: 'badge--info', textClass: 'badge-text--info' }
  const idx = hourly.indexOf(current)
  if (idx > 0) {
    const prev = Number(hourly[idx - 1].height), curr = Number(current.height)
    if (curr > prev) return { text: '涨潮中', class: 'badge--ok', textClass: 'badge-text--ok' }
    if (curr < prev) return { text: '退潮中', class: 'badge--mid', textClass: 'badge-text--mid' }
  }
  return { text: '平潮', class: 'badge--info', textClass: 'badge-text--info' }
})

const tidePath = computed(() => {
  if (!tideData.value?.tideHourly) return ''
  const hourly = tideData.value.tideHourly
  const maxH = Math.max(...hourly.map((h: any) => Number(h.height)))
  const minH = Math.min(...hourly.map((h: any) => Number(h.height)))
  const range = maxH - minH || 1
  const svgW = 340, svgH = 90, padTop = 5
  const points = hourly.map((h: any, i: number) => ({
    x: (i / (hourly.length - 1)) * svgW,
    y: padTop + (1 - (Number(h.height) - minH) / range) * (svgH - padTop * 2)
  }))
  if (points.length === 0) return ''
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const p = points[i - 1], c = points[i]
    d += ` C ${p.x + (c.x - p.x) / 3} ${p.y}, ${p.x + 2 * (c.x - p.x) / 3} ${c.y}, ${c.x} ${c.y}`
  }
  return d
})

const tideAreaPath = computed(() => tidePath.value ? tidePath.value + ' L 340 100 L 0 100 Z' : '')

const tideMarkers = computed(() => {
  if (!tideData.value?.tideTable) return []
  const hourly = tideData.value.tideHourly
  if (!hourly || hourly.length === 0) return []
  const maxH = Math.max(...hourly.map((h: any) => Number(h.height)))
  const minH = Math.min(...hourly.map((h: any) => Number(h.height)))
  const range = maxH - minH || 1
  return tideData.value.tideTable.map((t: any) => {
    const h = parseInt(t.fxTime.slice(11, 13)), m = parseInt(t.fxTime.slice(14, 16))
    return {
      x: (Math.min(h + (m > 0 ? 1 : 0), 23) / 23) * 340,
      y: 5 + (1 - (Number(t.height) - minH) / range) * 80,
      height: t.height, type: t.type
    }
  })
})

const tideNowX = computed(() => {
  if (!tideData.value?.tideHourly) return 0
  return (new Date().getHours() / 23) * 340
})

// === 鱼口预测 ===
const fishPredictions = computed(() => {
  const score = weatherStore.indexResult.score
  if (score >= 70) return [
    { name: '鲫鱼', desc: '底层活跃，开口积极', status: '开口积极', variant: 'open', trend: '↑', emoji: '🐟' },
    { name: '鲤鱼', desc: '觅食频繁，可等口', status: '正常', variant: 'normal', trend: '→', emoji: '🐠' },
    { name: '草鱼', desc: '中上层活动', status: '正常', variant: 'normal', trend: '→', emoji: '🐡' },
    { name: '鲢鳙', desc: '滤食活跃', status: '开口积极', variant: 'open', trend: '↑', emoji: '🎣' },
  ]
  if (score >= 40) return [
    { name: '鲫鱼', desc: '谨慎觅食', status: '一般', variant: 'normal', trend: '→', emoji: '🐟' },
    { name: '鲤鱼', desc: '偶尔探底', status: '鱼口较慢', variant: 'slow', trend: '↓', emoji: '🐠' },
    { name: '草鱼', desc: '活动减少', status: '鱼口较慢', variant: 'slow', trend: '↓', emoji: '🐡' },
    { name: '鲢鳙', desc: '不活跃', status: '鱼口较慢', variant: 'slow', trend: '↓', emoji: '🎣' },
  ]
  return [
    { name: '鲫鱼', desc: '低活性', status: '鱼口较慢', variant: 'slow', trend: '↓', emoji: '🐟' },
    { name: '鲤鱼', desc: '基本停口', status: '鱼口较慢', variant: 'slow', trend: '↓', emoji: '🐠' },
    { name: '草鱼', desc: '深水躲避', status: '鱼口较慢', variant: 'slow', trend: '↓', emoji: '🐡' },
    { name: '鲢鳙', desc: '不活动', status: '鱼口较慢', variant: 'slow', trend: '↓', emoji: '🎣' },
  ]
})

// === 钓法建议 ===
const fishingTips = computed(() => {
  const score = weatherStore.indexResult.score
  const temp = Number(weatherStore.weatherNow?.temp || 25)
  const wind = Number(weatherStore.weatherNow?.windScale || 0)
  const humidity = Number(weatherStore.weatherNow?.humidity || 50)
  const pressure = Number(weatherStore.weatherNow?.pressure || 1013)
  const text = weatherStore.weatherNow?.text || ''

  let bait = '蚯蚓、红虫等活饵，小钩细线'
  let target = '鲫鱼为主，兼顾鲤鱼'
  let timing = '上午6-9点，下午4-6点'
  let note = '注意防晒，保持安静'

  // 气压影响
  if (pressure >= 1015) {
    bait = '气压高鱼活跃，商品饵效果好，活饵也可'
  } else if (pressure < 1005) {
    bait = '气压低鱼缺氧，用清淡饵料，避免浓腥'
  }

  // 湿度影响
  if (humidity >= 70) {
    note = '湿度高蚯蚓活跃，活饵效果好'
  } else if (humidity < 40) {
    note = '空气干燥，蚯蚓易死，注意保鲜'
  }

  if (score >= 70) {
    target = '鲫鱼开口积极，鲤鱼等口为主'
    timing = '全天可钓，满潮前后是黄金时段'
  } else if (score >= 40) {
    target = '主攻鲫鱼，放弃鲢鳙'
    timing = '选早晚凉爽时段，避开中午高温'
  } else {
    target = '仅建议钓鲫鱼，其他鱼种停口'
    timing = '建议改日出钓，天气条件不佳'
  }

  if (wind >= 5) note = '风力较大，注意安全，建议近岸作钓'
  if (text.includes('雨')) timing = '雨后1-2小时鱼口转好，注意避雨'
  if (temp < 10 || temp > 35) note = '温度极端，鱼口差，建议改日'

  return { bait, target, timing, note }
})

onMounted(() => { weatherStore.loadWeather() })
</script>

<style scoped lang="scss">
$bg-page: #F2F3F5;
$bg-card: #FFFFFF;
$brand: #5865F2;
$divider: #E3E5E8;
$text-primary: #060607;
$text-secondary: #4E5058;
$text-muted: #80848E;
$tag-bg: #F2F3F5;
$success: #23A559;
$warning: #F0B232;
$danger: #F23F43;

.page-weather { overflow-x: hidden; min-height: 100vh; background: $bg-page; }

/* Header */
.header { position: sticky; top: 0; z-index: 100; background: $bg-card; border-bottom: 1px solid $divider; padding: 12px 16px; }
.header-top { display: flex; align-items: center; justify-content: space-between; }
.header-logo { display: flex; align-items: center; gap: 10px; }
.logo-icon { width: 36px; height: 36px; background: $brand; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.header-title { font-size: 18px; font-weight: 700; color: $text-primary; display: block; line-height: 1.2; }
.header-subtitle { font-size: 12px; color: $text-muted; display: block; }
.header-actions { display: flex; gap: 8px; }
.header-btn { width: 36px; height: 36px; border-radius: 50%; background: $tag-bg; display: flex; align-items: center; justify-content: center; }

/* Content */
.content { overflow-x: hidden; padding: 12px; height: calc(100vh - 60px); }
.loading-state { display: flex; align-items: center; justify-content: center; height: 300px; }
.loading-text { font-size: 14px; color: $text-muted; }

/* Hero */
.hero { background: linear-gradient(135deg, #5865F2, #7B68EE); border-radius: 16px; padding: 20px; margin-bottom: 12px; color: #fff; }
.hero-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
.hero-city { font-size: 13px; opacity: 0.8; display: block; margin-bottom: 4px; }
.hero-score-row { display: flex; align-items: baseline; gap: 4px; }
.hero-score { font-size: 52px; font-weight: 700; line-height: 1; }
.hero-score-unit { font-size: 18px; font-weight: 400; opacity: 0.7; }
.hero-label { font-size: 14px; opacity: 0.9; margin-top: 4px; display: block; }
.hero-weather-main { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.hero-icon { font-size: 40px; }
.hero-temp-now { font-size: 16px; font-weight: 600; opacity: 0.9; }
.hero-desc { margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.15); }
.hero-desc-text { font-size: 13px; opacity: 0.8; }
.hero-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.hero-item { background: rgba(255,255,255,0.15); border-radius: 10px; padding: 8px 4px; text-align: center; }
.hero-item-label { font-size: 10px; opacity: 0.7; display: block; }
.hero-item-value { font-size: 16px; font-weight: 600; margin-top: 2px; display: block; }
.hero-item-unit { font-size: 9px; opacity: 0.6; display: block; margin-top: 1px; }

/* Card */
.card { background: $bg-card; border-radius: 12px; padding: 16px; margin-bottom: 12px; border: 1px solid $divider; }
.card--half { flex: 1; min-width: 0; }
.card-row { display: flex; gap: 12px; margin-bottom: 12px; }
.card-row .card { margin-bottom: 0; }
.card-title-row { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.card-title { font-size: 14px; font-weight: 600; color: $text-primary; }
.card-title--sm { font-size: 13px; }
.card-subtitle { font-size: 11px; color: $text-muted; margin-left: auto; }

/* Badge */
.badge { padding: 2px 8px; border-radius: 100px; }
.badge--ok { background: rgba($success, 0.1); }
.badge--mid { background: rgba($brand, 0.1); }
.badge--low { background: rgba($danger, 0.1); }
.badge--info { background: rgba($brand, 0.06); }
.badge-text { font-size: 11px; font-weight: 500; }
.badge-text--ok { color: $success; }
.badge-text--mid { color: $brand; }
.badge-text--low { color: $danger; }
.badge-text--info { color: $text-muted; }

/* Hourly */
.hourly-scroll { white-space: nowrap; }
.hourly-list { display: inline-flex; gap: 12px; padding: 8px 0; }
.hourly-item { display: flex; flex-direction: column; align-items: center; gap: 4px; min-width: 52px; padding: 8px 4px; border-radius: 10px; }
.hourly-item--now { background: rgba($brand, 0.08); }
.hourly-time { font-size: 11px; color: $text-muted; font-weight: 500; }
.hourly-icon { font-size: 22px; }
.hourly-temp { font-size: 14px; font-weight: 600; color: $text-primary; }
.hourly-bar-wrap { height: 60px; display: flex; align-items: flex-end; justify-content: center; }
.hourly-bar { width: 20px; background: linear-gradient(180deg, $brand 0%, rgba($brand, 0.3) 100%); border-radius: 4px 4px 0 0; }
.hourly-pop { font-size: 10px; color: $brand; font-weight: 500; }

/* Sun Arc */
.sun-arc { height: 60px; position: relative; margin: 8px 0; display: flex; align-items: flex-end; }
.sun-arc-bg { position: absolute; bottom: 0; left: 0; right: 0; height: 50px; border-top: 2px dashed rgba($brand, 0.15); border-radius: 50% 50% 0 0; }
.sun-arc-fill { position: absolute; bottom: 0; left: 0; right: 0; height: 50px; border-top: 2px solid $warning; border-radius: 50% 50% 0 0; }
.sun-dot { position: absolute; transition: all 0.3s; }
.sun-dot-icon { font-size: 16px; }
.sun-times { display: flex; gap: 8px; }
.sun-time-item { flex: 1; text-align: center; }
.sun-time-label { font-size: 10px; color: $text-muted; display: block; }
.sun-time-val { font-size: 13px; font-weight: 600; color: $text-primary; display: block; margin-top: 2px; }
.moon-display { text-align: center; padding: 8px 0; }
.moon-icon { font-size: 36px; }
.moon-phase-text { font-size: 12px; color: $text-muted; display: block; margin-top: 4px; }

/* ① 压力 */
.pressure-chart { display: flex; align-items: flex-end; gap: 4px; height: 100px; padding: 0 4px; margin-bottom: 8px; }
.pressure-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; }
.pressure-val { font-size: 9px; font-weight: 600; color: $text-secondary; }
.pressure-bar { width: 100%; border-radius: 3px 3px 0 0; min-height: 4px; }
.pressure-time { font-size: 9px; color: $text-muted; }
.chart-hint { font-size: 11px; color: $text-muted; text-align: center; }

/* ② 风力 */
.wind-rose { display: flex; gap: 8px; overflow-x: auto; padding: 4px 0; }
.wind-item { display: flex; flex-direction: column; align-items: center; gap: 4px; min-width: 56px; }
.wind-arrow-wrap { display: flex; flex-direction: column; align-items: center; }
.wind-arrow { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; }
.wind-dir-text { font-size: 10px; color: $text-muted; }
.wind-scale { font-size: 12px; font-weight: 600; color: $text-primary; }
.wind-time { font-size: 9px; color: $text-muted; }

/* ③ 湿度 */
.humidity-chart { display: flex; align-items: flex-end; gap: 4px; height: 100px; padding: 0 4px; margin-bottom: 8px; }
.humidity-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; }
.humidity-val { font-size: 9px; font-weight: 600; color: $text-secondary; }
.humidity-bar-track { flex: 1; width: 100%; display: flex; align-items: flex-end; }
.humidity-bar { width: 100%; border-radius: 3px 3px 0 0; transition: height 0.3s; }
.humidity-time { font-size: 9px; color: $text-muted; }

/* ④ 云量 */
.cloud-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 8px; }
.cloud-item { background: $tag-bg; border-radius: 10px; padding: 12px; text-align: center; }
.cloud-emoji { font-size: 24px; display: block; }
.cloud-label { font-size: 11px; color: $text-muted; display: block; margin-top: 4px; }
.cloud-value { font-size: 18px; font-weight: 700; color: $text-primary; display: block; margin-top: 2px; }
.cloud-bar-track { height: 4px; background: rgba($brand, 0.08); border-radius: 2px; margin-top: 8px; overflow: hidden; }
.cloud-bar { height: 100%; background: $brand; border-radius: 2px; transition: width 0.3s; }
.cloud-bar--vis { background: $success; }

/* 7-day */
.day-rows { display: flex; flex-direction: column; }
.day-row { display: flex; align-items: center; padding: 10px 0; border-bottom: 1px solid $divider; gap: 12px; &:last-child { border-bottom: none; } }
.day-row--today .day-label { color: $brand; font-weight: 600; }
.day-left { width: 50px; flex-shrink: 0; }
.day-label { font-size: 13px; font-weight: 500; color: $text-primary; display: block; }
.day-date { font-size: 10px; color: $text-muted; display: block; }
.day-weather { display: flex; align-items: center; gap: 6px; width: 80px; flex-shrink: 0; }
.day-icon { font-size: 20px; }
.day-text { font-size: 12px; color: $text-secondary; }
.day-temp-bar { flex: 1; display: flex; align-items: center; gap: 8px; }
.day-temp-lo { font-size: 12px; color: $text-muted; width: 28px; text-align: right; flex-shrink: 0; }
.day-temp-hi { font-size: 12px; font-weight: 600; color: $text-primary; width: 28px; flex-shrink: 0; }
.day-temp-track { flex: 1; height: 4px; background: rgba($brand, 0.08); border-radius: 2px; position: relative; overflow: hidden; }
.day-temp-fill { position: absolute; top: 0; height: 100%; background: linear-gradient(90deg, $brand, $warning); border-radius: 2px; }

/* Tide */
.tide-chart-wrap { margin-bottom: 12px; }
.tide-svg { display: block; }
.tide-time-axis { display: flex; justify-content: space-between; padding: 4px 0; }
.tide-time-label { font-size: 10px; color: $text-muted; }
.tide-info { display: flex; gap: 8px; }
.tide-info-item { flex: 1; background: $tag-bg; border-radius: 10px; padding: 10px; text-align: center; }
.tide-info-label { font-size: 10px; color: $text-muted; display: block; }
.tide-info-time { font-size: 16px; font-weight: 700; color: $text-primary; display: block; margin-top: 2px; }
.tide-info-val { font-size: 11px; color: $text-muted; display: block; }

/* Fish */
.fish-list { display: flex; flex-direction: column; }
.fish-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid $divider; &:last-child { border-bottom: none; } }
.fish-left { display: flex; align-items: center; gap: 10px; }
.fish-emoji { font-size: 24px; }
.fish-name { font-size: 14px; font-weight: 600; color: $text-primary; display: block; }
.fish-desc { font-size: 11px; color: $text-muted; display: block; }
.fish-right { display: flex; align-items: center; gap: 8px; }
.fish-badge { padding: 3px 10px; border-radius: 100px; &--open { background: rgba($success, 0.1); } &--normal { background: rgba($brand, 0.1); } &--slow { background: rgba(128, 132, 142, 0.1); } }
.fish-badge-text { font-size: 12px; font-weight: 500; .fish-badge--open & { color: $success; } .fish-badge--normal & { color: $brand; } .fish-badge--slow & { color: $text-muted; } }
.fish-trend { font-size: 16px; color: $text-muted; width: 20px; text-align: center; }

/* Tips */
.tips { display: flex; flex-direction: column; }
.tip { display: flex; align-items: flex-start; gap: 10px; padding: 10px 0; border-bottom: 1px solid $divider; &:last-child { border-bottom: none; } }
.tip-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
.tip-icon--b { background: rgba($brand, 0.1); }
.tip-icon--g { background: rgba($success, 0.1); }
.tip-icon--o { background: rgba($warning, 0.1); }
.tip-icon--p { background: rgba($danger, 0.08); }
.tip-content { flex: 1; }
.tip-title { font-size: 13px; font-weight: 600; color: $text-primary; display: block; margin-bottom: 2px; }
.tip-text { font-size: 12px; color: $text-secondary; line-height: 1.5; }
</style>
