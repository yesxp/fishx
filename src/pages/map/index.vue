<template>
  <view class="page">
    <view class="topbar">
      <view class="topbar-inner">
        <text class="brand-name">钓点</text>
        <view class="topbar-status">
          <text class="status-sub">Nearby Spots</text>
        </view>
        <view class="topbar-actions">
          <view class="icon-btn" @click="locate">
            <svg viewBox="0 0 24 24" fill="none" stroke="#5865F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
          </view>
        </view>
      </view>
    </view>

    <!-- Search bar: Discord input style -->
    <view class="search-bar">
      <view class="search-wrap">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input class="search-input" v-model="keyword" placeholder="Search spots..." @confirm="handleSearch" />
      </view>
    </view>

    <!-- Map -->
    <view class="map-container">
      <view class="map-viewport">
        <view class="map-grid"></view>
        <view
          class="map-marker"
          v-for="spot in spotList"
          :key="spot.id"
          :style="{ left: getMarkerX(spot) + '%', top: getMarkerY(spot) + '%' }"
          @click="selectedSpot = spot"
        >
          <view class="marker-pin" :class="{ selected: selectedSpot?.id === spot.id }"></view>
        </view>
        <view class="map-center">
          <view class="center-dot"></view>
        </view>
      </view>

      <!-- Floating spot card -->
      <view class="spot-float" v-if="selectedSpot">
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

function handleSearch() {
  if (!keyword.value) { spotStore.loadList(); return }
  spotStore.spotList = spotList.filter(s => s.name.includes(keyword.value) || s.type.includes(keyword.value))
}

function locate() {
  uni.getLocation({
    type: 'wgs84',
    success: (res) => {
      uni.showToast({ title: `${res.latitude.toFixed(2)}, ${res.longitude.toFixed(2)}`, icon: 'none' })
    }
  })
}

onMounted(() => { spotStore.loadList() })
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
  justify-content: space-between;
}

.brand-name {
  font-size: 32rpx;
  font-weight: 700;
  color: #060607;
}

.topbar-status {
  display: flex;
  align-items: center;
}

.status-sub {
  font-size: 22rpx;
  color: #4E5058;
}

.icon-btn {
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  background: rgba(88,101,242,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.icon-btn:active {
  background: rgba(88,101,242,0.16);
}
.icon-btn svg {
  width: 24rpx;
  height: 24rpx;
}

/* ===== Search ===== */
.search-bar {
  padding: 12rpx 20rpx;
  background: #FFFFFF;
  border-bottom: 1rpx solid #E3E5E8;
}

.search-wrap {
  display: flex;
  align-items: center;
  gap: 10rpx;
  background: #E3E5E8;
  border-radius: 8rpx;
  padding: 14rpx 20rpx;
}

.search-icon {
  width: 22rpx;
  height: 22rpx;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #060607;
  background: transparent;
  border: none;
}

.search-input::placeholder {
  color: #80848E;
}

/* ===== Map ===== */
.map-container {
  flex: 1;
  position: relative;
}

.map-viewport {
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
  z-index: 10;
}

.marker-pin {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  background: #FFFFFF;
  border: 3rpx solid #5865F2;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  transition: all 0.15s;
}
.marker-pin.selected {
  background: #5865F2;
  transform: scale(1.15);
}

.map-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
}

.center-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #5865F2;
  box-shadow: 0 0 0 6rpx rgba(88,101,242,0.2);
}

/* ===== Floating spot card ===== */
.spot-float {
  position: absolute;
  bottom: 100rpx;
  left: 20rpx;
  right: 20rpx;
  z-index: 20;
}
</style>
