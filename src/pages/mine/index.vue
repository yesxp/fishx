<template>
  <view class="container">
    <!-- iOS 大标题头部 -->
    <view class="header">
      <text class="header-title">我的</text>
    </view>

    <scroll-view scroll-y class="content">
      <!-- 个人信息卡片 -->
      <view class="profile-card">
        <view class="avatar" @click="handleAvatarClick">
          <text class="avatar-text">{{ userInfo?.nickname?.[0] || '?' }}</text>
        </view>
        <view class="profile-info">
          <text class="nickname">{{ userInfo?.nickname || '点击登录' }}</text>
          <text class="user-id" v-if="userInfo?.id">ID: {{ userInfo.id }}</text>
        </view>
      </view>

      <!-- 统计行 -->
      <view class="stats-list">
        <view class="stats-row">
          <view class="stat-item" @click="goToMyCatch">
            <text class="stat-num">{{ myCatchCount }}</text>
            <text class="stat-label">总渔获</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item">
            <text class="stat-num">{{ mySpotCount }}</text>
            <text class="stat-label">钓点</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item">
            <text class="stat-num">{{ topFish }}</text>
            <text class="stat-label">最常钓</text>
          </view>
        </view>
      </view>

      <!-- 功能列表：iOS Inset Grouped Style -->
      <view class="list-section">
        <view class="list-group">
          <view class="list-item" @click="goToMyCatch">
            <text class="item-label">我的渔获</text>
            <text class="item-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </text>
          </view>
          <view class="list-divider"></view>
          <view class="list-item" @click="goToMySpot">
            <text class="item-label">我的钓点</text>
            <text class="item-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </text>
          </view>
          <view class="list-divider"></view>
          <view class="list-item" @click="goToCollection">
            <text class="item-label">收藏</text>
            <text class="item-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </text>
          </view>
        </view>
      </view>

      <!-- 设置列表 -->
      <view class="list-section">
        <view class="list-group">
          <view class="list-item" @click="handleLocationAuth">
            <text class="item-label">定位授权</text>
            <view class="item-right">
              <text class="item-status">{{ locationAuth ? '已授权' : '未授权' }}</text>
              <text class="item-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </text>
            </view>
          </view>
          <view class="list-divider"></view>
          <view class="list-item" @click="handleNotification">
            <text class="item-label">通知设置</text>
            <text class="item-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </text>
          </view>
          <view class="list-divider"></view>
          <view class="list-item" @click="handleClearCache">
            <text class="item-label">清除缓存</text>
            <view class="item-right">
              <text class="item-status">{{ cacheSize }}</text>
              <text class="item-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </text>
            </view>
          </view>
          <view class="list-divider"></view>
          <view class="list-item" @click="goToAbout">
            <text class="item-label">关于鱼渔娱</text>
            <text class="item-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </text>
          </view>
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

const myCatchCount = computed(() => catchList.value.length)
const mySpotCount = ref(8)
const topFish = ref('鲫鱼')
const locationAuth = ref(false)
const cacheSize = ref('2.3MB')

function handleAvatarClick() {
  if (!isLoggedIn) {
    uni.navigateTo({ url: '/pages/login/index' })
  }
}

function goToMyCatch() {
  uni.showToast({ title: '我的渔获页面开发中', icon: 'none' })
}

function goToMySpot() {
  uni.showToast({ title: '我的钓点页面开发中', icon: 'none' })
}

function goToCollection() {
  uni.showToast({ title: '收藏页面开发中', icon: 'none' })
}

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

function handleNotification() {
  uni.showToast({ title: '通知设置开发中', icon: 'none' })
}

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

function goToAbout() {
  uni.showToast({ title: '关于页面开发中', icon: 'none' })
}

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

onMounted(() => {
  uni.getSetting({
    success: (res) => {
      locationAuth.value = !!res.authSetting['scope.userLocation']
    }
  })
  catchStore.loadList(true)
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

.header-title {
  font-size: 60rpx;
  font-weight: 700;
  color: #000000;
  letter-spacing: -0.5rpx;
}

.content {
  flex: 1;
}

/* === 个人信息 === */
.profile-card {
  display: flex;
  align-items: center;
  gap: 20rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx 20rpx;
  margin: 16rpx 20rpx;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: #007AFF;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  font-size: 40rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.nickname {
  font-size: 34rpx;
  font-weight: 600;
  color: #000000;
}

.user-id {
  font-size: 24rpx;
  color: #8E8E93;
}

/* === 统计行 === */
.stats-list {
  background: #FFFFFF;
  border-radius: 16rpx;
  margin: 0 20rpx 16rpx;
  overflow: hidden;
}

.stats-row {
  display: flex;
  align-items: center;
}

.stat-item {
  flex: 1;
  text-align: center;
  padding: 24rpx 16rpx;
}

.stat-num {
  font-size: 40rpx;
  font-weight: 700;
  color: #007AFF;
  display: block;
}

.stat-label {
  font-size: 22rpx;
  color: #8E8E93;
  margin-top: 4rpx;
  display: block;
}

.stat-divider {
  width: 0.5px;
  height: 60rpx;
  background: #C6C6C8;
}

/* === 列表组 === */
.list-section {
  margin: 0 20rpx 16rpx;
}

.list-group {
  background: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
}

.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 20rpx;
}

.item-label {
  font-size: 30rpx;
  color: #000000;
}

.item-right {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.item-status {
  font-size: 26rpx;
  color: #8E8E93;
}

.item-arrow {
  width: 24rpx;
  height: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.item-arrow svg {
  width: 24rpx;
  height: 24rpx;
}

.list-divider {
  height: 0.5px;
  background: #C6C6C8;
  margin-left: 20rpx;
}

/* === 退出登录 === */
.logout-section {
  margin: 0 20rpx;
}

.logout-btn {
  width: 100%;
  height: 88rpx;
  border-radius: 16rpx;
  background: #FFFFFF;
  color: #FF3B30;
  font-size: 30rpx;
  font-weight: 500;
  border: none;
}

.logout-btn:active {
  background: #F2F2F7;
}
</style>
