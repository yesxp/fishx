<template>
  <view class="comment-section dc-card">
    <text class="comment-title">{{ comments.length }} Comments</text>

    <view class="comment-list" v-if="comments.length > 0">
      <view class="comment-item" v-for="item in comments" :key="item.id">
        <view class="comment-avatar">{{ item.avatar }}</view>
        <view class="comment-content">
          <view class="comment-header">
            <text class="comment-name">{{ item.nickname }}</text>
            <text class="comment-time">{{ formatTime(item.time) }}</text>
          </view>
          <text class="comment-text">{{ item.content }}</text>
        </view>
      </view>
    </view>

    <view class="comment-empty" v-else>
      <text class="empty-text">No comments yet</text>
    </view>

    <view class="comment-input-wrap">
      <input
        class="comment-input"
        v-model="inputText"
        placeholder="Add a comment..."
        confirm-type="send"
        @confirm="handleSubmit"
      />
      <view
        class="send-btn"
        :class="{ active: inputText.length > 0 }"
        @click="handleSubmit"
      >
        <text>Send</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Comment } from '@/api/interact'

const props = defineProps<{
  comments: Comment[]
}>()

const emit = defineEmits<{
  submit: [content: string]
}>()

const inputText = ref('')

function formatTime(t: string) {
  if (!t) return ''
  const date = new Date(t)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago'
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago'
  return (date.getMonth() + 1) + '/' + date.getDate()
}

function handleSubmit() {
  if (inputText.value.trim().length === 0) return
  emit('submit', inputText.value.trim())
  inputText.value = ''
}
</script>

<style scoped>
.comment-section {
  padding: 20rpx 24rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  margin-bottom: 12rpx;
}

.comment-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #060607;
  margin-bottom: 16rpx;
  display: block;
}

.comment-list {
  margin-bottom: 16rpx;
}

.comment-item {
  display: flex;
  gap: 12rpx;
  padding: 12rpx 0;
  border-bottom: 1rpx solid #E3E5E8;
}
.comment-item:last-child {
  border-bottom: none;
}

.comment-avatar {
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  background: #E3E5E8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4rpx;
}

.comment-name {
  font-size: 24rpx;
  font-weight: 600;
  color: #060607;
}

.comment-time {
  font-size: 20rpx;
  color: #80848E;
}

.comment-text {
  font-size: 26rpx;
  color: #060607;
  line-height: 1.4;
  word-break: break-word;
}

.comment-empty {
  padding: 32rpx 0;
  text-align: center;
}

.empty-text {
  font-size: 24rpx;
  color: #80848E;
}

.comment-input-wrap {
  display: flex;
  gap: 10rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid #E3E5E8;
}

.comment-input {
  flex: 1;
  height: 68rpx;
  background: #E3E5E8;
  border: none;
  border-radius: 9999px;
  padding: 0 20rpx;
  font-size: 26rpx;
  color: #060607;
}

.comment-input::placeholder {
  color: #80848E;
}

.send-btn {
  padding: 0 24rpx;
  height: 68rpx;
  border-radius: 9999px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  font-weight: 600;
  color: #80848E;
  transition: all 0.15s;
}

.send-btn:active {
  background: rgba(88,101,242,0.08);
}

.send-btn.active {
  background: #5865F2;
  color: #FFFFFF;
}
.send-btn.active:active {
  background: #4752C4;
}
</style>
