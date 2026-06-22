<template>
  <view class="page-detail">
    <!-- 沉浸式地图头部 -->
    <view class="detail-map-header">
      <MapView
        v-if="spot"
        :latitude="spot.lat"
        :longitude="spot.lng"
        :markers="[{ id: spot._id, name: spot.name, latitude: spot.lat, longitude: spot.lng, emoji: spot.emoji }]"
        @marker-tap="() => {}"
      />
      <view v-else class="map-placeholder" />
      <!-- 浮层按钮 -->
      <view class="detail-back" @tap="goBack">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
      </view>
      <view class="detail-nav-btn" @tap="onNavigate">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
      </view>
    </view>

    <!-- 内容卡片（覆盖在地图下方） -->
    <view class="detail-content">
      <scroll-view scroll-y class="detail-scroll" :enhanced="true" :show-scrollbar="false">
        <!-- 基本信息卡 -->
        <view class="info-card">
          <view class="info-header">
            <text class="spot-name">{{ spot?.name || '加载中...' }}</text>
            <view class="spot-rating" v-if="spot?.rating">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="#F0B232" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <text class="rating-text">{{ spot.rating }}</text>
              <text class="review-text">({{ spot.review_count }}条评价)</text>
            </view>
          </view>
          <text class="spot-addr" v-if="spot?.address">{{ spot.address }}</text>

          <!-- 类型标签 -->
          <view class="spot-badges">
            <view class="badge-item">
              <text class="badge-icon">📍</text>
              <text class="badge-text">{{ typeLabel(spot?.type) }}</text>
            </view>
            <view class="badge-item">
              <text class="badge-icon">💰</text>
              <text class="badge-text">{{ spot?.is_paid ? '收费' : '免费' }}</text>
            </view>
            <view class="badge-item" v-if="spot?.is_pit">
              <text class="badge-icon">🎯</text>
              <text class="badge-text">黑坑</text>
            </view>
          </view>
        </view>

        <!-- 数据统计 -->
        <view class="stat-card">
          <view class="stat-item">
            <text class="stat-num">{{ spot?.catch_count || 0 }}</text>
            <text class="stat-label">渔获</text>
          </view>
          <view class="stat-divider" />
          <view class="stat-item">
            <text class="stat-num">{{ spot?.review_count || 0 }}</text>
            <text class="stat-label">评价</text>
          </view>
          <view class="stat-divider" />
          <view class="stat-item">
            <text class="stat-num">{{ spot?.fish_types?.length || 0 }}</text>
            <text class="stat-label">鱼种</text>
          </view>
        </view>

        <!-- 鱼种 -->
        <view class="section-card" v-if="spot?.fish_types?.length">
          <text class="section-title">常见鱼种</text>
          <view class="fish-tags">
            <view v-for="f in spot.fish_types" :key="f" class="fish-tag-item">
              <text>{{ f }}</text>
            </view>
          </view>
        </view>

        <!-- 介绍 -->
        <view class="section-card" v-if="spot?.description">
          <text class="section-title">钓点介绍</text>
          <text class="desc-text">{{ spot.description }}</text>
        </view>

        <!-- 标签 -->
        <view class="section-card" v-if="spot?.tags?.length">
          <text class="section-title">标签</text>
          <view class="fish-tags">
            <view v-for="t in spot.tags" :key="t" class="tag-item">
              <text>{{ t }}</text>
            </view>
          </view>
        </view>

        <!-- 渔获列表（Mock） -->
        <view class="section-card">
          <view class="section-header">
            <text class="section-title">最近渔获</text>
            <text class="section-more">查看全部 ></text>
          </view>
          <view class="catch-list">
            <view v-for="c in recentCatches" :key="c.id" class="catch-item">
              <view class="catch-avatar">{{ c.emoji }}</view>
              <view class="catch-info">
                <text class="catch-fish">{{ c.fish }}</text>
                <text class="catch-user">{{ c.user }} · {{ c.time }}</text>
              </view>
              <view class="catch-weight">{{ c.weight }}</view>
            </view>
          </view>
        </view>

        <!-- 评论区（Mock） -->
        <view class="section-card">
          <view class="section-header">
            <text class="section-title">钓友评价</text>
          </view>
          <view class="comment-list">
            <view v-for="c in comments" :key="c.id" class="comment-item">
              <view class="comment-header">
                <text class="comment-avatar">{{ c.avatar }}</text>
                <view class="comment-meta">
                  <text class="comment-name">{{ c.name }}</text>
                  <text class="comment-time">{{ c.time }}</text>
                </view>
                <view class="comment-stars">
                  <svg v-for="i in c.stars" :key="i" viewBox="0 0 24 24" width="12" height="12" fill="#F0B232" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </view>
              </view>
              <text class="comment-text">{{ c.text }}</text>
            </view>
          </view>
        </view>

        <view style="height: 100px;" />
      </scroll-view>

      <!-- 底部操作栏 -->
      <view class="detail-bottom-bar">
        <view class="bottom-btn bottom-btn--outline" @tap="onCheckIn">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#5865F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <text class="bottom-btn-text">打卡</text>
        </view>
        <view class="bottom-btn bottom-btn--outline" @tap="onShare">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#5865F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          <text class="bottom-btn-text">分享</text>
        </view>
        <view class="bottom-btn bottom-btn--primary" @tap="onNavigate">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
          <text class="bottom-btn-text-white">导航到这里</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useSpotStore } from '@/stores/spot'
