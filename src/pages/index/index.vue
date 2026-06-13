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
    
    <view class="content">
      <view class="hero-card">
        <text class="hero-num">72</text>
        <view class="hero-info">
          <text class="hero-label">今日钓鱼指数</text>
          <text class="hero-text">气压稳定，适合出钓</text>
        </view>
      </view>
      
      <view class="stats-grid">
        <view class="stat-card">
          <text class="stat-icon">🌡️</text>
          <text class="stat-val">26°</text>
          <text class="stat-label">气温</text>
        </view>
        <view class="stat-card">
          <text class="stat-icon">📊</text>
          <text class="stat-val">1009</text>
          <text class="stat-label">气压 hPa</text>
        </view>
        <view class="stat-card">
          <text class="stat-icon">💨</text>
          <text class="stat-val">2级</text>
          <text class="stat-label">南风</text>
        </view>
      </view>
      
      <view class="section">
        <text class="section-title">附近渔获</text>
        <text class="section-more">查看全部 →</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f5f7fa;
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
  background: linear-gradient(135deg, #3B82F6, #06B6D4);
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
}

.subtitle {
  font-size: 22rpx;
  color: #64748B;
}

.header-right {
  display: flex;
  align-items: center;
}

.btn-camera {
  width: 68rpx;
  height: 68rpx;
  border-radius: 20rpx;
  background: linear-gradient(135deg, #3B82F6, #06B6D4);
  color: #fff;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.content {
  padding: 24rpx;
}

.hero-card {
  background: linear-gradient(135deg, #3B82F6, #06B6D4, #10B981);
  border-radius: 32rpx;
  padding: 40rpx;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 32rpx;
  margin-bottom: 24rpx;
}

.hero-num {
  font-size: 108rpx;
  font-weight: 800;
  line-height: 1;
}

.hero-info {
  flex: 1;
}

.hero-label {
  font-size: 22rpx;
  opacity: .8;
  text-transform: uppercase;
  letter-spacing: 2rpx;
}

.hero-text {
  font-size: 30rpx;
  font-weight: 600;
  margin-top: 8rpx;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  margin-bottom: 32rpx;
}

.stat-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx 16rpx;
  text-align: center;
  box-shadow: 0 2rpx 16rpx rgba(26,43,74,.06);
}

.stat-icon {
  font-size: 40rpx;
  margin-bottom: 8rpx;
}

.stat-val {
  font-size: 36rpx;
  font-weight: 700;
}

.stat-label {
  font-size: 20rpx;
  color: #64748B;
}

.section {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  font-size: 30rpx;
  font-weight: 700;
}

.section-more {
  font-size: 26rpx;
  color: #3B82F6;
}
</style>