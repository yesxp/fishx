<template>
  <view class="page-weather">
    <!-- Header -->
    <view class="header">
      <view class="header-top">
        <view class="header-logo">
          <view class="logo-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg></view>
          <view>
            <text class="header-title">天时</text>
            <text class="header-subtitle">天气 · 潮汐 · 钓鱼 · {{ nowStr }}</text>
          </view>
        </view>
        <view class="header-actions">
          <view class="header-btn">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </view>
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="content" :enhanced="true" :show-scrollbar="false" :style="{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }">
      <view v-if="weatherStore.loading && !weatherStore.weatherNow" class="loading-state">
        <wd-loading text="加载天气数据中..." />
      </view>

      <template v-else>
        <!-- ===== Hero Card ===== -->
        <view class="hero">
          <view class="hero-top-row">
            <!-- Left: Date + Temp (merged) -->
            <view class="hero-left">
              <text class="hero-date">广州 · 6月16日 周二</text>
              <view class="hero-temp-row">
                <text class="hero-temp-big">{{ weatherStore.weatherNow?.temp || '--' }}°</text>
                <text class="hero-icon">{{ getWeatherIcon(weatherStore.weatherNow?.icon || '100') }}</text>
              </view>
              <text class="hero-weather-desc">{{ weatherStore.weatherNow?.text || '' }}，体感 {{ weatherStore.weatherNow?.feelsLike || '--' }}°</text>
            </view>
            <!-- Right: Score Ring -->
            <view class="hero-score-ring">
              <view class="score-ring-outer">
                <view class="score-ring-inner">
                  <text class="hero-score">{{ weatherStore.indexResult.score }}</text>
                  <text class="hero-score-unit">分</text>
                </view>
              </view>
              <text class="hero-score-label">实况</text>
              <text class="hero-score-level">{{ weatherStore.indexResult.level }}</text>
            </view>
          </view>

          <!-- Bottom: 2x2 Grid -->
          <view class="hero-detail-grid">
            <view class="hero-detail-item">
              <view class="hero-detail-icon hero-detail-icon--purple"></view>
              <view class="hero-detail-info">
                <text class="hero-detail-label">气压</text>
                <text class="hero-detail-value">{{ weatherStore.weatherNow?.pressure || '--' }} <text class="hero-detail-unit">hPa</text></text>
              </view>
              <text class="hero-detail-tag" :class="pressureTag.class">{{ pressureTag.text }}</text>
            </view>
            <view class="hero-detail-item">
              <view class="hero-detail-icon hero-detail-icon--cyan"></view>
              <view class="hero-detail-info">
                <text class="hero-detail-label">风力</text>
                <text class="hero-detail-value">{{ weatherStore.weatherNow?.windScale || '--' }} <text class="hero-detail-unit">{{ weatherStore.weatherNow?.windDir || '' }}</text></text>
              </view>
              <text class="hero-detail-tag" :class="windTag.class">{{ windTag.text }}</text>
            </view>
            <view class="hero-detail-item">
              <view class="hero-detail-icon hero-detail-icon--blue"></view>
              <view class="hero-detail-info">
                <text class="hero-detail-label">降雨</text>
                <text class="hero-detail-value">{{ weatherStore.hourly[0]?.pop || '0' }}<text class="hero-detail-unit">%</text></text>
              </view>
              <text class="hero-detail-tag" :class="rainTag.class">{{ rainTag.text }}</text>
            </view>
            <view class="hero-detail-item">
              <view class="hero-detail-icon hero-detail-icon--green"></view>
              <view class="hero-detail-info">
                <text class="hero-detail-label">溶氧</text>
                <text class="hero-detail-value">-- <text class="hero-detail-unit">mg/L</text></text>
              </view>
              <text class="hero-detail-tag hero-detail-tag--muted">待检测</text>
            </view>
          </view>
        </view>

        <!-- ===== 今日垂钓建议（竖状柱状图） ===== -->
        <view class="card">
          <view class="card-title-row">
            <text class="card-title">🎯 今日垂钓指数</text>
            <text class="card-subtitle">基于天气 + 潮汐</text>
          </view>

          <!-- 竖状垂钓指数柱状图 -->
          <scroll-view scroll-x class="vbar-scroll" :show-scrollbar="false">
            <view class="vbar-chart">
              <view v-for="(h, i) in hourlyFishingScore" :key="i" class="vbar-col" :class="{ 'vbar-highlight': i === nowHour }">
                <text class="vbar-score">{{ h.score }}</text>
                <view class="vbar-bar" :class="getVBarClass(h.score)" :style="{ height: (h.score / 100 * 160) + 'rpx' }" />
                <text class="vbar-time">{{ h.time }}</text>
              </view>
            </view>
          </scroll-view>
          <view class="vbar-legend">
            <view class="vbar-legend-item"><view class="vbar-legend-dot vbar-legend-dot--excellent" /><text>极佳</text></view>
            <view class="vbar-legend-item"><view class="vbar-legend-dot vbar-legend-dot--good" /><text>良好</text></view>
            <view class="vbar-legend-item"><view class="vbar-legend-dot vbar-legend-dot--ok" /><text>一般</text></view>
            <view class="vbar-legend-item"><view class="vbar-legend-dot vbar-legend-dot--bad" /><text>较差</text></view>
            <view class="vbar-legend-item"><view class="vbar-legend-dot vbar-legend-dot--poor" /><text>不宜</text></view>
          </view>

          <view class="divider-simple" />

          <!-- 按钓法推荐鱼种 -->
          <text class="fish-section-title">🎣 按钓法推荐</text>
          <view class="method-grid">
            <view v-for="m in fishingMethods" :key="m.name" class="method-card-mini">
              <text class="method-mini-name">{{ m.icon }} {{ m.name }}</text>
              <view class="method-mini-score-row">
                <text class="method-mini-score" :class="'method-mini-score--' + m.level">{{ m.score }}分</text>
                <text class="method-mini-level">{{ m.levelText }}</text>
              </view>
              <text class="method-mini-fish">推荐{{ m.topFish }}</text>
            </view>
          </view>

          <view class="divider-simple" />

          <!-- 条件标签 -->
          <view class="tip-bar">
            <view class="tip-tag tip-tag--green"><text>✅ 气压 {{ weatherStore.weatherNow?.pressure || '--' }}hPa</text></view>
            <view v-if="Number(weatherStore.weatherNow?.temp) >= 30" class="tip-tag tip-tag--yellow"><text>🌡️ 午后闷热 {{ weatherStore.weatherNow?.temp }}°C</text></view>
            <view class="tip-tag tip-tag--blue"><text>🌊 {{ tideStatus.text }}</text></view>
          </view>
        </view>

        <!-- ===== 逐小时预报 ===== -->
        <view class="card">
          <view class="card-title-row">
            <text class="card-title">逐小时预报</text>
            <view class="card-title-right" v-if="today">
              <view class="card-title-sun">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#4E5058" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 17h1m16 0h1m-15.4-6.4l.7.7m12.1-.7l-.7.7m-9.7 5.7a4 4 0 0 1 8 0"/>
                  <path d="M3 21l18 0"/>
                  <path d="M12 9v-6l3 3m-6 0l3-3"/>
                </svg>
                <text>{{ today.sunrise || '--:--' }}</text>
              </view>
              <view class="card-title-sun">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#4E5058" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 17h1m16 0h1m-15.4-6.4l.7.7m12.1-.7l-.7.7m-9.7 5.7a4 4 0 0 1 8 0"/>
                  <path d="M3 21l18 0"/>
                  <path d="M12 3v6l3-3m-6 0l3 3"/>
                </svg>
                <text>{{ today.sunset || '--:--' }}</text>
              </view>
            </view>
          </view>
          <!-- 横向滑动小时卡片 -->
          <scroll-view v-if="filteredHourly.length > 0" scroll-x class="hourly-scroll" :show-scrollbar="false">
            <view class="hourly-row">
              <view
                v-for="(h, i) in filteredHourly"
                :key="i"
                class="hourly-card"
                :class="{ 'hourly-card--now': i === 0 && selectedDayIdx === 0 }"
              >
                <text class="hourly-time">{{ i === 0 && selectedDayIdx === 0 ? '现在' : h.time.slice(-5, -3) + '点' }}</text>
                <text class="hourly-icon">{{ getWeatherIcon(h.icon) }}</text>
                <text class="hourly-temp">{{ h.temp }}°</text>
                <!-- 温度竖条 -->
                <view class="hourly-line-area">
                  <view class="hourly-temp-bar" :style="{ height: getHourlyBarHeight(h) + 'px' }" />
                </view>
                <text class="hourly-wind">{{ h.windDir }} {{ h.windScale }}级</text>
                <wd-tag :type="getAlertType(h.text)" variant="light" size="small" round>{{ getAlertText(h.text) }}</wd-tag>
              </view>
            </view>
          </scroll-view>
          <view v-else class="hourly-empty">
            <text class="hourly-empty-text">暂无该日逐时数据</text>
          </view>
        </view>



        <!-- ===== 天气日历（未来7天）Redesigned ===== -->
        <view class="card">
          <view class="card-title-row">
            <text class="card-title">天气日历</text>
            <text class="card-subtitle">未来7天</text>
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
              </view>
              <view class="day-temp-bar">
                <text class="day-temp-lo">{{ day.tempNight }}°</text>
                <view class="day-temp-track">
                  <view class="day-temp-fill" :style="getTempBarStyle(day.tempNight, day.tempDay)" />
                </view>
                <text class="day-temp-hi">{{ day.tempDay }}°</text>
              </view>
              <view class="day-comfort">
                <wd-tag :type="getDayComfortType(day)" size="small" round variant="light">{{ getDayComfortText(day) }}</wd-tag>
              </view>
            </view>
          </view>
        </view>

        <!-- ===== 天文潮汐 Redesigned ===== -->
        <view class="card" v-if="tideData">
          <view class="card-title-row">
            <text class="card-title">🌊 天文潮汐</text>
            <wd-tag :type="tideStatus.tagType" size="small" round>{{ tideStatus.text }}</wd-tag>
          </view>
          <view class="tide-chart-wrap">
            <svg viewBox="0 0 340 100" width="100%" height="100" class="tide-svg">
              <!-- Fishing-friendly zone overlays -->
              <rect v-for="i in 4" :key="'tz'+i" :x="(i*70) - 15" y="0" width="30" height="100" fill="#23A559" opacity="0.06" rx="4"/>
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
          <!-- Compact Tide Info Badges -->
          <view class="tide-info-compact">
            <template v-for="(entry, i) in tideTable" :key="i">
              <view class="tide-badge" :class="entry.type === 'H' ? 'tide-badge--high' : 'tide-badge--low'">
                <text class="tide-badge-icon">{{ entry.type === 'H' ? '🌊' : '🌊' }}</text>
                <view class="tide-badge-info">
                  <text class="tide-badge-label">{{ entry.type === 'H' ? '满潮' : '干潮' }}</text>
                  <text class="tide-badge-time">{{ entry.time }}</text>
                </view>
                <text class="tide-badge-val">{{ entry.height }}m</text>
              </view>
            </template>
          </view>
        </view>

        <!-- ===== 潮汐日历（未来7天）+ 潮汐规律 ===== -->
        <view class="card">
          <view class="card-title-row">
            <text class="card-title">📅 潮汐日历</text>
            <text class="card-subtitle">未来7天</text>
          </view>
          <view class="tide-cal-header">
            <text class="tide-cal-col tide-cal-col--day">日期</text>
            <text class="tide-cal-col tide-cal-col--hl">满潮</text>
            <text class="tide-cal-col tide-cal-col--hl">干潮</text>
            <text class="tide-cal-col tide-cal-col--hl">满潮</text>
            <text class="tide-cal-col tide-cal-col--hl">干潮</text>
          </view>
          <view v-for="(day, i) in tideCalendar" :key="i" class="tide-cal-row" :class="{ 'tide-cal-row--today': i === 0, 'tide-cal-row--alt': i % 2 === 1 }">
            <view class="tide-cal-col tide-cal-col--day">
              <text class="tide-cal-date">{{ i === 0 ? '今天' : getWeekDayShort(day.date) }}</text>
            </view>
            <template v-if="day.data?.tideTable">
              <view v-for="(t, j) in padTideTable(day.data.tideTable, 4)" :key="j" class="tide-cal-col tide-cal-col--hl">
                <text class="tide-cal-time" v-if="t">{{ t.fxTime.slice(11, 16) }}</text>
                <text class="tide-cal-h" v-if="t" :class="t.type === 'H' ? 'tide-cal-h--hi' : 'tide-cal-h--lo'">{{ t.height }}m</text>
              </view>
            </template>
            <template v-else>
              <text class="tide-cal-empty">--</text>
            </template>
          </view>
          <wd-divider hairline custom-style="margin: 12px 0; padding: 0;" />
          <view class="tide-pattern">
            <view class="tide-pattern-item">
              <view class="tide-pattern-icon tide-pattern-icon--spring">🌊</view>
              <view>
                <text class="tide-pattern-name">{{ tidePattern.cycle }}</text>
                <text class="tide-pattern-desc">{{ tidePattern.cycleDesc }}</text>
              </view>
            </view>
            <view class="tide-pattern-item">
              <view class="tide-pattern-icon tide-pattern-icon--diff">📏</view>
              <view>
                <text class="tide-pattern-name">潮差 {{ tidePattern.range }}m</text>
                <text class="tide-pattern-desc">{{ tidePattern.rangeDesc }}</text>
              </view>
            </view>
            <view class="tide-pattern-item">
              <view class="tide-pattern-icon tide-pattern-icon--best">🎣</view>
              <view>
                <text class="tide-pattern-name">最佳窗口</text>
                <text class="tide-pattern-desc">{{ tidePattern.bestWindow }}</text>
              </view>
            </view>
          </view>
          <view class="tide-tip">
            <text class="tide-tip-text">💡 {{ tidePattern.suggestion }}</text>
          </view>
        </view>

        <!-- ===== 台风路径 ===== -->
        <view class="card" v-if="weatherStore.typhoonTrack">
          <view class="card-title-row">
            <text class="card-title">🌀 台风路径</text>
            <wd-tag type="danger" size="small" round>{{ typhoonInfo.name }}</wd-tag>
          </view>
          <view class="typhoon-map">
            <svg viewBox="0 0 340 160" width="100%" height="160" class="typhoon-svg">
              <!-- 简化地图背景 -->
              <rect x="0" y="0" width="340" height="160" fill="#F2F3F5" rx="8"/>
              <text x="170" y="85" text-anchor="middle" font-size="10" fill="#80848E">台风路径示意</text>
              <!-- 路径线 -->
              <polyline :points="typhoonPathPoints" fill="none" stroke="#F23F43" stroke-width="2"/>
              <!-- 路径点 -->
              <circle v-for="(pt, i) in typhoonPathDots" :key="'td'+i" :cx="pt.x" :cy="pt.y" r="3" :fill="i === typhoonPathDots.length - 1 ? '#F23F43' : '#80848E'"/>
            </svg>
          </view>
          <view class="typhoon-info">
            <view class="typhoon-info-item">
              <text class="typhoon-info-label">等级</text>
              <text class="typhoon-info-val">{{ typhoonInfo.type }}</text>
            </view>
            <view class="typhoon-info-item">
              <text class="typhoon-info-label">气压</text>
              <text class="typhoon-info-val">{{ typhoonInfo.pressure }}hPa</text>
            </view>
            <view class="typhoon-info-item">
              <text class="typhoon-info-label">风速</text>
              <text class="typhoon-info-val">{{ typhoonInfo.windSpeed }}m/s</text>
            </view>
            <view class="typhoon-info-item">
              <text class="typhoon-info-label">移速</text>
              <text class="typhoon-info-val">{{ typhoonInfo.moveSpeed }}km/h</text>
            </view>
          </view>
          <view class="typhoon-tip">
            <text class="tide-tip-text">⚠️ 台风期间不建议出海作钓，注意安全</text>
          </view>
        </view>
        <view class="card typhoon-card" v-else-if="!weatherStore.loading && activeTyphoon" @tap="goTyphoon">
          <view class="card-title-row">
            <text class="card-title">🌀 台风「{{ activeTyphoon.name }}」</text>
            <wd-tag :type="activeTyphoon.levelClass === 'super' ? 'danger' : activeTyphoon.levelClass === 'strong' ? 'warning' : 'primary'" size="small" round>
              {{ activeTyphoon.level }}
            </wd-tag>
            <text class="typhoon-link" style="margin-left:auto">详情 →</text>
          </view>
          <view class="typhoon-mini-map">
            <svg viewBox="0 0 340 140" width="100%" height="140">
              <rect x="0" y="0" width="340" height="140" fill="#F2F3F5" rx="8"/>
              <polyline points="20,80 60,75 100,68 140,60 170,55" fill="none" stroke="#80848E" stroke-width="1.5"/>
              <circle cx="20" cy="80" r="2.5" fill="#80848E"/>
              <circle cx="60" cy="75" r="2.5" fill="#80848E"/>
              <circle cx="100" cy="68" r="2.5" fill="#80848E"/>
              <circle cx="140" cy="60" r="2.5" fill="#80848E"/>
              <circle cx="190" cy="52" r="20" fill="#F23F43" opacity="0.08"/>
              <circle cx="190" cy="52" r="14" fill="#F23F43" opacity="0.15"/>
              <circle cx="190" cy="52" r="9" fill="#F23F43"/>
              <text x="190" y="22" text-anchor="middle" font-size="12" fill="#F23F43" font-weight="700">{{ activeTyphoon.name }}</text>
              <polyline points="190,52 230,44 265,32 300,18" fill="none" stroke="#F0B232" stroke-width="1.5" stroke-dasharray="6,4"/>
              <circle cx="230" cy="44" r="2.5" fill="#F0B232"/>
              <circle cx="265" cy="32" r="2.5" fill="#F0B232"/>
              <circle cx="300" cy="18" r="2.5" fill="#F0B232"/>
              <circle cx="150" cy="50" r="3" fill="#5865F2"/>
              <text x="150" y="42" text-anchor="middle" font-size="9" fill="#5865F2" font-weight="500">广州</text>
            </svg>
          </view>
          <view class="typhoon-info-grid">
            <view class="typhoon-info-item">
              <text class="typhoon-info-label">风速</text>
              <text class="typhoon-info-value">{{ activeTyphoon.windSpeed }}</text>
            </view>
            <view class="typhoon-info-item">
              <text class="typhoon-info-label">移向</text>
              <text class="typhoon-info-value">{{ activeTyphoon.moveDir }}</text>
            </view>
            <view class="typhoon-info-item">
              <text class="typhoon-info-label">移速</text>
              <text class="typhoon-info-value">{{ activeTyphoon.moveSpeed }}</text>
            </view>
            <view class="typhoon-info-item">
              <text class="typhoon-info-label">距离</text>
              <text class="typhoon-info-value">{{ activeTyphoon.distance }}</text>
            </view>
          </view>
          <view class="typhoon-impact">
            <view class="typhoon-impact-icon">⚠️</view>
            <text class="typhoon-impact-text">{{ activeTyphoon.impact }}</text>
          </view>
        </view>
        <view class="card" v-else-if="!weatherStore.loading">
          <view class="card-title-row">
            <text class="card-title">🌀 台风路径</text>
          </view>
          <view class="typhoon-empty">
            <text class="typhoon-empty-icon">✅</text>
            <text class="typhoon-empty-text">当前无活跃台风</text>
          </view>
        </view>

        <view style="height: 120rpx;" />
      </template>
    </scroll-view>
  </view>

    <!-- Wot UI TabBar -->
    <WotTabBar current="weather" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useWeatherStore } from '@/stores/weather'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { provideEcharts } from 'uni-echarts/shared'
