<template>
  <view class="loading-spinner">
    <view class="spinner-dots">
      <view class="dot"></view>
      <view class="dot"></view>
      <view class="dot"></view>
    </view>
    <text class="spinner-text" v-if="text">{{ text }}</text>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  text?: string
}>()
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.spinner-dots {
  display: flex;
  gap: 10rpx;
  margin-bottom: 16rpx;
}

.dot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  background: #5865F2;
  animation: pulse 0.6s ease-in-out infinite alternate;
}
.dot:nth-child(2) { animation-delay: 0.15s; }
.dot:nth-child(3) { animation-delay: 0.3s; }

@keyframes pulse {
  0% { opacity: 0.3; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}

.spinner-text {
  font-size: 22rpx;
  color: #80848E;
  font-weight: 500;
}
</style>
