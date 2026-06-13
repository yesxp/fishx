<template>
  <view class="container">
    <view class="header">
      <view class="header-left">
        <view class="logo">🎣</view>
        <view class="info">
          <text class="title">鱼渔娱</text>
          <text class="subtitle">上海市</text>
        </view>
      </view>
      <view class="header-right">
        <button class="btn-camera">📷</button>
      </view>
    </view>
    
    <scroll-view scroll-y class="content">
      <!-- 天气指数条 -->
      <WeatherMini 
        :score="indexResult.score"
        :level="indexResult.level"
        :color="indexResult.levelColor"
        :text="indexResult.suggestion"
      />
      
      <view class="stats-grid">
        <view class="stat-card">
          <text class="stat-icon">🌡️</text>
          <text class="stat-val">{{ weatherNow?.temp || '26' }}°</text>
          <text class="stat-label">气温</text>
        </view>
        <view class="stat-card">
          <text class="stat-icon">📊</text>
          <text class="stat-val">{{ weatherNow?.pressure || '1009' }}</text>
          <text class="stat-label">气压 hPa</text>
        </view>
        <view class="stat-card">
          <text class="stat-icon">💨</text>
          <text class="stat-val">{{ weatherNow?.windScale || '2' }}级</text>
          <text class="stat-label">南风</text>
        </view>
      </view>
      
      <view class="section">
        <text class="section-title">附近渔获</text>
        <text class="section-more" @click="switchTab(2)">查看全部 →</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useWeatherStore } from '@/stores/weather'
import WeatherMini from '@/components/WeatherMini.vue'

const weatherStore = useWeatherStore()
const { weatherNow, indexResult } = weatherStore

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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12rpx;
  padding: 0 16rpx;
  margin-bottom: 24rpx;
}

.stat-card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 20rpx 12rpx;
  text-align: center;
  box-shadow: 0 2px 12px rgba(26,43,74,.06);
}

.stat-icon {
  font-size: 36rpx;
  margin-bottom: 8rpx;
}

.stat-val {
  font-size: 32rpx;
  font-weight: 700;
  color: #1A2B4A;
}

.stat-label {
  font-size: 20rpx;
  color: #6B7A99;
}

.section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #1A2B4A;
}

.section-more {
  font-size: 26rpx;
  color: #2196F3;
}
</style>