import UniEcharts from 'uni-echarts'
import WotTabBar from '@/components/WotTabBar.vue'


const weatherStore = useWeatherStore()
provideEcharts(echarts)
echarts.use([LineChart, GridComponent, TooltipComponent, CanvasRenderer])

// ===== 台风模拟数据（有台风时显示） =====
// 设为 null 则不显示台风卡片，设为对象则显示
const activeTyphoon = ref<{
  name: string; level: string; levelClass: string;
  windSpeed: string; moveDir: string; moveSpeed: string;
  distance: string; impact: string
} | null>({
  name: '蝴蝶',
  level: '超强台风',
  levelClass: 'super',
  windSpeed: '62m/s',
  moveDir: '西北偏北',
  moveSpeed: '15km/h',
  distance: '约680km',
  impact: '预计24小时内影响华南沿海，带来强风暴雨。建议暂停出海及水库垂钓，沿海钓点注意安全。'
})

function goTyphoon() {
  uni.navigateTo({ url: '/pages/typhoon/index' })
}

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

// 和风天气图标 URL（SVG）
function getWeatherIconUrl(iconCode: string): string {
  return `https://icons.qweather.com/assets/icons/${iconCode}-fill.svg?ik=4JDXGV6WMN`
}

function getBarHeight(temp: number) {
  const clamped = Math.max(15, Math.min(35, temp))
  return 20 + ((clamped - 15) / 20) * 60
}

