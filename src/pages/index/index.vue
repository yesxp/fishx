<template>
  <view class="container">
    <!-- iOS 风格头部：大标题 + 滚动收缩 -->
    <view class="header">
      <view class="header-top">
        <view class="location">
          <text class="location-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
          </text>
          <text class="location-text">上海市</text>
        </view>
        <view class="header-actions">
          <view class="action-btn" @click="goToCreate">
            <svg viewBox="0 0 24 24" fill="none" stroke="#007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </view>
        </view>
      </view>
      <text class="header-title">鱼渔娱</text>
    </view>

    <scroll-view scroll-y class="content" @scrolltolower="loadMore">
      <!-- 天气指数卡片 -->
      <view class="index-card" @click="goToWeather">
        <view class="index-left">
          <text class="index-score" :style="{ color: indexResult.levelColor }">{{ indexResult.score }}</text>
          <view class="index-meta">
            <text class="index-label">钓鱼指数</text>
            <text class="index-level" :style="{ color: indexResult.levelColor }">{{ indexResult.level }}</text>
          </view>
        </view>
        <view class="index-right">
          <text class="index-suggestion">{{ indexResult.suggestion }}</text>
          <text class="index-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </text>
        </view>
      </view>

      <!-- 天气数据行：iOS 列表风格 -->
      <view class="data-list">
        <view class="data-row">
          <text class="data-label">气温</text>
          <text class="data-value">{{ weatherNow?.temp || '--' }}°</text>
        </view>
        <view class="data-divider"></view>
        <view class="data-row">
          <text class="data-label">气压</text>
          <text class="data-value">{{ weatherNow?.pressure || '--' }} hPa</text>
        </view>
        <view class="data-divider"></view>
        <view class="data-row">
          <text class="data-label">风力</text>
          <text class="data-value">{{ weatherNow?.windScale || '--' }}级 {{ weatherNow?.windDir || '' }}</text>
        </view>
      </view>

      <!-- 标签筛选：iOS segmented control 风格 -->
      <scroll-view scroll-x class="tags-scroll" :show-scrollbar="false">
        <view class="tags-row">
          <view class="tag"
            v-for="tag in tags"
            :key="tag.id"
            :class="{ active: selectedTag === tag.id }"
            @click="selectedTag = tag.id"
          >
            <text class="tag-text">{{ tag.name }}</text>
          </view>
        </view>
      </scroll-view>

      <!-- 渔获列表 -->
      <view class="section-header">
        <text class="section-title">附近渔获</text>
        <text class="section-more">查看全部</text>
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
        icon=""
        title="还没有渔获记录"
        desc="快去钓鱼吧，记录你的每一次收获"
        btnText="去钓鱼"
        @action="goToCreate"
      />

      <view class="loading-more" v-if="loading">
        <LoadingSpinner text="加载中..." />
      </view>

      <view class="no-more" v-if="noMore && catchList.length > 0">
        <text class="no-more-text">没有更多了</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useWeatherStore } from '@/stores/weather'
import { useCatchStore } from '@/stores/catch'
import CatchCard from '@/components/CatchCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const weatherStore = useWeatherStore()
const catchStore = useCatchStore()

const { weatherNow, indexResult } = storeToRefs(weatherStore)
const { catchList, loading, total } = storeToRefs(catchStore)

const selectedTag = ref('all')
const noMore = ref(false)

const tags = [
  { id: 'all', name: '全部' },
  { id: 'crucian', name: '鲫鱼' },
  { id: 'carp', name: '鲤鱼' },
  { id: 'grass', name: '草鱼' },
  { id: 'bass', name: '鲈鱼' },
]

function getIndex(item: any) {
  return catchList.indexOf(item)
}

function goToCreate() {
  uni.navigateTo({ url: '/pages/catch/create' })
}

function goToWeather() {
  uni.switchTab({ url: '/pages/weather/index' })
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
/* ===== iOS 设计系统 ===== */
/* 主色：#007AFF (iOS Blue) */
/* 背景：#F2F2F7 (iOS System Grouped Background) */
/* 卡片：#FFFFFF */
/* 文字：#000000 / #3C3C43 (60%) / #3C3C43 (30%) */
/* 分隔线：#C6C6C8 */

.container {
  min-height: 100vh;
  background: #F2F2F7;
}

/* === iOS 大标题头部 === */
.header {
  background: #FFFFFF;
  padding: 12rpx 20rpx 20rpx;
  border-bottom: 0.5px solid #C6C6C8;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.location {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.location-icon {
  width: 28rpx;
  height: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.location-icon svg {
  width: 28rpx;
  height: 28rpx;
}

.location-text {
  font-size: 26rpx;
  color: #007AFF;
  font-weight: 500;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.action-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: #F2F2F7;
  display: flex;
  align-items: center;
  justify-content: center;
}
.action-btn svg {
  width: 32rpx;
  height: 32rpx;
}

.header-title {
  font-size: 60rpx;
  font-weight: 700;
  color: #000000;
  letter-spacing: -0.5rpx;
}

/* === 内容区 === */
.content {
  flex: 1;
  padding: 16rpx 20rpx;
}

/* === 指数卡片 === */
.index-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx 20rpx;
  margin-bottom: 16rpx;
}

.index-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.index-score {
  font-size: 64rpx;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.index-meta {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.index-label {
  font-size: 24rpx;
  color: #8E8E93;
}

.index-level {
  font-size: 28rpx;
  font-weight: 600;
}

.index-right {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.index-suggestion {
  font-size: 24rpx;
  color: #8E8E93;
  text-align: right;
  max-width: 200rpx;
}

.index-arrow {
  width: 24rpx;
  height: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.index-arrow svg {
  width: 24rpx;
  height: 24rpx;
}

/* === 天气数据行：iOS Inset Grouped List === */
.data-list {
  background: #FFFFFF;
  border-radius: 16rpx;
  margin-bottom: 16rpx;
  overflow: hidden;
}

.data-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 20rpx;
}

.data-label {
  font-size: 30rpx;
  color: #000000;
}

.data-value {
  font-size: 30rpx;
  color: #8E8E93;
  font-variant-numeric: tabular-nums;
}

.data-divider {
  height: 0.5px;
  background: #C6C6C8;
  margin-left: 20rpx;
}

/* === 标签筛选：iOS Segment 风格 === */
.tags-scroll {
  margin-bottom: 24rpx;
  white-space: nowrap;
}

.tags-row {
  display: inline-flex;
  gap: 12rpx;
  padding: 4rpx 0;
}

.tag {
  display: inline-flex;
  align-items: center;
  height: 56rpx;
  padding: 0 28rpx;
  border-radius: 28rpx;
  background: #E5E5EA;
  flex-shrink: 0;
}

.tag.active {
  background: #007AFF;
}

.tag-text {
  font-size: 28rpx;
  font-weight: 500;
  color: #000000;
  white-space: nowrap;
}

.tag.active .tag-text {
  color: #FFFFFF;
}

/* === 列表头部 === */
.section-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.section-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #000000;
}

.section-more {
  font-size: 28rpx;
  color: #007AFF;
}

/* === 瀑布流 === */
.masonry {
  display: flex;
  gap: 12rpx;
}

.masonry-col {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* === 底部 === */
.loading-more {
  padding: 40rpx 0;
}

.no-more {
  padding: 40rpx 0;
  text-align: center;
}

.no-more-text {
  font-size: 24rpx;
  color: #8E8E93;
}
</style>
