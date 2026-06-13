<template>
  <view class="container">
    <view class="header">
      <view class="header-left">
        <view class="logo">👤</view>
        <view class="info">
          <text class="title">我的</text>
          <text class="subtitle">fishx_2026</text>
        </view>
      </view>
      <view class="header-right">
        <button class="btn-camera">📷</button>
      </view>
    </view>
    
    <view class="content">
      <view class="profile-card">
        <view class="avatar">🎣</view>
        <text class="name">钓鱼人小陈</text>
        <text class="id">ID: fishx_2026</text>
      </view>
      
      <view class="stats-row">
        <view class="stat-item">
          <text class="stat-num">42</text>
          <text class="stat-text">总渔获</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">8</text>
          <text class="stat-text">钓点</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">鲫鱼</text>
          <text class="stat-text">最常钓</text>
        </view>
      </view>
      
      <view class="menu-section">
        <view class="menu-item">
          <text class="menu-icon">🐟</text>
          <text class="menu-text">我的渔获</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item">
          <text class="menu-icon">📍</text>
          <text class="menu-text">我的钓点</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item">
          <text class="menu-icon">⭐</text>
          <text class="menu-text">收藏</text>
          <text class="menu-arrow">›</text>
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

.profile-card {
  background: linear-gradient(135deg, #DBEAFE, #CFFAFE);
  border-radius: 32rpx;
  padding: 48rpx;
  text-align: center;
  margin-bottom: 24rpx;
}

.avatar {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #3B82F6, #06B6D4);
  margin: 0 auto 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64rpx;
}

.name {
  font-size: 40rpx;
  font-weight: 700;
  margin-bottom: 8rpx;
}

.id {
  font-size: 24rpx;
  color: #64748B;
}

.stats-row {
  display: flex;
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 16rpx rgba(26,43,74,.06);
}

.stat-item {
  flex: 1;
  text-align: center;
  padding: 32rpx 16rpx;
}

.stat-num {
  font-size: 44rpx;
  font-weight: 700;
  color: #3B82F6;
}

.stat-text {
  font-size: 22rpx;
  color: #64748B;
  margin-top: 8rpx;
}

.menu-section {
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 16rpx rgba(26,43,74,.06);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 28rpx 32rpx;
  border-bottom: 1rpx solid #E2E8F0;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  background: #DBEAFE;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  margin-right: 24rpx;
}

.menu-text {
  flex: 1;
  font-size: 30rpx;
  font-weight: 500;
}

.menu-arrow {
  color: #64748B;
  font-size: 32rpx;
}
</style>