function getTempBarStyle(lo: number, hi: number) {
  const allTemps = weatherStore.daily.flatMap(d => [Number(d.tempNight), Number(d.tempDay)])
  const min = Math.min(...allTemps)
  const max = Math.max(...allTemps)
  const range = max - min || 1
  return { left: ((lo - min) / range) * 100 + '%', width: Math.max(((hi - lo) / range) * 100, 8) + '%' }
}
// 月相emoji

// 每日舒适度
function getDayComfortType(day: any) {
  const hi = Number(day.tempDay)
  if (hi >= 35) return 'danger'
  if (hi >= 30) return 'warning'
  if (hi >= 20) return 'success'
  return 'primary'
}

function getDayComfortText(day: any) {
  const hi = Number(day.tempDay)
  if (hi >= 35) return '闷热'
  if (hi >= 30) return '热'
  if (hi >= 20) return '温暖'
  return '凉爽'
}


// ===== ECharts 逐小时双折线图 =====
const hourlyChartOption = computed(() => {
  const hourly = filteredHourly.value
  if (hourly.length === 0) return {}

  const times = hourly.map((h, i) => i === 0 ? '现在' : h.time.slice(-5))
  const temps = hourly.map(h => Number(h.temp))

  const minT = Math.floor(Math.min(...temps) - 2)
  const maxT = Math.ceil(Math.max(...temps) + 2)

  return {
    dataZoom: [{
      type: 'slider',
      start: 0,
      end: 29,
      height: 18,
      bottom: 2,
      borderColor: 'transparent',
      backgroundColor: '#F2F3F5',
      fillerColor: 'rgba(88,101,242,0.12)',
      handleStyle: { color: '#5865F2', borderColor: '#5865F2' },
      textStyle: { color: '#80848E', fontSize: 9 },
      showDetail: false,
      brushSelect: false,
    }],
    grid: { left: 8, right: 8, top: 30, bottom: 60 },
    legend: { show: false },
    xAxis: {
      type: 'category',
      data: times,
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#E3E5E8' } },
      axisTick: { show: false },
      axisLabel: {
        color: '#80848E',
        fontSize: 10,
        margin: 8,
        formatter: (value, index) => {
          return `{icon|${getWeatherIcon(hourly[index].icon)}}\n${value}`
        },
        rich: {
          icon: { fontSize: 16, lineHeight: 22, align: 'center' },
        },
      },
      splitLine: {
        show: true,
        lineStyle: { color: '#ECEEF1', type: 'dashed', width: 1 },
      },
    },
    yAxis: {
      type: 'value',
      min: minT,
      max: maxT,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: '#E3E5E8',
      borderWidth: 1,
      textStyle: { color: '#1E2028', fontSize: 12 },
      axisPointer: { type: 'line', lineStyle: { color: '#D0D0D0', type: 'dashed' } },
    },
    series: [{
      name: '温度',
      type: 'line',
      data: temps,
      smooth: 0.3,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { color: '#FF8C42', width: 2 },
      itemStyle: { color: '#FF8C42', borderColor: '#fff', borderWidth: 1.5 },
      areaStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(255,140,66,0.15)' },
            { offset: 1, color: 'rgba(255,140,66,0.01)' },
          ],
        },
      },
      label: {
        show: true,
        position: 'top',
        color: '#1E2028',
        fontSize: 11,
        fontWeight: 600,
        formatter: '{c}°',
      },
    }],
  }
})

