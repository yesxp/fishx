<template>
  <view class="page-detail">
    <!-- 轮播图头部 -->
    <view class="detail-banner">
      <swiper 
        class="banner-swiper" 
        :indicator-dots="true" 
        indicator-color="rgba(255,255,255,0.4)" 
        indicator-active-color="#FFFFFF"
        :autoplay="true" 
        :interval="4000" 
        :circular="true"
        @change="onSwiperChange"
      >
        <swiper-item v-for="(img, i) in bannerImages" :key="i">
          <view class="banner-item" :style="{ background: img.bg }">
            <text class="banner-emoji">{{ img.emoji }}</text>
            <view class="banner-tag" v-if="img.tag">
              <text>{{ img.tag }}</text>
            </view>
          </view>
        </swiper-item>
      </swiper>
      <!-- 浮层按钮 -->
      <view class="detail-back" @tap="goBack">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
      </view>
      <view class="detail-share-btn" @tap="onShare">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
      </view>
      <!-- 图片计数 -->
      <view class="banner-count">
        <text>{{ currentImgIndex + 1 }}/{{ bannerImages.length }}</text>
      </view>
    </view>

    <!-- 内容卡片 -->
    <view class="detail-content">
      <scroll-view scroll-y class="detail-scroll" :enhanced="true" :show-scrollbar="false">
        
        <!-- 基本信息 -->
        <view class="info-card">
          <view class="info-header">
            <view class="info-title-row">
              <text class="spot-name">{{ spot?.name || '加载中...' }}</text>
              <view class="spot-rating" v-if="spot?.rating">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="#F0B232" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <text class="rating-num">{{ spot.rating }}</text>
                <text class="rating-count">({{ spot.review_count }}条评价)</text>
              </view>
            </view>
            <text class="spot-addr" v-if="spot?.address">📍 {{ spot.address }}</text>
            <!-- 标签行 -->
            <view class="spot-badges">
              <view class="badge-item">
                <text class="badge-icon">🗺️</text>
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
        </view>

        <!-- 数据统计 -->
        <view class="stat-card">
          <view class="stat-item" @tap="onStatTap('catch')">
            <text class="stat-num">{{ spot?.catch_count || 0 }}</text>
            <text class="stat-label">渔获</text>
          </view>
          <view class="stat-divider" />
          <view class="stat-item" @tap="onStatTap('review')">
            <text class="stat-num">{{ spot?.review_count || 0 }}</text>
            <text class="stat-label">评价</text>
          </view>
          <view class="stat-divider" />
          <view class="stat-item">
            <text class="stat-num">{{ spot?.fish_types?.length || 0 }}</text>
            <text class="stat-label">鱼种</text>
          </view>
        </view>

        <!-- 常见鱼种 -->
        <view class="section-card" v-if="spot?.fish_types?.length">
          <text class="section-title">常见鱼种</text>
          <view class="fish-tags">
            <view v-for="f in spot.fish_types" :key="f" class="fish-tag-item">
              <text>{{ getFishEmoji(f) }} {{ f }}</text>
            </view>
          </view>
        </view>

        <!-- 钓点介绍 -->
        <view class="section-card" v-if="spot?.description">
          <text class="section-title">钓点介绍</text>
          <text class="desc-text">{{ spot.description }}</text>
        </view>

        <!-- 标签 -->
        <view class="section-card" v-if="spot?.tags?.length">
          <text class="section-title">特色标签</text>
          <view class="fish-tags">
            <view v-for="t in spot.tags" :key="t" class="tag-item">
              <text>{{ t }}</text>
            </view>
          </view>
        </view>

        <!-- 交通信息 -->
        <view class="section-card">
          <text class="section-title">交通指南</text>
          <view class="traffic-item">
            <view class="traffic-icon traffic-icon--car">🚗</view>
            <view class="traffic-info">
              <text class="traffic-label">驾车导航</text>
              <text class="traffic-desc">距您{{ getDistance() }}，约{{ estimateTime() }}到达</text>
            </view>
          </view>
          <view class="traffic-item" v-if="spot?.type !== 'sea'">
            <view class="traffic-icon traffic-icon--park">🅿️</view>
            <view class="traffic-info">
              <text class="traffic-label">停车信息</text>
              <text class="traffic-desc">{{ spot?.is_pit ? '有停车场（钓场内）' : '路边可停车' }}</text>
            </view>
          </view>
          <view class="traffic-item" v-if="spot?.is_pit">
            <view class="traffic-icon traffic-icon--food">🍜</view>
            <view class="traffic-info">
              <text class="traffic-label">配套服务</text>
              <text class="traffic-desc">提供午饭、装备租赁、夜钓服务</text>
            </view>
          </view>
        </view>

        <!-- 最佳时段 -->
        <view class="section-card">
          <text class="section-title">最佳钓鱼时段</text>
          <view class="time-grid">
            <view v-for="slot in bestTimeSlots" :key="slot.label" class="time-slot" :class="{ 'time-slot--active': slot.active }">
              <text class="time-icon">{{ slot.icon }}</text>
              <text class="time-label">{{ slot.label }}</text>
              <text class="time-desc">{{ slot.desc }}</text>
            </view>
          </view>
        </view>

        <!-- 最近渔获 -->
        <view class="section-card">
          <view class="section-header">
            <text class="section-title">最近渔获</text>
            <text class="section-more">查看全部 ></text>
          </view>
          <view class="catch-list">
            <view v-for="c in recentCatches" :key="c.id" class="catch-item" @tap="onCatchTap(c)">
              <view class="catch-avatar" :style="{ background: c.bg }">
                <text>{{ c.emoji }}</text>
              </view>
              <view class="catch-info">
                <text class="catch-fish">{{ c.fish }}</text>
                <text class="catch-user">{{ c.user }} · {{ c.time }}</text>
              </view>
              <view class="catch-weight">{{ c.weight }}</view>
            </view>
          </view>
        </view>

        <!-- 钓友评价 -->
        <view class="section-card">
          <view class="section-header">
            <text class="section-title">钓友评价</text>
            <text class="section-more">全部 {{ spot?.review_count || 0 }}条 ></text>
          </view>
          <view class="comment-list">
            <view v-for="c in comments" :key="c.id" class="comment-item">
              <view class="comment-header">
                <view class="comment-avatar" :style="{ background: c.bg }">
                  <text>{{ c.avatar }}</text>
                </view>
                <view class="comment-meta">
                  <text class="comment-name">{{ c.name }}</text>
                  <text class="comment-time">{{ c.time }}</text>
                </view>
                <view class="comment-stars">
                  <svg v-for="i in c.stars" :key="i" viewBox="0 0 24 24" width="12" height="12" fill="#F0B232" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <svg v-for="j in (5 - c.stars)" :key="'e'+j" viewBox="0 0 24 24" width="12" height="12" fill="#E3E5E8" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </view>
              </view>
              <text class="comment-text">{{ c.text }}</text>
              <!-- 评价图片 -->
              <view v-if="c.images?.length" class="comment-images">
                <view v-for="(img, idx) in c.images" :key="idx" class="comment-img-item" :style="{ background: img }">
                  <text class="comment-img-emoji">🐟</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 周边推荐 -->
        <view class="section-card">
          <text class="section-title">周边钓点推荐</text>
          <scroll-view scroll-x class="nearby-scroll" :show-scrollbar="false">
            <view class="nearby-list">
              <view v-for="n in nearbySpots" :key="n.id" class="nearby-item" @tap="onNearbyTap(n)">
                <view class="nearby-avatar" :style="{ background: n.bg }">
                  <text class="nearby-emoji">{{ n.emoji }}</text>
                </view>
                <text class="nearby-name">{{ n.name }}</text>
                <text class="nearby-dist">{{ n.distance }}</text>
              </view>
            </view>
          </scroll-view>
        </view>

        <view style="height: 100px;" />
      </scroll-view>

      <!-- 底部操作栏 -->
      <view class="detail-bottom-bar">
        <view class="bar-btn bar-btn--icon" @tap="onCheckIn">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#5865F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <text class="bar-btn-text">打卡</text>
        </view>
        <view class="bar-btn bar-btn--icon" @tap="onCollect">
          <svg viewBox="0 0 24 24" width="20" height="20" :fill="collected ? '#ED4245' : 'none'" :stroke="collected ? '#ED4245' : '#5865F2'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <text class="bar-btn-text" :class="{ 'bar-btn-text--red': collected }">收藏</text>
        </view>
        <view class="bar-btn bar-btn--nav" @tap="onNavigate">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
          <text class="bar-btn-nav-text">导航到这里</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useSpotStore } from '@/stores/spot'
