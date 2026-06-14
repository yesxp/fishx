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
          <text class="rating-count">· {{ catchCount }} catches</text>
        </view>
      </view>
    </view>
    <view class="card-tags">
      <view class="tag-item" v-for="fish in fishTypes" :key="fish">
        <text>{{ fish }}</text>
      </view>
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
  padding: 20rpx 24rpx;
  transition: background 0.15s;
}
.spot-card:active {
  background: rgba(79,84,92,0.03);
}

.card-top {
  display: flex;
  gap: 14rpx;
  margin-bottom: 14rpx;
}

.spot-avatar {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: rgba(88,101,242,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.spot-avatar svg {
  width: 24rpx;
  height: 24rpx;
}

.spot-info {
  flex: 1;
  min-width: 0;
}

.spot-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #060607;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.spot-type {
  font-size: 24rpx;
  color: #80848E;
  margin-top: 2rpx;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  color: #F0B232;
}

.rating-count {
  font-size: 22rpx;
  color: #80848E;
}

.card-tags {
  display: flex;
  gap: 8rpx;
  flex-wrap: wrap;
}

.tag-item {
  padding: 4rpx 14rpx;
  border-radius: 9999px;
  background: rgba(88,101,242,0.08);
  font-size: 22rpx;
  color: #5865F2;
  font-weight: 500;
}
</style>
