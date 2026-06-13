<template>
  <view class="container">
    <view class="header">
      <view class="header-left">
        <view class="logo">📍</view>
        <view class="info">
          <text class="title">钓点</text>
          <text class="subtitle">发现附近钓点</text>
        </view>
      </view>
      <view class="header-right">
        <button class="btn-locate">📍</button>
        <button class="btn-camera">📷</button>
      </view>
    </view>
    
    <view class="map-container">
      <view class="map-placeholder">
        <text class="map-text">🗺️ 地图加载中...</text>
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
  gap: 16rpx;
}

.btn-locate, .btn-camera {
  width: 68rpx;
  height: 68rpx;
  border-radius: 20rpx;
  background: rgba(33,150,243,.08);
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.btn-camera {
  background: linear-gradient(135deg, #2196F3, #00BCD4);
  color: #fff;
}

.map-container {
  height: calc(100vh - 108rpx);
}

.map-placeholder {
  height: 100%;
  background: linear-gradient(180deg, #E3F2FD, #B3E5FC);
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-text {
  font-size: 32rpx;
  color: #6B7A99;
}
</style>