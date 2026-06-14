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
      <text class="mini-arrow">›</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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
  padding: 20rpx 24rpx;
  background: rgba(255,255,255,0.72);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.5);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.06);
  margin: 0 16rpx 16rpx;
}

.mini-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.mini-score {
  font-size: 48rpx;
  font-weight: 800;
  line-height: 1;
}

.mini-info {
  display: flex;
  flex-direction: column;
  gap: 2rpx;
}

.mini-label {
  font-size: 20rpx;
  color: #6B7A99;
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
  color: #6B7A99;
}

.mini-arrow {
  font-size: 28rpx;
  color: #6B7A99;
}
</style>