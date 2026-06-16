<template>
  <view class="page-weather">
    <!-- Header -->
    <view class="header">
      <view class="header-top">
        <view class="header-logo">
          <view class="logo-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg></view>
          <view>
            <text class="header-title">天时</text>
            <text class="header-subtitle">天气 · 潮汐 · 钓鱼 · 2026-06-16 23:11</text>
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
        <!-- ===== Hero Card (Redesigned) ===== -->
        <view class="hero">
          <!-- Top Row: Date + Score Ring -->
          <view class="hero-top-row">
            <view class="hero-date-col">
              <text class="hero-date">📍 广州</text>
              <text class="hero-date-full">6月16日 周二</text>
            </view>
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

          <!-- Middle: Temp + Weather -->
          <view class="hero-mid-row">
            <text class="hero-icon">{{ getWeatherIcon(weatherStore.weatherNow?.icon || '100') }}</text>
            <view class="hero-temp-info">
              <text class="hero-temp-big">{{ weatherStore.weatherNow?.temp || '--' }}°</text>
              <text class="hero-weather-text">{{ weatherStore.weatherNow?.text || '' }}</text>
              <text class="hero-feels-like">体感 {{ weatherStore.weatherNow?.feelsLike || '--' }}°</text>
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
              <wd-tag type="primary" size="small" round custom-class="hero-trend-tag">平稳</wd-tag>
            </view>
            <view class="hero-detail-item">
              <view class="hero-detail-icon hero-detail-icon--cyan"></view>
              <view class="hero-detail-info">
                <text class="hero-detail-label">风力</text>
                <text class="hero-detail-value">{{ weatherStore.weatherNow?.windScale || '--' }} <text class="hero-detail-unit">{{ weatherStore.weatherNow?.windDir || '' }}</text></text>
              </view>
              <wd-tag type="success" size="small" round custom-class="hero-trend-tag">适宜</wd-tag>
            </view>
            <view class="hero-detail-item">
              <view class="hero-detail-icon hero-detail-icon--green"></view>
              <view class="hero-detail-info">
                <text class="hero-detail-label">湿度</text>
                <text class="hero-detail-value">{{ weatherStore.weatherNow?.humidity || '--' }}<text class="hero-detail-unit">%</text></text>
              </view>
              <wd-tag type="default" size="small" round custom-class="hero-trend-tag"></wd-tag>
            </view>
            <view class="hero-detail-item">
              <view class="hero-detail-icon hero-detail-icon--orange"></view>
              <view class="hero-detail-info">
                <text class="hero-detail-label">能见度</text>
                <text class="hero-detail-value">{{ weatherStore.weatherNow?.vis || '--' }} <text class="hero-detail-unit">km</text></text>
              </view>
              <wd-tag type="default" size="small" round custom-class="hero-trend-tag"></wd-tag>
            </view>
          </view>
        </view>

        <!-- ===== 今日垂钓建议（Redesigned） ===== -->
        <view class="card">
          <view class="card-title-row">
            <text class="card-title">🎯 今日垂钓建议</text>
            <text class="card-subtitle">基于天气 + 潮汐</text>
          </view>

          <!-- Time Window Blocks -->
          <view class="fishing-windows">
            <view class="fishing-window fishing-window--best">
              <text class="fishing-window-dot">🟢</text>
              <view class="fishing-window-info">
                <text class="fishing-window-label">最佳窗口</text>
                <text class="fishing-window-time">{{ fishingTips.timing }}</text>
              </view>
            </view>
            <view class="fishing-window fishing-window--secondary">
              <text class="fishing-window-dot">🟠</text>
              <view class="fishing-window-info">
                <text class="fishing-window-label">傍晚次佳</text>
                <text class="fishing-window-time">16:00-17:30</text>
              </view>
            </view>
          </view>

          <!-- Condition Tags -->
          <view class="fishing-tags">
            <wd-tag type="success" size="small" round custom-style="margin-right: 6px; margin-bottom: 6px;">溶氧充足</wd-tag>
            <wd-tag v-if="weatherStore.weatherNow?.text?.includes('雨')" type="danger" size="small" round custom-style="margin-right: 6px; margin-bottom: 6px;">雷暴风险</wd-tag>
            <wd-tag type="primary" size="small" round custom-style="margin-right: 6px; margin-bottom: 6px;">晨口窗口</wd-tag>
            <wd-tag type="warning" size="small" round custom-style="margin-right: 6px; margin-bottom: 6px;">{{ tideStatus.text === '涨潮中' ? '涨潮助力' : tideStatus.text === '退潮中' ? '退潮待机' : '平潮观望' }}</wd-tag>
            <wd-tag type="default" size="small" round custom-style="margin-right: 6px; margin-bottom: 6px;">{{ fishPredictions[0]?.variant === 'open' ? '鱼口活跃' : fishPredictions[0]?.variant === 'slow' ? '鱼口较慢' : '一般' }}</wd-tag>
          </view>

          <!-- Advice Paragraph -->
          <view class="fishing-advice">
            <text class="fishing-advice-text">饵料：{{ fishingTips.bait }}。目标鱼种：{{ fishingTips.target }}。{{ fishingTips.note }}。建议选早晚凉爽时段作钓，使用活饵优先，味型偏腥，耐心等口不要频繁提竿。</text>
          </view>

          <!-- Fish Predictions (compact) -->
          <view class="fish-compact-list">
            <template v-for="(fish, index) in fishPredictions" :key="fish.name">
              <view class="fish-compact-row">
                <text class="fish-compact-emoji">{{ fish.emoji }}</text>
                <view class="fish-compact-info">
                  <text class="fish-compact-name">{{ fish.name }}</text>
                  <text class="fish-compact-desc">{{ fish.desc }}</text>
                </view>
                <view class="fish-badge" :class="'fish-badge--' + fish.variant">
                  <text class="fish-badge-text">{{ fish.status }}</text>
                </view>
                <text class="fish-trend">{{ fish.trend }}</text>
              </view>
              <wd-divider v-if="index < fishPredictions.length - 1" hairline custom-style="margin: 0; padding: 0;" />
            </template>
          </view>
        </view>

        <!-- ===== 逐小时预报（双折线图） ===== -->
        <view class="card">
          <view class="card-title-row">
            <text class="card-title">逐小时预报</text>
            <view class="card-title-right" v-if="today">
              <text class="card-title-sun">🌅 {{ today.sunrise || '--:--' }}</text>
              <text class="card-title-sun">🌇 {{ today.sunset || '--:--' }}</text>
            </view>
            <wd-tag :type="weatherStore.indexResult.score >= 70 ? 'success' : weatherStore.indexResult.score >= 40 ? 'primary' : 'default'" size="small" round custom-style="margin-left: 8px">
              {{ weatherStore.indexResult.score >= 70 ? '鱼口活跃' : weatherStore.indexResult.score >= 40 ? '一般' : '鱼口较慢' }}
            </wd-tag>
          </view>
          <!-- Day Selector Tabs -->
          <view class="hourly-day-tabs">
            <view class="hourly-day-tab">
              <text class="hourly-day-tab-name">昨天</text>
              <text class="hourly-day-tab-date">6/15</text>
            </view>
            <view class="hourly-day-tab hourly-day-tab--active">
              <text class="hourly-day-tab-name">今天</text>
              <text class="hourly-day-tab-date">6/16</text>
            </view>
            <view class="hourly-day-tab">
              <text class="hourly-day-tab-name">明天</text>
              <text class="hourly-day-tab-date">6/17</text>
            </view>
            <view class="hourly-day-tab">
              <text class="hourly-day-tab-name">周四</text>
              <text class="hourly-day-tab-date">6/18</text>
            </view>
            <view class="hourly-day-tab">
              <text class="hourly-day-tab-name">周五</text>
              <text class="hourly-day-tab-date">6/19</text>
            </view>
          </view>
          <view class="hourly-chart-wrap" v-if="weatherStore.hourly.length > 0">
            <uni-echarts custom-style="width:100%;height:240px" :option="hourlyChartOption" />
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
              <view class="day-temp-bar">
                <text class="day-temp-lo">{{ day.tempNight }}°</text>
                <view class="day-temp-track">
                  <view class="day-temp-fill" :style="getTempBarStyle(day.tempNight, day.tempDay)" />
                </view>
                <text class="day-temp-hi">{{ day.tempDay }}°</text>
              </view>
              <view class="day-comfort">
                <wd-tag
                  :type="Number(day.tempDay) >= 35 ? 'danger' : Number(day.tempDay) >= 30 ? 'warning' : Number(day.tempDay) >= 20 ? 'success' : 'primary'"
                  size="small"
                  round
                >
                  {{ Number(day.tempDay) >= 35 ? '闷热' : Number(day.tempDay) >= 30 ? '热' : Number(day.tempDay) >= 20 ? '温暖' : '凉爽' }}
                </wd-tag>
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

