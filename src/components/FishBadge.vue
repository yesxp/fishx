<template>
  <view class="fish-badge" :style="{ background: bgColor, color: textColor }">
    <text class="badge-emoji">{{ emoji }}</text>
    <text class="badge-name">{{ name }}</text>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  emoji?: string
  bgColor?: string
  textColor?: string
}>()
</script>

<style scoped>
.fish-badge {
  display: inline-flex;
  align-items: center;
  gap: 4rpx;
  padding: 4rpx 12rpx;
  border-radius: 100px;
  font-size: 20rpx;
  font-weight: 500;
}

.badge-emoji {
  font-size: 20rpx;
}

.badge-name {
  font-size: 20rpx;
}
</style>