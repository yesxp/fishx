<template>
  <view class="like-btn" @click="handleToggle">
    <text class="like-icon" :class="{ active: liked }">
      {{ liked ? '❤️' : '🤍' }}
    </text>
    <text class="like-count" :class="{ active: liked }">{{ count }}</text>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  liked: boolean
  count: number
}>()

const emit = defineEmits<{
  toggle: []
}>()

function handleToggle() {
  emit('toggle')
}
</script>

<style scoped>
.like-btn {
  display: flex;
  align-items: center;
  gap: 6rpx;
  cursor: pointer;
}

.like-icon {
  font-size: 28rpx;
  transition: transform .2s;
}

.like-icon.active {
  transform: scale(1.2);
}

.like-count {
  font-size: 24rpx;
  color: #6B7A99;
}

.like-count.active {
  color: #F44336;
}
</style>