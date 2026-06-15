<template>
  <view class="page-spot-detail">
    <!-- Header -->
    <view class="header">
      <view class="header-top">
        <view class="header-back" @tap="goBack">
          <text class="back-icon">←</text>
        </view>
        <text class="header-title">钓点详情</text>
        <view style="width: 36px;" />
      </view>
    </view>

    <!-- Content -->
    <scroll-view scroll-y class="content" :enhanced="true" :show-scrollbar="false">
      <!-- Map Preview -->
      <view class="map-preview">
        <view class="map-inner">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#5865F2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <text class="map-name">{{ spot?.name || '加载中...' }}</text>
        </view>
      </view>

      <!-- Info -->
      <view class="info-card" v-if="spot">
        <text class="spot-name">{{ spot.name }}</text>
        <text class="spot-type">{{ spot.type }}</text>
        <view class="spot-stats">
          <view class="spot-stat">
            <text class="spot-stat-value">{{ spot.rating }}</text>
            <text class="spot-stat-label">评分</text>
          </view>
          <view class="spot-stat">
            <text class="spot-stat-value">{{ spot.catchCount }}</text>
            <text class="spot-stat-label">渔获数</text>
          </view>
        </view>
        <view class="spot-fish">
          <text class="spot-fish-label">常见鱼种</text>
          <view class="fish-tags">
            <view v-for="f in spot.fishTypes" :key="f" class="fish-tag">
              <text class="fish-tag-text">{{ f }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Action Buttons -->
      <view class="actions">
        <view class="action-btn action-btn--primary" @tap="onCheckIn">
          <text class="action-btn-text">打卡</text>
        </view>
        <view class="action-btn" @tap="onNavigate">
          <text class="action-btn-text--outline">🧭 导航</text>
        </view>
      </view>

      <view style="height: 120rpx;" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useSpotStore } from '@/stores/spot'

const spotStore = useSpotStore()
const spot = ref<any>(null)

onLoad((options) => {
  const id = options?.id || '1'
  loadDetail(id)
})

async function loadDetail(id: string) {
  const data = await spotStore.loadDetail(id)
  spot.value = data
}

function goBack() {
  uni.navigateBack()
}

function onCheckIn() {
  uni.showToast({ title: '打卡成功', icon: 'success' })
}

function onNavigate() {
  uni.showToast({ title: '导航功能开发中', icon: 'none' })
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
$success: #23A559;

.page-spot-detail {
  min-height: 100vh;
  background: $bg-page;
}

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

.header-back {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #F2F3F5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.back-icon {
  font-size: 20px;
  color: $text-secondary;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: $text-primary;
}

.content {
  padding: 12px;
}

.map-preview {
  height: 200px;
  background: linear-gradient(135deg, #E3F2FD 0%, #B3E5FC 50%, #E8F5E9 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
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

.map-name {
  font-size: 14px;
  font-weight: 600;
  color: $text-secondary;
}

.info-card {
  background: $bg-card;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid $divider;
  margin-bottom: 12px;
}

.spot-name {
  font-size: 18px;
  font-weight: 700;
  color: $text-primary;
  display: block;
  margin-bottom: 4px;
}

.spot-type {
  font-size: 13px;
  color: $text-muted;
  display: block;
  margin-bottom: 12px;
}

.spot-stats {
  display: flex;
  gap: 32px;
  margin-bottom: 16px;
}

.spot-stat {
  text-align: center;
}

.spot-stat-value {
  font-size: 20px;
  font-weight: 700;
  color: $text-primary;
  display: block;
}

.spot-stat-label {
  font-size: 12px;
  color: $text-muted;
  display: block;
}

.spot-fish-label {
  font-size: 13px;
  font-weight: 600;
  color: $text-primary;
  display: block;
  margin-bottom: 8px;
}

.fish-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.fish-tag {
  padding: 4px 12px;
  border-radius: 100px;
  background: #F2F3F5;
}

.fish-tag-text {
  font-size: 13px;
  color: $text-secondary;
}

.actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: #F2F3F5;
}

.action-btn--primary {
  background: $brand;
}

.action-btn-text {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
}

.action-btn-text--outline {
  font-size: 15px;
  font-weight: 600;
  color: $text-primary;
}
</style>
