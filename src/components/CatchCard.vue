<template>
  <view class="catch-card" @click="goToDetail">
    <view class="card-photo" :style="{ background: bgColor }">
      <text class="photo-emoji">{{ fishEmoji }}</text>
    </view>
    <view class="card-body">
      <text class="card-name">{{ fishName }}</text>
      <view class="card-meta">
        <text class="meta-loc">{{ location }}</text>
        <text class="meta-time">{{ formatTime(time) }}</text>
      </view>
      <view class="card-footer">
        <view class="footer-stat">
          <svg viewBox="0 0 24 24" fill="none" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <text>{{ likes ?? 0 }}</text>
        </view>
        <view class="footer-stat">
          <svg viewBox="0 0 24 24" fill="none" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <text>{{ comments ?? 0 }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: string
  fishName: string
  fishEmoji: string
  imagePath: string
  location: string
  weather: string
  temperature: string
  time: string
  likes?: number
  comments?: number
}>()

const bgColor = '#F2F3F5'

function formatTime(t: string) {
  if (!t) return ''
  const date = new Date(t)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago'
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago'
  if (diff < 172800000) return 'Yesterday'
  return (date.getMonth() + 1) + '/' + date.getDate()
}

function goToDetail() {
  uni.navigateTo({ url: '/pages/catch/detail?id=' + props.id })
}
</script>

<style scoped>
.catch-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 12rpx;
  transition: background 0.15s;
}
.catch-card:active {
  background: rgba(79,84,92,0.03);
}

.card-photo {
  width: 100%;
  height: 240rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-emoji {
  font-size: 64rpx;
}

.card-body {
  padding: 16rpx 20rpx;
}

.card-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #060607;
  display: block;
  margin-bottom: 4rpx;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 2rpx;
}

.meta-loc {
  font-size: 24rpx;
  color: #4E5058;
}

.meta-time {
  font-size: 22rpx;
  color: #80848E;
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-top: 12rpx;
  padding-top: 12rpx;
  border-top: 1rpx solid #E3E5E8;
}

.footer-stat {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.footer-stat svg {
  width: 18rpx;
  height: 18rpx;
}

.footer-stat text {
  font-size: 22rpx;
  color: #80848E;
  font-weight: 500;
}
</style>
