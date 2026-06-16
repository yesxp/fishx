<template>
  <view class="page-map">
    <!-- Header -->
    <wd-navbar fixed placeholder bordered custom-class="custom-navbar" safe-area-inset-top>
      <template #left>
        <view class="header-logo">
          <view class="logo-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></view>
          <view>
            <text class="header-title">钓点</text>
            <text class="header-subtitle">钓点·钓场</text>
          </view>
        </view>
      </template>
      <template #right>
        <view class="header-actions">
          <view class="header-btn">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#5865F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </view>
          <view class="header-btn">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#5865F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </view>
        </view>
      </template>
    </wd-navbar>

    <!-- Content -->
    <scroll-view scroll-y class="content" :enhanced="true" :show-scrollbar="false" :style="{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }">
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
            @click="activeTag = i"
          >{{ tag }}</wd-tag>
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

    <!-- Wot UI TabBar -->
    <WotTabBar current="map" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SpotCard from '@/components/SpotCard.vue'
import WotTabBar from '@/components/WotTabBar.vue'


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

/* Spot List */
.spot-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
