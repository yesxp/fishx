<template>
  <view class="spot-card" @click="goToDetail">
    <view class="card-top">
      <view class="spot-avatar">
        <svg viewBox="0 0 24 24" fill="none" stroke="#5865F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
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
  border-radius: 12rpx;
  padding: 20rpx;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
}

.card-top {
  display: flex;
  gap: 16rpx;
  margin-bottom: 12rpx;
}

.spot-avatar {
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  background: rgba(88,101,242,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.spot-avatar svg {
  width: 28rpx;
  height: 28rpx;
}

.spot-info {
  flex: 1;
}

.spot-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #313338;
}

.spot-type {
  font-size: 22rpx;
  color: #80848E;
  margin-top: 2rpx;
}

.spot-rating {
  display: flex;
  align-items: center;
  gap: 4rpx;
  margin-top: 4rpx;
}

.rating-num {
  font-size: 22rpx;
  font-weight: 600;
  color: #F0B232;
}

.rating-count {
  font-size: 20rpx;
  color: #80848E;
}

.card-tags {
  display: flex;
  gap: 6rpx;
  flex-wrap: wrap;
}

.tag-item {
  padding: 4rpx 10rpx;
  border-radius: 4rpx;
  background: rgba(88,101,242,0.08);
  font-size: 20rpx;
  color: #5865F2;
  font-weight: 500;
}
</style>