import { calculateDistance, formatDistance } from '@/lib/amap'

const spotStore = useSpotStore()
const spot = ref<any>(null)
const collected = ref(false)
const currentImgIndex = ref(0)

// Banner 图片 Mock
const bannerImages = ref([
  { emoji: '🏞️', bg: 'linear-gradient(135deg, #E8F5E9 0%, #81C784 50%, #C8E6C9 100%)', tag: '实拍' },
  { emoji: '🐟', bg: 'linear-gradient(135deg, #E3F2FD 0%, #64B5F6 50%, #BBDEFB 100%)', tag: '鱼获' },
  { emoji: '🎣', bg: 'linear-gradient(135deg, #FFF3E0 0%, #FFB74D 50%, #FFE0B2 100%)', tag: '' },
  { emoji: '🌅', bg: 'linear-gradient(135deg, #FCE4EC 0%, #F48FB1 50%, #F8BBD0 100%)', tag: '日落' },
  { emoji: '⛰️', bg: 'linear-gradient(135deg, #E0F7FA 0%, #4DD0E1 50%, #B2EBF2 100%)', tag: '' },
])

// 最佳时段
const bestTimeSlots = ref([
  { icon: '🌅', label: '清晨', desc: '6:00-9:00', active: true },
  { icon: '☀️', label: '上午', desc: '9:00-12:00', active: false },
  { icon: '🌇', label: '傍晚', desc: '16:00-19:00', active: true },
  { icon: '🌙', label: '夜间', desc: '20:00-23:00', active: false },
])

