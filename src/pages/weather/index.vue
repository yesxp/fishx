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
  padding: 24rpx;
}

.weather-hero {
  text-align: center;
  padding: 48rpx 0;
}

.weather-num {
  font-size: 160rpx;
  font-weight: 800;
  line-height: 1;
  background: linear-gradient(135deg, #2196F3, #4CAF50);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.weather-label {
  font-size: 26rpx;
  color: #6B7A99;
  margin: 16rpx 0;
}

.weather-badge {
  display: inline-block;
  padding: 16rpx 40rpx;
  border-radius: 100px;
  background: rgba(76,175,80,.1);
  color: #4CAF50;
  font-size: 28rpx;
  font-weight: 600;
}

.weather-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.weather-card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 24rpx 16rpx;
  text-align: center;
  box-shadow: 0 2px 12px rgba(26,43,74,.06);
}

.weather-icon {
  font-size: 40rpx;
  margin-bottom: 8rpx;
}

.weather-val {
  font-size: 36rpx;
  font-weight: 700;
  color: #1A2B4A;
}

.weather-lbl {
  font-size: 20rpx;
  color: #6B7A99;
}
</style>