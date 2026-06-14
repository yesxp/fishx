<template>
  <view class="loading-spinner">
    <view class="spinner-ring">
      <view class="ring-dot" v-for="i in 3" :key="i" :style="{ animationDelay: (i - 1) * 0.15 + 's' }"></view>
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
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #2196F3, #00BCD4);
  animation: bounce 0.6s ease-in-out infinite alternate;
}

.ring-dot:nth-child(2) {
  background: linear-gradient(135deg, #00BCD4, #4CAF50);
}

.ring-dot:nth-child(3) {
  background: linear-gradient(135deg, #4CAF50, #8BC34A);
}

@keyframes bounce {
  0% { transform: translateY(0); opacity: 0.4; }
  100% { transform: translateY(-16rpx); opacity: 1; }
}

.spinner-text {
  font-size: 26rpx;
  color: #6B7A99;
  background: rgba(255,255,255,0.65);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 4rpx 16rpx;
  border-radius: 100px;
}
</style>