function getWeekDayShort(dateStr: string) {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return days[new Date(dateStr).getDay()]
}

const badgeClass = computed(() => {
  const s = weatherStore.indexResult.score
  return s >= 70 ? 'badge--ok' : s >= 40 ? 'badge--mid' : 'badge--low'
})

const today = computed(() => weatherStore.daily[0] || null)

// ===== 逐小时日期Tab =====
const selectedDayIdx = ref(0)

const hourlyDayTabs = computed(() => {
  const daily = weatherStore.daily
  if (daily.length === 0) return []
  const now = new Date()
  return daily.slice(0, 5).map((d, i) => {
    const date = new Date(d.date)
    const isToday = date.toDateString() === now.toDateString()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const isTomorrow = date.toDateString() === tomorrow.toDateString()
    const label = isToday ? '今天' : isTomorrow ? '明天' : d.week
    return {
      date: d.date,
      label,
      dateShort: `${date.getMonth() + 1}/${date.getDate()}`,
    }
  })
})

const filteredHourly = computed(() => {
  const tabs = hourlyDayTabs.value
  if (tabs.length === 0) return []
  const selectedDate = tabs[selectedDayIdx.value]?.date
  if (!selectedDate) return weatherStore.hourly.slice(0, 24)
  // 和风天气 hourly 的 time 格式是 HH:MM，需要按日期过滤
  // hourly data 的 fxTime 包含完整日期，但 store 里只存了 HH:MM
  // 所以用 index 推断：每天约24条，前24条是今天
  const allHourly = weatherStore.hourly
  if (selectedDayIdx.value === 0) return allHourly.slice(0, 24)
  // 非今天：API 只返回未来24-72小时，按时间偏移截取
  const start = selectedDayIdx.value * 24
  return allHourly.slice(start, start + 24)
})

// ===== 逐小时温度曲线 =====
const hourlyDots = computed(() => {
  const data = filteredHourly.value
  if (data.length < 2) return []
  const temps = data.map(h => Number(h.temp))
  const minT = Math.min(...temps)
  const maxT = Math.max(...temps)
  const range = maxT - minT || 1
  const svgH = 80
  const padY = 10

  // 先算全局 Y 坐标
  const globalY = temps.map(t => padY + (1 - (t - minT) / range) * (svgH - padY * 2))

  return data.map((_, i) => ({
    globalY: globalY[i],
    localY: globalY[i],
  }))
})

const moonPhaseIcon = computed(() => {
  const phase = today.value?.moonPhase || ''
  if (phase.includes('新月')) return '🌑'
  if (phase.includes('峨眉') || phase.includes('残月')) return '🌒'
  if (phase.includes('上弦')) return '🌓'
  if (phase.includes('盈凸')) return '🌔'
  if (phase.includes('满月')) return '🌕'
  if (phase.includes('亏凸')) return '🌖'
  if (phase.includes('下弦')) return '🌗'
  return '🌙'
})

const sunPosition = computed(() => {
  const now = new Date()
  const sunrise = today.value?.sunrise
  const sunset = today.value?.sunset
  if (!sunrise || !sunset) return { left: 50, bottom: 20 }
  const [sh, sm] = sunrise.split(':').map(Number)
  const [eh, em] = sunset.split(':').map(Number)
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const ratio = Math.max(0, Math.min(1, (nowMin - sh * 60 - sm) / ((eh * 60 + em) - (sh * 60 + sm))))
  return { left: ratio * 100, bottom: Math.sin(Math.PI * ratio) * 40 + 5 }
})

const sunClipPath = computed(() => {
  const pos = sunPosition.value.left
  return `polygon(0 100%, 0 ${100 - Math.sin(Math.PI * pos / 100) * 80}%, ${pos}% ${100 - Math.sin(Math.PI * pos / 100) * 80}%, ${pos}% 100%)`
})

// Hero grid tag logic
const pressureTag = computed(() => {
  const p = Number(weatherStore.weatherNow?.pressure || 0)
  if (p >= 1010 && p <= 1025) return { text: '平稳', class: 'hero-detail-tag--good' }
  if (p >= 1000 && p <= 1030) return { text: '波动', class: 'hero-detail-tag--warn' }
  return { text: '异常', class: 'hero-detail-tag--bad' }
})

const windTag = computed(() => {
  const w = Number(weatherStore.weatherNow?.windScale || 0)
  if (w >= 1 && w <= 3) return { text: '适宜', class: 'hero-detail-tag--good' }
  if (w === 4) return { text: '较大', class: 'hero-detail-tag--warn' }
  return { text: '不建议', class: 'hero-detail-tag--bad' }
})

const rainTag = computed(() => {
  const pop = Number(weatherStore.hourly[0]?.pop || 0)
  if (pop === 0) return { text: '放心', class: 'hero-detail-tag--good' }
  if (pop < 30) return { text: '可能', class: 'hero-detail-tag--warn' }
  return { text: '不建议', class: 'hero-detail-tag--bad' }
})

