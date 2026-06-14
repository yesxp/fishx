<template>
  <view class="page">
    <view class="topbar">
      <view class="topbar-inner">
        <text class="brand-name">我的</text>
      </view>
    </view>

    <scroll-view scroll-y class="scroll-content">
      <!-- Profile card -->
      <view class="dc-card profile-card">
        <view class="avatar" @click="handleAvatarClick">
          <text class="avatar-text">{{ userInfo?.nickname?.[0] || '?' }}</text>
        </view>
        <view class="profile-info">
          <text class="nickname">{{ userInfo?.nickname || 'Sign in' }}</text>
          <text class="user-id" v-if="userInfo?.id">ID: {{ userInfo.id }}</text>
        </view>
      </view>

      <!-- Stats: Discord inset list, no card bg -->
      <view class="dc-card stats-list">
        <view class="list-row" @click="goToMyCatch">
          <text class="stat-value">{{ myCatchCount }}</text>
          <text class="stat-label">Total Catches</text>
        </view>
        <view class="stat-sep"></view>
        <view class="list-row">
          <text class="stat-value">{{ mySpotCount }}</text>
          <text class="stat-label">Spots</text>
        </view>
        <view class="stat-sep"></view>
        <view class="list-row">
          <text class="stat-value">{{ topFish }}</text>
          <text class="stat-label">Top Fish</text>
        </view>
      </view>

      <!-- Feature list: Discord setting-style list -->
      <view class="dc-card settings-list">
        <view class="list-item" @click="goToMyCatch">
          <text class="item-label">My Catches</text>
          <svg class="item-arrow" viewBox="0 0 24 24" fill="none" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </view>
        <view class="list-sep"></view>
        <view class="list-item" @click="goToMySpot">
          <text class="item-label">My Spots</text>
          <svg class="item-arrow" viewBox="0 0 24 24" fill="none" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </view>
        <view class="list-sep"></view>
        <view class="list-item" @click="goToCollection">
          <text class="item-label">Favorites</text>
          <svg class="item-arrow" viewBox="0 0 24 24" fill="none" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </view>
      </view>

      <!-- Settings list -->
      <view class="dc-card settings-list">
        <view class="list-item" @click="handleLocationAuth">
          <text class="item-label">Location Access</text>
          <view class="item-right">
            <text class="item-status">{{ locationAuth ? 'Granted' : 'Denied' }}</text>
            <svg class="item-arrow" viewBox="0 0 24 24" fill="none" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </view>
        </view>
        <view class="list-sep"></view>
        <view class="list-item" @click="handleNotification">
          <text class="item-label">Notifications</text>
          <svg class="item-arrow" viewBox="0 0 24 24" fill="none" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </view>
        <view class="list-sep"></view>
        <view class="list-item" @click="handleClearCache">
          <text class="item-label">Clear Cache</text>
          <view class="item-right">
            <text class="item-status">{{ cacheSize }}</text>
            <svg class="item-arrow" viewBox="0 0 24 24" fill="none" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </view>
        </view>
        <view class="list-sep"></view>
        <view class="list-item" @click="goToAbout">
          <text class="item-label">About</text>
          <svg class="item-arrow" viewBox="0 0 24 24" fill="none" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </view>
      </view>

      <!-- Danger zone: logout -->
      <view class="danger-zone" v-if="isLoggedIn">
        <button class="danger-btn" @click="handleLogout">Sign Out</button>
      </view>

      <view class="spacer"></view>
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
const topFish = ref('Crucian')
const locationAuth = ref(false)
const cacheSize = ref('2.3MB')

function handleAvatarClick() {
  if (!isLoggedIn) uni.navigateTo({ url: '/pages/login/index' })
}
function goToMyCatch() { uni.showToast({ title: 'Coming soon', icon: 'none' }) }
function goToMySpot() { uni.showToast({ title: 'Coming soon', icon: 'none' }) }
function goToCollection() { uni.showToast({ title: 'Coming soon', icon: 'none' }) }
function handleLocationAuth() {
  uni.authorize({
    scope: 'scope.userLocation',
    success: () => { locationAuth.value = true; uni.showToast({ title: 'Granted', icon: 'success' }) },
    fail: () => { locationAuth.value = false; uni.showToast({ title: 'Deny in settings', icon: 'none' }) }
  })
}
function handleNotification() { uni.showToast({ title: 'Coming soon', icon: 'none' }) }
function handleClearCache() {
  uni.showModal({
    title: 'Clear Cache', content: 'Are you sure?',
    success: (res) => { if (res.confirm) { uni.clearStorageSync(); cacheSize.value = '0B'; uni.showToast({ title: 'Cleared', icon: 'success' }) } }
  })
}
function goToAbout() { uni.showToast({ title: 'Coming soon', icon: 'none' }) }
function handleLogout() {
  uni.showModal({
    title: 'Sign Out', content: 'Are you sure?',
    success: (res) => { if (res.confirm) { userStore.logout(); uni.reLaunch({ url: '/pages/index/index' }) } }
  })
}

onMounted(() => {
  uni.getSetting({ success: (res) => { locationAuth.value = !!res.authSetting['scope.userLocation'] } })
  catchStore.loadList(true)
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #F2F3F5;
  display: flex;
  flex-direction: column;
}

/* ===== Top Bar ===== */
.topbar {
  background: #FFFFFF;
  padding: 16rpx 24rpx;
  border-bottom: 2rpx solid rgba(79,84,92,0.12);
}

.topbar-inner {
  display: flex;
  align-items: center;
}

.brand-name {
  font-size: 32rpx;
  font-weight: 700;
  color: #313338;
}

.scroll-content {
  flex: 1;
}

/* ===== Discord Card ===== */
.dc-card {
  background: #FFFFFF;
  border-radius: 8rpx;
  margin: 12rpx 20rpx;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
}

/* ===== Profile ===== */
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
  box-shadow: 0 0 0 2rpx rgba(88,101,242,0.2);
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

/* ===== Stats ===== */
.stats-list {
  overflow: hidden;
  padding: 0;
}

.stats-list .list-row {
  flex: 1;
  text-align: center;
  padding: 20rpx 16rpx;
}

.stat-value {
  font-size: 36rpx;
  font-weight: 700;
  color: #5865F2;
  display: block;
  font-variant-numeric: tabular-nums;
}

.stat-label {
  font-size: 20rpx;
  color: #80848E;
  margin-top: 2rpx;
  display: block;
}

.stat-sep {
  width: 1px;
  height: 48rpx;
  background: rgba(79,84,92,0.12);
  align-self: center;
}

/* ===== Settings list ===== */
.settings-list {
  overflow: hidden;
  padding: 0;
}

.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 20rpx;
  transition: background 0.15s;
}
.list-item:active {
  background: rgba(79,84,92,0.06);
}

.item-label {
  font-size: 28rpx;
  color: #313338;
  font-weight: 500;
}

.item-right {
  display: flex;
  align-items: center;
  gap: 6rpx;
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

/* ===== Danger zone ===== */
.danger-zone {
  margin: 12rpx 20rpx;
}

.danger-btn {
  width: 100%;
  height: 80rpx;
  border-radius: 8rpx;
  background: #FFFFFF;
  color: #F23F43;
  font-size: 28rpx;
  font-weight: 500;
  border: none;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
  transition: background 0.15s;
}
.danger-btn:active {
  background: #F2F3F5;
}

.spacer {
  height: 40rpx;
}
</style>
