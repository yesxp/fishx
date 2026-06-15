<template>
  <view class="page-weather">
    <!-- Header -->
    <view class="header">
      <view class="header-top">
        <view class="header-logo">
          <view class="logo-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg></view>
          <view>
            <text class="header-title">天时</text>
            <text class="header-subtitle">天气·潮汐</text>
          </view>
        </view>
        <view class="header-actions">
          <view class="header-btn">
            <text class="icon-text">🔍</text>
          </view>
          <view class="header-btn">
            <text class="icon-text">🔔</text>
          </view>
        </view>
      </view>
    </view>

    <!-- Content -->
    <scroll-view scroll-y class="content" :enhanced="true" :show-scrollbar="false" :style="{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }">
      <!-- Hero -->
      <view class="hero">
        <view class="hero-top">
          <view>
            <text class="hero-city">杭州</text>
            <view class="hero-score-row">
              <text class="hero-score">{{ weatherStore.indexResult.score }}</text>
              <text class="hero-score-unit">分</text>
            </view>
            <text class="hero-label">{{ weatherStore.indexResult.level }}</text>
          </view>
          <text class="hero-icon">{{ getWeatherIcon(weatherStore.weatherNow?.icon || '100') }}</text>
        </view>
        <view class="hero-grid">
          <view class="hero-item">
            <text class="hero-item-label">温度</text>
            <text class="hero-item-value">{{ weatherStore.weatherNow?.temp || '--' }}°</text>
          </view>
          <view class="hero-item">
            <text class="hero-item-label">体感</text>
            <text class="hero-item-value">{{ weatherStore.weatherNow?.feelsLike || '--' }}°</text>
          </view>
          <view class="hero-item">
            <text class="hero-item-label">气压</text>
            <text class="hero-item-value">{{ weatherStore.weatherNow?.pressure || '--' }}</text>
          </view>
          <view class="hero-item">
            <text class="hero-item-label">风力</text>
            <text class="hero-item-value">{{ weatherStore.weatherNow?.windDir || '' }}{{ weatherStore.weatherNow?.windScale || '' }}</text>
          </view>
        </view>
      </view>

      <!-- 24h Hourly Forecast -->
      <view class="card">
        <view class="card-title-row">
          <text class="card-title">逐小时预报</text>
          <view class="badge badge--ok" v-if="weatherStore.indexResult.score >= 70"><text class="badge-text">鱼口活跃</text></view>
          <view class="badge badge--mid" v-else-if="weatherStore.indexResult.score >= 40"><text class="badge-text">一般</text></view>
          <view class="badge badge--low" v-else><text class="badge-text">鱼口较慢</text></view>
        </view>
        <view class="hourly-header">
          <text class="hourly-sub">温度变化</text>
          <text class="hourly-sub">{{ weatherStore.weatherNow?.text || '加载中...' }}</text>
        </view>
        <!-- Chart Placeholder (SVG) -->
        <view class="hourly-chart">
          <scroll-view scroll-x class="hourly-scroll" :show-scrollbar="false">
            <view class="hourly-list">
              <view v-for="(h, i) in weatherStore.hourly.slice(0, 24)" :key="i" class="hourly-item">
                <text class="hourly-time">{{ i === 0 ? '现在' : h.time }}</text>
                <text class="hourly-icon">{{ getWeatherIcon(h.icon) }}</text>
                <text class="hourly-temp">{{ h.temp }}°</text>
                <view class="hourly-bar" :style="{ height: getBarHeight(h.temp) + 'px' }" />
              </view>
            </view>
          </scroll-view>
        </view>
      </view>

      <!-- Pressure -->
      <view class="card">
        <text class="card-title">气压变化</text>
        <view class="pressure-v">
          <view class="pressure-col" v-for="p in pressureData" :key="p.time">
            <text class="pressure-val">{{ p.val }}</text>
            <view class="pressure-bar" :style="{ height: p.height + '%', background: p.color }" />
            <text class="pressure-time">{{ p.time }}</text>
          </view>
        </view>
        <text class="pressure-hint">📈 气压稳定偏高（1013±3），鱼类呼吸代谢活跃</text>
      </view>

      <!-- 15-day -->
      <view class="card">
        <view class="card-title-row">
          <text class="card-title">15天预报</text>
        </view>
        <view class="fifteen-legend">
          <view class="legend-item">
            <view class="legend-dot hot" />
            <text class="legend-text">高温</text>
          </view>
          <view class="legend-item">
            <view class="legend-dot cold" />
            <text class="legend-text">低温</text>
          </view>
          <text class="legend-label">宜钓指数</text>
          <view class="legend-gradient" />
        </view>
        <!-- Chart placeholder -->
        <view class="fifteen-chart">
          <view class="chart-placeholder">
            <text class="chart-label">📈 15天温度趋势</text>
          </view>
        </view>
        <!-- 15 day rows -->
        <view class="fifteen-rows">
          <view
            v-for="(day, index) in weatherStore.daily.slice(0, 7)"
            :key="day.date + index"
            class="fifteen-row"
            :class="{ 'fifteen-row--past': index === 0 }"
          >
            <text class="f-row-day">{{ index === 0 ? '今天' : day.week }}</text>
            <text class="f-row-date">{{ day.date.slice(5) }}</text>
            <text class="f-row-weather">{{ day.textDay }}</text>
            <text class="f-row-icon">{{ getWeatherIcon(day.iconDay) }}</text>
            <text class="f-row-temp"><text class="f-row-temp-hi">{{ day.tempDay }}°</text> / {{ day.tempNight }}°</text>
            <text class="f-row-wind">{{ day.windDirDay }}{{ day.windScaleDay }}级</text>
            <view class="f-row-badge" :class="index === 0 ? 'b-mid' : 'b-ok'">
              <text class="f-row-badge-text">--</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Tide -->
      <view class="card">
        <view class="card-title-row">
          <text class="card-title">潮汐曲线</text>
          <view class="badge badge--ok"><text class="badge-text">涨潮中</text></view>
        </view>
        <view class="tide-chart">
          <view class="chart-placeholder">
            <text class="chart-label">🌊 潮汐曲线</text>
          </view>
        </view>
        <view class="tide-info">
          <view class="tide-info-item">
            <text class="tide-info-label">🌊 满潮</text>
            <text class="tide-info-time">06:42</text>
            <text class="tide-info-val">+1.8m</text>
          </view>
          <view class="tide-info-item">
            <text class="tide-info-label">🌊 干潮</text>
            <text class="tide-info-time">12:15</text>
            <text class="tide-info-val">+0.3m</text>
          </view>
          <view class="tide-info-item">
            <text class="tide-info-label">🌊 满潮</text>
            <text class="tide-info-time">18:56</text>
            <text class="tide-info-val">+1.6m</text>
          </view>
        </view>
        <view class="tide-phases">
          <view class="tide-phase-tag tide-phase-tag--spring">大潮</view>
          <view class="tide-phase-tag tide-phase-tag--rising">涨潮中</view>
          <view class="tide-phase-tag tide-phase-tag--flood">活讯</view>
          <view class="tide-phase-tag tide-phase-tag--info">潮差 1.5m</view>
        </view>
        <view class="tide-lunar">
          <text class="tide-lunar-icon">🌒</text>
          <view class="tide-lunar-text">
            <text class="tide-lunar-bold">农历五月十九</text>
            <text>新月后第4天，进入大潮期。活讯期间鱼口活跃，建议涨潮至满潮时段作钓。</text>
          </view>
        </view>
      </view>

      <!-- Fish Predictions -->
      <view class="card">
        <text class="card-title">鱼口预测</text>
        <FishBadge
          v-for="fish in fishPredictions"
          :key="fish.name"
          :name="fish.name"
          :variant="fish.variant"
          size="md"
        />
        <view v-for="fish in fishPredictions" :key="fish.name + '_row'" class="fish-row">
          <text class="fish-name">{{ fish.name }}</text>
          <view class="fish-badge" :class="'fish-badge--' + fish.variant">
            <text class="fish-badge-text">{{ fish.status }}</text>
          </view>
          <text class="fish-trend">{{ fish.trend }}</text>
        </view>
      </view>

      <!-- Tips -->
      <view class="card">
        <text class="card-title">钓法建议</text>
        <view class="tip">
          <view class="tip-icon tip-icon--b">🎣</view>
          <text class="tip-text">鲫鱼开口积极，建议活饵（蚯蚓/红虫），小钩细线灵敏度高。</text>
        </view>
        <view class="tip">
          <view class="tip-icon tip-icon--g">🐟</view>
          <text class="tip-text">鲤鱼底层活动频繁，玉米打窝+商品饵挂钩，等口为主。</text>
        </view>
        <view class="tip">
          <view class="tip-icon tip-icon--o">🌊</view>
          <text class="tip-text">当前涨潮中，满潮前后1小时是黄金窗口，近岸作钓效果好。</text>
        </view>
      </view>

      <view style="height: 120rpx;" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import FishBadge from '@/components/FishBadge.vue'
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

