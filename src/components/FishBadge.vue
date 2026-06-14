<template>
  <view class="fish-badge" :style="{ background: bgColor, color: textColor }">
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
  padding: 2rpx 10rpx;
  border-radius: 20rpx;
  font-size: 20rpx;
  font-weight: 500;
}
</style>
