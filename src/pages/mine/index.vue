<template>
  <view class="container">
    <view class="header">
      <view class="header-left">
        <view class="logo">👤</view>
        <view class="info">
          <text class="title">我的</text>
          <text class="subtitle">{{ userInfo?.nickname || '未登录' }}</text>
        </view>
      </view>
      <view class="header-right">
        <button class="btn-camera" @click="goToCreate">📷</button>
      </view>
    </view>
    
    <scroll-view scroll-y class="content">
      <!-- 个人信息 -->
      <view class="profile-card">
        <view class="avatar" @click="handleAvatarClick">
          <text class="avatar-emoji">{{ userInfo?.avatar || '🎣' }}</text>
        </view>
        <text class="nickname">{{ userInfo?.nickname || '点击登录' }}</text>
        <text class="user-id">ID: {{ userInfo?.id || '--' }}</text>
      </view>
      
      <!-- 统计卡片 -->
      <view class="stats-row">
        <view class="stat-item" @click="goToMyCatch">
          <text class="stat-num">{{ myCatchCount }}</text>
          <text class="stat-label">总渔获</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">{{ mySpotCount }}</text>
          <text class="stat-label">钓点</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">{{ topFish }}</text>
          <text class="stat-label">最常钓</text>
        </view>
      </view>
      
      <!-- 功能菜单 -->
      <view class="menu-section">
        <view class="menu-item" @click="goToMyCatch">
          <view class="menu-icon" style="background: #E3F2FD; color: #2196F3;">🐟</view>
          <text class="menu-text">我的渔获</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="goToMySpot">
          <view class="menu-icon" style="background: #E0F7FA; color: #00BCD4;">📍</view>
          <text class="menu-text">我的钓点</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="goToCollection">
          <view class="menu-icon" style="background: #FFF3E0; color: #FF9800;">⭐</view>
          <text class="menu-text">收藏</text>
          <text class="menu-arrow">›</text>
        </view>
      </view>
      
      <!-- 设置菜单 -->
      <view class="menu-section">
        <view class="menu-item" @click="handleLocationAuth">
          <view class="menu-icon" style="background: #E8F5E9; color: #4CAF50;">📍</view>
          <text class="menu-text">定位授权</text>
          <view class="menu-status">
            <text class="status-text">{{ locationAuth ? '已授权' : '未授权' }}</text>
          </view>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="handleNotification">
          <view class="menu-icon" style="background: #F3E5F5; color: #9C27B0;">🔔</view>
          <text class="menu-text">通知设置</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="handleClearCache">
          <view class="menu-icon" style="background: #FFEBEE; color: #F44336;">🗑️</view>
          <text class="menu-text">清除缓存</text>
          <text class="menu-status">
            <text class="status-text">{{ cacheSize }}</text>
          </text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="goToAbout">
          <view class="menu-icon" style="background: #F1F5F9; color: #64748B;">ℹ️</view>
          <text class="menu-text">关于鱼渔娱</text>
          <text class="menu-arrow">›</text>
        </view>
      </view>
      
      <!-- 退出登录 -->
      <view class="logout-section" v-if="isLoggedIn">
        <button class="logout-btn" @click="handleLogout">退出登录</button>
      </view>
      
      <view style="height: 40rpx;"></view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useCatchStore } from '@/stores/catch'

const userStore = useUserStore()
const catchStore = useCatchStore()

const { userInfo, isLoggedIn } = userStore
const { catchList } = catchStore

// 统计数据
const myCatchCount = computed(() => catchList.value.length)
const mySpotCount = ref(8)
const topFish = ref('鲫鱼')

// 定位授权状态
const locationAuth = ref(false)

// 缓存大小
const cacheSize = ref('2.3MB')

// 头像点击
function handleAvatarClick() {
  if (!isLoggedIn) {
    uni.navigateTo({ url: '/pages/login/index' })
  }
}

// 跳转我的渔获
function goToMyCatch() {
  uni.showToast({ title: '我的渔获页面开发中', icon: 'none' })
}

// 跳转我的钓点
function goToMySpot() {
  uni.showToast({ title: '我的钓点页面开发中', icon: 'none' })
}

