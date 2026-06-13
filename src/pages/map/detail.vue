<template>
  <view class="container">
    <view class="header">
      <view class="header-left">
        <button class="btn-back" @click="goBack">←</button>
        <text class="title">{{ spot?.name || '钓点详情' }}</text>
      </view>
      <view class="header-right">
        <button class="btn-share">分享</button>
      </view>
    </view>
    
    <scroll-view scroll-y class="content">
      <!-- 钓点信息 -->
      <view class="spot-hero">
        <view class="hero-icon">📍</view>
        <text class="hero-name">{{ spot?.name }}</text>
        <text class="hero-type">{{ spot?.type }}</text>
        
        <view class="hero-stats">
          <view class="stat-item">
            <text class="stat-num">{{ spot?.rating }}</text>
            <text class="stat-label">评分</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item">
            <text class="stat-num">{{ spot?.catchCount }}</text>
            <text class="stat-label">渔获</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item">
            <text class="stat-num">{{ spot?.distance || '未知' }}</text>
            <text class="stat-label">距离</text>
          </view>
        </view>
      </view>
      
      <!-- 鱼种标签 -->
      <view class="fish-section">
        <text class="section-title">常见鱼种</text>
        <view class="fish-tags">
          <view class="fish-tag" v-for="fish in spot?.fishTypes" :key="fish">
            <text class="tag-emoji">🐟</text>
            <text class="tag-name">{{ fish }}</text>
          </view>
        </view>
      </view>
      
      <!-- 操作按钮 -->
      <view class="action-section">
        <button class="action-btn primary" @click="handleNavigate">
          <text class="btn-icon">🧭</text>
          <text class="btn-text">导航前往</text>
        </button>
        <button class="action-btn secondary" @click="handleCheckIn">
          <text class="btn-icon">✅</text>
          <text class="btn-text">打卡</text>
        </button>
      </view>
      
      <!-- 附近渔获 -->
      <view class="catch-section">
        <text class="section-title">该钓点的渔获</text>
        <view class="catch-list">
          <view class="catch-item" v-for="i in 4" :key="i">
            <view class="catch-photo" :style="{ background: fishColors[i % 4] }">
              <text class="catch-emoji">{{ fishEmojis[i % 4] }}</text>
            </view>
            <view class="catch-info">
              <text class="catch-fish">{{ fishNames[i % 4] }}</text>
              <text class="catch-time">{{ i }}小时前</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSpotStore } from '@/stores/spot'
import { checkIn } from '@/api/spot'

const spotStore = useSpotStore()
const spot = ref<any>(null)

const fishNames = ['鲫鱼', '鲤鱼', '鲈鱼', '草鱼']
const fishEmojis = ['🐟', '🐠', '🎣', '🐡']
const fishColors = ['#E3F2FD', '#E0F7FA', '#FFF3E0', '#E8F5E9']

const pages = getCurrentPages()
const currentPage = pages[pages.length - 1] as any
const spotId = currentPage?.options?.id || '1'

function goBack() {
  uni.navigateBack()
}

function handleNavigate() {
  if (spot.value) {
    uni.openLocation({
      latitude: spot.value.lat,
      longitude: spot.value.lng,
      name: spot.value.name,
      address: spot.value.type
    })
  }
}

async function handleCheckIn() {
  const res = await checkIn(spotId)
  if (res.code === 0) {
    uni.showToast({ title: '打卡成功', icon: 'success' })
  }
}

onMounted(async () => {
  const data = await spotStore.loadDetail(spotId)
  spot.value = data
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #F8FAFE;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 32rpx;
  background: rgba(255,255,255,.88);
  backdrop-filter: blur(24px);
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
}

.spot-hero {
  text-align: center;
  padding: 48rpx 24rpx;
  background: linear-gradient(135deg, #E3F2FD, #E0F7FA);
}

.hero-icon {
  font-size: 64rpx;
  margin-bottom: 16rpx;
}

.hero-name {
  font-size: 40rpx;
  font-weight: 700;
  color: #1A2B4A;
  display: block;
}

.hero-type {
  font-size: 26rpx;
  color: #6B7A99;
  margin-top: 8rpx;
}

.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32rpx;
  margin-top: 24rpx;
  padding: 20rpx;
  background: rgba(255,255,255,.8);
  border-radius: 16rpx;
}

.stat-item {
  text-align: center;
}

.stat-num {
  font-size: 36rpx;
  font-weight: 700;
  color: #2196F3;
  display: block;
}

.stat-label {
  font-size: 22rpx;
  color: #6B7A99;
}

.stat-divider {
  width: 1rpx;
  height: 48rpx;
  background: #E2E8F0;
}

.fish-section, .action-section, .catch-section {
  padding: 24rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #1A2B4A;
  margin-bottom: 16rpx;
  display: block;
}

.fish-tags {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
}

.fish-tag {
  display: flex;
  align-items: center;
  gap: 6rpx;
  padding: 12rpx 20rpx;
  background: #E3F2FD;
  border-radius: 100px;
}

.tag-emoji {
  font-size: 20rpx;
}

.tag-name {
  font-size: 24rpx;
  color: #2196F3;
  font-weight: 500;
}

.action-section {
  display: flex;
  gap: 16rpx;
}

.action-btn {
  flex: 1;
  height: 88rpx;
  border-radius: 16rpx;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  font-size: 28rpx;
  font-weight: 600;
}

.action-btn.primary {
  background: linear-gradient(135deg, #2196F3, #00BCD4);
  color: #FFFFFF;
}

.action-btn.secondary {
  background: #F1F5F9;
  color: #1A2B4A;
}

.btn-icon {
  font-size: 28rpx;
}

.catch-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.catch-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx;
  background: #FFFFFF;
  border-radius: 12rpx;
  box-shadow: 0 2px 8px rgba(26,43,74,.04);
}

.catch-photo {
  width: 80rpx;
  height: 80rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.catch-emoji {
  font-size: 36rpx;
}

.catch-info {
  flex: 1;
}

.catch-fish {
  font-size: 28rpx;
  font-weight: 600;
  color: #1A2B4A;
}

.catch-time {
  font-size: 22rpx;
  color: #6B7A99;
}
</style>