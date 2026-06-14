<template>
  <view class="container">
    <!-- iOS 大标题头部 -->
    <view class="header">
      <view class="header-top">
        <view class="location">
          <text class="location-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
          </text>
          <text class="location-text">上海</text>
        </view>
      </view>
      <text class="header-title">天时</text>
    </view>

    <scroll-view scroll-y class="content">
      <!-- 大字指数：iOS 数字突出显示 -->
      <view class="hero-card">
        <text class="hero-score" :style="{ color: indexResult.levelColor }">{{ indexResult.score }}</text>
        <text class="hero-label">今日钓鱼指数</text>
        <view class="hero-badge" :style="{ background: indexResult.levelColor + '18', color: indexResult.levelColor }">
          {{ indexResult.suggestion }}
        </view>
      </view>

      <!-- 数据列表：iOS Inset Grouped Style -->
      <view class="data-section">
        <view class="section-label">天气详情</view>
        <view class="data-list">
          <view class="data-row">
            <text class="data-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#FF9500" stroke-width="2" stroke-linecap="round"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg>
            </text>
            <text class="data-label">气温</text>
            <text class="data-value">{{ weatherNow?.temp || '--' }}°</text>
          </view>
          <view class="data-divider"></view>
          <view class="data-row">
            <text class="data-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" stroke-width="2" stroke-linecap="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
            </text>
            <text class="data-label">湿度</text>
            <text class="data-value">{{ weatherNow?.humidity || '--' }}%</text>
          </view>
          <view class="data-divider"></view>
          <view class="data-row">
            <text class="data-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#5856D6" stroke-width="2" stroke-linecap="round"><path d="M2 12h20"/><path d="M6 8v8"/><path d="M10 10v4"/><path d="M14 8v8"/><path d="M18 10v4"/></svg>
            </text>
            <text class="data-label">气压</text>
            <text class="data-value">{{ weatherNow?.pressure || '--' }} hPa</text>
          </view>
          <view class="data-divider"></view>
          <view class="data-row">
            <text class="data-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#34C759" stroke-width="2" stroke-linecap="round"><path d="M17.7 7.7a7.5 7.5 0 1 0-10.1 10.8"/><path d="M18 12h.01"/><path d="M12 2v2"/><path d="M2 12h2"/></svg>
            </text>
            <text class="data-label">天气</text>
            <text class="data-value">{{ weatherNow?.text || '--' }}</text>
          </view>
          <view class="data-divider"></view>
          <view class="data-row">
            <text class="data-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#FF3B30" stroke-width="2" stroke-linecap="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>
            </text>
            <text class="data-label">风力</text>
            <text class="data-value">{{ weatherNow?.windScale || '--' }}级 {{ weatherNow?.windDir || '' }}</text>
          </view>
        </view>
      </view>

      <!-- 气压趋势 -->
      <view class="data-section">
        <view class="section-label">气压趋势</view>
        <view class="chart-card">
          <view class="chart">
            <view
              class="bar"
              v-for="(item, i) in pressureData"
              :key="i"
              :style="{
                height: item.percent + '%',
                background: i === 12 ? '#007AFF' : (item.value > 1005 ? '#34C759' : '#E5E5EA')
              }"
            ></view>
          </view>
          <view class="chart-labels">
            <text class="chart-label">12h前</text>
            <text class="chart-label">现在</text>
            <text class="chart-label">12h后</text>
          </view>
        </view>
      </view>

      <!-- 最佳出钓时段 -->
      <view class="data-section">
        <view class="section-label">最佳出钓时段</view>
        <view class="data-list">
          <view class="data-row" v-for="item in bestTimes" :key="item.time">
            <view class="slot-dot" :class="item.level"></view>
            <text class="data-label">{{ item.time }}</text>
            <text class="data-sub">{{ item.level === 'good' ? '黄金时段' : item.level === 'ok' ? '可以出钓' : '不建议' }}</text>
            <text class="data-value" :style="{ color: item.score >= 80 ? '#34C759' : item.score >= 50 ? '#FF9500' : '#FF3B30' }">{{ item.score }}</text>
          </view>
        </view>
      </view>

      <!-- 逐小时鱼口 -->
      <view class="data-section">
        <view class="section-label">逐小时鱼口</view>
        <view class="chart-card">
          <view class="hourly-chart">
            <view
              class="hourly-item"
              v-for="(item, i) in hourly"
              :key="i"
              v-if="i < 12"
            >
              <text class="hourly-temp">{{ item.temp }}°</text>
              <view class="hourly-bar-wrap">
                <view
                  class="hourly-bar"
                  :style="{
                    height: (Number(item.pressure) - 980) / 50 * 100 + '%',
                    background: Number(item.pressure) > 1005 ? '#34C759' : '#FF9500'
                  }"
                ></view>
              </view>
              <text class="hourly-time">{{ getHour(item.fxTime) }}</text>
            </view>
          </view>
        </view>
      </view>

      <view style="height: 40rpx;"></view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useWeatherStore } from '@/stores/weather'