// 跳转收藏
function goToCollection() {
  uni.showToast({ title: '收藏页面开发中', icon: 'none' })
}

// 定位授权
function handleLocationAuth() {
  uni.authorize({
    scope: 'scope.userLocation',
    success: () => {
      locationAuth.value = true
      uni.showToast({ title: '已授权', icon: 'success' })
    },
    fail: () => {
      locationAuth.value = false
      uni.showToast({ title: '请在设置中授权', icon: 'none' })
    }
  })
}

// 通知设置
function handleNotification() {
  uni.showToast({ title: '通知设置开发中', icon: 'none' })
}

// 清除缓存
function handleClearCache() {
  uni.showModal({
    title: '清除缓存',
    content: '确定要清除缓存吗？',
    success: (res) => {
      if (res.confirm) {
        uni.clearStorageSync()
        cacheSize.value = '0B'
        uni.showToast({ title: '清除成功', icon: 'success' })
      }
    }
  })
}

// 关于页面
function goToAbout() {
  uni.showToast({ title: '关于页面开发中', icon: 'none' })
}

// 退出登录
function handleLogout() {
  uni.showModal({
    title: '退出登录',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
        uni.showToast({ title: '已退出', icon: 'success' })
        setTimeout(() => {
          uni.reLaunch({ url: '/pages/index/index' })
        }, 1500)
      }
    }
  })
}

// 跳转拍照
function goToCreate() {
  uni.navigateTo({ url: '/pages/catch/create' })
}

onMounted(() => {
  // 检查定位授权
  uni.getSetting({
    success: (res) => {
      locationAuth.value = !!res.authSetting['scope.userLocation']
    }
  })
  
  // 加载渔获数据
  catchStore.loadList(true)
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

.profile-card {
  margin: 24rpx;
  padding: 48rpx;
  background: linear-gradient(135deg, #E3F2FD, #E0F7FA);
  border-radius: 24rpx;
  text-align: center;
}

.avatar {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #2196F3, #00BCD4);
  margin: 0 auto 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 32rpx rgba(33,150,243,.3);
}

.avatar-emoji {
  font-size: 64rpx;
}

.nickname {
  font-size: 36rpx;
  font-weight: 700;
  color: #1A2B4A;
  margin-bottom: 8rpx;
}

.user-id {
  font-size: 24rpx;
  color: #6B7A99;
}

.stats-row {
  display: flex;
  gap: 1px;
  margin: 0 24rpx 24rpx;
  background: #FFFFFF;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(26,43,74,.06);
}

.stat-item {
  flex: 1;
  text-align: center;
  padding: 28rpx 16rpx;
  cursor: pointer;
}

.stat-item:active {
  background: #F8FAFE;
}

.stat-num {
  font-size: 40rpx;
  font-weight: 700;
  color: #2196F3;
  display: block;
}

.stat-label {
  font-size: 22rpx;
  color: #6B7A99;
  margin-top: 4rpx;
}

.menu-section {
  margin: 0 24rpx 24rpx;
  background: #FFFFFF;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(26,43,74,.06);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 28rpx 24rpx;
  border-bottom: 1rpx solid #F1F5F9;
  cursor: pointer;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background: #F8FAFE;
}

.menu-icon {
  width: 56rpx;
  height: 56rpx;
  border-radius: 14rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  margin-right: 20rpx;
}

.menu-text {
  flex: 1;
  font-size: 28rpx;
  font-weight: 500;
  color: #1A2B4A;
}

.menu-status {
  margin-right: 12rpx;
}

.status-text {
  font-size: 22rpx;
  color: #94A3B8;
}

.menu-arrow {
  font-size: 28rpx;
  color: #94A3B8;
}

.logout-section {
  margin: 0 24rpx;
}

.logout-btn {
  width: 100%;
  height: 88rpx;
  border-radius: 16rpx;
  background: #FFFFFF;
  border: 2rpx solid #F44336;
  color: #F44336;
  font-size: 28rpx;
  font-weight: 600;
}

.logout-btn:active {
  background: #FFEBEE;
}
</style>