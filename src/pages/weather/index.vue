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
      <!-- Loading -->
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

        <!-- 24h Hourly Forecast -->
        <view class="card">
          <view class="card-title-row">
            <text class="card-title">逐小时预报</text>
            <view class="badge" :class="badgeClass">
              <text class="badge-text">{{ weatherStore.indexResult.score >= 70 ? '鱼口活跃' : weatherStore.indexResult.score >= 40 ? '一般' : '鱼口较慢' }}</text>
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
          <!-- 日出日落 -->
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

          <!-- 月相 -->
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

        <!-- 生活指数 -->
        <view class="card" v-if="weatherStore.indices.length > 0">
          <view class="card-title-row">
            <text class="card-title">生活指数</text>
          </view>
          <view class="indices-grid">
            <view v-for="idx in displayIndices" :key="idx.type" class="index-item">
              <view class="index-icon-wrap" :class="'index-icon--' + getIndexColor(idx.type)">
                <text class="index-icon-emoji">{{ getIndexEmoji(idx.type) }}</text>
              </view>
              <text class="index-name">{{ idx.name }}</text>
              <text class="index-level">{{ idx.level }}</text>
              <text class="index-category">{{ idx.category }}</text>
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

        <!-- 潮汐 -->
        <view class="card" v-if="tideData">
          <view class="card-title-row">
            <text class="card-title">潮汐曲线</text>
            <view class="badge" :class="tideStatus.class"><text class="badge-text" :class="tideStatus.textClass">{{ tideStatus.text }}</text></view>
          </view>
          <!-- SVG潮汐曲线 -->
          <view class="tide-chart-wrap">
            <svg viewBox="0 0 340 100" width="100%" height="100" class="tide-svg">
              <!-- 网格线 -->
              <line v-for="i in 4" :key="'gl'+i" :x1="0" :y1="i*25" :x2="340" :y2="i*25" stroke="#E3E5E8" stroke-width="0.5" stroke-dasharray="4,4"/>
              <!-- 潮汐曲线 -->
              <path :d="tidePath" fill="none" stroke="#5865F2" stroke-width="2"/>
              <!-- 填充区域 -->
              <path :d="tideAreaPath" fill="url(#tideFillGrad)" opacity="0.15"/>
              <!-- 满潮/干潮标记 -->
              <g v-for="(pt, i) in tideMarkers" :key="'tm'+i">
                <circle :cx="pt.x" :cy="pt.y" r="3" :fill="pt.type === 'H' ? '#F0B232' : '#5865F2'"/>
                <text :x="pt.x" :y="pt.y - 8" text-anchor="middle" font-size="8" :fill="pt.type === 'H' ? '#F0B232' : '#5865F2'">{{ pt.height }}m</text>
              </g>
              <!-- 当前时间线 -->
              <line v-if="tideNowX" :x1="tideNowX" :y1="0" :x2="tideNowX" :y2="100" stroke="#F23F43" stroke-width="1" stroke-dasharray="3,3"/>
              <defs>
                <linearGradient id="tideFillGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#5865F2"/>
                  <stop offset="100%" stop-color="#5865F2" stop-opacity="0"/>
                </linearGradient>
              </defs>
            </svg>
            <!-- 时间轴 -->
            <view class="tide-time-axis">
              <text class="tide-time-label">00:00</text>
              <text class="tide-time-label">06:00</text>
              <text class="tide-time-label">12:00</text>
              <text class="tide-time-label">18:00</text>
              <text class="tide-time-label">24:00</text>
            </view>
          </view>
          <!-- 满潮/干潮信息卡 -->
          <view class="tide-info">
            <view v-for="(entry, i) in tideTable" :key="i" class="tide-info-item">
              <text class="tide-info-label">{{ entry.type === 'H' ? '🌊 满潮' : '🌊 干潮' }}</text>
              <text class="tide-info-time">{{ entry.time }}</text>
              <text class="tide-info-val">{{ entry.height }}m</text>
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

// 和风天气图标映射
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

