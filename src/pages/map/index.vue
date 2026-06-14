<template>
  <view class="container">
    <!-- iOS 大标题头部 -->
    <view class="header">
      <view class="header-top">
        <view class="location">
          <text class="location-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
          </text>
          <text class="location-text">定位中...</text>
        </view>
        <view class="header-actions">
          <view class="action-btn" @click="locate">
            <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>
          </view>
        </view>
      </view>
      <text class="header-title">钓点</text>
    </view>

    <!-- 搜索栏：iOS 风格 -->
    <view class="search-bar">
      <view class="search-wrap">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input class="search-input" v-model="keyword" placeholder="搜索钓点" />
      </view>
    </view>

    <!-- 地图区域 -->
    <view class="map-container">
      <view class="map-placeholder">
        <view class="map-grid"></view>
        <view
          class="map-marker"
          v-for="spot in spotList"
          :key="spot.id"
          :style="{ left: getMarkerX(spot) + '%', top: getMarkerY(spot) + '%' }"
          @click="showSpotCard(spot)"
        >
          <view class="marker-dot" :class="{ active: selectedSpot?.id === spot.id }"></view>
          <text class="marker-name">{{ spot.name }}</text>
        </view>
        <view class="map-center">
          <view class="center-dot"></view>
        </view>
      </view>

      <!-- 钓点卡片 -->
      <view class="spot-card-wrap" v-if="selectedSpot">
        <SpotCard
          :id="selectedSpot.id"
          :name="selectedSpot.name"
          :type="selectedSpot.type"
          :rating="selectedSpot.rating"
          :catchCount="selectedSpot.catchCount"
          :fishTypes="selectedSpot.fishTypes"
        />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSpotStore } from '@/stores/spot'
import SpotCard from '@/components/SpotCard.vue'

const spotStore = useSpotStore()
const { spotList } = storeToRefs(spotStore)

const keyword = ref('')
const selectedSpot = ref<any>(null)

function getMarkerX(spot: any) {
  return 20 + (spot.lng - 120.9) * 50
}

function getMarkerY(spot: any) {
  return 20 + (31.5 - spot.lat) * 80
}

function showSpotCard(spot: any) {
  selectedSpot.value = spot
}

function locate() {
  uni.getLocation({
    type: 'wgs84',
    success: (res) => {
      uni.showToast({
        title: `当前位置: ${res.latitude.toFixed(2)}, ${res.longitude.toFixed(2)}`,
        icon: 'none'
      })
    }
  })
}

function handleSearch() {
  if (!keyword.value) {
    spotStore.loadList()
    return
  }
  const filtered = spotList.filter(s =>
    s.name.includes(keyword.value) ||
    s.type.includes(keyword.value)
  )
  spotStore.spotList = filtered
}

onMounted(() => {
  spotStore.loadList()
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #F2F2F7;
  display: flex;
  flex-direction: column;
}

/* === iOS 大标题头部 === */
.header {
  background: #FFFFFF;
  padding: 12rpx 20rpx 20rpx;
  border-bottom: 0.5px solid #C6C6C8;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.location {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.location-icon {
  width: 28rpx;
  height: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.location-icon svg {
  width: 28rpx;
  height: 28rpx;
}

.location-text {
  font-size: 26rpx;
  color: #007AFF;
  font-weight: 500;
}

.header-actions {
  display: flex;
  align-items: center;
}

.action-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: #F2F2F7;
  display: flex;
  align-items: center;
  justify-content: center;
}
.action-btn svg {
  width: 32rpx;
  height: 32rpx;
}

.header-title {
  font-size: 60rpx;
  font-weight: 700;
  color: #000000;
  letter-spacing: -0.5rpx;
}

/* === 搜索栏 === */
.search-bar {
  padding: 12rpx 20rpx;
  background: #FFFFFF;
  border-bottom: 0.5px solid #C6C6C8;
}

.search-wrap {
  display: flex;
  align-items: center;
  gap: 12rpx;
  background: #E5E5EA;
  border-radius: 12rpx;
  padding: 16rpx 20rpx;
}

.search-icon {
  width: 28rpx;
  height: 28rpx;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  font-size: 30rpx;
  color: #000000;
}

/* === 地图 === */
.map-container {
  flex: 1;
  position: relative;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  background: #E8F5E9;
  position: relative;
  overflow: hidden;
}

.map-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
  background-size: 40rpx 40rpx;
}

.map-marker {
  position: absolute;
  transform: translate(-50%, -100%);
  cursor: pointer;
  z-index: 10;
}

.marker-dot {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: #FFFFFF;
  border: 3rpx solid #007AFF;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  transition: all .2s;
}

.marker-dot.active {
  transform: scale(1.2);
  background: #007AFF;
}

.marker-name {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20rpx;
  white-space: nowrap;
  color: #000000;
  font-weight: 500;
  margin-top: 4rpx;
  text-shadow: 0 1px 2px rgba(255,255,255,0.8);
}

.map-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
}

.center-dot {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background: #007AFF;
  box-shadow: 0 0 0 6rpx rgba(0,122,255,0.2);
}

.spot-card-wrap {
  position: absolute;
  bottom: 120rpx;
  left: 20rpx;
  right: 20rpx;
  z-index: 20;
  animation: slideUp .3s ease;
}

@keyframes slideUp {
  from { transform: translateY(20rpx); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