// ===== 竖状垂钓指数柱状图 =====
const hourlyFishingScore = computed(() => {
  return weatherStore.hourly.slice(0, 24).map((h: any) => {
    const temp = Number(h.temp || 25)
    const humidity = Number(h.humidity || 70)
    const windScale = Number(h.windScale || 1)
    const pop = Number(h.pop || 0)
    // 简化评分算法
    let score = 60
    // 温度：18-28最佳
    if (temp >= 18 && temp <= 28) score += 15
    else if (temp >= 15 && temp <= 32) score += 5
    else score -= 10
    // 风力：1-3级最佳
    if (windScale >= 1 && windScale <= 3) score += 10
    else if (windScale >= 4) score -= 10
    // 降水概率
    if (pop === 0) score += 10
    else if (pop < 30) score += 0
    else score -= 15
    // 湿度
    if (humidity >= 60 && humidity <= 80) score += 5
    // 时间：晨昏加分
    const hour = parseInt(h.time?.slice(0, 2) || '12')
    if ((hour >= 5 && hour <= 8) || (hour >= 16 && hour <= 19)) score += 10
    if (hour >= 11 && hour <= 14) score -= 10
    // 只显示小时数，如 "07"
    const hourLabel = h.time ? h.time.slice(0, 2) : '--'
    return { time: hourLabel, score: Math.max(0, Math.min(100, score)) }
  })
})

const nowHour = computed(() => new Date().getHours())
// 部署时间戳：每次提交时更新
const nowStr = '2026-06-17 17:25'

function getVBarClass(score: number) {
  if (score >= 85) return 'vbar-bar--excellent'
  if (score >= 70) return 'vbar-bar--good'
  if (score >= 55) return 'vbar-bar--ok'
  if (score >= 40) return 'vbar-bar--bad'
  return 'vbar-bar--poor'
}

function getHourlyBarClass(h: any) {
  const pop = Number(h.pop ?? 0)
  if (pop >= 50) return 'hourly-bar--rain'
  if (pop >= 20) return 'hourly-bar--cloud'
  return 'hourly-bar--sun'
}

// 温度竖条高度
const hourlyTempRange = computed(() => {
  const temps = filteredHourly.value.map((h: any) => Number(h.temp))
  return { min: Math.min(...temps), max: Math.max(...temps) }
})

const getHourlyBarHeight = (h: any) => {
  const temp = Number(h.temp)
  const { min, max } = hourlyTempRange.value
  const range = max - min || 1
  const minH = 10, maxH = 47
  return minH + ((temp - min) / range) * (maxH - minH)
}

// 天气预警等级
const getAlertType = (text: string) => {
  if (/暴雨|大暴雨|特大暴雨/.test(text)) return 'danger'
  if (/雷|冰雹|大风/.test(text)) return 'warning'
  if (/中雨|大雨|冻雨/.test(text)) return 'warning'
  if (/小雨|阵雨|雨夹雪/.test(text)) return 'primary'
  if (/雪|雾/.test(text)) return 'primary'
  return 'default'
}

const getAlertText = (text: string) => {
  if (!text) return text || '—'
  if (/暴雨|大暴雨|特大暴雨/.test(text)) return '暴雨'
  if (/雷阵雨|雷暴/.test(text)) return '雷暴'
  if (/雷/.test(text)) return '雷电'
  if (/冰雹/.test(text)) return '冰雹'
  if (/大风/.test(text)) return '大风'
  if (/大雨/.test(text)) return '大雨'
  if (/中雨/.test(text)) return '中雨'
  if (/冻雨/.test(text)) return '冻雨'
  if (/小雨|阵雨/.test(text)) return '小雨'
  if (/雨夹雪/.test(text)) return '雨雪'
  if (/雪/.test(text)) return '降雪'
  if (/雾/.test(text)) return '大雾'
  return text || '—'
}

// ===== 潮汐 =====
const tideData = computed(() => weatherStore.tide)

const tideTable = computed(() => {
  if (!tideData.value?.tideTable) return []
  return tideData.value.tideTable.map((t: any) => ({ time: t.fxTime.slice(11, 16), height: t.height, type: t.type }))
})

const tideStatus = computed(() => {
  if (!tideData.value?.tideHourly) return { text: '加载中', tagType: 'primary' }
  const hourly = tideData.value.tideHourly
  const now = new Date()
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const current = hourly.find((h: any) => {
    const hMin = parseInt(h.fxTime.slice(11, 13)) * 60 + parseInt(h.fxTime.slice(14, 16))
    return Math.abs(hMin - nowMin) < 30
  })
  if (!current) return { text: '正常', tagType: 'primary' }
  const idx = hourly.indexOf(current)
  if (idx > 0) {
    const curr = Number(current.height)
    const prev = Number(hourly[idx - 1].height)
    if (curr > prev) return { text: '涨潮中', tagType: 'success' }
    if (curr < prev) return { text: '退潮中', tagType: 'warning' }
  }
  return { text: '平潮', tagType: 'primary' }
})

