<template>
  <view class="container">
    <view class="header">
      <view class="header-row">
        <text class="header-title">钓点</text>
        <view class="header-actions">
          <view class="action-btn" @click="locate">
            <svg viewBox="0 0 24 24" fill="none" stroke="#5865F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>
          </view>
        </view>
      </view>
      <text class="header-sub">发现附近钓点</text>
    </view>

    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-wrap">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input class="search-input" v-model="keyword" placeholder="搜索钓点" />
      </view>
    </view>

    <!-- 地图 -->
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
      uni.showToast({ title: `${res.latitude.toFixed(2)}, ${res.longitude.toFixed(2)}`, icon: 'none' })
    }
  })
}

function handleSearch() {
  if (!keyword.value) { spotStore.loadList(); return }
  spotStore.spotList = spotList.filter(s => s.name.includes(keyword.value) || s.type.includes(keyword.value))
}

onMounted(() => { spotStore.loadList() })
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #F2F3F5;
  display: flex;
  flex-direction: column;
}

.header {
  background: #FFFFFF;
  padding: 20rpx 24rpx 16rpx;
  border-bottom: 1px solid rgba(79,84,92,0.12);
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #313338;
}

.header-sub {
  font-size: 24rpx;
  color: #5C5E66;
  margin-top: 4rpx;
}

.header-actions {
  display: flex;
  gap: 12rpx;
}

.action-btn {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: rgba(88,101,242,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}
.action-btn:active { background: rgba(88,101,242,0.16); }
.action-btn svg { width: 28rpx; height: 28rpx; }

.search-bar {
  padding: 12rpx 20rpx;
  background: #FFFFFF;
  border-bottom: 1px solid rgba(79,84,92,0.12);
}

.search-wrap {
  display: flex;
  align-items: center;
  gap: 10rpx;
  background: #F2F3F5;
  border-radius: 8rpx;
  padding: 14rpx 16rpx;
}

.search-icon { width: 24rpx; height: 24rpx; flex-shrink: 0; }

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #313338;
}

.map-container { flex: 1; position: relative; }

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
    linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
  background-size: 40rpx 40rpx;
}

.map-marker {
  position: absolute;
  transform: translate(-50%, -100%);
  cursor: pointer;
  z-index: 10;
}

.marker-dot {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  background: #FFFFFF;
  border: 3rpx solid #5865F2;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  transition: all 0.15s;
}
.marker-dot.active {
  transform: scale(1.2);
  background: #5865F2;
}

.marker-name {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 18rpx;
  white-space: nowrap;
  color: #313338;
  font-weight: 500;
  margin-top: 4rpx;
}

.map-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
}

.center-dot {
  width: 18rpx;
  height: 18rpx;
  border-radius: 50%;
  background: #5865F2;
  box-shadow: 0 0 0 6rpx rgba(88,101,242,0.2);
}

.spot-card-wrap {
  position: absolute;
  bottom: 120rpx;
  left: 20rpx;
  right: 20rpx;
  z-index: 20;
  animation: slideUp 0.2s ease;
}

@keyframes slideUp {
  from { transform: translateY(16rpx); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
