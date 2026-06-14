<template>
  <view class="page-home">
    <!-- Header -->
    <view class="header">
      <view class="header-top">
        <view class="header-logo">
          <view class="logo-icon">🐟</view>
          <view>
            <text class="header-title">首页</text>
            <text class="header-subtitle">渔获·发现</text>
          </view>
        </view>
        <view class="header-actions">
          <view class="header-btn" @tap="onSearch">
            <text class="icon-search">🔍</text>
          </view>
          <view class="header-btn" @tap="onNotify">
            <text class="icon-bell">🔔</text>
          </view>
          <view class="header-btn header-btn--primary" @tap="onCreate">
            <text class="icon-camera">📷</text>
          </view>
        </view>
      </view>
      <scroll-view scroll-x class="tags-scroll" :show-scrollbar="false">
        <view class="tags-inner">
          <view
            v-for="(tag, i) in tags"
            :key="i"
            class="tag"
            :class="{ 'tag--active': activeTag === i }"
            @tap="activeTag = i"
          >
            <text class="tag-text">{{ tag }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- Content -->
    <scroll-view scroll-y class="content" :enhanced="true" :show-scrollbar="false">
      <!-- Weather Mini -->
      <WeatherMini
        :score="82"
        level="适宜"
        suggestion="气压稳定，气温适宜，微风。鲫鱼开口积极，建议使用活饵。"
        temperature="26°C"
        wind="东风3级"
        humidity="65"
        @tap="goWeather"
      />

      <!-- Catch Card 1 -->
      <CatchCard
        nickname="李钓友"
        time="2小时前 · 千岛湖"
        fish-name="3.2斤 鲫鱼"
        fish-emoji="🐟"
        :liked="true"
        :like-count="128"
        :comment-count="32"
        content="今天手感不错，连杆了好几条！这款蓝鲫饵料真的好用。"
        :tags="[
          { text: '鲫鱼', type: undefined },
          { text: '野钓', type: 'green' },
          { text: '战报', type: 'orange' }
        ]"
      />

      <!-- Spot Grid -->
      <view class="card-grid">
        <view class="grid-item" v-for="spot in spotGrid1" :key="spot.name">
          <view class="grid-item-image" :class="spot.bgClass">
            <view class="fish-placeholder-inner">
              <text class="placeholder-emoji">📍</text>
            </view>
          </view>
          <view class="grid-item-body">
            <text class="grid-item-title">{{ spot.name }}</text>
            <view class="grid-item-meta">
              <text>{{ spot.dist }}</text>
              <text class="dot">·</text>
              <text class="grid-item-tag" :class="spot.tagClass">{{ spot.tag }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Catch Card 2 -->
      <CatchCard
        nickname="张大师"
        time="5小时前 · 西湖"
        fish-name="5.6斤 草鱼"
        fish-emoji="🐠"
        :liked="false"
        :like-count="86"
        :comment-count="18"
        content="用玉米打窝，玉米挂钩，守了两个小时终于来口了！大弯弓，爽！"
        :tags="[
          { text: '草鱼', type: undefined },
          { text: '野钓', type: 'green' }
        ]"
      />

      <!-- Spot Grid 2 -->
      <view class="card-grid">
        <view class="grid-item" v-for="spot in spotGrid2" :key="spot.name">
          <view class="grid-item-image" :class="spot.bgClass">
            <view class="fish-placeholder-inner">
              <text class="placeholder-emoji">📍</text>
            </view>
          </view>
          <view class="grid-item-body">
            <text class="grid-item-title">{{ spot.name }}</text>
            <view class="grid-item-meta">
              <text>{{ spot.dist }}</text>
              <text class="dot">·</text>
              <text class="grid-item-tag" :class="spot.tagClass">{{ spot.tag }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Bottom Safe Area -->
      <view style="height: 120rpx;" />
    </scroll-view>

    <!-- FAB -->
    <view class="fab" @tap="onCreate">
      <text class="fab-icon">＋</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WeatherMini from '@/components/WeatherMini.vue'
import CatchCard from '@/components/CatchCard.vue'

const tags = ['全部', '鲫鱼', '鲤鱼', '草鱼', '黑坑', '野钓', '路亚']
const activeTag = ref(0)

const spotGrid1 = [
  { name: '西湖钓点', dist: '2.8km', tag: '推荐', tagClass: 'tag--recommend', bgClass: 'fish-img-2' },
  { name: '老王钓场', dist: '5.1km', tag: '黑坑', tagClass: 'tag--pit', bgClass: 'fish-img-3' },
]

const spotGrid2 = [
  { name: '千岛湖大坝', dist: '12km', tag: '免费', tagClass: 'tag--free', bgClass: 'fish-img-5' },
  { name: '龙王塘', dist: '8.3km', tag: '收费', tagClass: 'tag--paid', bgClass: 'fish-img-6' },
]

function onSearch() {
  // TODO: search
}

function onNotify() {
  // TODO: notifications
}

function onCreate() {
  uni.navigateTo({ url: '/pages/catch/create' })
}

function goWeather() {
  uni.switchTab({ url: '/pages/weather/index' })
}
</script>

<style scoped lang="scss">
/* === Discord Light Theme Colors === */
$bg-page: #F2F3F5;
$bg-card: #FFFFFF;
$brand: #5865F2;
$divider: #E3E5E8;
$text-primary: #060607;
$text-secondary: #4E5058;
$text-muted: #80848E;
$tag-bg: #F2F3F5;
$success: #23A559;
$warning: #F0B232;

.page-home { overflow-x: hidden;
  min-height: 100vh;
  background: $bg-page;
  position: relative;
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
  margin-bottom: 12px;
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
  background: $tag-bg;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.header-btn--primary {
  background: $brand;

  .icon-camera {
    color: #fff;
  }
}

.icon-search, .icon-bell, .icon-camera {
  font-size: 16px;
}

/* Tags */
.tags-scroll {
  white-space: nowrap;
}

.tags-inner {
  display: flex;
  gap: 8px;
}

.tag {
  flex-shrink: 0;
  padding: 6px 14px;
  border-radius: 100px;
  background: $tag-bg;
  cursor: pointer;
  transition: all 0.15s;
}

.tag--active {
  background: $bg-card;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.tag-text {
  font-size: 13px;
  font-weight: 500;
  color: $text-secondary;
}

.tag--active .tag-text {
  color: $text-primary;
}

/* Content */
.content { overflow-x: hidden;
  padding: 12px;
  height: calc(100vh - 140px);
}

/* Grid */
.card-grid {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.grid-item {
  flex: 1;
  background: $bg-card;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid $divider;
}

.grid-item-image {
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fish-placeholder-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: $text-muted;
}

.placeholder-emoji {
  font-size: 32px;
  opacity: 0.4;
}

.grid-item-body {
  padding: 10px 12px;
}

.grid-item-title {
  font-size: 14px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 4px;
  display: block;
}

.grid-item-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: $text-muted;
}

.dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: $divider;
  display: inline-block;
}

.grid-item-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.tag--recommend {
  background: rgba($success, 0.1);
  color: $success;
}

.tag--pit {
  background: rgba($warning, 0.1);
  color: $warning;
}

.tag--free {
  background: rgba($success, 0.1);
  color: $success;
}

.tag--paid {
  background: rgba($warning, 0.1);
  color: $warning;
}

/* Gradient backgrounds */
.fish-img-2 {
  background: linear-gradient(135deg, #E8F5E9 0%, #81C784 100%);
}

.fish-img-3 {
  background: linear-gradient(135deg, #FFF3E0 0%, #FFB74D 100%);
}

.fish-img-5 {
  background: linear-gradient(135deg, #E0F7FA 0%, #4DD0E1 100%);
}

.fish-img-6 {
  background: linear-gradient(135deg, #FBE9E7 0%, #FF8A65 100%);
}

/* FAB */
.fab {
  position: fixed;
  bottom: 100px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: $brand;
  box-shadow: 0 4px 12px rgba(88, 101, 242, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
  cursor: pointer;
}

.fab-icon {
  font-size: 28px;
  color: #fff;
  font-weight: 300;
  line-height: 1;
}
</style>