// Mock 渔获数据
const recentCatches = ref([
  { id: '1', fish: '3.2斤 鲫鱼', weight: '3.2斤', user: '李钓友', time: '2小时前', emoji: '🐟', bg: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)' },
  { id: '2', fish: '5.6斤 草鱼', weight: '5.6斤', user: '张大师', time: '5小时前', emoji: '🐠', bg: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)' },
  { id: '3', fish: '2.1斤 鲤鱼', weight: '2.1斤', user: '老王', time: '昨天', emoji: '🐟', bg: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)' },
  { id: '4', fish: '8.3斤 青鱼', weight: '8.3斤', user: '钓鱼郎', time: '2天前', emoji: '🎣', bg: 'linear-gradient(135deg, #FCE4EC 0%, #F8BBD0 100%)' },
  { id: '5', fish: '1.8斤 鳊鱼', weight: '1.8斤', user: '新手小白', time: '3天前', emoji: '🐟', bg: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)' },
])

// Mock 评论数据
const comments = ref([
  { 
    id: '1', avatar: '🎣', name: '钓鱼郎', time: '3天前', stars: 5, bg: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
    text: '鱼口很好，连杆了好几条鲫鱼！水质清澈，环境不错。周末人会多一些，建议工作日去。用蚯蚓钓效果最佳，蓝鲫打窝。',
    images: ['linear-gradient(135deg, #E8F5E9 0%, #81C784 100%)', 'linear-gradient(135deg, #E3F2FD 0%, #64B5F6 100%)'],
  },
  { 
    id: '2', avatar: '🐟', name: '新手小白', time: '1周前', stars: 4, bg: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
    text: '第一次来，钓到了2条鲫鱼，很开心。老板很热情，还教了我调漂。停车方便，就是蚊子有点多，记得带驱蚊水。',
    images: [],
  },
  { 
    id: '3', avatar: '🐠', name: '老王', time: '2周前', stars: 5, bg: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
    text: '钓了十年的老钓位了，每次来都有收获。大物池有10斤以上的青鱼，不过需要碰运气。推荐用玉米打窝，蚯蚓挂钩。',
    images: ['linear-gradient(135deg, #FFF3E0 0%, #FFB74D 100%)'],
  },
])

