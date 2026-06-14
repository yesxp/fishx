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
          <view class="avatar-status" :class="isLoggedIn ? 'online' : ''"></view>
        </view>
        <view class="profile-info">
          <text class="nickname">{{ userInfo?.nickname || 'Sign in' }}</text>
          <text class="user-id" v-if="userInfo?.id">ID: {{ userInfo.id }}</text>
        </view>
        <view class="profile-edit" @click="handleAvatarClick" v-if="isLoggedIn">
          <text class="edit-text">Edit</text>
        </view>
      </view>

      <!-- Stats: Discord inset list -->
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
  border-bottom: 1rpx solid #E3E5E8;
}

.topbar-inner {
  display: flex;
  align-items: center;
}

.brand-name {
  font-size: 32rpx;
  font-weight: 700;
  color: #060607;
}

.scroll-content {
  flex: 1;
  padding: 20rpx 20rpx 40rpx;
}

/* ===== Discord Card ===== */
.dc-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  margin-bottom: 12rpx;
}

/* ===== Profile ===== */
.profile-card {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 24rpx 20rpx;
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
  position: relative;
}

.avatar-status {
  position: absolute;
  bottom: -2rpx;
  right: -2rpx;
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background: #80848E;
  border: 3rpx solid #FFFFFF;
}
.avatar-status.online {
  background: #23A55A;
}

.avatar-text {
  font-size: 36rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.profile-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rpx;
}

.nickname {
  font-size: 32rpx;
  font-weight: 600;
  color: #060607;
}

.user-id {
  font-size: 22rpx;
  color: #80848E;
}

.profile-edit {
  padding: 8rpx 24rpx;
  border-radius: 9999px;
  background: #5865F2;
  transition: background 0.15s;
}
.profile-edit:active {
  background: #4752C4;
}

.edit-text {
  font-size: 24rpx;
  font-weight: 600;
  color: #FFFFFF;
}

/* ===== Stats ===== */
.stats-list {
  overflow: hidden;
  padding: 0;
}

.stats-list .list-row {
  flex: 1;
  text-align: center;
  padding: 24rpx 16rpx;
}

.stat-value {
  font-size: 36rpx;
  font-weight: 700;
  color: #5865F2;
  display: block;
  font-variant-numeric: tabular-nums;
}

.stat-label {
  font-size: 22rpx;
  color: #80848E;
  margin-top: 4rpx;
  display: block;
  font-weight: 500;
}

.stat-sep {
  width: 1px;
  height: 48rpx;
  background: #E3E5E8;
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
  padding: 18rpx 24rpx;
  transition: background 0.15s;
}
.list-item:active {
  background: rgba(79,84,92,0.04);
}

.item-label {
  font-size: 26rpx;
  color: #060607;
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
  background: #E3E5E8;
  margin-left: 24rpx;
}

/* ===== Danger zone ===== */
.danger-zone {
  margin-top: 12rpx;
}

.danger-btn {
  width: 100%;
  height: 80rpx;
  border-radius: 9999px;
  background: #FFFFFF;
  color: #F23F43;
  font-size: 26rpx;
  font-weight: 600;
  border: none;
  box-shadow: none;
  transition: background 0.15s;
}
.danger-btn:active {
  background: #F2F3F5;
}

.spacer {
  height: 40rpx;
}
</style>
