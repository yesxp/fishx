<template>
  <view class="page-map">
    <!-- Header -->
    <view class="header">
      <view class="header-top">
        <view class="header-logo">
          <view class="logo-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></view>
          <view>
            <text class="header-title">钓点</text>
            <text class="header-subtitle">钓点·钓场</text>
          </view>
        </view>
        <view class="header-actions">
          <view class="header-btn" @tap="onSearch">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#5865F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </view>
          <view class="header-btn" @tap="onAdd">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#5865F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </view>
        </view>
      </view>
    </view>

    <!-- Content -->
    <scroll-view scroll-y class="content" :enhanced="true" :show-scrollbar="false">
      <!-- Map Placeholder -->
      <view class="map-placeholder">
        <view class="map-inner">
          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#5865F2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <text class="map-label">地图区域</text>
        </view>
      </view>

      <!-- Tags -->
      <scroll-view scroll-x class="tags-scroll" :show-scrollbar="false">
        <view class="tags-inner">
          <wd-tag
            v-for="(tag, i) in tags"
            :key="i"
            :type="activeTag === i ? 'primary' : 'default'"
            round
            @click="onTagChange(i)"
          >{{ tag }}</wd-tag>
        </view>
      </scroll-view>

      <!-- Loading -->
      <view v-if="loading" class="loading-wrap">
        <wd-loading />
      </view>

      <!-- Spot Cards -->
      <view v-else class="spot-list">
        <view v-if="spots.length === 0" class="empty-wrap">
          <text class="empty-text">暂无钓点数据</text>
          <text class="empty-sub">点击右上角 + 添加钓点</text>
        </view>
        <SpotCard
          v-for="spot in spots"
          :key="spot._id"
          :name="spot.name"
          :type="spot.type"
          :distance="getDistance(spot)"
          :rating="spot.rating"
          :emoji="spot.emoji"
          :description="spot.description"
          :address="spot.address"
          :fish-types="spot.fish_types"
          :is-paid="spot.is_paid"
          :is-pit="spot.is_pit"
          :catch-count="spot.catch_count"
          @tap="onSpotTap(spot)"
        />
      </view>

      <view style="height: 120rpx;" />
    </scroll-view>
  </view>

  <!-- Wot UI TabBar -->
  <WotTabBar current="map" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSpotStore } from '@/stores/spot'
import SpotCard from '@/components/SpotCard.vue'
import WotTabBar from '@/components/WotTabBar.vue'

const spotStore = useSpotStore()

const tags = ['全部', '湖泊', '河流', '黑坑', '野钓', '海钓']
const activeTag = ref(0)
const loading = ref(false)

// 从 store 获取钓点列表
const spots = computed(() => spotStore.spotList)

// 标签切换
async function onTagChange(index: number) {
  activeTag.value = index
  await loadSpots()
}

// 加载钓点
async function loadSpots() {
  loading.value = true
  await spotStore.loadList()
  loading.value = false
}

// 计算距离（简化版，实际应使用地理距离计算）
function getDistance(spot: any): string {
  // TODO: 使用用户位置计算真实距离
  return '...'
}

// 搜索
function onSearch() {
  uni.showToast({ title: '搜索功能开发中', icon: 'none' })
}

// 添加钓点
function onAdd() {
  uni.navigateTo({ url: '/pages/map/create' })
}

// 点击钓点
function onSpotTap(spot: any) {
  uni.navigateTo({ url: `/pages/map/detail?id=${spot._id}` })
}

// 页面加载
onMounted(() => {
  loadSpots()
})
</script>

<style scoped lang="scss">
$bg-page: #F2F3F5;
$bg-card: #FFFFFF;
$brand: #5865F2;
$divider: #E3E5E8;
$text-primary: #060607;
$text-secondary: #4E5058;
$text-muted: #80848E;
$tag-bg: #F2F3F5;

.page-map { overflow-x: hidden;
  min-height: 100vh;
  background: $bg-page;
  max-width: 100vw;
  box-sizing: border-box;
}

/* Header */
.header { position: sticky; top: 0; z-index: 100; background: $bg-card; border-bottom: 1px solid $divider; padding: 12px 16px; }
.header-top { display: flex; align-items: center; justify-content: space-between; }

.header-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: $brand;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.header-title {
  font-size: 18px;
  font-weight: 700;
  color: $text-primary;
  display: block;
  line-height: 1.2;
}

.header-subtitle {
  font-size: 12px;
  color: $text-muted;
  display: block;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.header-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: $tag-bg;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Content */
.content { overflow-x: hidden;
  padding: 12px;
  height: calc(100vh - 60px);
  box-sizing: border-box;
  max-width: 100vw;
}

/* Map Placeholder */
.map-placeholder {
  height: 180px;
  background: linear-gradient(135deg, #E3F2FD 0%, #B3E5FC 50%, #E8F5E9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  border-radius: 12px;
  border: 1px solid $divider;
}

.map-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.map-label {
  font-size: 14px;
  color: $text-muted;
}

/* Tags */
.tags-scroll {
  white-space: nowrap;
  margin-bottom: 12px;
}

.tags-inner {
  display: flex;
  gap: 8px;
}

/* Loading */
.loading-wrap {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

/* Empty */
.empty-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
}

.empty-text {
  font-size: 14px;
  color: $text-muted;
  margin-bottom: 8px;
}

.empty-sub {
  font-size: 12px;
  color: $text-muted;
}

/* Spot List */
.spot-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
}
</style>