// 计算小时柱高度 (基于温度范围 15-35度 → 20-80px)
function getBarHeight(temp: number) {
  const minTemp = 15
  const maxTemp = 35
  const minHeight = 20
  const maxHeight = 80
  const clamped = Math.max(minTemp, Math.min(maxTemp, temp))
  return minHeight + ((clamped - minTemp) / (maxTemp - minTemp)) * (maxHeight - minHeight)
}

// 7天温度条范围
function getTempBarStyle(lo: number, hi: number) {
  const allTemps = weatherStore.daily.flatMap(d => [Number(d.tempNight), Number(d.tempDay)])
  const min = Math.min(...allTemps)
  const max = Math.max(...allTemps)
  const range = max - min || 1
  const left = ((lo - min) / range) * 100
  const width = ((hi - lo) / range) * 100
  return { left: left + '%', width: Math.max(width, 8) + '%' }
}

// Badge class
const badgeClass = computed(() => {
  const s = weatherStore.indexResult.score
  return s >= 70 ? 'badge--ok' : s >= 40 ? 'badge--mid' : 'badge--low'
})

// 今天数据
const today = computed(() => weatherStore.daily[0] || null)

// 月相图标
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

// 日出日落弧线位置
const sunPosition = computed(() => {
  const now = new Date()
  const sunrise = today.value?.sunrise
  const sunset = today.value?.sunset
  if (!sunrise || !sunset) return { left: 50, bottom: 20 }

  const [sh, sm] = sunrise.split(':').map(Number)
  const [eh, em] = sunset.split(':').map(Number)
  const sunriseMin = sh * 60 + sm
  const sunsetMin = eh * 60 + em
  const nowMin = now.getHours() * 60 + now.getMinutes()

  const total = sunsetMin - sunriseMin
  const elapsed = nowMin - sunriseMin
  const ratio = Math.max(0, Math.min(1, elapsed / total))

  // 弧线: x = ratio*100%, y = sin(π*ratio) * height
  return {
    left: ratio * 100,
    bottom: Math.sin(Math.PI * ratio) * 40 + 5
  }
})

// 日出日落clipPath
const sunClipPath = computed(() => {
  const pos = sunPosition.value.left
  return `polygon(0 100%, 0 ${100 - Math.sin(Math.PI * pos / 100) * 80}%, ${pos}% ${100 - Math.sin(Math.PI * pos / 100) * 80}%, ${pos}% 100%)`
})

// === 潮汐数据 ===
const tideData = computed(() => weatherStore.tide)

// 潮汐表格数据
const tideTable = computed(() => {
  if (!tideData.value?.tideTable) return []
  return tideData.value.tideTable.map((t: any) => ({
    time: t.fxTime.slice(11, 16),
    height: t.height,
    type: t.type
  }))
})

// 潮汐状态
const tideStatus = computed(() => {
  if (!tideData.value?.tideHourly) return { text: '加载中', class: 'badge--info', textClass: 'badge-text--info' }
  const hourly = tideData.value.tideHourly
  const now = new Date()
  const nowMin = now.getHours() * 60 + now.getMinutes()
  // 找当前时刻最近的小时数据
  const current = hourly.find((h: any) => {
    const hMin = parseInt(h.fxTime.slice(11, 13)) * 60 + parseInt(h.fxTime.slice(14, 16))
    return Math.abs(hMin - nowMin) < 30
  })
  if (!current) return { text: '正常', class: 'badge--info', textClass: 'badge-text--info' }
  // 判断涨退潮：与前一个小时比较
  const idx = hourly.indexOf(current)
  if (idx > 0) {
    const prev = Number(hourly[idx - 1].height)
    const curr = Number(current.height)
    if (curr > prev) return { text: '涨潮中', class: 'badge--ok', textClass: 'badge-text' }
    if (curr < prev) return { text: '退潮中', class: 'badge--mid', textClass: 'badge-text badge-text--mid' }
  }
  return { text: '平潮', class: 'badge--info', textClass: 'badge-text--info' }
})