// 计算小时柱高度 (基于温度范围)
function getBarHeight(temp: number) {
  // 假设温度范围 15-35度，映射到 20-80px高度
  const minTemp = 15
  const maxTemp = 35
  const minHeight = 20
  const maxHeight = 80
  const clamped = Math.max(minTemp, Math.min(maxTemp, temp))
  return minHeight + ((clamped - minTemp) / (maxTemp - minTemp)) * (maxHeight - minHeight)
}

// 鱼口预测
const fishPredictions = [
  { name: '鲫鱼', status: '开口积极', variant: 'open' as const, trend: '↑' },
  { name: '鲤鱼', status: '正常', variant: 'normal' as const, trend: '→' },
  { name: '草鱼', status: '鱼口较慢', variant: 'slow' as const, trend: '↓' },
  { name: '鲢鳙', status: '鱼口较慢', variant: 'slow' as const, trend: '↓' },
]

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
  font-size: 18px;
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

.icon-text {
  font-size: 16px;
}

/* Content */
.content { overflow-x: hidden;
  padding: 12px;
  height: calc(100vh - 60px);
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
  margin-bottom: 12px;
}

.hero-city {
  font-size: 13px;
  opacity: 0.8;
}

.hero-score-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.hero-score {
  font-size: 56px;
  font-weight: 700;
  line-height: 1;
}

