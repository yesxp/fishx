<template>
  <view class="page-mine">
    <!-- Header -->
    <view class="header">
      <view class="header-top">
        <view class="header-logo">
          <view class="logo-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></view>
          <view>
            <text class="header-title">我的</text>
            <text class="header-subtitle">个人中心</text>
          </view>
        </view>
        <view class="header-actions">
          <view class="header-btn" @tap="goSettings">
            <text class="icon-text">⚙️</text>
          </view>
        </view>
      </view>
    </view>

    <!-- Content -->
    <scroll-view scroll-y class="content" :enhanced="true" :show-scrollbar="false">
      <!-- Profile Header -->
      <view class="profile-header">
        <view class="profile-banner" />
        <view class="profile-avatar-wrap">
          <view class="profile-avatar">
            <text class="profile-avatar-text">{{ userInitial }}</text>
          </view>
          <view class="profile-status" />
        </view>
        <text class="profile-name">{{ nickname }}</text>
        <text class="profile-bio">热爱生活，热爱钓鱼</text>
        <view class="profile-stats">
          <view class="profile-stat">
            <text class="profile-stat-value">128</text>
            <text class="profile-stat-label">渔获</text>
          </view>
          <view class="profile-stat">
            <text class="profile-stat-value">2.4k</text>
            <text class="profile-stat-label">获赞</text>
          </view>
          <view class="profile-stat">
            <text class="profile-stat-value">86</text>
            <text class="profile-stat-label">关注</text>
          </view>
        </view>
      </view>

      <!-- Menu 1: Data -->
      <view class="profile-menu">
        <view class="profile-menu-item" v-for="item in menuItems1" :key="item.text" @tap="onMenuTap(item)">
          <view class="profile-menu-icon" :class="'profile-menu-icon--' + item.color">
            <view v-html="menuIcons[item.icon]" />
          </view>
          <text class="profile-menu-text">{{ item.text }}</text>
          <text class="profile-menu-arrow">›</text>
        </view>
      </view>

      <!-- Menu 2: System -->
      <view class="profile-menu">
        <view class="profile-menu-item" v-for="item in menuItems2" :key="item.text" @tap="onMenuTap(item)">
          <view class="profile-menu-icon" :class="'profile-menu-icon--' + item.color">
            <view v-html="menuIcons[item.icon]" />
          </view>
          <text class="profile-menu-text">{{ item.text }}</text>
          <text class="profile-menu-arrow">›</text>
        </view>
      </view>

      <view style="height: 120rpx;" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const nickname = computed(() => userStore.userInfo?.nickname || '钓鱼达人')
const userInitial = computed(() => nickname.value?.charAt(0) || 'U')

const menuIcons: Record<string, string> = {
  camera: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
  heart: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  chart: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  settings: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  feedback: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  info: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
}

const menuItems1 = [
  { icon: 'camera', text: '我的渔获', color: 'blue' },
  { icon: 'heart', text: '我的收藏', color: 'green' },
  { icon: 'pin', text: '常去钓点', color: 'orange' },
  { icon: 'chart', text: '钓鱼统计', color: 'blue' },
]

const menuItems2 = [
  { icon: 'settings', text: '设置', color: 'blue' },
  { icon: 'feedback', text: '意见反馈', color: 'orange' },
  { icon: 'info', text: '关于我们', color: 'green' },
]

function goSettings() {
  // TODO: navigate to settings
}

function onMenuTap(item: any) {
  uni.showToast({ title: item.text, icon: 'none' })
}
</script>

<style scoped lang="scss">
$bg-page: #F2F3F5;
$bg-card: #FFFFFF;
$brand: #5865F2;
$divider: #E3E5E8;
$text-primary: #060607;
$text-secondary: #4E5058;
$text-muted: #80848E;

.page-mine { overflow-x: hidden;
  min-height: 100vh;
  background: $bg-page;
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

.header-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: $brand;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.header-title {
  font-size: 18px;
  font-weight: 700;
  color: $text-primary;
  display: block;
  line-height: 1.2;
}

.header-subtitle {
  font-size: 12px;
  color: $text-muted;
  display: block;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.header-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #F2F3F5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-text {
  font-size: 16px;
}

/* Content */
.content {
  padding: 0 0 0 0;
  height: calc(100vh - 60px);
}

/* Profile Header */
.profile-header {
  text-align: center;
  padding: 0 16px 24px;
  background: $bg-card;
  border-bottom: 1px solid $divider;
  margin-bottom: 12px;
  position: relative;
}

.profile-banner {
  height: 120px;
  background: linear-gradient(135deg, #5865F2 0%, #4752C4 50%, #3C45A5 100%);
  border-radius: 12px 12px 0 0;
  margin: 0 -16px;
}

.profile-avatar-wrap {
  position: relative;
  width: 80px;
  height: 80px;
  margin: -40px auto 12px;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: $divider;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid $bg-card;
  box-sizing: border-box;
}

.profile-status {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: $status-green;
  border: 3px solid $bg-card;
}

.profile-avatar-text {
  font-size: 28px;
  font-weight: 600;
  color: $text-muted;
}

.profile-name {
  font-size: 18px;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 4px;
  display: block;
}

.profile-bio {
  font-size: 13px;
  color: $text-muted;
  display: block;
}

.profile-stats {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-top: 16px;
}

.profile-stat {
  text-align: center;
}

.profile-stat-value {
  font-size: 18px;
  font-weight: 700;
  color: $text-primary;
  display: block;
}

.profile-stat-label {
  font-size: 12px;
  color: $text-muted;
  display: block;
}

/* Profile Menu */
.profile-menu {
  background: $bg-card;
  border-radius: 12px;
  margin: 0 12px 12px;
  border: 1px solid $divider;
  overflow: hidden;
}

.profile-menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid $divider;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background: #F2F3F5;
  }
}

.profile-menu-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.profile-menu-icon--blue {
  background: rgba($brand, 0.1);
}

.profile-menu-icon--green {
  background: rgba(#23A559, 0.1);
}

.profile-menu-icon--orange {
  background: rgba(#F0B232, 0.1);
}

.profile-menu-text {
  flex: 1;
  font-size: 14px;
  color: $text-primary;
}

.profile-menu-arrow {
  font-size: 14px;
  color: $text-muted;
}
</style>
