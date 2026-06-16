<template>
  <view class="page-detail">
    <!-- Header -->
    <wd-navbar title="渔获详情" left-arrow fixed placeholder bordered @click-left="goBack" safe-area-inset-top />

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

        <wd-empty v-if="comments.length === 0" description="暂无评论，快来抢沙发！" />

        <view v-else class="comment-list">
          <wd-cell v-for="comment in comments" :key="comment.id" :title="comment.nickname" :label="comment.content" :value="comment.time" clickable>
            <template #icon>
              <view class="comment-avatar">
                <text class="comment-avatar-text">{{ comment.nickname.charAt(0) }}</text>
              </view>
            </template>
          </wd-cell>
        </view>
      </view>

      <view style="height: 120rpx;" />
    </scroll-view>

    <!-- Comment Input -->
    <view class="comment-bar">
      <wd-input v-model="commentText" placeholder="写评论..." @confirm="onSendComment" />
      <wd-button type="primary" size="small" round :disabled="!commentText.trim()" @click="onSendComment">发送</wd-button>
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

.comment-list {
  display: flex;
  flex-direction: column;
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
</style>
