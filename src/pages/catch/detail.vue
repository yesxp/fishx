<template>
  <view class="page">
    <view class="header">
      <view class="header-left">
        <button class="btn-back" @click="goBack">
          <svg viewBox="0 0 24 24" fill="none" stroke="#060607" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
      </view>
      <text class="title">Catch Detail</text>
      <view class="header-right">
        <button class="btn-share" @click="handleShare">Share</button>
      </view>
    </view>

    <scroll-view scroll-y class="scroll-content">
      <!-- Hero image -->
      <view class="dc-card hero-photo" :style="{ background: bgColor }">
        <text class="hero-emoji">{{ detail.fishEmoji }}</text>
      </view>

      <!-- Info card -->
      <view class="dc-card info-card">
        <view class="info-header">
          <view class="species-badge">
            <text class="badge-emoji">{{ detail.fishEmoji }}</text>
            <text class="badge-name">{{ detail.fishName }}</text>
          </view>
          <text class="meta-time">{{ formatTime(detail.time) }}</text>
        </view>
        <view class="info-grid">
          <view class="info-row">
            <svg class="row-icon" viewBox="0 0 24 24" fill="none" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <text class="row-text">{{ detail.location }}</text>
          </view>
          <view class="info-row">
            <svg class="row-icon" viewBox="0 0 24 24" fill="none" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>
            <text class="row-text">{{ detail.weather }} · {{ detail.temperature }}</text>
          </view>
        </view>
      </view>

      <!-- Actions -->
      <view class="dc-card action-card">
        <view class="action-item" @click="handleLike">
          <text class="action-icon" :class="{ liked: isLiked }">{{ isLiked ? '❤️' : '🤍' }}</text>
          <text class="action-count" :class="{ liked: isLiked }">{{ likeCount }}</text>
        </view>
        <view class="action-sep"></view>
        <view class="action-item" @click="handleShare">
          <svg class="row-icon" viewBox="0 0 24 24" fill="none" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          <text class="action-text">Share</text>
        </view>
      </view>

      <!-- Comments -->
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
import CommentList from '@/components/CommentList.vue'

const detail = ref({
  id: '',
  fishName: 'Crucian',
  fishEmoji: '🐟',
  imagePath: '',
  location: 'Chongming East Beach',
  weather: 'Cloudy',
  temperature: '26°',
  time: new Date().toISOString()
})

const bgColor = '#F2F3F5'
const isLiked = ref(false)
const likeCount = ref(42)
const comments = ref<Comment[]>([])

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
    uni.showToast({ title: 'Posted', icon: 'success' })
  }
}

function handleShare() {
  // #ifdef H5
  uni.setClipboardData({
    data: window.location.href,
    success: () => uni.showToast({ title: 'Copied', icon: 'success' })
  })
  // #endif
  // #ifdef MP-WEIXIN
  uni.showToast({ title: 'Tap top-right to share', icon: 'none' })
  // #endif
}

function formatTime(t: string) {
  if (!t) return ''
  const date = new Date(t)
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
}

onMounted(async () => {
  const res = await getComments(catchId)
  if (res.code === 0) {
    comments.value = res.data
  }
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #F2F3F5;
  display: flex;
  flex-direction: column;
}

/* ===== Header ===== */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 16rpx;
  background: #FFFFFF;
  border-bottom: 1rpx solid #E3E5E8;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
}

.btn-back {
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.btn-back:active {
  background: rgba(79,84,92,0.08);
}
.btn-back svg {
  width: 24rpx;
  height: 24rpx;
}

.title {
  font-size: 30rpx;
  font-weight: 700;
  color: #060607;
}

.header-right {
  display: flex;
  align-items: center;
}

.btn-share {
  padding: 10rpx 24rpx;
  border-radius: 9999px;
  background: transparent;
  color: #5865F2;
  font-size: 26rpx;
  font-weight: 600;
  border: none;
  height: auto;
  line-height: 1.4;
  transition: background 0.15s;
}
.btn-share:active {
  background: rgba(88,101,242,0.08);
}

/* ===== Scroll ===== */
.scroll-content {
  flex: 1;
}

/* ===== Discord Card ===== */
.dc-card {
  background: #FFFFFF;
  border-radius: 16rpx;
  margin: 12rpx 20rpx;
}

/* ===== Hero Photo ===== */
.hero-photo {
  width: 100%;
  height: 400rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-emoji {
  font-size: 100rpx;
}

/* ===== Info ===== */
.info-card {
  padding: 24rpx;
}

.info-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.species-badge {
  display: flex;
  align-items: center;
  gap: 6rpx;
  padding: 4rpx 16rpx;
  border-radius: 9999px;
  background: rgba(88,101,242,0.08);
}

.badge-emoji {
  font-size: 22rpx;
}

.badge-name {
  font-size: 24rpx;
  font-weight: 600;
  color: #5865F2;
}

.meta-time {
  font-size: 22rpx;
  color: #80848E;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.row-icon {
  width: 20rpx;
  height: 20rpx;
  flex-shrink: 0;
}

.row-text {
  font-size: 26rpx;
  color: #060607;
}

/* ===== Actions ===== */
.action-card {
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 6rpx;
  cursor: pointer;
}
.action-item:active {
  opacity: 0.7;
}

.action-icon {
  font-size: 28rpx;
}
.action-icon.liked {
  transform: scale(1.15);
}

.action-count {
  font-size: 26rpx;
  font-weight: 600;
  color: #4E5058;
}
.action-count.liked {
  color: #F23F43;
}

.action-sep {
  width: 1px;
  height: 28rpx;
  background: #E3E5E8;
  margin: 0 24rpx;
}

.action-text {
  font-size: 26rpx;
  color: #4E5058;
}
</style>