.hero-score-unit {
  font-size: 20px;
  font-weight: 400;
  opacity: 0.7;
}

.hero-label {
  font-size: 14px;
  opacity: 0.9;
  margin-top: 2px;
  display: block;
}

.hero-icon {
  font-size: 44px;
}

.hero-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.hero-item {
  background: rgba(255,255,255,0.15);
  border-radius: 10px;
  padding: 8px;
  text-align: center;
}

.hero-item-label {
  font-size: 10px;
  opacity: 0.7;
  display: block;
}

.hero-item-value {
  font-size: 15px;
  font-weight: 600;
  margin-top: 1px;
  display: block;
}

/* Card */
.card {
  background: $bg-card;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid $divider;
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
  margin-bottom: 12px;
}

.card-title-row .card-title {
  margin-bottom: 0;
}

.badge {
  padding: 2px 8px;
  border-radius: 100px;
  font-weight: 500;
}

.badge--ok {
  background: rgba($success, 0.1);
}

.badge-text {
  font-size: 11px;
  color: $success;
}

/* Hourly */
.hourly-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.hourly-sub {
  font-size: 12px;
  color: $text-muted;
}

.hourly-header-right {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: $text-muted;
}

.hourly-sun, .hourly-moon {
  font-size: 12px;
}

.hourly-chart {
  margin: 12px 0;
}

.hourly-scroll {
  white-space: nowrap;
}

.hourly-list {
  display: inline-flex;
  gap: 16px;
  padding: 12px 0;
}

.hourly-item {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 48px;
}

.hourly-time {
  font-size: 11px;
  color: $text-muted;
}

.hourly-icon {
  font-size: 20px;
}

.hourly-temp {
  font-size: 14px;
  font-weight: 600;
  color: $text-primary;
}

.hourly-bar {
  width: 24px;
  background: linear-gradient(180deg, $brand 0%, rgba($brand, 0.3) 100%);
  border-radius: 4px 4px 0 0;
}

.hourly-meta {
  margin-bottom: 8px;
}

.hourly-meta-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.hourly-meta-label {
  font-size: 11px;
  color: $text-muted;
  width: 28px;
  flex-shrink: 0;
}

.hourly-meta-blocks {
  display: flex;
  gap: 2px;
  flex: 1;
}

.hourly-meta-block {
  flex: 1;
  height: 16px;
  border-radius: 2px;
}

.l1 { background: rgba($success, 0.25); }
.l2 { background: rgba($success, 0.45); }
.l3 { background: rgba($success, 0.7); }
.w1 { background: rgba($brand, 0.2); }
.w2 { background: rgba($brand, 0.4); }
.w3 { background: rgba($brand, 0.6); }

.hourly-meta-val {
  font-size: 10px;
  margin-left: 4px;
  &.ok { color: $success; }
  &.brand { color: $brand; }
}

.hourly-time-axis {
  display: flex;
  justify-content: space-between;
  padding: 0 4px;

  text {
    font-size: 10px;
    color: $text-muted;
  }
}

