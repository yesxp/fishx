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
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
  font-weight: 500;
}
</style>