// 周边推荐 Mock
const nearbySpots = ref([
  { id: 'near_1', name: '老王钓场', emoji: '🐟', distance: '5.1km', bg: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)' },
  { id: 'near_2', name: '千岛湖大坝', emoji: '⛰️', distance: '12km', bg: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)' },
  { id: 'near_3', name: '龙王塘路亚', emoji: '🎣', distance: '8.3km', bg: 'linear-gradient(135deg, #FCE4EC 0%, #F8BBD0 100%)' },
  { id: 'near_4', name: '富春江钓场', emoji: '🏞️', distance: '15km', bg: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)' },
])

// 用户位置（用于距离计算）
const userLat = ref(30.25)
const userLng = ref(120.15)

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

function getFishEmoji(fish: string): string {
  const map: Record<string, string> = { '鲫鱼': '🐟', '鲤鱼': '🐟', '草鱼': '🐠', '青鱼': '🐠', '鳊鱼': '🐟', '鲈鱼': '🐠', '翘嘴': '🐠', '鳜鱼': '🐠', '鲢鱼': '🐟', '鳙鱼': '🐟', '鲶鱼': '🐟' }
  return map[fish] || '🐟'
}

function getDistance(): string {
  if (!spot.value?.lat || !spot.value?.lng) return '...'
  const meters = calculateDistance(userLat.value, userLng.value, spot.value.lat, spot.value.lng)
  return formatDistance(meters)
}

function estimateTime(): string {
  if (!spot.value?.lat || !spot.value?.lng) return '...'
  const meters = calculateDistance(userLat.value, userLng.value, spot.value.lat, spot.value.lng)
  const minutes = Math.round(meters / 500)
  if (minutes < 60) return `${minutes}分钟`
  return `${(minutes / 60).toFixed(1)}小时`
}

function onSwiperChange(e: any) {
  currentImgIndex.value = e.detail.current
}

function goBack() { uni.navigateBack() }

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

function onCollect() {
  collected.value = !collected.value
  uni.showToast({ title: collected.value ? '已收藏 ❤️' : '取消收藏', icon: 'none' })
}

function onShare() {
  uni.showToast({ title: '分享功能开发中', icon: 'none' })
}

function onStatTap(type: string) {
  uni.showToast({ title: `${type === 'catch' ? '渔获' : '评价'}列表开发中`, icon: 'none' })
}

function onCatchTap(c: any) {
  uni.showToast({ title: `${c.fish} 详情开发中`, icon: 'none' })
}

function onNearbyTap(n: any) {
  // 跳转到其他钓点详情
  uni.redirectTo({ url: `/pages/map/detail?id=${n.id}` })
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
  background: $bg-page;
}

/* ===== Banner 轮播图 ===== */
.detail-banner {
  width: 100%;
  height: 300px;
  position: relative;
}

.banner-swiper {
  width: 100%;
  height: 100%;
}