/* Pressure */
.pressure-v {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 120px;
  padding: 0 4px;
}

.pressure-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.pressure-bar {
  width: 100%;
  border-radius: 4px 4px 0 0;
  min-height: 4px;
}

.pressure-val {
  font-size: 10px;
  font-weight: 600;
  color: $text-secondary;
}

.pressure-time {
  font-size: 10px;
  color: $text-muted;
}

.pressure-hint {
  font-size: 11px;
  color: $text-muted;
  margin-top: 8px;
  text-align: center;
}

/* 15-day */
.fifteen-legend {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 11px;
  color: $text-muted;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legend-dot.hot { background: $danger; }
.legend-dot.cold { background: $brand; }

.legend-text {
  font-size: 11px;
  color: $text-muted;
}

.legend-label {
  font-size: 11px;
  color: $text-muted;
}

.legend-gradient {
  width: 60px;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(90deg, $success, $brand, $warning, $danger);
}

.fifteen-chart {
  height: 220px;
  margin-bottom: 4px;
  background: $bg-page;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fifteen-rows {
  display: flex;
  flex-direction: column;
}

.fifteen-row {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid $divider;
  gap: 6px;

  &:last-child { border-bottom: none; }
}

.fifteen-row--past {
  opacity: 0.5;
}

.f-row-day {
  font-size: 12px;
  font-weight: 500;
  width: 32px;
  flex-shrink: 0;
  color: $text-primary;
}

.f-row-date {
  font-size: 10px;
  color: $text-muted;
  width: 32px;
  flex-shrink: 0;
}

.f-row-weather {
  font-size: 11px;
  color: $text-secondary;
  width: 32px;
  flex-shrink: 0;
}

.f-row-icon {
  font-size: 18px;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}

.f-row-temp {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: $text-secondary;
}

.f-row-temp-hi {
  color: $text-primary;
  font-weight: 600;
}

.f-row-wind {
  font-size: 10px;
  color: $text-muted;
  width: 48px;
  flex-shrink: 0;
  text-align: center;
}

.f-row-badge {
  width: 36px;
  height: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.b-ok { background: $success; }
  &.b-mid { background: $brand; }
  &.b-low { background: $text-muted; }
}

.f-row-badge-text {
  font-size: 10px;
  font-weight: 600;
  color: #fff;
}

/* Tide */
.tide-chart {
  height: 160px;
  margin: 12px 0 8px;
  background: linear-gradient(180deg, rgba(88,101,242,0.03) 0%, rgba(88,101,242,0.08) 100%);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tide-info {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
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
  margin-bottom: 3px;
  display: block;
}

.tide-info-time {
  font-size: 16px;
  font-weight: 700;
  display: block;
}

.tide-info-val {
  font-size: 11px;
  color: $text-muted;
  margin-top: 1px;
  display: block;
}

.tide-phases {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.tide-phase-tag {
  padding: 4px 10px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 500;
}

.tide-phase-tag--spring {
  background: rgba($brand, 0.1);
  color: $brand;
}

.tide-phase-tag--rising {
  background: rgba($success, 0.1);
  color: $success;
}

.tide-phase-tag--flood {
  background: rgba($brand, 0.1);
  color: $brand;
}

.tide-phase-tag--info {
  background: rgba($brand, 0.06);
  color: $brand;
}

.tide-lunar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background: $tag-bg;
  border-radius: 10px;
}

.tide-lunar-icon {
  font-size: 28px;
}

.tide-lunar-text {
  font-size: 12px;
  color: $text-secondary;
  line-height: 1.5;
}

.tide-lunar-bold {
  font-weight: 700;
  color: $text-primary;
}

/* Fish rows */
.fish-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid $divider;

  &:last-child { border-bottom: none; }
}

.fish-name {
  font-size: 14px;
  font-weight: 500;
  width: 48px;
}

.fish-badge {
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 500;

  &--open {
    background: rgba($success, 0.1);
    color: $success;
  }

  &--normal {
    background: rgba($brand, 0.1);
    color: $brand;
  }

  &--slow {
    background: rgba(128, 132, 142, 0.1);
    color: $text-muted;
  }
}

.fish-badge-text {
  font-size: 12px;
  font-weight: 500;
}

.fish-trend {
  margin-left: auto;
  font-size: 16px;
  color: $text-muted;
}

/* Tips */
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

.tip-text {
  font-size: 13px;
  color: $text-secondary;
  line-height: 1.5;
}
</style>
