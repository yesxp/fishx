<template>
  <view class="empty-state">
    <view class="empty-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="#AEAEB2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.46-3.44 6-7 6-3.56 0-7.56-2.54-8.5-6Z"/><path d="M18 12v.5"/><path d="M16 17.93a9.77 9.77 0 0 1 0-11.86"/><path d="M7 10.67C5.58 10.33 4.5 10 3 10c-1.5 0-3 .33-4 .67"/></svg>
    </view>
    <text class="empty-title">{{ title }}</text>
    <text class="empty-desc" v-if="desc">{{ desc }}</text>
    <button class="empty-btn" v-if="btnText" @click="$emit('action')">
      {{ btnText }}
    </button>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  icon?: string
  title?: string
  desc?: string
  btnText?: string
}>()

defineEmits<{
  action: []
}>()
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 40rpx;
}

.empty-icon {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: #E5E5EA;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32rpx;
}
.empty-icon svg {
  width: 56rpx;
  height: 56rpx;
}

.empty-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #000000;
  margin-bottom: 12rpx;
}

.empty-desc {
  font-size: 26rpx;
  color: #8E8E93;
  text-align: center;
  line-height: 1.5;
  margin-bottom: 32rpx;
}

.empty-btn {
  padding: 20rpx 48rpx;
  border-radius: 100rpx;
  background: #007AFF;
  color: #fff;
  font-size: 28rpx;
  font-weight: 600;
  border: none;
}

.empty-btn:active {
  opacity: .85;
  transform: scale(.97);
}
</style>
