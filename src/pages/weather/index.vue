<template>
  <view class="container">
    <view class="header">
      <view class="header-left">
        <view class="logo">🌤️</view>
        <view class="info">
          <text class="title">天时</text>
          <text class="subtitle">钓鱼指数 · 上海</text>
        </view>
      </view>
      <view class="header-right">
        <button class="btn-camera">📷</button>
      </view>
    </view>
    
    <scroll-view scroll-y class="content">
      <!-- 大字指数 -->
      <view class="hero">
        <text class="hero-num" :style="{ color: indexResult.levelColor }">
          {{ indexResult.score }}
        </text>
        <text class="hero-label">今日钓鱼指数 · 上海</text>
        <view class="hero-badge" :style="{ 
          background: indexResult.levelColor + '15',
          color: indexResult.levelColor 
        }">
          {{ indexResult.suggestion }}
        </view>
      </view>
      
      <!-- 核心数据 -->
      <view class="data-grid">
        <view class="data-card">
          <text class="data-icon">🌡️</text>
          <text class="data-val">{{ weatherNow?.temp || '--' }}°</text>
          <text class="data-label">气温</text>
        </view>
        <view class="data-card">
          <text class="data-icon">💧</text>
          <text class="data-val">{{ weatherNow?.humidity || '--' }}%</text>
          <text class="data-label">湿度</text>
        </view>
        <view class="data-card">
          <text class="data-icon">📊</text>
          <text class="data-val">{{ weatherNow?.pressure || '--' }}</text>
          <text class="data-label">气压 hPa</text>
        </view>
        <view class="data-card">
          <text class="data-icon">💨</text>
          <text class="data-val">{{ weatherNow?.windScale || '--' }}级</text>
          <text class="data-label">{{ weatherNow?.windDir || '风力' }}</text>
        </view>
        <view class="data-card">
          <text class="data-icon">🌤️</text>
          <text class="data-val">{{ weatherNow?.text || '--' }}</text>
          <text class="data-label">天气</text>
        </view>
        <view class="data-card">
          <text class="data-icon">🐟</text>
          <text class="data-val">{{ indexResult.level }}</text>
          <text class="data-label">指数等级</text>
        </view>
      </view>
      
      <!-- 气压趋势 -->
      <view class="section-card">
        <view class="card-title">
          <view class="title-bar"></view>
          <text class="title-text">气压趋势（24h）</text>
        </view>
        <view class="chart">
          <view 
            class="bar" 
            v-for="(item, i) in pressureData" 
            :key="i"
            :style="{ 
              height: item.percent + '%',
              background: i === 12 ? '#2196F3' : (item.value > 1005 ? '#4CAF50' : '#E3F2FD')
            }"
          ></view>
        </view>
        <view class="chart-labels">
          <text>12h前</text>
          <text>现在</text>
          <text>12h后</text>
        </view>
      </view>
      
      <!-- 最佳出钓时段 -->
      <view class="section-card">
        <view class="card-title">
          <view class="title-bar"></view>
          <text class="title-text">最佳出钓时段</text>
        </view>
        <view class="time-slot" v-for="item in bestTimes" :key="item.time">
          <view class="slot-dot" :class="item.level"></view>
          <view class="slot-info">
            <text class="slot-time">{{ item.time }}</text>
            <text class="slot-level">{{ 
              item.level === 'good' ? '黄金时段' : 
              item.level === 'ok' ? '可以出钓' : '不建议' 
            }}</text>
          </view>
          <text class="slot-score" :style="{ 
            color: item.score >= 80 ? '#4CAF50' : item.score >= 50 ? '#FFC107' : '#F44336' 
          }">{{ item.score }}</text>
        </view>
      </view>
      
      <!-- 逐小时鱼口 -->
      <view class="section-card">
        <view class="card-title">
          <view class="title-bar"></view>
          <text class="title-text">逐小时鱼口预测</text>
        </view>
        <view class="hourly-chart">
          <view 
            class="hourly-item" 
            v-for="(item, i) in hourly" 
            :key="i"
            v-if="i < 12"
          >
            <text class="hourly-time">{{ getHour(item.fxTime) }}</text>
            <view class="hourly-bar-wrap">
              <view 
                class="hourly-bar" 
                :style="{ 
                  height: (Number(item.pressure) - 980) / 50 * 100 + '%',
                  background: Number(item.pressure) > 1005 ? '#4CAF50' : '#FFC107'
                }"
              ></view>
            </view>
            <text class="hourly-temp">{{ item.temp }}°</text>
          </view>
        </view>
      </view>
      
      <!-- 底部安全区 -->
      <view style="height: 40rpx;"></view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useWeatherStore } from '@/stores/weather'