.banner-item {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.banner-emoji {
  font-size: 80px;
}

.banner-tag {
  position: absolute;
  top: env(safe-area-inset-top);
  right: 16px;
  margin-top: 12px;
  padding: 4px 10px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  font-size: 11px;
  color: #fff;
}

.banner-count {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 3px 12px;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 12px;
  font-size: 12px;
  color: #fff;
}

.detail-back {
  position: absolute;
  top: 0; left: 16px;
  margin-top: env(safe-area-inset-top);
  width: 40px; height: 40px;
  background: rgba(255,255,255,0.92);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 10;
  cursor: pointer;
}

.detail-share-btn {
  position: absolute;
  top: 0; right: 16px;
  margin-top: env(safe-area-inset-top);
  width: 40px; height: 40px;
  background: rgba(255,255,255,0.92);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 10;
  cursor: pointer;
}

/* ===== 内容区 ===== */
.detail-content {
  position: absolute;
  top: 270px;
  left: 0; right: 0; bottom: 0;
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

.info-header { }

.info-title-row {
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

.rating-num {
  font-size: 14px;
  font-weight: 700;
  color: #F0B232;
}

.rating-count {
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
  cursor: pointer;
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

/* ===== 交通信息 ===== */
.traffic-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid $bg-page;
  &:last-child { border-bottom: none; }
}

.traffic-icon {
  width: 40px; height: 40px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px;
  &--car { background: rgba($brand, 0.1); }
  &--park { background: rgba(#23A559, 0.1); }
  &--food { background: rgba(#F0B232, 0.1); }
}

.traffic-info { flex: 1; }
.traffic-label { font-size: 14px; font-weight: 600; color: $text-primary; display: block; }
.traffic-desc { font-size: 12px; color: $text-muted; display: block; margin-top: 2px; }

/* ===== 最佳时段 ===== */
.time-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.time-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 0;
  border-radius: 10px;
  background: $bg-page;
  transition: all 0.2s;

  &--active {
    background: rgba($brand, 0.1);
    .time-label { color: $brand; font-weight: 600; }
  }
}

.time-icon { font-size: 20px; }
.time-label { font-size: 12px; color: $text-primary; }
.time-desc { font-size: 10px; color: $text-muted; }

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
  cursor: pointer;
  &:active { opacity: 0.7; }
}

.catch-avatar {
  width: 44px; height: 44px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.catch-info { flex: 1; }
.catch-fish { font-size: 14px; font-weight: 600; color: $text-primary; display: block; }
.catch-user { font-size: 12px; color: $text-muted; display: block; }
.catch-weight { font-size: 14px; font-weight: 600; color: $brand; flex-shrink: 0; }

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

.comment-avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
}

.comment-meta { flex: 1; }
.comment-name { font-size: 14px; font-weight: 600; color: $text-primary; display: block; }
.comment-time { font-size: 11px; color: $text-muted; display: block; }
.comment-stars { display: flex; gap: 1px; }
.comment-text { font-size: 13px; color: $text-secondary; line-height: 1.5; }

.comment-images {
  display: flex;
  gap: 6px;
  margin-top: 8px;
}

.comment-img-item {
  width: 72px; height: 72px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}

.comment-img-emoji { font-size: 24px; }

/* ===== 周边推荐 ===== */
.nearby-scroll { white-space: nowrap; }

.nearby-list {
  display: flex;
  gap: 10px;
}

.nearby-item {
  flex-shrink: 0;
  width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  &:active { opacity: 0.7; }
}

.nearby-avatar {
  width: 60px; height: 60px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
}

.nearby-emoji { font-size: 28px; }
.nearby-name { font-size: 12px; font-weight: 600; color: $text-primary; }
.nearby-dist { font-size: 11px; color: $text-muted; }

/* ===== 底部操作栏 ===== */
.detail-bottom-bar {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  display: flex;
  gap: 10px;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  background: $bg-card;
  border-top: 1px solid $divider;
  z-index: 30;
}

.bar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 44px;
  border-radius: 12px;
  cursor: pointer;

  &--icon {
    flex: 0 0 auto;
    padding: 0 16px;
    border: 1.5px solid $divider;
    background: $bg-card;
  }

  &--nav {
    flex: 1;
    background: $brand;
  }
}

.bar-btn-text {
  font-size: 13px;
  font-weight: 600;
  color: $text-secondary;

  &--red { color: #ED4245; }
}

.bar-btn-nav-text {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}
</style>