import MapView from '@/components/MapView.vue'

const spotStore = useSpotStore()
const spot = ref<any>(null)

// Mock 渔获数据
const recentCatches = ref([
  { id: '1', fish: '3.2斤 鲫鱼', weight: '3.2斤', user: '李钓友', time: '2小时前', emoji: '🐟' },
  { id: '2', fish: '5.6斤 草鱼', weight: '5.6斤', user: '张大师', time: '5小时前', emoji: '🐠' },
  { id: '3', fish: '2.1斤 鲤鱼', weight: '2.1斤', user: '老王', time: '昨天', emoji: '🐟' },
])

// Mock 评论数据
const comments = ref([
  { id: '1', avatar: '🎣', name: '钓鱼郎', time: '3天前', stars: 5, text: '鱼口很好，连杆了好几条鲫鱼！水质清澈，环境不错。周末人会多一些，建议工作日去。' },
  { id: '2', avatar: '🐟', name: '新手小白', time: '1周前', stars: 4, text: '第一次来，钓到了2条鲫鱼，很开心。老板很热情，还教了我调漂。' },
])

onLoad((options) => {
  const id = options?.id || 'mock_1'
  loadDetail(id)
})

async function loadDetail(id: string) {
  const data = await spotStore.loadDetail(id)
  spot.value = data
}

function typeLabel(type?: string): string {
  const map: Record<string, string> = { lake: '湖泊', river: '河流', pond: '黑坑', wild: '野钓', sea: '海钓' }
  return map[type || ''] || type || ''
}

function goBack() {
  uni.navigateBack()
}

function onNavigate() {
  if (!spot.value?.lat || !spot.value?.lng) return
  // #ifdef H5
  window.open(`https://uri.amap.com/navigation?to=${spot.value.lng},${spot.value.lat},${encodeURIComponent(spot.value.name)}&mode=car&coordinate=gaode`)
  // #endif
  // #ifndef H5
  uni.openLocation({
    latitude: spot.value.lat,
    longitude: spot.value.lng,
    name: spot.value.name,
    address: spot.value.address,
  })
  // #endif
}

function onCheckIn() {
  uni.showToast({ title: '打卡成功 ✅', icon: 'none' })
}

