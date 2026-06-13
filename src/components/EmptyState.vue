<template>
  <view class="empty-state">
    <view class="empty-icon">
      <text class="icon-emoji">{{ icon }}</text>
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
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #E3F2FD, #E0F7FA);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32rpx;
}

.icon-emoji {
  font-size: 64rpx;
}

.empty-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1A2B4A;
  margin-bottom: 12rpx;
}

.empty-desc {
  font-size: 26rpx;
  color: #6B7A99;
  text-align: center;
  line-height: 1.5;
  margin-bottom: 32rpx;
}

.empty-btn {
  padding: 20rpx 48rpx;
  border-radius: 100rpx;
  background: linear-gradient(135deg, #2196F3, #00BCD4);
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