const tidePath = computed(() => {
  if (!tideData.value?.tideHourly) return ''
  const hourly = tideData.value.tideHourly
  const maxH = Math.max(...hourly.map((h: any) => Number(h.height)))
  const minH = Math.min(...hourly.map((h: any) => Number(h.height)))
  const range = maxH - minH || 1
  const points = hourly.map((h: any, i: number) => ({
    x: (i / (hourly.length - 1)) * 340,
    y: 5 + (1 - (Number(h.height) - minH) / range) * 80
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
  if (!tideData.value?.tideTable || !tideData.value?.tideHourly) return []
  const hourly = tideData.value.tideHourly
  const maxH = Math.max(...hourly.map((h: any) => Number(h.height)))
  const minH = Math.min(...hourly.map((h: any) => Number(h.height)))
  const range = maxH - minH || 1
  return tideData.value.tideTable.map((t: any) => {
    const h = parseInt(t.fxTime.slice(11, 13))
    const m = parseInt(t.fxTime.slice(14, 16))
    return {
      x: (Math.min(h + (m > 0 ? 1 : 0), 23) / 23) * 340,
      y: 5 + (1 - (Number(t.height) - minH) / range) * 80,
      height: t.height, type: t.type
    }
  })
})

const tideNowX = computed(() => {
  const now = new Date()
  return (now.getHours() / 23) * 340
})

// ===== 潮汐日历 =====
const tideCalendar = computed(() => weatherStore.tideCalendar)

function padTideTable(table: any[], len: number) {
  const result = [...table]
  while (result.length < len) result.push(null)
  return result.slice(0, len)
}

// ===== 潮汐规律 =====
const tidePattern = computed(() => {
  const calendar = weatherStore.tideCalendar
  if (!calendar || calendar.length < 2) {
    return { cycle: '加载中', cycleDesc: '等待数据', range: '--', rangeDesc: '等待数据', bestWindow: '等待数据', suggestion: '正在分析潮汐规律...' }
  }

  // 计算潮差趋势
  const ranges: number[] = calendar.filter(d => d.data?.tideTable).map(d => {
    const table = d.data.tideTable
    const maxH = Math.max(...table.map((t: any) => Number(t.height)))
    const minH = Math.min(...table.map((t: any) => Number(t.height)))
    return maxH - minH
  })

  const avgRange = ranges.length > 0 ? (ranges.reduce((a, b) => a + b, 0) / ranges.length).toFixed(1) : '--'
  const maxRange = ranges.length > 0 ? Math.max(...ranges).toFixed(1) : '--'
  const minRange = ranges.length > 0 ? Math.min(...ranges).toFixed(1) : '--'

  // 判断大潮/小潮（基于潮差变化）
  const isSpring = ranges.length >= 2 && ranges[ranges.length - 1] > ranges[0]
  const cycle = isSpring ? '大潮期 → 活讯' : '小潮期 → 死讯'
  const cycleDesc = isSpring ? '潮差增大，鱼口活跃' : '潮差减小，鱼口较慢'

  // 最佳窗口
  const bestWindow = isSpring ? '满潮前后1-2小时' : '干潮转涨潮时段'

  // 建议
  const suggestion = isSpring
    ? '大潮期间潮水活跃，鱼类觅食积极。建议在满潮前1小时开始作钓，满潮后1小时内收竿。'
    : '小潮期间潮水变化平缓，鱼类活动减少。建议在干潮转涨潮的转折点作钓，使用活饵增加诱惑力。'

  return { cycle, cycleDesc, range: avgRange, rangeDesc: `潮差 ${minRange}-${maxRange}m`, bestWindow, suggestion }
})

// ===== 台风 =====
const typhoonInfo = computed(() => {
  const track = weatherStore.typhoonTrack
  if (!track?.now) return { name: '', type: '', pressure: '--', windSpeed: '--', moveSpeed: '--' }
  const storm = weatherStore.typhoons[0]
  return {
    name: storm?.name || '未知',
    type: track.now.type || '--',
    pressure: track.now.pressure || '--',
    windSpeed: track.now.windSpeed || '--',
    moveSpeed: track.now.moveSpeed || '--'
  }
})

const typhoonPathPoints = computed(() => {
  const track = weatherStore.typhoonTrack
  if (!track?.track || track.track.length === 0) return ''
  const lats = track.track.map((t: any) => Number(t.lat))
  const lons = track.track.map((t: any) => Number(t.lon))
  const minLat = Math.min(...lats), maxLat = Math.max(...lats)
  const minLon = Math.min(...lons), maxLon = Math.max(...lons)
  const range = Math.max(maxLat - minLat, maxLon - minLon) || 1
  return track.track.map((t: any) => {
    const x = ((Number(t.lon) - minLon) / range) * 300 + 20
    const y = 140 - ((Number(t.lat) - minLat) / range) * 120
    return `${x},${y}`
  }).join(' ')
})

const typhoonPathDots = computed(() => {
  const track = weatherStore.typhoonTrack
  if (!track?.track || track.track.length === 0) return []
  const lats = track.track.map((t: any) => Number(t.lat))
  const lons = track.track.map((t: any) => Number(t.lon))
  const minLat = Math.min(...lats), maxLat = Math.max(...lats)
  const minLon = Math.min(...lons), maxLon = Math.max(...lons)
  const range = Math.max(maxLat - minLat, maxLon - minLon) || 1
  return track.track.map((t: any) => ({
    x: ((Number(t.lon) - minLon) / range) * 300 + 20,
    y: 140 - ((Number(t.lat) - minLat) / range) * 120
  }))
})

// ===== 鱼口预测 =====
const fishingMethods = computed(() => {
  const score = weatherStore.indexResult.score
  const tideNow = tideStatus.value.text
  const isRising = tideNow === '涨潮中'
  const isFalling = tideNow === '退潮中'
  const temp = Number(weatherStore.weatherNow?.temp || 25)
  const pressure = Number(weatherStore.weatherNow?.pressure || 1013)
  const wind = Number(weatherStore.weatherNow?.windScale || 0)
  const hour = new Date().getHours()
  const month = new Date().getMonth() + 1

  // 基础环境分 (0-100)
  const baseScore = score

  // 各鱼种活性计算
  const calc = (base: number, boosts: number[]) => {
    return Math.min(100, Math.max(0, Math.round(base + boosts.reduce((a, b) => a + b, 0))))
  }

  // ===== 台钓目标鱼 =====
  const taiJiyu = calc(baseScore * 0.9, [
    (hour >= 5 && hour <= 9) ? 15 : (hour >= 16 && hour <= 19) ? 10 : 0,
    isRising ? 5 : 0,
    temp < 15 ? 10 : 0,
  ])
  const taiLiyu = calc(baseScore * 0.85, [
    (temp >= 20 && temp <= 28) ? 15 : 0,
    isRising ? 10 : 0,
    (hour >= 16 && hour <= 19) ? 10 : 0,
  ])
  const taiCaoyu = calc(baseScore * 0.7, [
    temp >= 25 ? 20 : 0,
    (month >= 5 && month <= 9) ? 10 : 0,
    (hour >= 12 && hour <= 16) ? 10 : 0,
  ])
  const taiLianyong = calc(baseScore * 0.65, [
    temp >= 28 ? 25 : 0,
    (month >= 6 && month <= 8) ? 15 : 0,
    (hour >= 10 && hour <= 15) ? 10 : 0,
  ])
  const taiAvg = Math.round((taiJiyu + taiLiyu + taiCaoyu + taiLianyong) / 4)

  // ===== 路亚目标鱼 =====
  const luyaLuyu = calc(baseScore * 0.8, [
    (hour >= 5 && hour <= 8) ? 20 : (hour >= 17 && hour <= 20) ? 15 : 0,
    (temp >= 15 && temp <= 28) ? 10 : -5,
    isRising ? 8 : 0,
  ])
  const luyaGuidiao = calc(baseScore * 0.75, [
    (hour >= 5 && hour <= 8) ? 18 : (hour >= 18 && hour <= 21) ? 12 : 0,
    (temp >= 18 && temp <= 26) ? 12 : -3,
    isFalling ? 5 : 0,
  ])
  const luyaQiaozui = calc(baseScore * 0.7, [
    (hour >= 6 && hour <= 9) ? 15 : (hour >= 16 && hour <= 19) ? 12 : 0,
    (temp >= 20 && temp <= 30) ? 10 : -5,
    wind >= 2 ? 5 : 0,
  ])
  const luyaMakou = calc(baseScore * 0.6, [
    (hour >= 5 && hour <= 9) ? 15 : (hour >= 16 && hour <= 18) ? 10 : 0,
    (temp >= 18 && temp <= 28) ? 8 : -3,
  ])
  const luyaAvg = Math.round((luyaLuyu + luyaGuidiao + luyaQiaozui + luyaMakou) / 4)

  // ===== 伐钓目标鱼 =====
  const faLiyu = calc(baseScore * 0.85, [
    isRising ? 12 : 0,
    (temp >= 20 && temp <= 28) ? 12 : 0,
    (hour >= 6 && hour <= 10) ? 8 : (hour >= 16 && hour <= 19) ? 10 : 0,
  ])
  const faCaoyu = calc(baseScore * 0.7, [
    temp >= 25 ? 18 : 0,
    (month >= 5 && month <= 9) ? 10 : 0,
    (hour >= 10 && hour <= 15) ? 8 : 0,
  ])
  const faJiyu = calc(baseScore * 0.8, [
    (hour >= 5 && hour <= 9) ? 12 : (hour >= 16 && hour <= 19) ? 8 : 0,
    isRising ? 5 : 0,
  ])
  const faQingyu = calc(baseScore * 0.6, [
    (temp >= 22 && temp <= 30) ? 15 : 0,
    (month >= 5 && month <= 9) ? 10 : 0,
    pressure >= 1010 ? 5 : 0,
  ])
  const faAvg = Math.round((faLiyu + faCaoyu + faJiyu + faQingyu) / 4)

  // ===== 矶钓目标鱼 =====
  const jiHeidiao = calc(baseScore * 0.75, [
    isRising ? 15 : isFalling ? -5 : 0,
    (temp >= 18 && temp <= 28) ? 10 : -5,
    (hour >= 6 && hour <= 9) ? 8 : (hour >= 16 && hour <= 19) ? 10 : 0,
  ])
  const jiZhendiao = calc(baseScore * 0.7, [
    isRising ? 12 : 0,
    (temp >= 20 && temp <= 27) ? 10 : -3,
    (hour >= 5 && hour <= 8) ? 10 : (hour >= 17 && hour <= 20) ? 8 : 0,
  ])
  const jiLuyu = calc(baseScore * 0.65, [
    (hour >= 5 && hour <= 8) ? 12 : (hour >= 17 && hour <= 20) ? 10 : 0,
    (temp >= 15 && temp <= 28) ? 8 : -3,
  ])
  const jiAvg = Math.round((jiHeidiao + jiZhendiao + jiLuyu) / 3)

  // 评分等级
  const getLevel = (s: number) => {
    if (s >= 70) return { level: 'excellent', levelText: '很适合' }
    if (s >= 50) return { level: 'good', levelText: '适合' }
    if (s >= 30) return { level: 'ok', levelText: '一般' }
    return { level: 'low', levelText: '不太适合' }
  }

  // 钓法提示
  const getTip = (name: string) => {
    if (name === '台钓') return '活饵+细线，守钓为主'
    if (name === '路亚') return '假饵拟态，主动找鱼'
    if (name === '伐钓') return '大水面深水区，守大物'
    if (name === '矶钓') return '礁石钓位，涨潮前到位'
    return ''
  }

  // 生成推荐鱼种文字（取分数最高的2-3种）
  const getTopFish = (fishObj: Record<string, number>) => {
    return Object.entries(fishObj)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => name)
      .join('、')
  }

  const methods = [
    {
      name: '台钓', icon: '🎣', score: taiAvg, ...getLevel(taiAvg),
      topFish: getTopFish({ '鲫鱼': taiJiyu, '鲤鱼': taiLiyu, '草鱼': taiCaoyu, '鲢鳙': taiLianyong }),
    },
    {
      name: '路亚', icon: '🐠', score: luyaAvg, ...getLevel(luyaAvg),
      topFish: getTopFish({ '鲈鱼': luyaLuyu, '鳜鱼': luyaGuidiao, '翘嘴': luyaQiaozui, '马口': luyaMakou }),
    },
    {
      name: '伐钓', icon: '🚣', score: faAvg, ...getLevel(faAvg),
      topFish: getTopFish({ '鲤鱼': faLiyu, '草鱼': faCaoyu, '鲫鱼': faJiyu, '青鱼': faQingyu }),
    },
    {
      name: '矶钓', icon: '🪨', score: jiAvg, ...getLevel(jiAvg),
      topFish: getTopFish({ '黑鲷': jiHeidiao, '真鲷': jiZhendiao, '鲈鱼': jiLuyu }),
    },
  ]

  // 按评分排序，推荐的在前
  return methods.sort((a, b) => b.score - a.score)
})

// ===== 钓法建议 =====
const fishingTips = computed(() => {
  const score = weatherStore.indexResult.score
  const temp = Number(weatherStore.weatherNow?.temp || 25)
  const wind = Number(weatherStore.weatherNow?.windScale || 0)
  const text = weatherStore.weatherNow?.text || ''
  const tideNow = tideStatus.value.text

  let bait = '蚯蚓、红虫等活饵，小钩细线'
  let target = '鲫鱼为主，兼顾鲤鱼'
  let timing = '上午6-9点，下午4-6点'
  let note = '注意防晒，保持安静'

  if (score >= 70) {
    bait = '活饵效果好，商品饵也可'
    target = '鲫鱼开口积极，鲤鱼等口为主'
    timing = isRising.value ? '涨潮期间是黄金时段' : '全天可钓'
    note = '鱼口好时保持节奏，及时补窝'
  } else if (score >= 40) {
    bait = '活饵优先，味型偏腥'
    target = '主攻鲫鱼，放弃鲢鳙'
    timing = '选早晚凉爽时段'
    note = '耐心等口，不要频繁提竿'
  } else {
    bait = '高腥活饵，蚯蚓+红虫组合'
    target = '仅建议钓鲫鱼'
    timing = '建议改日出钓'
    note = '天气不佳，注意安全'
  }

  if (wind >= 5) note = '风力较大，近岸作钓'
  if (text.includes('雨')) timing = '雨后1-2小时鱼口转好'
  if (temp < 10 || temp > 35) note = '温度极端，建议改日'

  return { bait, target, timing, note }
})

const isRising = computed(() => tideStatus.value.text === '涨潮中')



onMounted(() => {
  weatherStore.loadWeather()
  weatherStore.loadTideCalendar()
  weatherStore.loadTyphoons()
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

/* Loading */
.loading-state { display: flex; align-items: center; justify-content: center; height: 300px; }
.loading-text { font-size: 14px; color: $text-muted; }

/* Hero Card (Redesigned) */
.hero { background: linear-gradient(135deg, #5865F2, #7B68EE); border-radius: 16px; padding: 20px; margin-bottom: 12px; color: #fff; }

.hero-top-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0; }
.hero-left { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
.hero-date { font-size: 12px; opacity: 0.7; display: block; margin-bottom: 4px; }
.hero-temp-row { display: flex; align-items: baseline; gap: 6px; }
.hero-temp-big { font-size: 44px; font-weight: 700; line-height: 1; }
.hero-icon { font-size: 32px; }
.hero-weather-desc { font-size: 13px; opacity: 0.75; display: block; margin-top: 2px; }

.hero-score-ring { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.score-ring-outer {
  width: 72px; height: 72px; border-radius: 50%;
  background: conic-gradient(#fff 0%, #fff calc(var(--score-pct, 80) * 1%), rgba(255,255,255,0.2) calc(var(--score-pct, 80) * 1%));
  display: flex; align-items: center; justify-content: center;
}
.score-ring-inner {
  width: 60px; height: 60px; border-radius: 50%;
  background: rgba(88,101,242,0.85);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  backdrop-filter: blur(4px);
}
.hero-score { font-size: 26px; font-weight: 700; line-height: 1; }
.hero-score-unit { font-size: 10px; opacity: 0.7; }
.hero-score-label { font-size: 10px; opacity: 0.6; }
.hero-score-level { font-size: 12px; font-weight: 600; opacity: 0.9; }



.hero-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 14px; }
.hero-detail-item { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.12); border-radius: 10px; padding: 10px 10px; }
.hero-detail-icon { width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; }
.hero-detail-icon--purple { background: rgba(255,255,255,0.3); }
.hero-detail-icon--cyan { background: rgba(86,204,222,0.4); }
.hero-detail-icon--green { background: rgba(35,165,89,0.4); }
.hero-detail-icon--blue { background: rgba(88,101,242,0.4); }
.hero-detail-icon--orange { background: rgba(240,178,50,0.4); }
.hero-detail-info { flex: 1; min-width: 0; }
.hero-detail-label { font-size: 10px; opacity: 0.6; display: block; }
.hero-detail-value { font-size: 14px; font-weight: 600; display: block; line-height: 1.2; }
.hero-detail-unit { font-size: 10px; opacity: 0.6; font-weight: 400; }
.hero-detail-tag { font-size: 10px; font-weight: 500; padding: 2px 6px; border-radius: 4px; flex-shrink: 0; white-space: nowrap; }
.hero-detail-tag--good { background: rgba(76,175,80,0.25); color: #fff; }
.hero-detail-tag--warn { background: rgba(255,193,7,0.3); color: #fff; }
.hero-detail-tag--bad { background: rgba(244,67,54,0.25); color: #fff; }
.hero-detail-tag--muted { background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.5); }
.hero-trend-tag { flex-shrink: 0; }

/* Card */
.card { background: $bg-card; border-radius: 12px; padding: 16px; margin-bottom: 12px; border: 1px solid $divider; }
.card--half { flex: 1; min-width: 0; }
.card-row { display: flex; gap: 12px; margin-bottom: 12px; }
.card-row .card { margin-bottom: 0; }
.card-title-row { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.card-title { font-size: 14px; font-weight: 600; color: $text-primary; }
.card-title--sm { font-size: 13px; }
.card-subtitle { font-size: 11px; color: $text-muted; margin-left: auto; }
.card-title-right { display: flex; gap: 10px; margin-left: auto; }
.card-title-sun { display: flex; align-items: center; gap: 3px; font-size: 11px; color: $text-secondary; }
.badge { padding: 2px 8px; border-radius: 100px; }
.badge--ok { background: rgba($success, 0.1); }
.badge--mid { background: rgba($brand, 0.1); }
.badge--low { background: rgba($text-muted, 0.1); }
.badge--info { background: rgba($brand, 0.06); }
.badge--danger { background: rgba($danger, 0.1); }
.badge-text { font-size: 11px; font-weight: 500; color: $success; }
.badge-text--info { color: $text-muted; }
.badge-text--mid { color: $brand; }
.badge--super { background: rgba($danger, 0.1); }
.badge-text--super { color: $danger; }
.badge--strong { background: rgba($warning, 0.1); }
.badge-text--strong { color: $warning; }
.badge--medium { background: rgba($brand, 0.1); }
.badge-text--medium { color: $brand; }
.badge-text--danger { color: $danger; }

/* 竖状垂钓指数柱状图 */
.vbar-scroll { width: 100%; white-space: nowrap; }
.vbar-chart { display: inline-flex; align-items: flex-end; gap: 9rpx; height: 200rpx; padding-top: 16rpx; position: relative; min-width: 100%; }
.vbar-col { flex: 0 0 28rpx; display: flex; flex-direction: column; align-items: center; gap: 2rpx; }
.vbar-bar { width: 100%; border-radius: 3rpx 3rpx 0 0; min-height: 4rpx; }
.vbar-bar--excellent { background: linear-gradient(180deg, #66BB6A, #4CAF50); }
.vbar-bar--good { background: linear-gradient(180deg, #9CCC65, #8BC34A); }
.vbar-bar--ok { background: linear-gradient(180deg, #FFD54F, #FFC107); }
.vbar-bar--bad { background: linear-gradient(180deg, #FFB74D, #FF9800); }
.vbar-bar--poor { background: linear-gradient(180deg, #EF5350, #F44336); }
.vbar-score { font-size: 14rpx; color: $header-primary; font-weight: 600; }
.vbar-time { font-size: 16rpx; color: $text-muted; margin-top: 4rpx; }
.vbar-highlight { background: rgba($blurple, 0.06); border-radius: 12rpx; padding: 6rpx 4rpx; margin: 0 -4rpx; }
.vbar-legend { display: flex; gap: 16rpx; margin-top: 12rpx; justify-content: center; }
.vbar-legend-item { display: flex; align-items: center; gap: 6rpx; font-size: 20rpx; color: $text-muted; }
.vbar-legend-dot { width: 16rpx; height: 16rpx; border-radius: 4rpx; }
.vbar-legend-dot--excellent { background: #4CAF50; }
.vbar-legend-dot--good { background: #8BC34A; }
.vbar-legend-dot--ok { background: #FFC107; }
.vbar-legend-dot--bad { background: #FF9800; }
.vbar-legend-dot--poor { background: #F44336; }

/* 按钓法推荐 */
.fish-section-title { font-size: 24rpx; font-weight: 600; color: $header-primary; margin-bottom: 12rpx; display: block; }
.method-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12rpx; }
.method-card-mini {
  background: $bg-page; border-radius: 12rpx; padding: 16rpx;
  display: flex; flex-direction: column; gap: 6rpx;
}
.method-mini-name { font-size: 24rpx; font-weight: 600; color: $header-primary; }
.method-mini-score-row { display: flex; align-items: center; gap: 8rpx; }
.method-mini-score { font-size: 22rpx; font-weight: 700; }
.method-mini-score--excellent { color: $status-green; }
.method-mini-score--good { color: $blurple; }
.method-mini-score--ok { color: $status-yellow; }
.method-mini-score--low { color: $text-muted; }
.method-mini-level { font-size: 18rpx; color: $text-muted; }
.method-mini-fish { font-size: 20rpx; color: $text-muted; margin-top: 2rpx; }

/* 条件标签 */
.divider-simple { height: 1rpx; background: $divider; margin: 16rpx 0; }
.tip-bar { display: flex; gap: 12rpx; flex-wrap: wrap; }
.tip-tag { font-size: 20rpx; padding: 8rpx 16rpx; border-radius: 20rpx; background: $bg-page; color: $text-muted; }
.tip-tag--green { background: rgba($status-green, 0.1); color: $status-green; }
.tip-tag--yellow { background: rgba($status-yellow, 0.1); color: $status-yellow; }
.tip-tag--blue { background: rgba($blurple, 0.1); color: $blurple; }

/* Hourly Scroll Cards */
.hourly-scroll { white-space: nowrap; }
.hourly-row { display: inline-flex; gap: 0; }
.hourly-card {
  width: 107rpx; min-width: 107rpx; display: flex; flex-direction: column;
  align-items: center; padding: 12rpx 6rpx 16rpx; gap: 6rpx;
}
.hourly-card--now { background: rgba($blurple, 0.06); border-radius: 16rpx; }
.hourly-time { font-size: 22rpx; color: $text-muted; font-weight: 500; }
.hourly-card--now .hourly-time { color: $blurple; font-weight: 700; }
.hourly-icon { font-size: 36rpx; }
.hourly-temp { font-size: 32rpx; font-weight: 700; color: $header-primary; }
.hourly-card--now .hourly-temp { font-size: 36rpx; }
.hourly-line-area { width: 107rpx; height: 53px; display: flex; align-items: flex-end; justify-content: center; }
.hourly-temp-bar { width: 10rpx; border-radius: 5rpx; background: $blurple; }
.hourly-wind { font-size: 18rpx; color: $text-muted; text-align: center; }


.hourly-empty { padding: 30rpx 0; text-align: center; }
.hourly-empty-text { font-size: 26rpx; color: $text-muted; }

/* 7-day comfort tag */
.day-comfort { margin-left: auto; flex-shrink: 0; }

/* 图例 */
.chart-legend {
  display: flex;
  gap: 16px;
  margin-bottom: 4px;
}
.chart-legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}
.chart-legend-dot {
  width: 10px;
  height: 3px;
  border-radius: 2px;
}
.chart-legend-text {
  font-size: 11px;
  color: #80848E;
}

/* Sun Arc */
.sun-arc { height: 60px; position: relative; margin: 8px 0; display: flex; align-items: flex-end; }
.sun-arc-bg { position: absolute; bottom: 0; left: 0; right: 0; height: 50px; border-top: 2px dashed rgba($brand, 0.15); border-radius: 50% 50% 0 0; }
.sun-arc-fill { position: absolute; bottom: 0; left: 0; right: 0; height: 50px; border-top: 2px solid $warning; border-radius: 50% 50% 0 0; }
.sun-dot { position: absolute; }
.sun-dot-icon { font-size: 16px; }
.sun-times { display: flex; gap: 8px; }
.sun-time-item { flex: 1; text-align: center; }
.sun-time-label { font-size: 10px; color: $text-muted; display: block; }
.sun-time-val { font-size: 13px; font-weight: 600; color: $text-primary; display: block; margin-top: 2px; }
.moon-display { text-align: center; padding: 8px 0; }
.moon-icon { font-size: 36px; }
.moon-phase-text { font-size: 12px; color: $text-muted; display: block; margin-top: 4px; }

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
.day-temp-track { flex: 1; height: 10px; background: #E8EAED; border-radius: 5px; position: relative; overflow: hidden; }
.day-temp-fill { position: absolute; top: 0; height: 100%; background: linear-gradient(90deg, #5865F2, #9B8AFB, #F0B232); border-radius: 5px; }
.day-comfort { flex-shrink: 0; }
