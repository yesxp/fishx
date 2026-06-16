<template>
  <view class="weather-mini" @click="$emit('tap', $event)">
    <view class="weather-score">
      <text class="weather-score-num">{{ score }}</text>
      <text class="weather-score-label">{{ level }}</text>
    </view>
    <view class="weather-info">
      <text class="weather-title">今日钓况指数</text>
      <text class="weather-desc">{{ suggestion }}</text>
      <text class="weather-detail">{{ temperature }} · {{ wind }} · 湿度{{ humidity }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  score: number
  level: string
  suggestion: string
  temperature: string
  wind: string
  humidity: string
}>()
defineEmits<{ tap: [e: Event] }>()
</script>

<style scoped lang="scss">
.weather-mini {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid #E3E5E8;
  margin-bottom: 12px;
}

.weather-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 80rpx;
}

.weather-score-num {
  font-size: 44rpx;
  font-weight: 700;
  color: #5865F2;
  line-height: 1;
}

.weather-score-label {
  font-size: 18rpx;
  color: #80848E;
  margin-top: 4rpx;
}

.weather-info {
  flex: 1;
  min-width: 0;
}

.weather-title {
  font-size: 22rpx;
  font-weight: 600;
  color: #060607;
  display: block;
  margin-bottom: 6rpx;
}

.weather-desc {
  font-size: 20rpx;
  color: #4E5058;
  line-height: 1.5;
  display: block;
  margin-bottom: 6rpx;
}

.weather-detail {
  font-size: 18rpx;
  color: #80848E;
}
</style>
