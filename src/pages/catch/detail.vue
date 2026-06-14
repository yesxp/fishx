<template>
  <view class="page-detail">
    <!-- Header -->
    <view class="header">
      <view class="header-top">
        <view class="header-back" @tap="goBack">
          <text class="back-icon">←</text>
        </view>
        <text class="header-title">渔获详情</text>
        <view style="width: 36px;" />
      </view>
    </view>

    <!-- Content -->
    <scroll-view scroll-y class="content" :enhanced="true" :show-scrollbar="false">
      <!-- Catch Card (full width) -->
      <CatchCard
        :nickname="detail.nickname"
        :time="detail.time"
        :fish-name="detail.fishName"
        fish-emoji="🐟"
        :liked="detail.liked"
        :like-count="detail.likeCount"
        :comment-count="detail.commentCount"
        :content="detail.content"
        :tags="detail.tags"
      />

      <!-- Comments Section -->
      <view class="comments-section">
        <view class="comments-header">
          <text class="comments-title">评论 ({{ comments.length }})</text>
        </view>

        <view v-if="comments.length === 0" class="empty-comments">
          <text class="empty-icon">💬</text>
          <text class="empty-text">暂无评论，快来抢沙发！</text>
        </view>

        <view v-else class="comment-list">
          <view v-for="comment in comments" :key="comment.id" class="comment-item">
            <view class="comment-avatar">
              <text class="comment-avatar-text">{{ comment.nickname.charAt(0) }}</text>
            </view>
            <view class="comment-body">
              <view class="comment-header">
                <text class="comment-nick">{{ comment.nickname }}</text>
                <text class="comment-time">{{ comment.time }}</text>
              </view>
              <text class="comment-content">{{ comment.content }}</text>
            </view>
          </view>
        </view>
      </view>

      <view style="height: 120rpx;" />
    </scroll-view>

    <!-- Comment Input -->
    <view class="comment-bar">
      <input
        v-model="commentText"
        class="comment-input"
        placeholder="写评论..."
        confirm-type="send"
        @confirm="onSendComment"
      />
      <view
        class="comment-send"
        :class="{ 'comment-send--active': commentText.trim() }"
        @tap="onSendComment"
      >
        <text class="send-text">发送</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import CatchCard from '@/components/CatchCard.vue'
import { getComments, addComment } from '@/api/interact'

const detail = reactive({
  nickname: '李钓友',
  time: '2小时前 · 千岛湖',
  fishName: '3.2斤 鲫鱼',
  liked: true,
  likeCount: 128,
  commentCount: 32,
  content: '今天手感不错，连杆了好几条！这款蓝鲫饵料真的好用。',
  tags: [
    { text: '鲫鱼' },
    { text: '野钓', type: 'green' as const },
    { text: '战报', type: 'orange' as const },
  ],
})

interface Comment {
  id: string
  nickname: string
  content: string
  time: string
}

const comments = ref<Comment[]>([])
const commentText = ref('')

async function loadComments() {
  const res = await getComments('1')
  if (res.code === 0) {
    comments.value = res.data.map((c: any) => ({
      id: c.id,
      nickname: c.nickname,
      content: c.content,
      time: formatTime(c.time),
    }))
  }
}

function formatTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}分钟前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}小时前`
  return `${Math.floor(hours / 24)}天前`
}

async function onSendComment() {
  const text = commentText.value.trim()
  if (!text) return

  const res = await addComment('1', text, 'dev_user')
  if (res.code === 0) {
    comments.value.push({
      id: res.data.id,
      nickname: res.data.nickname,
      content: res.data.content,
      time: '刚刚',
    })
    commentText.value = ''
    detail.commentCount++
  }
}

function goBack() {
  uni.navigateBack()
}

// Load on mount
loadComments()
</script>

<style scoped lang="scss">
$bg-page: #F2F3F5;
$bg-card: #FFFFFF;
$brand: #5865F2;
$divider: #E3E5E8;
$text-primary: #060607;
$text-secondary: #4E5058;
$text-muted: #80848E;

.page-detail {
  min-height: 100vh;
  background: $bg-page;
  display: flex;
  flex-direction: column;
}

/* Header */
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

/* Content */
.content {
  flex: 1;
  padding: 12px;
}

/* Comments */
.comments-section {
  background: $bg-card;
  border-radius: 12px;
  border: 1px solid $divider;
  overflow: hidden;
  margin-top: 12px;
}

.comments-header {
  padding: 12px 14px;
  border-bottom: 1px solid $divider;
}

.comments-title {
  font-size: 14px;
  font-weight: 600;
  color: $text-primary;
}

.empty-comments {
  padding: 32px 16px;
  text-align: center;
}

.empty-icon {
  font-size: 32px;
  display: block;
  margin-bottom: 8px;
}

.empty-text {
  font-size: 13px;
  color: $text-muted;
}

.comment-list {
  display: flex;
  flex-direction: column;
}

.comment-item {
  display: flex;
  gap: 10px;
  padding: 12px 14px;
  border-bottom: 1px solid $divider;

  &:last-child {
    border-bottom: none;
  }
}

.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: $divider;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.comment-avatar-text {
  font-size: 12px;
  font-weight: 600;
  color: $text-muted;
}

.comment-body {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.comment-nick {
  font-size: 13px;
  font-weight: 600;
  color: $text-primary;
}

.comment-time {
  font-size: 11px;
  color: $text-muted;
}

.comment-content {
  font-size: 13px;
  color: $text-secondary;
  line-height: 1.5;
}

/* Comment Bar */
.comment-bar {
  position: sticky;
  bottom: 0;
  background: $bg-card;
  border-top: 1px solid $divider;
  padding: 8px 12px;
  display: flex;
  gap: 8px;
  align-items: center;
}

.comment-input {
  flex: 1;
  height: 36px;
  padding: 0 12px;
  background: #F2F3F5;
  border-radius: 100px;
  font-size: 14px;
  color: $text-primary;
}

.comment-send {
  padding: 8px 16px;
  background: $divider;
  border-radius: 100px;
  cursor: pointer;
  transition: background 0.15s;
}

.comment-send--active {
  background: $brand;
}

.send-text {
  font-size: 14px;
  font-weight: 500;
  color: $text-muted;
}

.comment-send--active .send-text {
  color: #fff;
}
</style>
