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
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 20rpx;
}

.card-top {
  display: flex;
  gap: 16rpx;
  margin-bottom: 12rpx;
}

.spot-avatar {
  width: 56rpx;
  height: 56rpx;
  border-radius: 14rpx;
  background: #F2F2F7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-emoji {
  font-size: 24rpx;
}

.spot-info {
  flex: 1;
}

.spot-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #000000;
}

.spot-type {
  font-size: 24rpx;
  color: #8E8E93;
  margin-top: 4rpx;
}

.spot-rating {
  display: flex;
  align-items: center;
  gap: 4rpx;
  margin-top: 4rpx;
}

.rating-num {
  font-size: 24rpx;
  font-weight: 600;
  color: #FF9500;
}

.rating-count {
  font-size: 22rpx;
  color: #8E8E93;
}

.card-tags {
  display: flex;
  gap: 8rpx;
  flex-wrap: wrap;
}

.tag-item {
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  background: #F2F2F7;
  font-size: 22rpx;
  color: #3C3C43;
}
</style>
