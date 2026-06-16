<template>
  <view class="catch-card">
    <view class="catch-card-header">
      <view class="avatar" :style="{ backgroundImage: avatar ? `url(${avatar})` : undefined }">
        <text v-if="!avatar" class="avatar-placeholder">{{ nickname?.charAt(0) || 'U' }}</text>
      </view>
      <view class="user-info">
        <text class="user-name">{{ nickname }}</text>
        <text class="user-time">{{ time }}</text>
      </view>
    </view>
    <view v-if="imageUrl" class="catch-card-image" @tap="$emit('imageTap', $event)">
      <image :src="imageUrl" mode="aspectFill" class="catch-img" />
    </view>
    <view v-else class="catch-card-image catch-card-image--placeholder">
      <view class="fish-placeholder">
        <text class="fish-emoji">{{ fishEmoji }}</text>
        <text class="fish-weight">{{ weight }} {{ fishName }}</text>
      </view>
    </view>
    <view class="catch-card-body">
      <text v-if="content" class="catch-card-text">{{ content }}</text>
      <view v-if="tags?.length" class="catch-tags">
        <view
          v-for="(tag, i) in tags"
          :key="i"
          class="catch-tag"
          :class="{
            'catch-tag--green': tag.type === 'green',
            'catch-tag--orange': tag.type === 'orange'
          }"
        >
          {{ tag.text }}
        </view>
      </view>
    </view>
    <view class="catch-card-actions">
      <view class="catch-action" :class="{ 'catch-action--liked': liked }" @tap="$emit('like', $event)">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <text>{{ likeCount }}</text>
      </view>
      <view class="catch-action" @tap="$emit('comment', $event)">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <text>{{ commentCount }}</text>
      </view>
      <view class="catch-action" @tap="$emit('share', $event)">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
        <text>分享</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface TagItem {
  text: string
  type?: 'green' | 'orange'
}

defineProps<{
  nickname: string
  time: string
  fishName?: string
  fishEmoji?: string
  weight?: string
  imageUrl?: string
  content?: string
  tags?: TagItem[]
  liked?: boolean
  likeCount: number
  commentCount: number
  avatar?: string
}>()

defineEmits<{
  like: [e: Event]
  comment: [e: Event]
  share: [e: Event]
  imageTap: [e: Event]
}>()
</script>

<style scoped lang="scss">
.catch-card {
  background: #FFFFFF;
  border-radius: 12px;
  margin-bottom: 12px;
  overflow: hidden;
  border: 1px solid #E3E5E8;
}

.catch-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #E3E5E8;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-placeholder {
  font-weight: 600;
  color: #80848E;
  font-size: 14px;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #060607;
  line-height: 1.3;
  display: block;
}

.user-time {
  font-size: 12px;
  color: #80848E;
}

.catch-card-image {
  width: 100%;
  aspect-ratio: 4/3;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F2F3F5;
}

.catch-img {
  width: 100%;
  height: 100%;
}

.catch-card-image--placeholder {
  flex-direction: column;
}

.fish-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #80848E;
}

.fish-emoji {
  font-size: 48px;
  opacity: 0.4;
}

.fish-weight {
  font-size: 13px;
  color: #80848E;
}

.catch-card-body {
  padding: 12px 14px;
}

.catch-card-text {
  font-size: 14px;
  color: #060607;
  line-height: 1.6;
  margin-bottom: 10px;
  display: block;
}

.catch-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.catch-tag {
  padding: 4px 10px;
  border-radius: 100px;
  background: #F2F3F5;
  font-size: 12px;
  color: #5865F2;
  font-weight: 500;

  &--green {
    color: #23A559;
    background: rgba(35, 165, 89, 0.1);
  }

  &--orange {
    color: #E67E22;
    background: rgba(230, 126, 34, 0.1);
  }
}

.catch-card-actions {
  display: flex;
  gap: 20px;
  padding: 10px 14px;
  border-top: 1px solid #E3E5E8;
}

.catch-action {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #80848E;
  cursor: pointer;
  transition: color 0.15s;

  &:hover {
    color: #5865F2;
  }

  &--liked {
    color: #F23F43;
  }
}
</style>