const weatherStore = useWeatherStore()

const { weatherNow, indexResult, hourly, bestTimes } = storeToRefs(weatherStore)

const pressureData = computed(() => {
  const data = []
  const base = Number(weatherNow?.pressure || 1009)
  for (let i = 0; i < 24; i++) {
    const value = base + Math.round((Math.random() - 0.5) * 20)
    data.push({
      value,
      percent: Math.min(100, Math.max(20, (value - 980) / 50 * 100))
    })
  }
  return data
})

function getHour(time: string) {
  const h = new Date(time).getHours()
  return h + ':00'
}

onMounted(() => {
  weatherStore.loadWeather()
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #F2F2F7;
}

/* === iOS 大标题头部 === */
.header {
  background: #FFFFFF;
  padding: 12rpx 20rpx 20rpx;
  border-bottom: 0.5px solid #C6C6C8;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.location {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.location-icon {
  width: 28rpx;
  height: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.location-icon svg {
  width: 28rpx;
  height: 28rpx;
}

.location-text {
  font-size: 26rpx;
  color: #007AFF;
  font-weight: 500;
}

.header-title {
  font-size: 60rpx;
  font-weight: 700;
  color: #000000;
  letter-spacing: -0.5rpx;
}

/* === 内容 === */
.content {
  flex: 1;
  padding: 16rpx 20rpx;
}

/* === 指数卡片 === */
.hero-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 40rpx 24rpx;
  text-align: center;
  margin-bottom: 24rpx;
}

.hero-score {
  font-size: 160rpx;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.hero-label {
  font-size: 26rpx;
  color: #8E8E93;
  margin: 12rpx 0 20rpx;
  display: block;
}

.hero-badge {
  display: inline-block;
  padding: 12rpx 28rpx;
  border-radius: 100px;
  font-size: 28rpx;
  font-weight: 500;
}

/* === 数据区 === */
.data-section {
  margin-bottom: 24rpx;
}

.section-label {
  font-size: 24rpx;
  font-weight: 600;
  color: #8E8E93;
  text-transform: uppercase;
  letter-spacing: 0.5rpx;
  margin-bottom: 12rpx;
  padding-left: 4rpx;
}

.data-list {
  background: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
}

.data-row {
  display: flex;
  align-items: center;
  padding: 24rpx 20rpx;
}

.data-icon {
  width: 36rpx;
  height: 36rpx;
  margin-right: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.data-icon svg {
  width: 36rpx;
  height: 36rpx;
}

.data-label {
  flex: 1;
  font-size: 30rpx;
  color: #000000;
}

.data-sub {
  font-size: 26rpx;
  color: #8E8E93;
  margin-right: 12rpx;
}

.data-value {
  font-size: 30rpx;
  color: #8E8E93;
  font-variant-numeric: tabular-nums;
}

.data-divider {
  height: 0.5px;
  background: #C6C6C8;
  margin-left: 72rpx;
}

/* === 图表卡片 === */
.chart-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx 20rpx;
}

.chart {
  display: flex;
  align-items: flex-end;
  gap: 6rpx;
  height: 160rpx;
  margin-bottom: 12rpx;
}

.bar {
  flex: 1;
  border-radius: 4rpx 4rpx 0 0;
  transition: height .5s ease;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
}

.chart-label {
  font-size: 22rpx;
  color: #8E8E93;
}

/* === 时间段点 === */
.slot-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  margin-right: 16rpx;
  flex-shrink: 0;
}
.slot-dot.good { background: #34C759; }
.slot-dot.ok { background: #FF9500; }
.slot-dot.bad { background: #FF3B30; }

/* === 逐小时 === */
.hourly-chart {
  display: flex;
  gap: 8rpx;
  overflow-x: auto;
  padding-bottom: 8rpx;
}

.hourly-item {
  flex-shrink: 0;
  width: 60rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.hourly-temp {
  font-size: 22rpx;
  color: #000000;
  font-weight: 500;
}

.hourly-bar-wrap {
  width: 24rpx;
  height: 120rpx;
  background: #F2F2F7;
  border-radius: 4rpx;
  display: flex;
  align-items: flex-end;
}

.hourly-bar {
  width: 100%;
  border-radius: 4rpx 4rpx 0 0;
  transition: height .5s ease;
}

.hourly-time {
  font-size: 20rpx;
  color: #8E8E93;
}
</style>
