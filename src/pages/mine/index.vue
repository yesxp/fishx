<template>
  <view class="page-mine">
    <!-- Header -->
    <view class="header">
      <view class="header-top">
        <view class="header-logo">
          <view class="logo-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg></view>
          <view>
            <text class="header-title">我的</text>
            <text class="header-subtitle">个人中心</text>
          </view>
        </view>
        <view class="header-actions">
          <view class="header-btn" @tap="goSettings">
            <wd-icon name="settings" size="18px" color="#80848E" />
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
            <wd-avatar size="80px">{{ userInitial }}</wd-avatar>
            <view class="profile-status" />
        </view>
        <text class="profile-name">{{ nickname }}</text>
        <text class="profile-bio">热爱生活，热爱钓鱼</text>
        <wd-grid :column="3" :border="false" style="margin-top: 16px;">
          <wd-grid-item badge="" text="渔获">
            <template #value>128</template>
          </wd-grid-item>
          <wd-grid-item badge="" text="获赞">
            <template #value>2.4k</template>
          </wd-grid-item>
          <wd-grid-item badge="" text="关注">
            <template #value>86</template>
          </wd-grid-item>
        </wd-grid>
      </view>

      <!-- Menu 1: Data -->
      <wd-cell-group style="margin: 0 12px 12px;">
        <wd-cell v-for="item in menuItems1" :key="item.text" :title="item.text" is-link @click="onMenuTap(item)">
          <template #icon>
            <view class="profile-menu-icon" :class="'profile-menu-icon--' + item.color">
              <wd-icon :name="item.icon" size="18px" :color="item.iconColor" />
            </view>
          </template>
        </wd-cell>
      </wd-cell-group>

      <!-- Menu 2: System -->
      <wd-cell-group style="margin: 0 12px 12px;">
        <wd-cell v-for="item in menuItems2" :key="item.text" :title="item.text" is-link @click="onMenuTap(item)">
          <template #icon>
            <view class="profile-menu-icon" :class="'profile-menu-icon--' + item.color">
              <wd-icon :name="item.icon" size="18px" :color="item.iconColor" />
            </view>
          </template>
        </wd-cell>
      </wd-cell-group>

      <view style="height: 120rpx;" />
    </scroll-view>
  </view>

    <!-- Wot UI TabBar -->
    <WotTabBar current="mine" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import WotTabBar from '@/components/WotTabBar.vue'

const userStore = useUserStore()

const nickname = computed(() => userStore.userInfo?.nickname || '钓鱼达人')
const userInitial = computed(() => nickname.value?.charAt(0) || 'U')

const menuItems1 = [
  { icon: 'image', text: '我的渔获', color: 'blue', iconColor: '#5865F2' },
  { icon: 'heart', text: '我的收藏', color: 'green', iconColor: '#23A559' },
  { icon: 'location', text: '常去钓点', color: 'orange', iconColor: '#F0B232' },
  { icon: 'time-line', text: '钓鱼统计', color: 'blue', iconColor: '#5865F2' },
]

const menuItems2 = [
  { icon: 'settings', text: '设置', color: 'blue', iconColor: '#5865F2' },
  { icon: 'message', text: '意见反馈', color: 'orange', iconColor: '#F0B232' },
  { icon: 'info-circle', text: '关于我们', color: 'green', iconColor: '#23A559' },
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
.header { position: sticky; top: 0; z-index: 100; background: $bg-card; border-bottom: 1px solid $divider; padding: 12px 16px; }
.header-top { display: flex; align-items: center; justify-content: space-between; }




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
  padding: 0 16px 12px;
  background: $bg-card;
  border-bottom: 1px solid $divider;
  margin-bottom: 12px;
  position: relative;
}

.profile-banner {
  height: 120px;
  background: transparent;
  border-radius: 12px 12px 0 0;
  margin: 0 -16px;
}

.profile-avatar-wrap {
  position: relative;
  width: 80px;
  height: 80px;
  margin: -40px auto 12px;
  display: flex;
  justify-content: center;
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

/* Profile Menu */
.profile-menu-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
  margin-right: 8px;
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
</style>
