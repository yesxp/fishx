<template>
  <view class="container">
    <view class="header">
      <view class="header-left">
        <view class="logo">📍</view>
        <view class="info">
          <text class="title">钓点</text>
          <text class="subtitle">发现附近钓点</text>
        </view>
      </view>
      <view class="header-right">
        <button class="btn-locate" @click="locate">📍</button>
        <button class="btn-camera" @click="goToCreate">📷</button>
      </view>
    </view>
    
    <!-- 搜索栏 -->
    <view class="search-bar">
      <input 
        class="search-input" 
        v-model="keyword"
        placeholder="🔍 搜索钓点..."
      />
      <button class="search-btn" @click="handleSearch">搜索</button>
    </view>
    
    <!-- 地图区域 -->
    <view class="map-container">
      <!-- 模拟地图 -->
      <view class="map-placeholder">
        <view class="map-grid"></view>
        
        <!-- 钓点标记 -->
        <view 
          class="map-marker" 
          v-for="spot in spotList" 
          :key="spot.id"
          :style="{ left: getMarkerX(spot) + '%', top: getMarkerY(spot) + '%' }"
          @click="showSpotCard(spot)"
        >
          <view class="marker-dot" :class="{ active: selectedSpot?.id === spot.id }">
            <text class="marker-emoji">🎣</text>
          </view>
          <text class="marker-name">{{ spot.name }}</text>
        </view>
        
        <!-- 当前位置 -->
        <view class="map-center">
          <view class="center-pulse"></view>
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
  // 模拟经纬度转百分比
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

function goToCreate() {
  // TODO: 创建钓点页面
  uni.showToast({ title: '创建钓点功能开发中', icon: 'none' })
}

onMounted(() => {
  spotStore.loadList()
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
  gap: 12rpx;
}

.btn-locate, .btn-camera {
  width: 68rpx;
  height: 68rpx;
  border-radius: 20rpx;
  background: rgba(33,150,243,.08);
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.btn-camera {
  background: linear-gradient(135deg, #2196F3, #00BCD4);
  color: #fff;
}

.search-bar {
  display: flex;
  gap: 12rpx;
  padding: 16rpx 24rpx;
  background: #FFFFFF;
}

.search-input {
  flex: 1;
  height: 72rpx;
  background: #F8FAFE;
  border: 2rpx solid #E2E8F0;
  border-radius: 36rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
}

.search-btn {
  padding: 0 32rpx;
  height: 72rpx;
  border-radius: 36rpx;
  background: linear-gradient(135deg, #2196F3, #00BCD4);
  color: #fff;
  font-size: 28rpx;
  border: none;
}

.map-container {
  position: relative;
  height: calc(100vh - 200rpx);
}

.map-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #E3F2FD 0%, #B3E5FC 100%);
  position: relative;
  overflow: hidden;
}

.map-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(33,150,243,.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(33,150,243,.08) 1px, transparent 1px);
  background-size: 40rpx 40rpx;
}

.map-marker {
  position: absolute;
  transform: translate(-50%, -100%);
  cursor: pointer;
  z-index: 10;
}

.marker-dot {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: #FFFFFF;
  border: 4rpx solid #2196F3;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,.15);
  transition: all .2s;
}

.marker-dot.active {
  transform: scale(1.2);
  background: #2196F3;
}

.marker-emoji {
  font-size: 24rpx;
}

.marker-name {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20rpx;
  white-space: nowrap;
  color: #1A2B4A;
  font-weight: 600;
  text-shadow: 0 1px 4px rgba(255,255,255,.8);
  margin-top: 4rpx;
}

.map-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
}

.center-pulse {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  border: 4rpx solid #2196F3;
  animation: pulse 2s infinite;
}

.center-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background: #2196F3;
  box-shadow: 0 0 16rpx rgba(33,150,243,.4);
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0; }
}

.spot-card-wrap {
  position: absolute;
  bottom: 120rpx;
  left: 24rpx;
  right: 24rpx;
  z-index: 20;
  animation: slideUp .3s ease;
}

@keyframes slideUp {
  from { transform: translateY(20rpx); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>