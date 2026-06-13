<template>
  <view class="spot-card" @click="goToDetail">
    <view class="card-top">
      <view class="spot-avatar">
        <text class="avatar-emoji">📍</text>
      </view>
      <view class="spot-info">
        <text class="spot-name">{{ name }}</text>
        <text class="spot-type">{{ type }}{{ distance ? ' · ' + distance : '' }}</text>
        <view class="spot-rating">
          <text class="rating-star">⭐</text>
          <text class="rating-num">{{ rating }}</text>
          <text class="rating-count">· {{ catchCount }}条渔获</text>
        </view>
      </view>
    </view>
    
    <view class="card-tags">
      <text class="tag-item" v-for="fish in fishTypes" :key="fish">{{ fish }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: string
  name: string
  type: string
  rating: number
  catchCount: number
  fishTypes: string[]
  distance?: string
}>()

function goToDetail() {
  uni.navigateTo({ url: '/pages/map/detail?id=' + props.id })
}
</script>

<style scoped>
.spot-card {
  background: rgba(255,255,255,.95);
  backdrop-filter: blur(16px);
  border-radius: 20rpx;
  padding: 20rpx;
  box-shadow: 0 4px 20px rgba(0,0,0,.1);
}

.card-top {
  display: flex;
  gap: 16rpx;
  margin-bottom: 12rpx;
}

.spot-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 16rpx;
  background: linear-gradient(135deg, #2196F3, #00BCD4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-emoji {
  font-size: 28rpx;
}

.spot-info {
  flex: 1;
}

.spot-name {
  font-size: 30rpx;
  font-weight: 700;
  color: #1A2B4A;
}

.spot-type {
  font-size: 22rpx;
  color: #6B7A99;
  margin-top: 4rpx;
}

.spot-rating {
  display: flex;
  align-items: center;
  gap: 4rpx;
  margin-top: 4rpx;
}

.rating-star {
  font-size: 20rpx;
}

.rating-num {
  font-size: 24rpx;
  font-weight: 600;
  color: #FF9800;
}

.rating-count {
  font-size: 22rpx;
  color: #6B7A99;
}

.card-tags {
  display: flex;
  gap: 8rpx;
  flex-wrap: wrap;
}

.tag-item {
  padding: 4rpx 12rpx;
  border-radius: 100px;
  background: #E3F2FD;
  font-size: 20rpx;
  color: #2196F3;
}
</style>