const weatherStore = useWeatherStore()

const { weatherNow, indexResult, hourly, bestTimes } = weatherStore

// 生成模拟气压数据
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
  background-color: #F8FAFE;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 32rpx;
  background: rgba(255,255,255,.88);
  backdrop-filter: blur(24px);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.logo {
  width: 68rpx;
  height: 68rpx;
  border-radius: 20rpx;
  background: linear-gradient(135deg, #2196F3, #00BCD4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.title {
  font-size: 34rpx;
  font-weight: 700;
  color: #1A2B4A;
}

.subtitle {
  font-size: 22rpx;
  color: #6B7A99;
}

.header-right {
  display: flex;
  align-items: center;
}

.btn-camera {
  width: 68rpx;
  height: 68rpx;
  border-radius: 20rpx;
  background: linear-gradient(135deg, #2196F3, #00BCD4);
  color: #fff;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.content {
  flex: 1;
}

.hero {
  text-align: center;
  padding: 40rpx 24rpx;
}

.hero-num {
  font-size: 160rpx;
  font-weight: 800;
  line-height: 1;
}

.hero-label {
  font-size: 26rpx;
  color: #6B7A99;
  margin: 16rpx 0;
}

.hero-badge {
  display: inline-block;
  padding: 16rpx 32rpx;
  border-radius: 100px;
  font-size: 28rpx;
  font-weight: 500;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12rpx;
  padding: 0 24rpx;
  margin-bottom: 24rpx;
}

.data-card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 20rpx 12rpx;
  text-align: center;
  box-shadow: 0 2px 12px rgba(26,43,74,.06);
}

.data-icon {
  font-size: 36rpx;
  margin-bottom: 8rpx;
}

.data-val {
  font-size: 32rpx;
  font-weight: 700;
  color: #1A2B4A;
  margin-bottom: 4rpx;
}

.data-label {
  font-size: 20rpx;
  color: #6B7A99;
}

.section-card {
  margin: 0 24rpx 24rpx;
  background: #FFFFFF;
  border-radius: 16px;
  padding: 24rpx;
  box-shadow: 0 2px 12px rgba(26,43,74,.06);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.title-bar {
  width: 6rpx;
  height: 28rpx;
  border-radius: 3rpx;
  background: linear-gradient(180deg, #2196F3, #00BCD4);
}

.title-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #1A2B4A;
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
  font-size: 20rpx;
  color: #6B7A99;
}

.time-slot {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #F1F5F9;
}

.time-slot:last-child {
  border-bottom: none;
}

.slot-dot {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.slot-dot.good {
  background: #4CAF50;
}

.slot-dot.ok {
  background: #FFC107;
}

.slot-dot.bad {
  background: #F44336;
}

.slot-info {
  flex: 1;
}

.slot-time {
  font-size: 28rpx;
  font-weight: 600;
  color: #1A2B4A;
}

.slot-level {
  font-size: 22rpx;
  color: #6B7A99;
  margin-top: 4rpx;
}

.slot-score {
  font-size: 32rpx;
  font-weight: 700;
}

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

.hourly-time {
  font-size: 18rpx;
  color: #6B7A99;
}

.hourly-bar-wrap {
  width: 24rpx;
  height: 120rpx;
  background: #F1F5F9;
  border-radius: 4rpx;
  display: flex;
  align-items: flex-end;
}

.hourly-bar {
  width: 100%;
  border-radius: 4rpx 4rpx 0 0;
  transition: height .5s ease;
}

.hourly-temp {
  font-size: 18rpx;
  color: #1A2B4A;
  font-weight: 500;
}
</style>