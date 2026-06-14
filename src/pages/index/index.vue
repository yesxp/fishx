<template>
  <view class="container">
    <!-- Discord 风格头部：简洁 + 状态指示 -->
    <view class="header">
      <view class="header-row">
        <view class="header-brand">
          <view class="brand-dot"></view>
          <text class="header-title">鱼渔娱</text>
        </view>
        <view class="header-actions">
          <view class="action-btn" @click="goToCreate">
            <svg viewBox="0 0 24 24" fill="none" stroke="#5865F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          </view>
        </view>
      </view>
      <text class="header-sub">上海市 · 适合钓鱼</text>
    </view>

    <scroll-view scroll-y class="content" @scrolltolower="loadMore">
      <!-- 指数卡片：Discord 卡片风格，微妙阴影 -->
      <view class="card index-card" @click="goToWeather">
        <view class="index-left">
          <text class="index-score" :style="{ color: indexResult.levelColor }">{{ indexResult.score }}</text>
          <view class="index-meta">
            <text class="index-label">钓鱼指数</text>
            <text class="index-level" :style="{ color: indexResult.levelColor }">{{ indexResult.level }}</text>
          </view>
        </view>
        <view class="index-right">
          <text class="index-suggestion">{{ indexResult.suggestion }}</text>
          <svg class="index-arrow" viewBox="0 0 24 24" fill="none" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </view>
      </view>

      <!-- 天气数据：Discord 列表风格 -->
      <view class="card data-card">
        <view class="data-row">
          <view class="data-dot" style="background: #F0B232;"></view>
          <text class="data-label">气温</text>
          <text class="data-value">{{ weatherNow?.temp || '--' }}°</text>
        </view>
        <view class="data-sep"></view>
        <view class="data-row">
          <view class="data-dot" style="background: #5865F2;"></view>
          <text class="data-label">气压</text>
          <text class="data-value">{{ weatherNow?.pressure || '--' }} hPa</text>
        </view>
        <view class="data-sep"></view>
        <view class="data-row">
          <view class="data-dot" style="background: #23A55A;"></view>
          <text class="data-label">风力</text>
          <text class="data-value">{{ weatherNow?.windScale || '--' }}级</text>
        </view>
      </view>

      <!-- 标签筛选：Discord pill 风格 -->
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

      <!-- 列表头部 -->
      <view class="section-header">
        <text class="section-title">附近渔获</text>
        <text class="section-more">查看全部</text>
      </view>

      <!-- 渔获瀑布流 -->
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
/* ===== Discord Design Language ===== */

.container {
  min-height: 100vh;
  background: #F2F3F5;
}

/* === 头部 === */
.header {
  background: #FFFFFF;
  padding: 20rpx 24rpx 16rpx;
  border-bottom: 1px solid rgba(79,84,92,0.12);
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.brand-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #23A55A;
}

.header-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #313338;
  letter-spacing: -0.3rpx;
}

.header-sub {
  font-size: 24rpx;
  color: #5C5E66;
  margin-top: 4rpx;
}

.header-actions {
  display: flex;
  gap: 12rpx;
}

.action-btn {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: rgba(88,101,242,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}
.action-btn:active {
  background: rgba(88,101,242,0.16);
}
.action-btn svg {
  width: 28rpx;
  height: 28rpx;
}

/* === 内容 === */
.content {
  flex: 1;
  padding: 16rpx 20rpx;
}

/* === Discord 卡片 === */
.card {
  background: #FFFFFF;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 12rpx;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
}

/* === 指数卡片 === */
.index-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.index-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.index-score {
  font-size: 60rpx;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.index-meta {
  display: flex;
  flex-direction: column;
  gap: 2rpx;
}

.index-label {
  font-size: 22rpx;
  color: #80848E;
}

.index-level {
  font-size: 26rpx;
  font-weight: 600;
}

.index-right {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.index-suggestion {
  font-size: 22rpx;
  color: #80848E;
  text-align: right;
  max-width: 200rpx;
}

.index-arrow {
  width: 24rpx;
  height: 24rpx;
  flex-shrink: 0;
}

/* === 数据列表 === */
.data-card {
  padding: 8rpx 20rpx;
}

.data-row {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
}

.data-dot {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.data-label {
  flex: 1;
  font-size: 28rpx;
  color: #313338;
  font-weight: 500;
}

.data-value {
  font-size: 28rpx;
  color: #80848E;
  font-variant-numeric: tabular-nums;
}

.data-sep {
  height: 1px;
  background: rgba(79,84,92,0.08);
}

/* === 标签 === */
.tags-scroll {
  margin-bottom: 20rpx;
  white-space: nowrap;
}

.tags-row {
  display: inline-flex;
  gap: 8rpx;
}

.tag {
  display: inline-flex;
  align-items: center;
  height: 48rpx;
  padding: 0 20rpx;
  border-radius: 24rpx;
  background: rgba(79,84,92,0.08);
  transition: all 0.15s;
}

.tag:active {
  background: rgba(79,84,92,0.16);
}

.tag.active {
  background: #5865F2;
}

.tag-text {
  font-size: 26rpx;
  font-weight: 500;
  color: #5C5E66;
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
  margin-bottom: 12rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #313338;
}

.section-more {
  font-size: 26rpx;
  color: #5865F2;
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
  font-size: 22rpx;
  color: #80848E;
}
</style>
