<template>
  <view class="catch-card" @click="goToDetail">
    <!-- 图片 -->
    <view class="card-photo" :style="{ background: bgColor }">
      <text class="photo-emoji">{{ fishEmoji }}</text>
    </view>
    
    <!-- 内容 -->
    <view class="card-body">
      <FishBadge :name="fishName" :emoji="fishEmoji" />
      
      <view class="card-meta">
        <text class="meta-location">📍 {{ location }}</text>
        <text class="meta-time">{{ formatTime(time) }}</text>
      </view>
      
      <view class="card-weather">
        <text class="weather-text">🌤️ {{ temperature }} {{ weather }}</text>
      </view>
      
      <view class="card-actions">
        <view class="action-item">
          <text class="action-icon">❤️</text>
          <text class="action-count">{{ likes }}</text>
        </view>
        <view class="action-item">
          <text class="action-icon">💬</text>
          <text class="action-count">{{ comments }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import FishBadge from './FishBadge.vue'

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
  const colors = ['#E3F2FD', '#E0F7FA', '#FFF3E0', '#E8F5E9', '#F3E5F5', '#FBE9E7', '#ECEFF1', '#E8EAF6']
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
  background: rgba(255,255,255,0.72);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.5);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.06);
  margin-bottom: 16rpx;
}

.card-photo {
  width: 100%;
  height: 280rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.35);
}

.photo-emoji {
  font-size: 80rpx;
}

.card-body {
  padding: 16rpx;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  margin-top: 12rpx;
}

.meta-location {
  font-size: 24rpx;
  color: #1A2B4A;
}

.meta-time {
  font-size: 20rpx;
  color: #6B7A99;
}

.card-weather {
  margin-top: 8rpx;
}

.weather-text {
  font-size: 20rpx;
  color: #6B7A99;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-top: 12rpx;
  padding-top: 12rpx;
  border-top: 1rpx solid #F1F5F9;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 4rpx;
}

.action-icon {
  font-size: 20rpx;
}

.action-count {
  font-size: 20rpx;
  color: #6B7A99;
}
</style>