// 潮汐曲线SVG路径
const tidePath = computed(() => {
  if (!tideData.value?.tideHourly) return ''
  const hourly = tideData.value.tideHourly
  const maxH = Math.max(...hourly.map((h: any) => Number(h.height)))
  const minH = Math.min(...hourly.map((h: any) => Number(h.height)))
  const range = maxH - minH || 1
  const svgW = 340
  const svgH = 90
  const padTop = 5

  const points = hourly.map((h: any, i: number) => {
    const x = (i / (hourly.length - 1)) * svgW
    const y = padTop + (1 - (Number(h.height) - minH) / range) * (svgH - padTop * 2)
    return { x, y }
  })

  if (points.length === 0) return ''
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const cpx1 = prev.x + (curr.x - prev.x) / 3
    const cpx2 = prev.x + (2 * (curr.x - prev.x)) / 3
    d += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`
  }
  return d
})

// 潮汐填充路径
const tideAreaPath = computed(() => {
  if (!tidePath.value) return ''
  return tidePath.value + ` L 340 100 L 0 100 Z`
})

// 潮汐标记点（满潮/干潮）
const tideMarkers = computed(() => {
  if (!tideData.value?.tideTable) return []
  const hourly = tideData.value.tideHourly
  if (!hourly || hourly.length === 0) return []
  const maxH = Math.max(...hourly.map((h: any) => Number(h.height)))
  const minH = Math.min(...hourly.map((h: any) => Number(h.height)))
  const range = maxH - minH || 1
  const svgW = 340
  const svgH = 90
  const padTop = 5

  return tideData.value.tideTable.map((t: any) => {
    const h = parseInt(t.fxTime.slice(11, 13))
    const m = parseInt(t.fxTime.slice(14, 16))
    const idx = h + (m > 0 ? 1 : 0)
    const x = (Math.min(idx, 23) / 23) * svgW
    const y = padTop + (1 - (Number(t.height) - minH) / range) * (svgH - padTop * 2)
    return { x, y, height: t.height, type: t.type }
  })
})

// 当前时间X坐标
const tideNowX = computed(() => {
  if (!tideData.value?.tideHourly) return 0
  const now = new Date()
  const h = now.getHours()
  return (h / 23) * 340
})

// 生活指数展示
const displayIndices = computed(() => {
  return weatherStore.indices.slice(0, 4)
})

function getIndexEmoji(type: string) {
  const map: Record<string, string> = { '1': '🏃', '2': '🚗', '3': '☁️', '9': '👕' }
  return map[type] || '📊'
}

function getIndexColor(type: string) {
  const map: Record<string, string> = { '1': 'green', '2': 'blue', '3': 'yellow', '9': 'orange' }
  return map[type] || 'blue'
}

// 鱼口预测
const fishPredictions = computed(() => {
  const score = weatherStore.indexResult.score
  if (score >= 70) {
    return [
      { name: '鲫鱼', desc: '底层活跃，开口积极', status: '开口积极', variant: 'open', trend: '↑', emoji: '🐟' },
      { name: '鲤鱼', desc: '觅食频繁，可等口', status: '正常', variant: 'normal', trend: '→', emoji: '🐠' },
      { name: '草鱼', desc: '中上层活动', status: '正常', variant: 'normal', trend: '→', emoji: '🐡' },
      { name: '鲢鳙', desc: '滤食活跃', status: '开口积极', variant: 'open', trend: '↑', emoji: '🎣' },
    ]
  } else if (score >= 40) {
    return [
      { name: '鲫鱼', desc: '谨慎觅食', status: '一般', variant: 'normal', trend: '→', emoji: '🐟' },
      { name: '鲤鱼', desc: '偶尔探底', status: '鱼口较慢', variant: 'slow', trend: '↓', emoji: '🐠' },
      { name: '草鱼', desc: '活动减少', status: '鱼口较慢', variant: 'slow', trend: '↓', emoji: '🐡' },
      { name: '鲢鳙', desc: '不活跃', status: '鱼口较慢', variant: 'slow', trend: '↓', emoji: '🎣' },
    ]
  } else {
    return [
      { name: '鲫鱼', desc: '低活性', status: '鱼口较慢', variant: 'slow', trend: '↓', emoji: '🐟' },
      { name: '鲤鱼', desc: '基本停口', status: '鱼口较慢', variant: 'slow', trend: '↓', emoji: '🐠' },
      { name: '草鱼', desc: '深水躲避', status: '鱼口较慢', variant: 'slow', trend: '↓', emoji: '🐡' },
      { name: '鲢鳙', desc: '不活动', status: '鱼口较慢', variant: 'slow', trend: '↓', emoji: '🎣' },
    ]
  }
})

// 钓法建议
const fishingTips = computed(() => {
  const score = weatherStore.indexResult.score
  const temp = Number(weatherStore.weatherNow?.temp || 25)
  const wind = Number(weatherStore.weatherNow?.windScale || 0)
  const text = weatherStore.weatherNow?.text || ''

  let bait = '蚯蚓、红虫等活饵，小钩细线'
  let target = '鲫鱼为主，兼顾鲤鱼'
  let timing = '上午6-9点，下午4-6点'
  let note = '注意防晒，保持安静'

  if (score >= 70) {
    bait = '活饵（蚯蚓/红虫）效果好，商品饵也可'
    target = '鲫鱼开口积极，鲤鱼等口为主'
    timing = '全天可钓，满潮前后是黄金时段'
    note = '鱼口好时保持节奏，及时补窝'
  } else if (score >= 40) {
    bait = '活饵优先，味型偏腥，少量多次打窝'
    target = '主攻鲫鱼，放弃鲢鳙'
    timing = '选早晚凉爽时段，避开中午高温'
    note = '耐心等口，不要频繁提竿'
  } else {
    bait = '高腥活饵，蚯蚓+红虫组合'
    target = '仅建议钓鲫鱼，其他鱼种停口'
    timing = '建议改日出钓，天气条件不佳'
    note = '天气不佳，注意安全，不建议远投'
  }

  if (wind >= 5) {
    note = '风力较大，注意安全，建议近岸作钓'
  }
  if (text.includes('雨')) {
    timing = '雨后1-2小时鱼口转好，注意避雨'
  }
  if (temp < 10 || temp > 35) {
    note = '温度极端，鱼口差，建议改日'
  }

  return { bait, target, timing, note }
})

onMounted(() => {
  weatherStore.loadWeather()
})
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

.page-weather { overflow-x: hidden;
  min-height: 100vh;
  background: $bg-page;
}

/* Header */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: $bg-card;
  border-bottom: 1px solid $divider;
  padding: 12px 16px;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: $brand;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-title {
  font-size: 18px;
  font-weight: 700;
  color: $text-primary;
  display: block;
  line-height: 1.2;
}

.header-subtitle {
  font-size: 12px;
  color: $text-muted;
  display: block;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.header-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: $tag-bg;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Content */
.content { overflow-x: hidden;
  padding: 12px;
  height: calc(100vh - 60px);
}

/* Loading */
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.loading-text {
  font-size: 14px;
  color: $text-muted;
}

/* Hero */
.hero {
  background: linear-gradient(135deg, #5865F2, #7B68EE);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 12px;
  color: #fff;
}

.hero-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.hero-city {
  font-size: 13px;
  opacity: 0.8;
  display: block;
  margin-bottom: 4px;
}

.hero-score-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.hero-score {
  font-size: 52px;
  font-weight: 700;
  line-height: 1;
}

.hero-score-unit {
  font-size: 18px;
  font-weight: 400;
  opacity: 0.7;
}

.hero-label {
  font-size: 14px;
  opacity: 0.9;
  margin-top: 4px;
  display: block;
}

.hero-weather-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.hero-icon {
  font-size: 40px;
}

.hero-temp-now {
  font-size: 16px;
  font-weight: 600;
  opacity: 0.9;
}

.hero-desc {
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.15);
}

.hero-desc-text {
  font-size: 13px;
  opacity: 0.8;
}

.hero-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.hero-item {
  background: rgba(255,255,255,0.15);
  border-radius: 10px;
  padding: 8px 4px;
  text-align: center;
}

.hero-item-label {
  font-size: 10px;
  opacity: 0.7;
  display: block;
}

.hero-item-value {
  font-size: 16px;
  font-weight: 600;
  margin-top: 2px;
  display: block;
}

.hero-item-unit {
  font-size: 9px;
  opacity: 0.6;
  display: block;
  margin-top: 1px;
}

/* Card */
.card {
  background: $bg-card;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid $divider;
}

.card--half {
  flex: 1;
  min-width: 0;
}

.card-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.card-row .card {
  margin-bottom: 0;
}

.card-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: $text-primary;
}

.card-title--sm {
  font-size: 13px;
}

.card-subtitle {
  font-size: 11px;
  color: $text-muted;
  margin-left: auto;
}

.badge {
  padding: 2px 8px;
  border-radius: 100px;
}

.badge--ok { background: rgba($success, 0.1); }
.badge--mid { background: rgba($brand, 0.1); }
.badge--low { background: rgba($text-muted, 0.1); }
.badge--info { background: rgba($brand, 0.06); }

.badge-text {
  font-size: 11px;
  font-weight: 500;
  color: $success;
}
.badge-text--info { color: $text-muted; }
.badge-text--mid { color: $brand; }

/* Hourly */
.hourly-scroll { white-space: nowrap; }

.hourly-list {
  display: inline-flex;
  gap: 12px;
  padding: 8px 0;
}

.hourly-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 52px;
  padding: 8px 4px;
  border-radius: 10px;
}

.hourly-item--now { background: rgba($brand, 0.08); }

.hourly-time { font-size: 11px; color: $text-muted; font-weight: 500; }
.hourly-icon { font-size: 22px; }
.hourly-temp { font-size: 14px; font-weight: 600; color: $text-primary; }

.hourly-bar-wrap { height: 60px; display: flex; align-items: flex-end; justify-content: center; }

.hourly-bar {
  width: 20px;
  background: linear-gradient(180deg, $brand 0%, rgba($brand, 0.3) 100%);
  border-radius: 4px 4px 0 0;
}

.hourly-pop { font-size: 10px; color: $brand; font-weight: 500; }

/* Sun Arc */
.sun-arc {
  height: 60px;
  position: relative;
  margin: 8px 0;
  display: flex;
  align-items: flex-end;
}

.sun-arc-bg {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  border-top: 2px dashed rgba($brand, 0.15);
  border-radius: 50% 50% 0 0;
}

.sun-arc-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  border-top: 2px solid $warning;
  border-radius: 50% 50% 0 0;
}

.sun-dot {
  position: absolute;
  transition: all 0.3s;
}

.sun-dot-icon { font-size: 16px; }

.sun-times {
  display: flex;
  gap: 8px;
}

.sun-time-item {
  flex: 1;
  text-align: center;
}

.sun-time-label {
  font-size: 10px;
  color: $text-muted;
  display: block;
}

.sun-time-val {
  font-size: 13px;
  font-weight: 600;
  color: $text-primary;
  display: block;
  margin-top: 2px;
}

/* Moon */
.moon-display {
  text-align: center;
  padding: 8px 0;
}

.moon-icon { font-size: 36px; }
.moon-phase-text { font-size: 12px; color: $text-muted; display: block; margin-top: 4px; }

/* 7-day */
.day-rows { display: flex; flex-direction: column; }

.day-row {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid $divider;
  gap: 12px;
  &:last-child { border-bottom: none; }
}

.day-row--today .day-label { color: $brand; font-weight: 600; }

.day-left { width: 50px; flex-shrink: 0; }
.day-label { font-size: 13px; font-weight: 500; color: $text-primary; display: block; }
.day-date { font-size: 10px; color: $text-muted; display: block; }

.day-weather {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 80px;
  flex-shrink: 0;
}

.day-icon { font-size: 20px; }
.day-text { font-size: 12px; color: $text-secondary; }

.day-temp-bar { flex: 1; display: flex; align-items: center; gap: 8px; }
.day-temp-lo { font-size: 12px; color: $text-muted; width: 28px; text-align: right; flex-shrink: 0; }
.day-temp-hi { font-size: 12px; font-weight: 600; color: $text-primary; width: 28px; flex-shrink: 0; }

.day-temp-track {
  flex: 1;
  height: 4px;
  background: rgba($brand, 0.08);
  border-radius: 2px;
  position: relative;
  overflow: hidden;
}

.day-temp-fill {
  position: absolute;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, $brand, $warning);
  border-radius: 2px;
}

/* Indices */
.indices-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.index-item {
  background: $tag-bg;
  border-radius: 10px;
  padding: 12px;
  text-align: center;
}

.index-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 6px;
}

.index-icon--green { background: rgba($success, 0.12); }
.index-icon--blue { background: rgba($brand, 0.12); }
.index-icon--yellow { background: rgba($warning, 0.12); }
.index-icon--orange { background: rgba(255, 140, 50, 0.12); }

.index-icon-emoji { font-size: 18px; }
.index-name { font-size: 11px; color: $text-muted; display: block; }
.index-level { font-size: 13px; font-weight: 600; color: $text-primary; display: block; margin-top: 2px; }
.index-category { font-size: 10px; color: $text-muted; display: block; margin-top: 1px; }

/* Tide */
.tide-chart-wrap {
  margin-bottom: 12px;
}

.tide-svg {
  display: block;
}

.tide-time-axis {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
}

.tide-time-label {
  font-size: 10px;
  color: $text-muted;
}

.tide-info {
  display: flex;
  gap: 8px;
}

.tide-info-item {
  flex: 1;
  background: $tag-bg;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
}

.tide-info-label {
  font-size: 10px;
  color: $text-muted;
  display: block;
}

.tide-info-time {
  font-size: 16px;
  font-weight: 700;
  color: $text-primary;
  display: block;
  margin-top: 2px;
}

.tide-info-val {
  font-size: 11px;
  color: $text-muted;
  display: block;
}

/* Fish */
.fish-list { display: flex; flex-direction: column; }

.fish-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid $divider;
  &:last-child { border-bottom: none; }
}

.fish-left { display: flex; align-items: center; gap: 10px; }
.fish-emoji { font-size: 24px; }
.fish-name { font-size: 14px; font-weight: 600; color: $text-primary; display: block; }
.fish-desc { font-size: 11px; color: $text-muted; display: block; }

.fish-right { display: flex; align-items: center; gap: 8px; }

.fish-badge {
  padding: 3px 10px;
  border-radius: 100px;
  &--open { background: rgba($success, 0.1); }
  &--normal { background: rgba($brand, 0.1); }
  &--slow { background: rgba(128, 132, 142, 0.1); }
}

.fish-badge-text {
  font-size: 12px;
  font-weight: 500;
  color: $success;
  .fish-badge--normal & { color: $brand; }
  .fish-badge--slow & { color: $text-muted; }
}

.fish-trend { font-size: 16px; color: $text-muted; width: 20px; text-align: center; }

/* Tips */
.tips { display: flex; flex-direction: column; }

.tip {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid $divider;
  &:last-child { border-bottom: none; }
}

.tip-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.tip-icon--b { background: rgba($brand, 0.1); }
.tip-icon--g { background: rgba($success, 0.1); }
.tip-icon--o { background: rgba($warning, 0.1); }
.tip-icon--p { background: rgba($danger, 0.08); }

.tip-content { flex: 1; }

.tip-title {
  font-size: 13px;
  font-weight: 600;
  color: $text-primary;
  display: block;
  margin-bottom: 2px;
}

.tip-text {
  font-size: 12px;
  color: $text-secondary;
  line-height: 1.5;
}
</style>
