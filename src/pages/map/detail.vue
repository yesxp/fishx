<template>
  <view class="page">
    <view class="header">
      <view class="header-left">
        <button class="btn-back" @click="goBack">
          <svg viewBox="0 0 24 24" fill="none" stroke="#060607" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
      </view>
      <text class="title">{{ spot?.name || 'Spot Detail' }}</text>
      <view class="header-right">
        <button class="btn-share" @click="handleShare">Share</button>
      </view>
    </view>

    <scroll-view scroll-y class="scroll-content">
      <!-- Hero -->
      <view class="dc-card spot-hero">
        <text class="hero-icon">📍</text>
        <text class="hero-name">{{ spot?.name }}</text>
        <text class="hero-type">{{ spot?.type }}</text>
        <view class="hero-stats">
          <view class="stat-col">
            <text class="stat-num">{{ spot?.rating }}</text>
            <text class="stat-label">Rating</text>
          </view>
          <view class="stat-col">
            <text class="stat-num">{{ spot?.catchCount }}</text>
            <text class="stat-label">Catches</text>
          </view>
          <view class="stat-col">
            <text class="stat-num">{{ spot?.distance || '--' }}</text>
            <text class="stat-label">Distance</text>
          </view>
        </view>
      </view>

      <!-- Fish species -->
      <view class="dc-card section-card">
        <text class="card-title">Species Found</text>
        <view class="fish-tags">
          <view class="fish-tag" v-for="fish in spot?.fishTypes" :key="fish">
            <text class="tag-name">{{ fish }}</text>
          </view>
        </view>
      </view>

      <!-- Actions -->
      <view class="action-section">
        <button class="action-btn primary" @click="handleNavigate">
          <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
          <text class="btn-label">Navigate</text>
        </button>
        <button class="action-btn secondary" @click="handleCheckIn">
          <svg viewBox="0 0 24 24" fill="none" stroke="#4E5058" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <text class="btn-label">Check In</text>
        </button>
      </view>

      <!-- Nearby catches -->
      <view class="section-header-wrap">
        <text class="section-title">Catches Here</text>
      </view>
      <view class="recent-list">
        <view class="recent-item" v-for="i in 4" :key="i">
          <view class="recent-photo" :style="{ background: fishColors[i % 4] }">
            <text class="recent-emoji">{{ fishEmojis[i % 4] }}</text>
          </view>
          <view class="recent-info">
            <text class="recent-fish">{{ fishNames[i % 4] }}</text>
            <text class="recent-time">{{ i }}h ago</text>
          </view>
        </view>
      </view>

      <view class="spacer"></view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSpotStore } from '@/stores/spot'
import { checkIn } from '@/api/spot'

const spotStore = useSpotStore()
const spot = ref<any>(null)

const fishNames = ['Crucian', 'Carp', 'Bass', 'Grass Carp']
const fishEmojis = ['🐟', '🐠', '🎣', '🐡']
const fishColors = ['#F2F3F5', '#E8F5E9', '#FFF3E0', '#E3E5E8']

const pages = getCurrentPages()
const currentPage = pages[pages.length - 1] as any
const spotId = currentPage?.options?.id || '1'

function goBack() {
  uni.navigateBack()
}

function handleNavigate() {
  if (spot.value) {
    uni.openLocation({
      latitude: spot.value.lat,
      longitude: spot.value.lng,
      name: spot.value.name,
      address: spot.value.type
    })
  }
}

async function handleCheckIn() {
  const res = await checkIn(spotId)
  if (res.code === 0) {
    uni.showToast({ title: 'Checked in', icon: 'success' })
  }
}

function handleShare() {
  uni.setClipboardData({
    data: window.location.href,
    success: () => uni.showToast({ title: 'Copied', icon: 'success' })
  })
}

onMounted(async () => {
  const data = await spotStore.loadDetail(spotId)
  spot.value = data
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #F2F3F5;
  display: flex;
  flex-direction: column;
}

/* ===== Header ===== */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 16rpx;
  background: #FFFFFF;
  border-bottom: 1rpx solid #E3E5E8;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
}

.btn-back {
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.btn-back:active {
  background: rgba(79,84,92,0.08);
}
.btn-back svg {
  width: 24rpx;
  height: 24rpx;
}

.title {
  font-size: 30rpx;
  font-weight: 700;
  color: #060607;
  max-width: 400rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-right {
  display: flex;
  align-items: center;
}

.btn-share {
  padding: 10rpx 24rpx;
  border-radius: 9999px;
  background: transparent;
  color: #5865F2;
  font-size: 26rpx;
  font-weight: 600;
  border: none;
  height: auto;
  line-height: 1.4;
  transition: background 0.15s;
}
.btn-share:active {
  background: rgba(88,101,242,0.08);
}

/* ===== Scroll ===== */
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

/* ===== Hero ===== */
.spot-hero {
  text-align: center;
  padding: 48rpx 24rpx;
}

.hero-icon {
  font-size: 56rpx;
  display: block;
  margin-bottom: 12rpx;
}

.hero-name {
  font-size: 36rpx;
  font-weight: 700;
  color: #060607;
  display: block;
}

.hero-type {
  font-size: 24rpx;
  color: #4E5058;
  margin-top: 4rpx;
  display: block;
}

.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24rpx;
  margin-top: 28rpx;
  padding-top: 24rpx;
  border-top: 1rpx solid #E3E5E8;
}

.stat-col {
  text-align: center;
}

.stat-num {
  font-size: 32rpx;
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

/* ===== Section card ===== */
.section-card {
  padding: 24rpx;
}

.card-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #060607;
  margin-bottom: 16rpx;
  display: block;
}

.fish-tags {
  display: flex;
  gap: 8rpx;
  flex-wrap: wrap;
}

.fish-tag {
  padding: 4rpx 16rpx;
  border-radius: 9999px;
  background: rgba(88,101,242,0.08);
}

.tag-name {
  font-size: 24rpx;
  color: #5865F2;
  font-weight: 500;
}

/* ===== Actions ===== */
.action-section {
  display: flex;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.action-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 9999px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  font-size: 26rpx;
  font-weight: 600;
}

.action-btn.primary {
  background: #5865F2;
  color: #FFFFFF;
  transition: background 0.15s;
}
.action-btn.primary:active {
  background: #4752C4;
}

.action-btn.secondary {
  background: #E3E5E8;
  color: #060607;
  transition: background 0.15s;
}
.action-btn.secondary:active {
  background: #DCDDDE;
}

.btn-label {
  font-size: 26rpx;
  font-weight: 600;
}

/* ===== Section header ===== */
.section-header-wrap {
  padding-bottom: 12rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #060607;
}

/* ===== Recent list ===== */
.recent-list {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
}

.recent-photo {
  width: 80rpx;
  height: 80rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.recent-emoji {
  font-size: 32rpx;
}

.recent-info {
  flex: 1;
}

.recent-fish {
  font-size: 28rpx;
  font-weight: 600;
  color: #060607;
}

.recent-time {
  font-size: 22rpx;
  color: #80848E;
}

.spacer {
  height: 40rpx;
}
</style>
