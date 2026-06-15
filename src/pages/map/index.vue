<template>
  <view class="page-map">
    <!-- Header -->
    <view class="header">
      <view class="header-top">
        <view class="header-logo">
          <view class="logo-icon">📍</view>
          <view>
            <text class="header-title">钓点</text>
            <text class="header-subtitle">钓点·钓场</text>
          </view>
        </view>
        <view class="header-actions">
          <view class="header-btn">
            <text class="icon-text">🔍</text>
          </view>
          <view class="header-btn">
            <text class="icon-text">🔔</text>
          </view>
        </view>
      </view>
    </view>

    <!-- Content -->
    <scroll-view scroll-y class="content" :enhanced="true" :show-scrollbar="false" :style="{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }">
      <!-- Map Placeholder -->
      <view class="map-placeholder">
        <view class="map-inner">
          <text class="map-pin">📍</text>
          <text class="map-label">地图区域</text>
        </view>
      </view>

      <!-- Tags -->
      <scroll-view scroll-x class="tags-scroll" :show-scrollbar="false">
        <view class="tags-inner">
          <view
            v-for="(tag, i) in tags"
            :key="i"
            class="tag"
            :class="{ 'tag--active': activeTag === i }"
            @tap="activeTag = i"
          >
            <text class="tag-text">{{ tag }}</text>
          </view>
        </view>
      </scroll-view>

      <!-- Spot Cards -->
      <view class="spot-list">
        <SpotCard
          v-for="spot in spots"
          :key="spot.name"
          :name="spot.name"
          :type="spot.type"
          :distance="spot.distance"
          :rating="spot.rating"
          :emoji="spot.emoji"
          :is-paid="spot.isPaid"
          :is-pit="spot.isPit"
          @tap="onSpotTap(spot)"
        />
      </view>

      <view style="height: 120rpx;" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SpotCard from '@/components/SpotCard.vue'

const tags = ['全部', '路亚', '台钓', '海钓']
const activeTag = ref(0)

const spots = [
  {
    name: '西湖钓点',
    type: 'lake',
    distance: '2.8km',
    rating: 4.8,
    emoji: '🏞️',
    isPaid: false,
    isPit: false,
  },
  {
    name: '老王钓场',
    type: 'pond',
    distance: '5.1km',
    rating: 4.5,
    emoji: '🐟',
    isPaid: true,
    isPit: true,
  },
  {
    name: '千岛湖大坝',
    type: 'wild',
    distance: '12km',
    rating: 4.9,
    emoji: '⛰️',
    isPaid: false,
    isPit: false,
  },
  {
    name: '龙王塘',
    type: 'pond',
    distance: '8.3km',
    rating: 4.2,
    emoji: '🎣',
    isPaid: true,
    isPit: true,
  },
]

function onSpotTap(spot: any) {
  uni.navigateTo({ url: `/pages/map/detail?id=${spot.name}` })
}
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
}

/* Header */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: $bg-card;
  border-bottom: 1px solid $divider;
  padding: 12px 16px;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

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

.icon-text {
  font-size: 16px;
}

/* Content */
.content { overflow-x: hidden;
  padding: 12px;
  height: calc(100vh - 60px);
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

.map-pin {
  font-size: 40px;
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

.tag {
  flex-shrink: 0;
  padding: 6px 14px;
  border-radius: 100px;
  background: $tag-bg;
  cursor: pointer;
  transition: all 0.15s;
}

.tag--active {
  background: $bg-card;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.tag-text {
  font-size: 13px;
  font-weight: 500;
  color: $text-secondary;
}

.tag--active .tag-text {
  color: $text-primary;
}

/* Spot List */
.spot-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
