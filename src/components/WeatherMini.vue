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
      <text class="mini-arrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </text>
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
  padding: 24rpx 20rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  margin: 0 0 16rpx;
}

.mini-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.mini-score {
  font-size: 52rpx;
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
  font-size: 22rpx;
  color: #8E8E93;
}

.mini-level {
  font-size: 28rpx;
  font-weight: 600;
}

.mini-right {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.mini-text {
  font-size: 24rpx;
  color: #8E8E93;
  max-width: 240rpx;
}

.mini-arrow {
  width: 24rpx;
  height: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mini-arrow svg {
  width: 24rpx;
  height: 24rpx;
}
</style>
