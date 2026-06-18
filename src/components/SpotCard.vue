<template>
  <view class="spot-card" @tap="$emit('tap', $event)">
    <!-- 顶部：图标 + 名称 + 评分 -->
    <view class="spot-card-header">
      <view class="spot-card-icon" :style="bgStyle">
        <text class="spot-card-emoji">{{ emoji }}</text>
      </view>
      <view class="spot-card-info">
        <view class="spot-card-name-row">
          <text class="spot-card-name">{{ name }}</text>
          <text class="spot-card-rating">⭐ {{ rating }}</text>
        </view>
        <text class="spot-card-type">{{ typeName }}</text>
      </view>
    </view>

    <!-- 描述 -->
    <text class="spot-card-desc">{{ description }}</text>

    <!-- 地址 -->
    <view class="spot-card-row">
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#80848E" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      <text class="spot-card-address">{{ address }}</text>
    </view>

    <!-- 鱼种 -->
    <view class="spot-card-fish">
      <text class="spot-card-fish-label">目标鱼种：</text>
      <view class="spot-card-fish-tags">
        <text v-for="fish in fishTypes" :key="fish" class="spot-card-fish-tag">{{ fish }}</text>
      </view>
    </view>

    <!-- 底部标签 -->
    <view class="spot-card-bottom">
      <view class="spot-card-tags">
        <view class="spot-card-tag" :class="isPaid ? 'spot-card-tag--paid' : 'spot-card-tag--free'">
          {{ isPaid ? '💰 收费' : '🆓 免费' }}
        </view>
        <view v-if="isPit" class="spot-card-tag spot-card-tag--pit">🐟 黑坑</view>
        <view class="spot-card-tag spot-card-tag--count">🎣 {{ catchCount }}次渔获</view>
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
  description?: string
  address?: string
  fishTypes?: string[]
  isPaid?: boolean
  isPit?: boolean
  catchCount?: number
}>()

defineEmits<{ tap: [e: Event] }>()

// 类型中文名
const typeName = computed(() => {
  const map: Record<string, string> = {
    lake: '湖泊',
    river: '河流',
    pond: '黑坑',
    wild: '野钓',
    sea: '海钓',
  }
  return map[props.type?.toLowerCase()] || props.type
})

// 背景渐变
const bgStyle = computed(() => {
  const gradients: Record<string, string> = {
    lake: 'linear-gradient(135deg, #E8F4FD 0%, #D0E8F9 100%)',
    river: 'linear-gradient(135deg, #E8F8EE 0%, #D0F0D8 100%)',
    pond: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
    wild: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
    sea: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)',
  }
  return { background: gradients[props.type?.toLowerCase()] || gradients.wild }
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
  padding: 14px;
}

.spot-card-header {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
}

.spot-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.spot-card-emoji {
  font-size: 24px;
}

.spot-card-info {
  flex: 1;
  min-width: 0;
}

.spot-card-name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 2px;
}

.spot-card-name {
  font-size: 15px;
  font-weight: 600;
  color: #060607;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.spot-card-rating {
  font-size: 12px;
  color: #F0B232;
  font-weight: 500;
  flex-shrink: 0;
}

.spot-card-type {
  font-size: 12px;
  color: #80848E;
}

.spot-card-desc {
  font-size: 13px;
  color: #4E5058;
  line-height: 1.5;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.spot-card-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
}

.spot-card-address {
  font-size: 12px;
  color: #80848E;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.spot-card-fish {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-bottom: 12px;
}

.spot-card-fish-label {
  font-size: 12px;
  color: #80848E;
  flex-shrink: 0;
}

.spot-card-fish-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.spot-card-fish-tag {
  font-size: 11px;
  color: #5865F2;
  background: rgba(88, 101, 242, 0.08);
  padding: 2px 8px;
  border-radius: 100px;
}

.spot-card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid #F2F3F5;
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

  &--free {
    background: rgba(35, 165, 89, 0.1);
    color: #23A559;
  }

  &--pit {
    background: rgba(88, 101, 242, 0.1);
    color: #5865F2;
  }

  &--count {
    background: #F2F3F5;
    color: #4E5058;
  }
}

.spot-card-arrow {
  font-size: 20px;
  color: #80848E;
}
</style>