function onShare() {
  uni.showToast({ title: '分享功能开发中', icon: 'none' })
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

.page-detail {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

/* ===== 沉浸式地图头部 ===== */
.detail-map-header {
  width: 100%;
  height: 280px;
  position: relative;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #E3F2FD 0%, #B3E5FC 50%, #E8F5E9 100%);
}

.detail-back {
  position: absolute;
  top: 0; left: 16px;
  margin-top: env(safe-area-inset-top);
  width: 40px; height: 40px;
  background: rgba(255,255,255,0.9);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 10;
  cursor: pointer;
}

.detail-nav-btn {
  position: absolute;
  top: 0; right: 16px;
  margin-top: env(safe-area-inset-top);
  width: 40px; height: 40px;
  background: $brand;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  z-index: 10;
  cursor: pointer;
}

/* ===== 内容区 ===== */
.detail-content {
  position: absolute;
  top: 250px;
  left: 0; right: 0;
  bottom: 0;
  background: $bg-page;
  border-radius: 16px 16px 0 0;
  z-index: 20;
}

.detail-scroll {
  height: 100%;
  padding: 16px 12px;
}

/* ===== 信息卡 ===== */
.info-card {
  background: $bg-card;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 10px;
}

.info-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 4px;
}

.spot-name {
  font-size: 20px;
  font-weight: 700;
  color: $text-primary;
  flex: 1;
}

.spot-rating {
  display: flex;
  align-items: center;
  gap: 3px;
  flex-shrink: 0;
}

.rating-text {
  font-size: 14px;
  font-weight: 700;
  color: #F0B232;
}

.review-text {
  font-size: 12px;
  color: $text-muted;
}

.spot-addr {
  font-size: 13px;
  color: $text-muted;
  display: block;
  margin-bottom: 12px;
}

.spot-badges {
  display: flex;
  gap: 16px;
}

.badge-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.badge-icon { font-size: 14px; }

.badge-text {
  font-size: 13px;
  color: $text-secondary;
  font-weight: 500;
}

/* ===== 统计卡 ===== */
.stat-card {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: $bg-card;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 10px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-num {
  font-size: 22px;
  font-weight: 700;
  color: $brand;
}

.stat-label {
  font-size: 12px;
  color: $text-muted;
}

.stat-divider {
  width: 1px;
  height: 28px;
  background: $divider;
}

/* ===== 通用区块 ===== */
.section-card {
  background: $bg-card;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 10px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: $text-primary;
  display: block;
  margin-bottom: 12px;
}

.section-header .section-title {
  margin-bottom: 0;
}

.section-more {
  font-size: 13px;
  color: $brand;
}

/* ===== 鱼种标签 ===== */
.fish-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.fish-tag-item {
  padding: 6px 14px;
  background: rgba($brand, 0.08);
  border-radius: 16px;
  font-size: 13px;
  color: $brand;
  font-weight: 500;
}

.tag-item {
  padding: 6px 14px;
  background: $bg-page;
  border-radius: 16px;
  font-size: 13px;
  color: $text-secondary;
}

/* ===== 介绍 ===== */
.desc-text {
  font-size: 14px;
  color: $text-secondary;
  line-height: 1.6;
}

/* ===== 渔获列表 ===== */
.catch-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.catch-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.catch-avatar {
  font-size: 28px;
}

.catch-info {
  flex: 1;
}

.catch-fish {
  font-size: 14px;
  font-weight: 600;
  color: $text-primary;
  display: block;
}

.catch-user {
  font-size: 12px;
  color: $text-muted;
  display: block;
}

.catch-weight {
  font-size: 14px;
  font-weight: 600;
  color: $brand;
}

/* ===== 评论区 ===== */
.comment-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment-item {
  padding-bottom: 16px;
  border-bottom: 1px solid $bg-page;
  &:last-child { border-bottom: none; padding-bottom: 0; }
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.comment-avatar { font-size: 24px; }

.comment-meta { flex: 1; }

.comment-name {
  font-size: 14px;
  font-weight: 600;
  color: $text-primary;
  display: block;
}

.comment-time {
  font-size: 11px;
  color: $text-muted;
  display: block;
}

.comment-stars {
  display: flex;
  gap: 1px;
}

.comment-text {
  font-size: 13px;
  color: $text-secondary;
  line-height: 1.5;
}

/* ===== 底部操作栏 ===== */
.detail-bottom-bar {
  position: absolute;
  bottom: 0;
  left: 0; right: 0;
  display: flex;
  gap: 10px;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  background: $bg-card;
  border-top: 1px solid $divider;
}

.bottom-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 44px;
  border-radius: 12px;
  cursor: pointer;

  &--outline {
    flex: 0 0 auto;
    padding: 0 20px;
    border: 1.5px solid $brand;
    background: transparent;
  }

  &--primary {
    flex: 1;
    background: $brand;
  }
}

.bottom-btn-text {
  font-size: 14px;
  font-weight: 600;
  color: $brand;
}

.bottom-btn-text-white {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}
</style>
