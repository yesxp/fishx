<template>
  <view class="loading-spinner">
    <view class="spinner-ring">
      <view class="ring-dot"></view>
      <view class="ring-dot"></view>
      <view class="ring-dot"></view>
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
  padding: 60rpx;
}

.spinner-ring {
  display: flex;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.ring-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: #AEAEB2;
  animation: bounce 0.6s ease-in-out infinite alternate;
}

.ring-dot:nth-child(2) {
  animation-delay: 0.15s;
}

.ring-dot:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes bounce {
  0% { transform: translateY(0); opacity: 0.4; }
  100% { transform: translateY(-12rpx); opacity: 1; }
}

.spinner-text {
  font-size: 24rpx;
  color: #8E8E93;
}
</style>
