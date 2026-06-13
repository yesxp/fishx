<template>
  <view class="comment-section">
    <view class="comment-title">
      <text class="title-text">评论 ({{ comments.length }})</text>
    </view>
    
    <!-- 评论列表 -->
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
      <text class="empty-text">暂无评论，快来抢沙发！</text>
    </view>
    
    <!-- 输入框 -->
    <view class="comment-input-wrap">
      <input 
        class="comment-input" 
        v-model="inputText"
        placeholder="说点什么..."
        confirm-type="send"
        @confirm="handleSubmit"
      />
      <view 
        class="send-btn" 
        :class="{ active: inputText.length > 0 }"
        @click="handleSubmit"
      >
        <text>发送</text>
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
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  return (date.getMonth() + 1) + '月' + date.getDate() + '日'
}

function handleSubmit() {
  if (inputText.value.trim().length === 0) return
  emit('submit', inputText.value.trim())
  inputText.value = ''
}
</script>

<style scoped>
.comment-section {
  background: #FFFFFF;
  border-radius: 20rpx;
  padding: 24rpx;
  box-shadow: 0 2px 12px rgba(26,43,74,.06);
}

.comment-title {
  margin-bottom: 20rpx;
}

.title-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #1A2B4A;
}

.comment-list {
  margin-bottom: 20rpx;
}

.comment-item {
  display: flex;
  gap: 16rpx;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #F1F5F9;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-avatar {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: #E3F2FD;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.comment-name {
  font-size: 24rpx;
  font-weight: 600;
  color: #1A2B4A;
}

.comment-time {
  font-size: 20rpx;
  color: #94A3B8;
}

.comment-text {
  font-size: 26rpx;
  color: #1A2B4A;
  line-height: 1.5;
}

.comment-empty {
  padding: 40rpx;
  text-align: center;
}

.empty-text {
  font-size: 24rpx;
  color: #94A3B8;
}

.comment-input-wrap {
  display: flex;
  gap: 12rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid #F1F5F9;
}

.comment-input {
  flex: 1;
  height: 72rpx;
  background: #F8FAFE;
  border: 2rpx solid #E2E8F0;
  border-radius: 36rpx;
  padding: 0 24rpx;
  font-size: 26rpx;
}

.send-btn {
  padding: 0 24rpx;
  height: 72rpx;
  border-radius: 36rpx;
  background: #E2E8F0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  color: #94A3B8;
  transition: all .2s;
}

.send-btn.active {
  background: linear-gradient(135deg, #2196F3, #00BCD4);
  color: #FFFFFF;
}
</style>