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
        <text class="footer-stat">{{ likes }} 赞</text>
        <text class="footer-stat">{{ comments }} 评</text>
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

const bgColor = getColorByIndex(Math.floor(Math.random() * 6))

function getColorByIndex(index: number) {
  const colors = ['#F2F3F5', '#E8F5E9', '#FFF3E0', '#E3E5E8', '#F3E5F5', '#ECEFF1']
  return colors[index]
}

function formatTime(t: string) {
  if (!t) return ''
  const date = new Date(t)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  if (diff < 172800000) return '昨天'
  return (date.getMonth() + 1) + '月' + date.getDate() + '日'
}

function goToDetail() {
  uni.navigateTo({ url: '/pages/catch/detail?id=' + props.id })
}
</script>

<style scoped>
.catch-card {
  background: #FFFFFF;
  border-radius: 12rpx;
  overflow: hidden;
  margin-bottom: 12rpx;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
}

.card-photo {
  width: 100%;
  height: 260rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-emoji {
  font-size: 72rpx;
}

.card-body {
  padding: 14rpx 16rpx 18rpx;
}

.card-name {
  font-size: 26rpx;
  font-weight: 600;
  color: #313338;
  display: block;
  margin-bottom: 6rpx;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 2rpx;
}

.meta-loc {
  font-size: 22rpx;
  color: #80848E;
}

.meta-time {
  font-size: 20rpx;
  color: #80848E;
  opacity: 0.7;
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-top: 10rpx;
  padding-top: 10rpx;
  border-top: 1px solid rgba(79,84,92,0.08);
}

.footer-stat {
  font-size: 20rpx;
  color: #80848E;
}
</style>
