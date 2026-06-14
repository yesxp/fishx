<template>
  <view class="spot-card" @tap="$emit('tap', $event)">
    <view class="spot-card-top">
      <view class="spot-card-image" :style="bgStyle">
        <text class="spot-card-emoji">{{ emoji }}</text>
      </view>
      <view class="spot-card-info">
        <text class="spot-card-name">{{ name }}</text>
        <text class="spot-card-type">{{ type }}</text>
        <text class="spot-card-dist">{{ distance }}</text>
      </view>
    </view>
    <view class="spot-card-bottom">
      <view class="spot-card-tags">
        <view v-if="isPaid" class="spot-card-tag spot-card-tag--paid">收费</view>
        <view v-if="isPit" class="spot-card-tag spot-card-tag--pit">黑坑</view>
        <view class="spot-card-tag spot-card-tag--rating">{{ rating }}分</view>
      </view>
      <text class="spot-card-arrow">›</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: string
  type: string
  distance: string
  rating: number
  emoji: string
  isPaid?: boolean
  isPit?: boolean
}>()

defineEmits<{ tap: [e: Event] }>()

const bgStyle = computed(() => {
  const gradients: Record<string, string> = {
    lake: 'linear-gradient(135deg, #E8F4FD 0%, #D0E8F9 100%)',
    river: 'linear-gradient(135deg, #E8F8EE 0%, #D0F0D8 100%)',
    pond: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
    wild: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
  }
  return { background: gradients[props.type.toLowerCase()] || gradients.wild }
})
</script>

<style scoped lang="scss">
.spot-card {
  background: #FFFFFF;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #E3E5E8;
  cursor: pointer;
  transition: transform 0.15s;
}

.spot-card-top {
  display: flex;
  gap: 12px;
  padding: 12px;
}

.spot-card-image {
  width: 80rpx;
  height: 80rpx;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.spot-card-emoji {
  font-size: 32rpx;
}

.spot-card-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2rpx;
}

.spot-card-name {
  font-size: 14px;
  font-weight: 600;
  color: #060607;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.spot-card-type {
  font-size: 12px;
  color: #80848E;
}

.spot-card-dist {
  font-size: 11px;
  color: #5865F2;
  font-weight: 500;
}

.spot-card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px 10px;
}

.spot-card-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.spot-card-tag {
  padding: 3px 8px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 500;

  &--paid {
    background: rgba(240, 178, 50, 0.1);
    color: #E67E22;
  }

  &--pit {
    background: rgba(88, 101, 242, 0.1);
    color: #5865F2;
  }

  &--rating {
    background: #F2F3F5;
    color: #4E5058;
  }
}

.spot-card-arrow {
  font-size: 20px;
  color: #80848E;
}
</style>
