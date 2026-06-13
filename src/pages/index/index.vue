<template>
  <view class="container">
    <view class="header">
      <view class="header-left">
        <view class="logo">🎣</view>
        <view class="info">
          <text class="title">鱼渔娱</text>
          <text class="subtitle">上海市</text>
        </view>
      </view>
      <view class="header-right">
        <button class="btn-camera" @click="goToCreate">📷</button>
      </view>
    </view>
    
    <scroll-view scroll-y class="content" @scrolltolower="loadMore">
      <!-- 天气指数条 -->
      <WeatherMini 
        :score="indexResult.score"
        :level="indexResult.level"
        :color="indexResult.levelColor"
        :text="indexResult.suggestion"
      />
      
      <!-- 核心数据 -->
      <view class="stats-grid">
        <view class="stat-card">
          <text class="stat-icon">🌡️</text>
          <text class="stat-val">{{ weatherNow?.temp || '26' }}°</text>
          <text class="stat-label">气温</text>
        </view>
        <view class="stat-card">
          <text class="stat-icon">📊</text>
          <text class="stat-val">{{ weatherNow?.pressure || '1009' }}</text>
          <text class="stat-label">气压 hPa</text>
        </view>
        <view class="stat-card">
          <text class="stat-icon">💨</text>
          <text class="stat-val">{{ weatherNow?.windScale || '2' }}级</text>
          <text class="stat-label">南风</text>
        </view>
      </view>
      
      <!-- 标签筛选 -->
      <scroll-view scroll-x class="tags-scroll">
        <view class="tag" 
          v-for="tag in tags" 
          :key="tag.id"
          :class="{ active: selectedTag === tag.id }"
          @click="selectedTag = tag.id"
        >
          {{ tag.icon }} {{ tag.name }}
        </view>
      </scroll-view>
      
      <!-- 渔获瀑布流 -->
      <view class="section">
        <text class="section-title">附近渔获</text>
        <text class="section-more">查看全部 →</text>
      </view>
      
      <view class="masonry" v-if="catchList.length > 0">
        <view class="masonry-col">
          <CatchCard 
            v-for="item in catchList" 
            :key="item.id"
            v-if="getIndex(item) % 2 === 0"
            v-bind="item"
          />
        </view>
        <view class="masonry-col">
          <CatchCard 
            v-for="item in catchList" 
            :key="item.id"
            v-if="getIndex(item) % 2 === 1"
            v-bind="item"
          />
        </view>
      </view>
      
      <!-- 空态 -->
      <EmptyState 
        v-else
        icon="🎣"
        title="还没有渔获记录"
        desc="快去钓鱼吧！记录你的每一次收获"
        btnText="去钓鱼吧！"
        @action="goToCreate"
      />
      
      <!-- 加载更多 -->
      <view class="loading-more" v-if="loading">
        <LoadingSpinner text="加载中..." />
      </view>
      
      <view class="no-more" v-if="noMore && catchList.length > 0">
        <text class="no-more-text">—— 没有更多了 ——</text>
      </view>
    </scroll-view>
    
    <!-- 浮动拍照按钮 -->
    <view class="fab" @click="goToCreate">
      <text class="fab-icon">📷</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useWeatherStore } from '@/stores/weather'
import { useCatchStore } from '@/stores/catch'
import WeatherMini from '@/components/WeatherMini.vue'
import CatchCard from '@/components/CatchCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const weatherStore = useWeatherStore()
const catchStore = useCatchStore()

const { weatherNow, indexResult } = weatherStore
const { catchList, loading, total } = catchStore

const selectedTag = ref('all')
const noMore = ref(false)

const tags = [
  { id: 'all', name: '全部', icon: '' },
  { id: 'crucian', name: '鲫鱼', icon: '🐟' },
  { id: 'carp', name: '鲤鱼', icon: '🐠' },
  { id: 'grass', name: '草鱼', icon: '🐡' },
  { id: 'bass', name: '鲈鱼', icon: '🎣' },
]

function getIndex(item: any) {
  return catchList.indexOf(item)
}

function goToCreate() {
  uni.navigateTo({ url: '/pages/catch/create' })
}

async function loadMore() {
  if (loading.value || noMore.value) return
  const prevTotal = total.value
  await catchStore.loadList()
  if (total.value === prevTotal) {
    noMore.value = true
  }
}

onMounted(() => {
  weatherStore.loadWeather()
  catchStore.loadList(true)
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #F8FAFE;
  position: relative;
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
  gap: 24rpx;
}

.logo {
  width: 68rpx;
  height: 68rpx;
  border-radius: 20rpx;
  background: linear-gradient(135deg, #2196F3, #00BCD4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.title {
  font-size: 34rpx;
  font-weight: 700;
  color: #1A2B4A;
}

.subtitle {
  font-size: 22rpx;
  color: #6B7A99;
}

.header-right {
  display: flex;
  align-items: center;
}

.btn-camera {
  width: 68rpx;
  height: 68rpx;
  border-radius: 20rpx;
  background: linear-gradient(135deg, #2196F3, #00BCD4);
  color: #fff;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.content {
  flex: 1;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12rpx;
  padding: 0 16rpx;
  margin-bottom: 20rpx;
}

.stat-card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 20rpx 12rpx;
  text-align: center;
  box-shadow: 0 2px 12px rgba(26,43,74,.06);
}

.stat-icon {
  font-size: 36rpx;
  margin-bottom: 8rpx;
}

.stat-val {
  font-size: 32rpx;
  font-weight: 700;
  color: #1A2B4A;
}

.stat-label {
  font-size: 20rpx;
  color: #6B7A99;
}

.tags-scroll {
  white-space: nowrap;
  padding: 0 16rpx;
  margin-bottom: 20rpx;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 4rpx;
  padding: 12rpx 24rpx;
  border-radius: 100px;
  background: #FFFFFF;
  color: #6B7A99;
  font-size: 24rpx;
  margin-right: 12rpx;
  box-shadow: 0 2px 8px rgba(26,43,74,.04);
}

.tag.active {
  background: linear-gradient(135deg, #2196F3, #00BCD4);
  color: #FFFFFF;
}

.section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16rpx;
  margin-bottom: 16rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #1A2B4A;
}

.section-more {
  font-size: 26rpx;
  color: #2196F3;
}

.masonry {
  display: flex;
  gap: 12rpx;
  padding: 0 16rpx;
}

.masonry-col {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.loading-more {
  padding: 40rpx 0;
}

.no-more {
  padding: 40rpx 0;
  text-align: center;
}

.no-more-text {
  font-size: 24rpx;
  color: #94A3B8;
}

.fab {
  position: fixed;
  right: 40rpx;
  bottom: 200rpx;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #2196F3, #00BCD4);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(33,150,243,.3);
  z-index: 50;
}

.fab-icon {
  font-size: 40rpx;
}
</style>