// ===== ECharts 逐小时双折线图 =====
const hourlyChartOption = computed(() => {
  const hourly = weatherStore.hourly.slice(0, 24)
  if (hourly.length === 0) return {}

  const times = hourly.map((h, i) => i === 0 ? '现在' : h.time.slice(-5))
  const highTemps = hourly.map(h => Number(h.temp))
  const lowTemps = hourly.map(h => {
    const temp = Number(h.temp)
    const hum = Number(h.humidity || 80)
    const wind = Number(h.windScale || 1)
    const feelsOffset = (hum > 80 ? -1 : 0) + (wind >= 4 ? -2 : wind >= 3 ? -1 : 0)
    return temp + feelsOffset
  })

  const allTemps = [...highTemps, ...lowTemps]
  const minT = Math.floor(Math.min(...allTemps) - 2)
  const maxT = Math.ceil(Math.max(...allTemps) + 2)

  // 虚线分隔：在每两个点中间画竖线
  const separatorLines = []
  for (let i = 0; i < hourly.length - 1; i++) {
    separatorLines.push({
      xAxis: i + 0.5,
      lineStyle: { color: '#ECEEF1', type: [4, 4], width: 1 },
      label: { show: false },
    })
  }

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
    grid: { left: 8, right: 8, top: 45, bottom: 60 },
    legend: {
      show: true,
      top: 0,
      right: 0,
      itemWidth: 12,
      itemHeight: 3,
      textStyle: { color: '#80848E', fontSize: 10 },
      data: ['高温', '低温'],
    },
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
    series: [
      {
        name: '高温',
        type: 'line',
        data: highTemps,
        smooth: 0.3,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: '#FF8C42', width: 2 },
        itemStyle: { color: '#FF8C42', borderColor: '#fff', borderWidth: 1.5 },
        label: {
          show: true,
          position: 'top',
          color: '#1E2028',
          fontSize: 11,
          fontWeight: 600,
          formatter: '{c}°',
        },
        markLine: {
          silent: true,
          symbol: 'none',
          data: [
            // 当前时间标记（第一列高亮）
            {
              xAxis: 0,
              lineStyle: { color: '#5865F2', type: 'solid', width: 2 },
              label: { show: false },
            },
            ...separatorLines,
          ],
        },
      },
      {
        name: '低温',
        type: 'line',
        data: lowTemps,
        smooth: 0.3,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: '#5865F2', width: 2 },
        itemStyle: { color: '#5865F2', borderColor: '#fff', borderWidth: 1.5 },
        label: {
          show: true,
          position: 'bottom',
          color: '#80848E',
          fontSize: 10,
          formatter: '{c}°',
        },
      },
    ],
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
const fishPredictions = computed(() => {
  const score = weatherStore.indexResult.score
  const tideNow = tideStatus.value.text
  const isRising = tideNow === '涨潮中'
  const isFalling = tideNow === '退潮中'

  // 潮汐加成
  let tideBonus = 0
  if (isRising) tideBonus = 10
  else if (isFalling) tideBonus = -5

  const total = Math.min(100, score + tideBonus)

  if (total >= 70) {
    return [
      { name: '鲫鱼', desc: isRising ? '涨潮觅食积极' : '底层活跃', status: '开口积极', variant: 'open', trend: '↑', emoji: '🐟' },
      { name: '鲤鱼', desc: '觅食频繁', status: '正常', variant: 'normal', trend: '→', emoji: '🐠' },
      { name: '草鱼', desc: '中上层活动', status: '正常', variant: 'normal', trend: '→', emoji: '🐡' },
      { name: '鲢鳙', desc: '滤食活跃', status: '开口积极', variant: 'open', trend: '↑', emoji: '🎣' },
    ]
  } else if (total >= 40) {
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

.hero-top-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
.hero-date-col { display: flex; flex-direction: column; gap: 4px; }
.hero-date { font-size: 14px; font-weight: 600; opacity: 0.9; display: block; }
.hero-date-full { font-size: 12px; opacity: 0.6; display: block; }

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

.hero-mid-row { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.15); }
.hero-icon { font-size: 48px; }
.hero-temp-info { display: flex; flex-direction: column; gap: 2px; }
.hero-temp-big { font-size: 40px; font-weight: 700; line-height: 1; }
.hero-weather-text { font-size: 14px; opacity: 0.85; }
.hero-feels-like { font-size: 12px; opacity: 0.6; }

.hero-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.hero-detail-item { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.12); border-radius: 10px; padding: 10px 10px; }
.hero-detail-icon { width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; }
.hero-detail-icon--purple { background: rgba(255,255,255,0.3); }
.hero-detail-icon--cyan { background: rgba(86,204,222,0.4); }
.hero-detail-icon--green { background: rgba(35,165,89,0.4); }
.hero-detail-icon--orange { background: rgba(240,178,50,0.4); }
.hero-detail-info { flex: 1; min-width: 0; }
.hero-detail-label { font-size: 10px; opacity: 0.6; display: block; }
.hero-detail-value { font-size: 14px; font-weight: 600; display: block; line-height: 1.2; }
.hero-detail-unit { font-size: 10px; opacity: 0.6; font-weight: 400; }
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
.card-title-sun { font-size: 11px; color: $text-secondary; }
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

/* Hourly Chart */
.hourly-chart-wrap { margin-top: 8px; }
.hourly-chart-inner { min-height: 200px; }
.hourly-svg { display: block; }

/* Hourly Day Tabs */
.hourly-day-tabs { display: flex; gap: 0; margin-bottom: 12px; background: $tag-bg; border-radius: 10px; padding: 3px; }
.hourly-day-tab { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 6px 4px; border-radius: 8px; cursor: pointer; }
.hourly-day-tab--active { background: $bg-card; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
.hourly-day-tab-name { font-size: 12px; font-weight: 500; color: $text-primary; }
.hourly-day-tab--active .hourly-day-tab-name { color: $brand; font-weight: 700; }
.hourly-day-tab-date { font-size: 10px; color: $text-muted; margin-top: 2px; }
.hourly-day-tab--active .hourly-day-tab-date { color: $brand; opacity: 0.7; }

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

/* Tide Compact Badges (Redesigned) */
.tide-info-compact { display: flex; flex-wrap: wrap; gap: 6px; }
.tide-badge { display: flex; align-items: center; gap: 6px; border-radius: 8px; padding: 6px 10px; flex: 1; min-width: 120px; }
.tide-badge--high { background: rgba($warning, 0.08); }
.tide-badge--low { background: rgba($brand, 0.08); }
.tide-badge-icon { font-size: 16px; }
.tide-badge-info { flex: 1; }
.tide-badge-label { font-size: 10px; color: $text-muted; display: block; }
.tide-badge-time { font-size: 13px; font-weight: 600; color: $text-primary; display: block; }
.tide-badge-val { font-size: 12px; font-weight: 600; }
.tide-badge--high .tide-badge-val { color: $warning; }
.tide-badge--low .tide-badge-val { color: $brand; }

/* Tide Calendar */
.tide-cal-header { display: flex; padding: 6px 0; border-bottom: 1px solid $divider; }
.tide-cal-row { display: flex; padding: 8px 0; border-bottom: 1px solid rgba($divider, 0.5); &:last-child { border-bottom: none; } }
.tide-cal-row--alt { background: rgba($bg-page, 0.5); margin: 0 -8px; padding: 8px; border-radius: 6px; }
.tide-cal-row--today { background: rgba($brand, 0.04); margin: 0 -8px; padding: 8px; border-radius: 6px; }
.tide-cal-col { text-align: center; }
.tide-cal-col--day { width: 48px; flex-shrink: 0; }
.tide-cal-col--hl { flex: 1; }
.tide-cal-date { font-size: 12px; font-weight: 500; color: $text-primary; display: block; }
.tide-cal-time { font-size: 11px; color: $text-secondary; display: block; }
.tide-cal-h { font-size: 11px; font-weight: 600; display: block; }
.tide-cal-h--hi { color: $warning; }
.tide-cal-h--lo { color: $brand; }
.tide-cal-empty { font-size: 12px; color: $text-muted; text-align: center; width: 100%; display: block; }

/* Tide Pattern */
.tide-pattern { display: flex; flex-direction: column; gap: 10px; margin-bottom: 12px; }
.tide-pattern-item { display: flex; align-items: center; gap: 10px; }
.tide-pattern-icon { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.tide-pattern-icon--spring { background: rgba($brand, 0.1); }
.tide-pattern-icon--diff { background: rgba($warning, 0.1); }
.tide-pattern-icon--best { background: rgba($success, 0.1); }
.tide-pattern-name { font-size: 13px; font-weight: 600; color: $text-primary; display: block; }
.tide-pattern-desc { font-size: 11px; color: $text-muted; display: block; }
.tide-tip { background: rgba($brand, 0.04); border-radius: 8px; padding: 10px; }
.tide-tip-text { font-size: 12px; color: $text-secondary; line-height: 1.5; }

/* Typhoon */
.typhoon-map { margin-bottom: 12px; }
.typhoon-svg { display: block; border-radius: 8px; overflow: hidden; }
.typhoon-info { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 12px; }
.typhoon-info-item { background: $tag-bg; border-radius: 8px; padding: 8px; text-align: center; }
.typhoon-info-label { font-size: 10px; color: $text-muted; display: block; }
.typhoon-info-val { font-size: 13px; font-weight: 600; color: $text-primary; display: block; margin-top: 2px; }
.typhoon-empty { text-align: center; padding: 20px 0; }
.typhoon-empty-icon { font-size: 24px; display: block; }
.typhoon-empty-text { font-size: 13px; color: $text-muted; display: block; margin-top: 6px; }
.typhoon-tip { background: rgba($danger, 0.05); border-radius: 8px; padding: 10px; }

/* Fish */
.fish-list { display: flex; flex-direction: column; }
.fish-row { display: flex !important; align-items: center; justify-content: space-between; padding: 10px 0 !important; background: transparent !important; }
.fish-row :deep(.wd-cell__wrapper) { padding: 0 !important; }
.fish-row :deep(.wd-cell__left) { gap: 10px; }
.fish-left { display: flex; align-items: center; gap: 10px; }
.fish-emoji { font-size: 24px; }
.fish-name { font-size: 14px; font-weight: 600; color: $text-primary; display: block; }
.fish-desc { font-size: 11px; color: $text-muted; display: block; }
.fish-right { display: flex; align-items: center; gap: 8px; }
.fish-badge { padding: 3px 10px; border-radius: 100px; &--open { background: rgba($success, 0.1); } &--normal { background: rgba($brand, 0.1); } &--slow { background: rgba(128, 132, 142, 0.1); } }
.fish-badge-text { font-size: 12px; font-weight: 500; color: $success; .fish-badge--normal & { color: $brand; } .fish-badge--slow & { color: $text-muted; } }
.fish-trend { font-size: 16px; color: $text-muted; width: 20px; text-align: center; }

/* Fishing Windows (Redesigned) */
.fishing-windows { display: flex; gap: 8px; margin-bottom: 12px; }
.fishing-window { flex: 1; border-radius: 10px; padding: 12px; display: flex; align-items: center; gap: 8px; }
.fishing-window--best { background: rgba($success, 0.08); border: 1px solid rgba($success, 0.2); }
.fishing-window--secondary { background: rgba($warning, 0.08); border: 1px solid rgba($warning, 0.2); }
.fishing-window-dot { font-size: 12px; }
.fishing-window-info { flex: 1; }
.fishing-window-label { font-size: 11px; font-weight: 500; color: $text-secondary; display: block; }
.fishing-window-time { font-size: 15px; font-weight: 700; color: $text-primary; display: block; margin-top: 2px; }

/* Fishing Tags */
.fishing-tags { display: flex; flex-wrap: wrap; margin-bottom: 10px; }

/* Fishing Advice Paragraph */
.fishing-advice { background: rgba($brand, 0.03); border-radius: 8px; padding: 10px; margin-bottom: 12px; }
.fishing-advice-text { font-size: 12px; color: $text-secondary; line-height: 1.6; }

/* Fish Compact List (Redesigned) */
.fish-compact-list { display: flex; flex-direction: column; }
.fish-compact-row { display: flex; align-items: center; padding: 8px 0; gap: 10px; }
.fish-compact-emoji { font-size: 20px; flex-shrink: 0; }
.fish-compact-info { flex: 1; min-width: 0; }
.fish-compact-name { font-size: 13px; font-weight: 600; color: $text-primary; display: block; }
.fish-compact-desc { font-size: 11px; color: $text-muted; display: block; }

/* Tips */
.tips { display: flex; flex-direction: column; }
.tip { display: flex !important; align-items: flex-start; gap: 10px; padding: 10px 0 !important; background: transparent !important; }
.tip :deep(.wd-cell__wrapper) { padding: 0 !important; }
.tip :deep(.wd-cell__left) { gap: 10px; }
.tip-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
.tip-icon--b { background: rgba($brand, 0.1); }
.tip-icon--g { background: rgba($success, 0.1); }
.tip-icon--o { background: rgba($warning, 0.1); }
.tip-icon--p { background: rgba($danger, 0.08); }
.tip-content { flex: 1; }
.tip-title { font-size: 13px; font-weight: 600; color: $text-primary; display: block; margin-bottom: 2px; }
.tip-text { font-size: 12px; color: $text-secondary; line-height: 1.5; }

/* Typhoon Card */
.typhoon-card {}

.typhoon-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.typhoon-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.typhoon-level-badge {
  padding: 2px 8px;
  border-radius: 3px;
}

.typhoon-level--super { background: rgba($danger, 0.12); }
.typhoon-level--strong { background: rgba($warning, 0.12); }
.typhoon-level--medium { background: rgba($brand, 0.12); }
.typhoon-level--weak { background: rgba($text-muted, 0.12); }

.typhoon-level-text {
  font-size: 11px;
  font-weight: 600;
  color: $danger;
  .typhoon-level--strong & { color: $warning; }
  .typhoon-level--medium & { color: $brand; }
  .typhoon-level--weak & { color: $text-muted; }
}

.typhoon-link {
  font-size: 12px;
  color: $brand;
  font-weight: 500;
}

.typhoon-mini-map {
  margin-bottom: 12px;
  border-radius: 8px;
  overflow: hidden;
}

.typhoon-info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.typhoon-info-item {
  text-align: center;
}

.typhoon-info-label {
  font-size: 10px;
  color: $text-muted;
  display: block;
}

.typhoon-info-value {
  font-size: 13px;
  font-weight: 600;
  color: $text-primary;
  display: block;
  margin-top: 2px;
}

.typhoon-impact {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px;
  background: rgba($danger, 0.04);
  border-radius: 8px;
}

.typhoon-impact-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.typhoon-impact-text {
  font-size: 12px;
  color: $text-secondary;
  line-height: 1.5;
  flex: 1;
}
</style>
