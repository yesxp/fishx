<template>
  <view class="container">
    <view class="header">
      <view class="header-left">
        <button class="btn-back" @click="goBack">←</button>
        <text class="title">渔获详情</text>
      </view>
      <view class="header-right">
        <button class="btn-share">分享</button>
      </view>
    </view>
    
    <scroll-view scroll-y class="content">
      <!-- 大图 -->
      <view class="photo-section" :style="{ background: bgColor }">
        <text class="photo-emoji">{{ detail.fishEmoji }}</text>
      </view>
      
      <!-- 基本信息 -->
      <view class="info-card">
        <view class="info-header">
          <view class="fish-badge">
            <text class="badge-emoji">{{ detail.fishEmoji }}</text>
            <text class="badge-name">{{ detail.fishName }}</text>
          </view>
          <view class="info-meta">
            <text class="meta-time">{{ formatTime(detail.time) }}</text>
          </view>
        </view>
        
        <view class="info-grid">
          <view class="info-item">
            <text class="item-icon">📍</text>
            <text class="item-text">{{ detail.location }}</text>
          </view>
          <view class="info-item">
            <text class="item-icon">🌤️</text>
            <text class="item-text">{{ detail.weather }} {{ detail.temperature }}</text>
          </view>
        </view>
      </view>
      
      <!-- 互动区 -->
      <view class="action-card">
        <LikeButton 
          :liked="isLiked" 
          :count="likeCount"
          @toggle="handleLike"
        />
        <view class="action-divider"></view>
        <view class="share-btn" @click="handleShare">
          <text class="share-icon">🔗</text>
          <text class="share-text">分享</text>
        </view>
      </view>
      
      <!-- 评论区 -->
      <CommentList 
        :comments="comments"
        @submit="handleComment"
      />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { toggleLike, getComments, addComment, type Comment } from '@/api/interact'
import LikeButton from '@/components/LikeButton.vue'
import CommentList from '@/components/CommentList.vue'

// 模拟详情数据
const detail = ref({
  id: '',
  fishName: '鲫鱼',
  fishEmoji: '🐟',
  imagePath: '',
  location: '崇明东滩',
  weather: '多云',
  temperature: '26°',
  time: new Date().toISOString()
})

const bgColor = '#E3F2FD'
const isLiked = ref(false)
const likeCount = ref(42)
const comments = ref<Comment[]>([])

// 获取页面参数
const pages = getCurrentPages()
const currentPage = pages[pages.length - 1] as any
const catchId = currentPage?.options?.id || '1'

function goBack() {
  uni.navigateBack()
}

async function handleLike() {
  const res = await toggleLike(catchId, 'current_user')
  if (res.code === 0) {
    isLiked.value = res.data.liked
    likeCount.value = res.data.count
  }
}

async function handleComment(content: string) {
  const res = await addComment(catchId, content, 'current_user')
  if (res.code === 0) {
    comments.value.unshift(res.data)
    uni.showToast({ title: '评论成功', icon: 'success' })
  }
}

function handleShare() {
  // #ifdef H5
  uni.setClipboardData({
    data: window.location.href,
    success: () => {
      uni.showToast({ title: '链接已复制', icon: 'success' })
    }
  })
  // #endif
  
  // #ifdef MP-WEIXIN
  uni.showToast({ title: '请点击右上角分享', icon: 'none' })
  // #endif
}

function formatTime(t: string) {
  if (!t) return ''
  const date = new Date(t)
  return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
}

onMounted(async () => {
  // 加载评论
  const res = await getComments(catchId)
  if (res.code === 0) {
    comments.value = res.data
  }
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #EBF5FF 0%, #F0F9FF 50%, #F8FAFE 100%);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 32rpx;
  background: rgba(255,255,255,0.72);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.5);
  box-shadow: 0 4px 16px rgba(0,0,0,0.04);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.btn-back {
  width: 60rpx;
  height: 60rpx;
  border-radius: 16rpx;
  background: #F1F5F9;
  border: none;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  font-size: 34rpx;
  font-weight: 700;
  color: #1A2B4A;
}

.header-right {
  display: flex;
  align-items: center;
}

.btn-share {
  padding: 12rpx 24rpx;
  border-radius: 12rpx;
  background: #F1F5F9;
  border: none;
  font-size: 26rpx;
  color: #6B7A99;
}

.content {
  flex: 1;
  padding: 24rpx;
}

.photo-section {
  width: 100%;
  height: 500rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
}

.photo-emoji {
  font-size: 120rpx;
}

.info-card {
  background: rgba(255,255,255,0.72);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  border: 1px solid rgba(255,255,255,0.5);
  box-shadow: 0 8px 32px rgba(0,0,0,0.06);
}

.info-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.fish-badge {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 16rpx;
  background: #E3F2FD;
  border-radius: 100px;
}

.badge-emoji {
  font-size: 24rpx;
}

.badge-name {
  font-size: 24rpx;
  font-weight: 600;
  color: #2196F3;
}

.info-meta {
  font-size: 22rpx;
  color: #94A3B8;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.item-icon {
  font-size: 20rpx;
}

.item-text {
  font-size: 26rpx;
  color: #1A2B4A;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 24rpx;
  background: rgba(255,255,255,0.72);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 20rpx;
  padding: 20rpx 24rpx;
  margin-bottom: 16rpx;
  border: 1px solid rgba(255,255,255,0.5);
  box-shadow: 0 8px 32px rgba(0,0,0,0.06);
}

.action-divider {
  width: 1rpx;
  height: 32rpx;
  background: #E2E8F0;
}

.share-btn {
  display: flex;
  align-items: center;
  gap: 6rpx;
  cursor: pointer;
}

.share-icon {
  font-size: 24rpx;
}

.share-text {
  font-size: 24rpx;
  color: #6B7A99;
}
</style>