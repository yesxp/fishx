<template>
  <view class="page">
    <!-- Top bar: brand + status dot -->
    <view class="topbar">
      <view class="topbar-inner">
        <view class="brand">
          <view class="brand-status"></view>
          <text class="brand-name">鱼渔娱</text>
        </view>
        <view class="topbar-status">
          <text class="status-location">上海市</text>
          <text class="status-dot-live" :style="{ color: indexResult.levelColor }">{{ indexResult.level }}</text>
        </view>
        <view class="topbar-actions">
          <view class="icon-btn" @click="goToCreate">
            <svg viewBox="0 0 24 24" fill="none" stroke="#5865F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </view>
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="scroll-content" @scrolltolower="loadMore">
      <!-- Index card: Discord style -->
      <view class="dc-card index-card" @click="goToWeather">
        <view class="index-main">
          <text class="index-score" :style="{ color: indexResult.levelColor }">{{ indexResult.score }}</text>
          <view class="index-meta">
            <text class="index-label">Fishing Index</text>
            <text class="index-level" :style="{ color: indexResult.levelColor }">{{ indexResult.level }}</text>
          </view>
        </view>
        <view class="index-right">
          <text class="index-desc">{{ indexResult.suggestion }}</text>
          <svg viewBox="0 0 24 24" fill="none" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </view>
      </view>

      <!-- Current weather: Discord inset list -->
      <view class="dc-card weather-list">
        <view class="list-row" :class="{'has-divider': true}">
          <view class="list-dot" style="background: #F0B232;"></view>
          <text class="list-label">Temperature</text>
          <text class="list-value">{{ weatherNow?.temp || '--' }}°</text>
        </view>
        <view class="list-row" :class="{'has-divider': true}">
          <view class="list-dot" style="background: #5865F2;"></view>
          <text class="list-label">Atmospheric Pressure</text>
          <text class="list-value">{{ weatherNow?.pressure || '--' }} hPa</text>
        </view>
        <view class="list-row">
          <view class="list-dot" style="background: #23A55A;"></view>
          <text class="list-label">Wind Scale</text>
          <text class="list-value">{{ weatherNow?.windScale || '--' }}级</text>
        </view>
      </view>

      <!-- Filter tags: Discord pill tags -->
      <scroll-view scroll-x class="tags-bar" :show-scrollbar="false">
        <view class="tags-wrap">
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

      <!-- Section header -->
      <view class="section-header">
        <text class="section-title">Catches Nearby</text>
        <text class="section-action">View All</text>
      </view>

      <!-- Masonry feed -->
      <view class="masonry" v-if="catchList.length > 0">
        <view class="masonry-col">
          <CatchCard
            v-for="item in catchList"
            :key="'a-' + item.id"
            v-if="getIndex(item) % 2 === 0"
            v-bind="item"
          />
        </view>
        <view class="masonry-col">
          <CatchCard
            v-for="item in catchList"
            :key="'b-' + item.id"
            v-if="getIndex(item) % 2 === 1"
            v-bind="item"
          />
        </view>
      </view>

      <EmptyState
        v-else
        icon=""
        title="No catches yet"
        desc="Start fishing and record your first catch"
        btnText="Start Fishing"
        @action="goToCreate"
      />

      <view class="load-more-area" v-if="loading">
        <LoadingSpinner text="Loading..." />
      </view>

      <view class="end-area" v-if="noMore && catchList.length > 0">
        <text class="end-text">No more</text>
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
  { id: 'all', name: 'All' },
  { id: 'crucian', name: 'Crucian' },
  { id: 'carp', name: 'Carp' },
  { id: 'grass', name: 'Grass Carp' },
  { id: 'bass', name: 'Bass' },
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
.page {
  min-height: 100vh;
  background: #F2F3F5;
  display: flex;
  flex-direction: column;
}

/* ===== Top Bar ===== */
.topbar {
  background: #FFFFFF;
  padding: 12rpx 24rpx 14rpx;
  border-bottom: 2rpx solid rgba(79,84,92,0.12);
}

.topbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.brand-status {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #23A55A;
  box-shadow: 0 0 0 2rpx rgba(35,165,90,0.2);
}

.brand-name {
  font-size: 32rpx;
  font-weight: 700;
  color: #313338;
  letter-spacing: -0.5rpx;
}

.topbar-status {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.status-location {
  font-size: 22rpx;
  color: #5C5E66;
  font-weight: 500;
}

.status-dot-live {
  font-size: 22rpx;
  font-weight: 600;
}

.icon-btn {
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  background: rgba(88,101,242,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.icon-btn:active {
  background: rgba(88,101,242,0.16);
}
.icon-btn svg {
  width: 24rpx;
  height: 24rpx;
}

/* ===== Scroll Content ===== */
.scroll-content {
  flex: 1;
  padding: 16rpx 20rpx;
}

/* ===== Discord Card ===== */
.dc-card {
  background: #FFFFFF;
  border-radius: 8rpx;
  margin-bottom: 12rpx;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
}

/* ===== Index Card ===== */
.index-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 20rpx;
  transition: background 0.15s;
}
.index-card:active {
  background: rgba(79,84,92,0.04);
}

.index-main {
  display: flex;
  align-items: baseline;
  gap: 16rpx;
}

.index-score {
  font-size: 72rpx;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.index-meta {
  display: flex;
  flex-direction: column;
}

.index-label {
  font-size: 20rpx;
  color: #80848E;
  font-weight: 500;
}

.index-level {
  font-size: 26rpx;
  font-weight: 600;
}

.index-right {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.index-desc {
  font-size: 22rpx;
  color: #80848E;
  max-width: 180rpx;
  text-align: right;
  line-height: 1.3;
}

/* ===== Weather List (inset list) ===== */
.weather-list {
  padding: 6rpx 0;
}

.list-row {
  display: flex;
  align-items: center;
  padding: 14rpx 20rpx;
}

.list-row.has-divider {
  border-bottom: 1rpx solid rgba(79,84,92,0.08);
}

.list-dot {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.list-label {
  flex: 1;
  font-size: 28rpx;
  color: #313338;
  font-weight: 500;
}

.list-value {
  font-size: 28rpx;
  color: #80848E;
  font-variant-numeric: tabular-nums;
  font-weight: 500;
}

/* ===== Tags ===== */
.tags-bar {
  margin-bottom: 16rpx;
}

.tags-wrap {
  display: inline-flex;
  gap: 8rpx;
}

.tag {
  display: inline-flex;
  align-items: center;
  height: 44rpx;
  padding: 0 20rpx;
  border-radius: 22rpx;
  background: rgba(79,84,92,0.08);
  transition: background 0.15s;
  flex-shrink: 0;
}
.tag:active {
  background: rgba(79,84,92,0.16);
}
.tag.active {
  background: #5865F2;
}

.tag-text {
  font-size: 24rpx;
  font-weight: 500;
  color: #5C5E66;
  white-space: nowrap;
}
.tag.active .tag-text {
  color: #FFFFFF;
}

/* ===== Section Header ===== */
.section-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 8rpx 0 12rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #313338;
}

.section-action {
  font-size: 24rpx;
  color: #5865F2;
  font-weight: 500;
}

/* ===== Masonry ===== */
.masonry {
  display: flex;
  gap: 12rpx;
}

.masonry-col {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* ===== Bottom ===== */
.load-more-area {
  padding: 48rpx 0;
  display: flex;
  justify-content: center;
}

.end-area {
  padding: 48rpx 0;
  text-align: center;
}

.end-text {
  font-size: 22rpx;
  color: #80848E;
  font-weight: 500;
}
</style>
