<template>
  <view class="container">
    <view class="header">
      <text class="header-title">我的</text>
    </view>

    <scroll-view scroll-y class="content">
      <!-- 个人信息 -->
      <view class="card profile-card">
        <view class="avatar" @click="handleAvatarClick">
          <text class="avatar-text">{{ userInfo?.nickname?.[0] || '?' }}</text>
        </view>
        <view class="profile-info">
          <text class="nickname">{{ userInfo?.nickname || '点击登录' }}</text>
          <text class="user-id" v-if="userInfo?.id">ID: {{ userInfo.id }}</text>
        </view>
      </view>

      <!-- 统计 -->
      <view class="card stats-card">
        <view class="stats-row">
          <view class="stat-item" @click="goToMyCatch">
            <text class="stat-num">{{ myCatchCount }}</text>
            <text class="stat-label">总渔获</text>
          </view>
          <view class="stat-sep"></view>
          <view class="stat-item">
            <text class="stat-num">{{ mySpotCount }}</text>
            <text class="stat-label">钓点</text>
          </view>
          <view class="stat-sep"></view>
          <view class="stat-item">
            <text class="stat-num">{{ topFish }}</text>
            <text class="stat-label">最常钓</text>
          </view>
        </view>
      </view>

      <!-- 功能列表 -->
      <view class="card list-card">
        <view class="list-item" @click="goToMyCatch">
          <text class="item-label">我的渔获</text>
          <svg class="item-arrow" viewBox="0 0 24 24" fill="none" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </view>
        <view class="list-sep"></view>
        <view class="list-item" @click="goToMySpot">
          <text class="item-label">我的钓点</text>
          <svg class="item-arrow" viewBox="0 0 24 24" fill="none" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </view>
        <view class="list-sep"></view>
        <view class="list-item" @click="goToCollection">
          <text class="item-label">收藏</text>
          <svg class="item-arrow" viewBox="0 0 24 24" fill="none" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </view>
      </view>

      <!-- 设置 -->
      <view class="card list-card">
        <view class="list-item" @click="handleLocationAuth">
          <text class="item-label">定位授权</text>
          <view class="item-right">
            <text class="item-status">{{ locationAuth ? '已授权' : '未授权' }}</text>
            <svg class="item-arrow" viewBox="0 0 24 24" fill="none" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </view>
        </view>
        <view class="list-sep"></view>
        <view class="list-item" @click="handleNotification">
          <text class="item-label">通知设置</text>
          <svg class="item-arrow" viewBox="0 0 24 24" fill="none" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </view>
        <view class="list-sep"></view>
        <view class="list-item" @click="handleClearCache">
          <text class="item-label">清除缓存</text>
          <view class="item-right">
            <text class="item-status">{{ cacheSize }}</text>
            <svg class="item-arrow" viewBox="0 0 24 24" fill="none" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </view>
        </view>
        <view class="list-sep"></view>
        <view class="list-item" @click="goToAbout">
          <text class="item-label">关于鱼渔娱</text>
          <svg class="item-arrow" viewBox="0 0 24 24" fill="none" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </view>
      </view>

      <!-- 退出 -->
      <view class="logout-wrap" v-if="isLoggedIn">
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
  if (!isLoggedIn) uni.navigateTo({ url: '/pages/login/index' })
}
function goToMyCatch() { uni.showToast({ title: '开发中', icon: 'none' }) }
function goToMySpot() { uni.showToast({ title: '开发中', icon: 'none' }) }
function goToCollection() { uni.showToast({ title: '开发中', icon: 'none' }) }
function handleLocationAuth() {
  uni.authorize({
    scope: 'scope.userLocation',
    success: () => { locationAuth.value = true; uni.showToast({ title: '已授权', icon: 'success' }) },
    fail: () => { locationAuth.value = false; uni.showToast({ title: '请在设置中授权', icon: 'none' }) }
  })
}
function handleNotification() { uni.showToast({ title: '开发中', icon: 'none' }) }
function handleClearCache() {
  uni.showModal({
    title: '清除缓存', content: '确定？',
    success: (res) => { if (res.confirm) { uni.clearStorageSync(); cacheSize.value = '0B'; uni.showToast({ title: '已清除', icon: 'success' }) } }
  })
}
function goToAbout() { uni.showToast({ title: '开发中', icon: 'none' }) }
function handleLogout() {
  uni.showModal({
    title: '退出登录', content: '确定？',
    success: (res) => { if (res.confirm) { userStore.logout(); uni.reLaunch({ url: '/pages/index/index' }) } }
  })
}

onMounted(() => {
  uni.getSetting({ success: (res) => { locationAuth.value = !!res.authSetting['scope.userLocation'] } })
  catchStore.loadList(true)
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #F2F3F5;
}

.header {
  background: #FFFFFF;
  padding: 20rpx 24rpx 16rpx;
  border-bottom: 1px solid rgba(79,84,92,0.12);
}

.header-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #313338;
}

.content { flex: 1; }

/* === 卡片 === */
.card {
  background: #FFFFFF;
  border-radius: 12rpx;
  margin: 12rpx 20rpx;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
}

/* === 个人信息 === */
.profile-card {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx;
}

.avatar {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  background: #5865F2;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  font-size: 36rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 2rpx;
}

.nickname {
  font-size: 32rpx;
  font-weight: 600;
  color: #313338;
}

.user-id {
  font-size: 22rpx;
  color: #80848E;
}

/* === 统计 === */
.stats-card {
  padding: 0;
  overflow: hidden;
}

.stats-row {
  display: flex;
  align-items: center;
}

.stat-item {
  flex: 1;
  text-align: center;
  padding: 20rpx 16rpx;
}

.stat-num {
  font-size: 36rpx;
  font-weight: 700;
  color: #5865F2;
  display: block;
}

.stat-label {
  font-size: 20rpx;
  color: #80848E;
  margin-top: 4rpx;
  display: block;
}

.stat-sep {
  width: 1px;
  height: 48rpx;
  background: rgba(79,84,92,0.12);
}

/* === 列表 === */
.list-card {
  padding: 0;
  overflow: hidden;
}

.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
}

.list-item:active {
  background: rgba(79,84,92,0.06);
}

.item-label {
  font-size: 28rpx;
  color: #313338;
}

.item-right {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.item-status {
  font-size: 24rpx;
  color: #80848E;
}

.item-arrow {
  width: 20rpx;
  height: 20rpx;
  flex-shrink: 0;
}

.list-sep {
  height: 1px;
  background: rgba(79,84,92,0.08);
  margin-left: 20rpx;
}

/* === 退出 === */
.logout-wrap {
  margin: 12rpx 20rpx;
}

.logout-btn {
  width: 100%;
  height: 80rpx;
  border-radius: 12rpx;
  background: #FFFFFF;
  color: #F23F43;
  font-size: 28rpx;
  font-weight: 500;
  border: none;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
}
.logout-btn:active {
  background: #F2F3F5;
}
</style>
