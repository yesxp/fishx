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
    
    <view class="content">
      <view class="weather-hero">
        <text class="weather-num">72</text>
        <text class="weather-label">今日钓鱼指数 · 上海</text>
        <view class="weather-badge">🎣 气压稳定，适合出钓</view>
      </view>
      
      <view class="weather-grid">
        <view class="weather-card">
          <text class="weather-icon">🌡️</text>
          <text class="weather-val">26°</text>
          <text class="weather-lbl">气温</text>
        </view>
        <view class="weather-card">
          <text class="weather-icon">💧</text>
          <text class="weather-val">24°</text>
          <text class="weather-lbl">水温</text>
        </view>
        <view class="weather-card">
          <text class="weather-icon">📊</text>
          <text class="weather-val">1009</text>
          <text class="weather-lbl">气压 hPa</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
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

.weather-hero {
  text-align: center;
  padding: 40rpx 0;
}

.weather-num {
  font-size: 160rpx;
  font-weight: 800;
  line-height: 1;
  background: linear-gradient(135deg, #3B82F6, #10B981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.weather-label {
  font-size: 26rpx;
  color: #64748B;
  margin: 16rpx 0;
}

.weather-badge {
  display: inline-flex;
  align-items: center;
  padding: 16rpx 40rpx;
  border-radius: 100rpx;
  background: rgba(16,185,129,.1);
  color: #10B981;
  font-size: 28rpx;
  font-weight: 600;
}

.weather-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.weather-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx 16rpx;
  text-align: center;
  box-shadow: 0 2rpx 16rpx rgba(26,43,74,.06);
}

.weather-icon {
  font-size: 40rpx;
  margin-bottom: 8rpx;
}

.weather-val {
  font-size: 36rpx;
  font-weight: 700;
}

.weather-lbl {
  font-size: 20rpx;
  color: #64748B;
}
</style>