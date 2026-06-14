<template>
  <view class="weather-mini" @click="goToWeather">
    <view class="mini-left">
      <text class="mini-score" :style="{ color: color }">{{ score }}</text>
      <view class="mini-info">
        <text class="mini-label">钓鱼指数</text>
        <text class="mini-level" :style="{ color: color }">{{ level }}</text>
      </view>
    </view>
    <view class="mini-right">
      <text class="mini-text">{{ text }}</text>
      <svg class="mini-arrow" viewBox="0 0 24 24" fill="none" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
    </view>
  </view>
</template>

<script setup lang="ts">
const props = defineProps<{
  score: number
  level: string
  color: string
  text?: string
}>()

function goToWeather() {
  uni.switchTab({ url: '/pages/weather/index' })
}
</script>

<style scoped>
.weather-mini {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  background: #FFFFFF;
  border-radius: 12rpx;
  margin-bottom: 12rpx;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
}

.mini-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.mini-score {
  font-size: 48rpx;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.mini-info {
  display: flex;
  flex-direction: column;
  gap: 2rpx;
}

.mini-label {
  font-size: 20rpx;
  color: #80848E;
}

.mini-level {
  font-size: 26rpx;
  font-weight: 600;
}

.mini-right {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.mini-text {
  font-size: 22rpx;
  color: #80848E;
  max-width: 220rpx;
}

.mini-arrow {
  width: 20rpx;
  height: 20rpx;
  flex-shrink: 0;
}
</style>
