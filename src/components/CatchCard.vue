<template>
  <view class="catch-card" @click="goToDetail">
    <view class="card-photo" :style="{ background: bgColor }">
      <text class="photo-emoji">{{ fishEmoji }}</text>
    </view>
    <view class="card-body">
      <view class="card-tag">
        <text class="tag-name">{{ fishName }}</text>
      </view>
      <view class="card-meta">
        <text class="meta-location">{{ location }}</text>
        <text class="meta-time">{{ formatTime(time) }}</text>
      </view>
      <view class="card-actions">
        <view class="action-item">
          <text class="action-count">{{ likes }}</text>
        </view>
        <view class="action-item">
          <text class="action-count">{{ comments }}</text>
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

const bgColor = getColorByIndex(Math.floor(Math.random() * 8))

function getColorByIndex(index: number) {
  const colors = ['#F2F2F7', '#E8F5E9', '#FFF3E0', '#E3F2FD', '#F3E5F5', '#FBE9E7', '#ECEFF1', '#E8EAF6']
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
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 12rpx;
}

.card-photo {
  width: 100%;
  height: 280rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-emoji {
  font-size: 80rpx;
}

.card-body {
  padding: 16rpx 16rpx 20rpx;
}

.card-tag {
  margin-bottom: 8rpx;
}

.tag-name {
  font-size: 26rpx;
  font-weight: 600;
  color: #000000;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.meta-location {
  font-size: 24rpx;
  color: #8E8E93;
}

.meta-time {
  font-size: 22rpx;
  color: #AEAEB2;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-top: 12rpx;
  padding-top: 12rpx;
  border-top: 0.5px solid #E5E5EA;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 4rpx;
}

.action-count {
  font-size: 22rpx;
  color: #8E8E93;
}
</style>
