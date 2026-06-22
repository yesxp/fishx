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
      <view class="banner-count">
        <text>{{ currentImgIndex + 1 }}/{{ bannerImages.length }}</text>
      </view>
    </view>

    <!-- 内容卡片 -->
    <view class="detail-content">
      <scroll-view scroll-y class="detail-scroll" :enhanced="true" :show-scrollbar="false">

        <!-- 名称 + 标签行 -->
        <view class="info-card">
          <view class="info-name-row">
            <text class="spot-name">{{ spot?.name || '加载中...' }}</text>
            <view class="tag-badges">
              <view class="type-badge" v-if="spot?.type">
                <text>{{ typeLabel(spot?.type) }}</text>
              </view>
              <view class="tag-badge tag-badge--green" v-if="!spot?.is_paid">
                <text>免费</text>
              </view>
              <view class="tag-badge tag-badge--orange" v-if="spot?.is_pit">
                <text>黑坑</text>
              </view>
            </view>
          </view>

          <!-- 评分行 -->
          <view class="rating-row" v-if="spot?.rating">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="#F0B232" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <text class="rating-num">{{ spot.rating }}</text>
            <view class="rating-stars">
              <svg v-for="i in 5" :key="i" viewBox="0 0 24 24" width="14" height="14" fill="#F0B232" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </view>
            <text class="rating-count">{{ spot.review_count }}条评价</text>
          </view>

          <!-- 地址卡片 -->
          <view class="address-card" @tap="onNavigate">
            <view class="address-left">
              <text class="address-pin">📍</text>
              <view class="address-text-wrap">
                <text class="address-dist">{{ getDistance() }}</text>
                <text class="address-text">{{ spot?.address }}</text>
              </view>
            </view>
            <view class="address-link">
              <text class="address-link-text">查看地图</text>
            </view>
          </view>

          <!-- 最近渔获照片 -->
          <scroll-view scroll-x class="recent-photos-scroll" :show-scrollbar="false">
            <view class="recent-photos-row">
              <view v-for="(p, i) in recentPhotos" :key="i" class="recent-photo-item">
                <view class="recent-photo" :style="{ background: p.bg }">
                  <text class="recent-photo-emoji">{{ p.emoji }}</text>
                  <view class="recent-photo-badge" v-if="i < 2">
                    <text>最新</text>
                  </view>
                </view>
              </view>
            </view>
          </scroll-view>
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

        <!-- 会员黄条 -->
        <view class="member-banner">
          <text class="member-banner-text">{{ memberCount }}位钓友常来 · 会员可看</text>
          <view class="member-banner-btn">
            <text>了解会员</text>
          </view>
        </view>

        <!-- 天气与鱼情 -->
        <view class="section-card">
          <text class="section-title">天气与鱼情</text>
          <view class="weather-grid">
            <view class="weather-item">
              <text class="weather-icon">🌡️</text>
              <text class="weather-val">{{ weatherData.temp }}</text>
              <text class="weather-label">{{ weatherData.tempLabel }}</text>
            </view>
            <view class="weather-item">
              <text class="weather-icon">☀️</text>
              <text class="weather-val">{{ weatherData.condition }}</text>
              <text class="weather-label">天气</text>
            </view>
            <view class="weather-item">
              <text class="weather-icon">🌬️</text>
              <text class="weather-val">{{ weatherData.wind }}</text>
              <text class="weather-label">风力</text>
            </view>
            <view class="weather-item">
              <text class="weather-icon">📊</text>
              <text class="weather-val">{{ weatherData.pressure }}</text>
              <text class="weather-label">气压</text>
            </view>
          </view>
          <view class="weather-forecast-link">
            <text>查看7天预报 ></text>
          </view>

          <!-- 今日鱼口指数 -->
          <view class="fish-index-header">
            <text class="fish-index-title">今日鱼口指数</text>
          </view>
          <view class="fish-index-bars">
            <view v-for="(val, idx) in fishIndexData" :key="idx" class="fish-bar-col">
              <view class="fish-bar-track">
                <view class="fish-bar-fill" :style="{ height: val + '%', background: getBarColor(val) }" />
              </view>
              <text class="fish-bar-label" v-if="idx % 3 === 0">{{ idx }}时</text>
              <text class="fish-bar-label" v-else></text>
            </view>
          </view>
        </view>

        <!-- 最近这水域钓什么 -->
        <view class="section-card">
          <text class="section-title">最近这水域钓什么</text>
          <scroll-view scroll-x class="filter-tabs-scroll" :show-scrollbar="false">
            <view class="filter-tabs">
              <view v-for="(tab, i) in filterTabs" :key="i" class="filter-tab" :class="{ 'filter-tab--active': activeFilter === i }" @tap="activeFilter = i">
                <text :class="activeFilter === i ? 'filter-tab-text--active' : 'filter-tab-text'">{{ tab }}</text>
              </view>
            </view>
          </scroll-view>
        </view>

        <!-- 渔获动态 Feed -->
        <view class="feed-section">
          <view v-for="feed in feedData" :key="feed.id" class="feed-item">
            <!-- 头部：头像+用户名+等级 -->
            <view class="feed-header">
              <view class="feed-avatar" :style="{ background: feed.avatarBg }">
                <text class="feed-avatar-emoji">{{ feed.avatarEmoji }}</text>
              </view>
              <view class="feed-user-info">
                <text class="feed-username">{{ feed.username }}</text>
                <text class="feed-meta">Lv.{{ feed.level }} · {{ feed.city }} · {{ feed.daysAgo }}天前</text>
              </view>
            </view>
            <!-- 文字内容 -->
            <text class="feed-text">{{ feed.text }}</text>
            <!-- 大图 -->
            <view class="feed-image" :style="{ background: feed.imageBg }">
              <text class="feed-image-emoji">{{ feed.imageEmoji }}</text>
            </view>
            <!-- 底部互动栏 -->
            <view class="feed-bottom">
              <view class="feed-actions">
                <text class="feed-action">👍 {{ feed.likes }}</text>
                <text class="feed-action">💬 {{ feed.comments }}</text>
              </view>
              <view class="feed-fish-tag">
                <text class="feed-fish-tag-text">{{ feed.fishTag }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 钓友评价 -->
        <view class="section-card">
          <view class="section-header">
            <text class="section-title">钓友评价</text>
            <text class="section-more">全部 {{ spot?.review_count || 0 }}条 ></text>
          </view>
          <view v-if="comments.length === 0" class="empty-reviews">
            <text class="empty-text">还没人留下评价</text>
            <view class="write-review-btn" @tap="onWriteReview">
              <text class="write-review-text">写评价</text>
            </view>
          </view>
          <view class="comment-list" v-else>
            <view v-for="c in comments" :key="c.id" class="comment-item">
              <view class="comment-header">
                <view class="comment-avatar" :style="{ background: c.bg }">
                  <text>{{ c.avatar }}</text>
                </view>
                <view class="comment-meta">
                  <text class="comment-name">{{ c.name }}</text>
                  <text class="comment-time">Lv.{{ c.level }} · {{ c.city }} · {{ c.time }}</text>
                </view>
                <view class="comment-stars">
                  <svg v-for="i in c.stars" :key="i" viewBox="0 0 24 24" width="12" height="12" fill="#F0B232" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <svg v-for="j in (5 - c.stars)" :key="'e'+j" viewBox="0 0 24 24" width="12" height="12" fill="#E3E5E8" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </view>
              </view>
              <text class="comment-text">{{ c.text }}</text>
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
        <view class="bar-icon-btn" @tap="onCollect">
          <text class="bar-icon-emoji">⭐</text>
          <text class="bar-icon-label" :class="{ 'bar-icon-label--active': collected }">收藏</text>
        </view>
        <view class="bar-icon-btn" @tap="onWriteReview">
          <text class="bar-icon-emoji">💬</text>
          <text class="bar-icon-label">评价</text>
        </view>
        <view class="bar-icon-btn" @tap="onCheckIn">
          <text class="bar-icon-emoji">📷</text>
          <text class="bar-icon-label">晒渔获</text>
        </view>
        <view class="bar-nav-btn" @tap="onNavigate">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
          <text class="bar-nav-text">导航前往</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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

// 静态地图
const staticMapUrl = computed(() => {
  if (!spot.value?.lat || !spot.value?.lng) return ''
  const lng = spot.value.lng
  const lat = spot.value.lat
  return `https://restapi.amap.com/v3/staticmap?location=${lng},${lat}&zoom=15&size=600*300&markers=mid,0xFF0000,A:${lng},${lat}&key=7720afe7008d2bf80f6608d8751f3652`
})

// 会员人数
const memberCount = ref(128)

// 天气数据
const weatherData = ref({
  temp: '33.5°C',
  tempLabel: '温度',
  condition: '晴',
  wind: '西南风3级',
  pressure: '1003.6',
})

// 鱼口指数 24小时数据
const fishIndexData = ref([
  15, 10, 8, 5, 3, 12, 35, 65, 82, 90, 78, 55,
  45, 40, 50, 62, 85, 92, 88, 72, 55, 38, 25, 18
])

// 滤筛 tabs
const filterTabs = ref(['最新发布', '最多点赞', '只看大物', '全部鱼种 ▼'])
const activeFilter = ref(0)

// 最近渔获照片
const recentPhotos = ref([
  { emoji: '🐟', bg: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)' },
  { emoji: '🐠', bg: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)' },
  { emoji: '🎣', bg: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)' },
  { emoji: '🐟', bg: 'linear-gradient(135deg, #FCE4EC 0%, #F8BBD0 100%)' },
])

// 渔获动态 Feed
const feedData = ref([
  {
    id: 'f1',
    avatarEmoji: '🎣',
    avatarBg: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
    username: '钓鱼郎',
    level: 3,
    city: '杭州',
    daysAgo: 1,
    text: '今天大丰收！连杆了好几条鲫鱼，最大的有3斤多，用蚯蚓+蓝鲫打窝，效果绝佳 🎉',
    imageBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    imageEmoji: '🐟',
    likes: 42,
    comments: 8,
    fishTag: '鲫鱼 3尾 2.5公斤',
  },
  {
    id: 'f2',
    avatarEmoji: '🐟',
    avatarBg: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
    username: '新手小白',
    level: 1,
    city: '宁波',
    daysAgo: 2,
    text: '第一次来这个钓点，环境真不错，虽然只钓了一条但很开心 😄',
    imageBg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    imageEmoji: '🐠',
    likes: 15,
    comments: 3,
    fishTag: '鲫鱼 1尾 0.5公斤',
  },
  {
    id: 'f3',
    avatarEmoji: '🐠',
    avatarBg: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
    username: '张大师',
    level: 5,
    city: '温州',
    daysAgo: 3,
    text: '今天来试试新买的鱼竿，手感不错。收获一般般，但胜在风景好 🌅',
    imageBg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    imageEmoji: '🎣',
    likes: 28,
    comments: 5,
    fishTag: '鲤鱼 2尾 1.8公斤',
  },
])

// Mock 评论数据
const comments = ref([
  {
    id: '1', avatar: '🎣', name: '钓鱼郎', level: 3, city: '杭州', time: '3天前', stars: 5, bg: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
    text: '鱼口很好，连杆了好几条鲫鱼！水质清澈，环境不错。周末人会多一些，建议工作日去。用蚯蚓钓效果最佳，蓝鲫打窝。',
    images: ['linear-gradient(135deg, #E8F5E9 0%, #81C784 100%)', 'linear-gradient(135deg, #E3F2FD 0%, #64B5F6 100%)'],
  },
  {
    id: '2', avatar: '🐟', name: '新手小白', level: 1, city: '宁波', time: '1周前', stars: 4, bg: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
    text: '第一次来，钓到了2条鲫鱼，很开心。老板很热情，还教了我调漂。停车方便，就是蚊子有点多，记得带驱蚊水。',
    images: [],
  },
  {
    id: '3', avatar: '🐠', name: '老王', level: 4, city: '嘉兴', time: '2周前', stars: 5, bg: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
    text: '钓了十年的老钓位了，每次来都有收获。大物池有10斤以上的青鱼，不过需要碰运气。推荐用玉米打窝，蚯蚓挂钩。',
    images: ['linear-gradient(135deg, #FFF3E0 0%, #FFB74D 100%)'],
  },
])

// 周边推荐 Mock
const nearbySpots = ref([
  { id: 'mock_2', name: '老王钓场', emoji: '🐟', distance: '5.1km', bg: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)' },
  { id: 'mock_3', name: '千岛湖大坝', emoji: '⛰️', distance: '12km', bg: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)' },
  { id: 'mock_4', name: '龙王塘路亚', emoji: '🎣', distance: '8.3km', bg: 'linear-gradient(135deg, #FCE4EC 0%, #F8BBD0 100%)' },
  { id: 'mock_6', name: '富春江钓场', emoji: '🏞️', distance: '15km', bg: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)' },
])

// 用户位置
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

function getBarColor(val: number): string {
  if (val >= 80) return 'linear-gradient(to top, #FFB300, #FF8F00)'
  if (val >= 60) return 'linear-gradient(to top, #FFC107, #FFB300)'
  if (val >= 40) return 'linear-gradient(to top, #FFD54F, #FFC107)'
  return 'linear-gradient(to top, #FFE082, #FFD54F)'
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
  uni.redirectTo({ url: `/pages/map/detail?id=${n.id}` })
}

function onWriteReview() {
  uni.showToast({ title: '评价功能开发中', icon: 'none' })
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

/* ===== Banner ===== */
.detail-banner {
  width: 100%;
  height: 280px;
  position: relative;
  border-radius: 0 0 20px 20px;
  overflow: hidden;
}
.banner-swiper { width: 100%; height: 100%; }
.banner-item {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  position: relative;
}
.banner-emoji { font-size: 80px; }
.banner-tag {
  position: absolute;
  top: env(safe-area-inset-top); right: 16px;
  margin-top: 12px;
  padding: 4px 10px;
  background: rgba(0,0,0,0.4);
  border-radius: 8px;
  font-size: 11px; color: #fff;
}
.banner-count {
  position: absolute; bottom: 20px; left: 50%;
  transform: translateX(-50%);
  padding: 3px 12px;
  background: rgba(0,0,0,0.35);
  border-radius: 12px;
  font-size: 12px; color: #fff;
}
.detail-back {
  position: absolute; top: 0; left: 16px;
  margin-top: env(safe-area-inset-top);
  width: 40px; height: 40px;
  background: rgba(255,255,255,0.92);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 10; cursor: pointer;
}
.detail-share-btn {
  position: absolute; top: 0; right: 16px;
  margin-top: env(safe-area-inset-top);
  width: 40px; height: 40px;
  background: rgba(255,255,255,0.92);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 10; cursor: pointer;
}

/* ===== 内容区 ===== */
.detail-content {
  position: absolute;
  top: 250px; left: 0; right: 0; bottom: 0;
  background: $bg-page;
  border-radius: 16px 16px 0 0;
  z-index: 20;
}
.detail-scroll { height: 100%; padding: 12px 12px 0; }

/* ===== 信息卡 ===== */
.info-card {
  background: $bg-card;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 10px;
}
.info-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.spot-name {
  font-size: 18px; font-weight: 700; color: $text-primary;
}
.tag-badges {
  display: flex; gap: 6px;
}
.type-badge {
  padding: 2px 8px;
  background: rgba($brand, 0.1);
  border-radius: 6px;
  font-size: 11px; color: $brand; font-weight: 600;
}
.tag-badge {
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px; font-weight: 600;
  &--green {
    background: rgba(#23A559, 0.1);
    color: #23A559;
  }
  &--orange {
    background: rgba(#F0B232, 0.1);
    color: #E67E22;
  }
}

/* ===== 评分行 ===== */
.rating-row {
  display: flex; align-items: center; gap: 6px;
  margin-top: 8px;
}
.rating-num {
  font-size: 16px; font-weight: 700; color: #F0B232;
}
.rating-stars {
  display: flex; gap: 1px;
}
.rating-count {
  font-size: 12px; color: $text-muted; margin-left: 4px;
}

/* ===== 地址卡片 ===== */
.address-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  padding: 10px 12px;
  background: $bg-page;
  border-radius: 10px;
}
.address-left {
  display: flex; align-items: center; gap: 8px; flex: 1;
  min-width: 0;
}
.address-pin { font-size: 16px; flex-shrink: 0; }
.address-text-wrap { min-width: 0; }
.address-dist {
  font-size: 12px; color: $brand; font-weight: 600;
  display: block;
}
.address-text {
  font-size: 13px; color: $text-secondary;
  display: block; margin-top: 2px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.address-link { flex-shrink: 0; margin-left: 8px; }
.address-link-text {
  font-size: 13px; color: $brand; font-weight: 500;
}

/* ===== 最近渔获照片 ===== */
.recent-photos-scroll {
  margin-top: 12px;
}
.recent-photos-row {
  display: flex; gap: 8px;
}
.recent-photo-item {
  flex-shrink: 0;
}
.recent-photo {
  width: 80px; height: 80px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  position: relative;
  overflow: hidden;
}
.recent-photo-emoji { font-size: 36px; }
.recent-photo-badge {
  position: absolute; top: 4px; left: 4px;
  padding: 2px 6px;
  background: rgba($brand, 0.85);
  border-radius: 4px;
  font-size: 10px; color: #fff; font-weight: 600;
}

/* ===== 统计卡 ===== */
.stat-card {
  display: flex; align-items: center;
  background: $bg-card;
  border-radius: 12px;
  padding: 16px 0;
  margin-bottom: 10px;
}
.stat-item {
  flex: 1; text-align: center; cursor: pointer;
}
.stat-num {
  font-size: 22px; font-weight: 700; color: $text-primary; display: block;
}
.stat-label {
  font-size: 12px; color: $text-muted; display: block; margin-top: 2px;
}
.stat-divider {
  width: 1px; height: 30px; background: $divider;
}

/* ===== 会员黄条 ===== */
.member-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%);
  border-radius: 12px;
}
.member-banner-text {
  font-size: 13px; font-weight: 600; color: #E65100;
}
.member-banner-btn {
  padding: 4px 12px;
  background: rgba(230, 81, 0, 0.1);
  border-radius: 14px;
  font-size: 12px; color: #E65100; font-weight: 600;
}

/* ===== 通用 Section ===== */
.section-card {
  background: $bg-card;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 10px;
}
.section-header {
  display: flex; justify-content: space-between; align-items: center;
}
.section-title {
  font-size: 16px; font-weight: 700; color: $text-primary;
  display: block; margin-bottom: 12px;
}
.section-header .section-title { margin-bottom: 0; }
.section-more {
  font-size: 13px; color: $brand; font-weight: 500; cursor: pointer;
}

/* ===== 天气与鱼情 ===== */
.weather-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}
.weather-item {
  display: flex; flex-direction: column; align-items: center;
  padding: 10px 4px;
  background: $bg-page;
  border-radius: 10px;
}
.weather-icon { font-size: 20px; margin-bottom: 4px; }
.weather-val {
  font-size: 14px; font-weight: 700; color: $text-primary;
}
.weather-label {
  font-size: 11px; color: $text-muted; margin-top: 2px;
}
.weather-forecast-link {
  margin-top: 10px;
  text-align: center;
  font-size: 13px; color: $brand; font-weight: 500;
}

/* ===== 鱼口指数 ===== */
.fish-index-header {
  margin-top: 16px;
}
.fish-index-title {
  font-size: 14px; font-weight: 600; color: $text-primary;
}
.fish-index-bars {
  display: flex;
  gap: 2px;
  align-items: flex-end;
  height: 80px;
  margin-top: 10px;
}
.fish-bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}
.fish-bar-track {
  width: 100%;
  flex: 1;
  display: flex;
  align-items: flex-end;
  border-radius: 2px;
}
.fish-bar-fill {
  width: 100%;
  border-radius: 2px;
  min-height: 2px;
}
.fish-bar-label {
  font-size: 9px;
  color: $text-muted;
  margin-top: 3px;
  text-align: center;
}

/* ===== 滤筛 Tabs ===== */
.filter-tabs-scroll {
  margin-top: 4px;
}
.filter-tabs {
  display: flex; gap: 8px;
}
.filter-tab {
  flex-shrink: 0;
  padding: 6px 14px;
  border-radius: 20px;
  background: $bg-page;
  &--active {
    background: $brand;
  }
}
.filter-tab-text {
  font-size: 13px; color: $text-secondary; font-weight: 500;
}
.filter-tab-text--active {
  font-size: 13px; color: #fff; font-weight: 600;
}

/* ===== 渔获动态 Feed ===== */
.feed-section {
  margin-bottom: 10px;
}
.feed-item {
  background: $bg-card;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 10px;
}
.feed-header {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 10px;
}
.feed-avatar {
  width: 40px; height: 40px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.feed-avatar-emoji { font-size: 20px; }
.feed-user-info { flex: 1; min-width: 0; }
.feed-username {
  font-size: 14px; font-weight: 600; color: $text-primary;
  display: block;
}
.feed-meta {
  font-size: 12px; color: $text-muted;
  display: block; margin-top: 2px;
}
.feed-text {
  font-size: 14px; line-height: 1.6;
  color: $text-secondary;
  margin-bottom: 10px;
  display: block;
}
.feed-image {
  width: 100%; height: 180px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 10px;
}
.feed-image-emoji { font-size: 48px; }
.feed-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.feed-actions {
  display: flex; gap: 16px;
}
.feed-action {
  font-size: 13px; color: $text-muted;
}
.feed-fish-tag {
  padding: 4px 10px;
  background: rgba($brand, 0.08);
  border-radius: 8px;
}
.feed-fish-tag-text {
  font-size: 12px; color: $brand; font-weight: 600;
}

/* ===== 评论 ===== */
.comment-list { margin-top: 8px; }
.comment-item {
  padding: 12px 0;
  border-bottom: 1px solid $bg-page;
  &:last-child { border-bottom: none; }
}
.comment-header { display: flex; align-items: center; gap: 10px; }
.comment-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; flex-shrink: 0;
}
.comment-meta { flex: 1; }
.comment-name { font-size: 14px; font-weight: 600; color: $text-primary; display: block; }
.comment-time { font-size: 11px; color: $text-muted; display: block; }
.comment-stars { display: flex; gap: 1px; }
.comment-text {
  font-size: 13px; line-height: 1.6;
  color: $text-secondary;
  margin-top: 8px;
}
.comment-images {
  display: flex; gap: 6px; margin-top: 8px;
}
.comment-img-item {
  width: 80px; height: 80px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}
.comment-img-emoji { font-size: 28px; }

/* ===== 空评价 ===== */
.empty-reviews {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
}
.empty-text {
  font-size: 14px; color: $text-muted; margin-bottom: 12px;
}
.write-review-btn {
  padding: 8px 24px;
  background: $brand;
  border-radius: 20px;
}
.write-review-text {
  font-size: 14px; color: #fff; font-weight: 600;
}

/* ===== 周边推荐 ===== */
.nearby-scroll { margin-top: 8px; }
.nearby-list { display: flex; gap: 10px; }
.nearby-item {
  flex-shrink: 0;
  width: 110px;
  display: flex; flex-direction: column; align-items: center;
  padding: 12px 8px;
  background: $bg-page;
  border-radius: 12px;
  cursor: pointer;
}
.nearby-avatar {
  width: 60px; height: 60px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 8px;
}
.nearby-emoji { font-size: 28px; }
.nearby-name { font-size: 13px; font-weight: 600; color: $text-primary; text-align: center; }
.nearby-dist { font-size: 11px; color: $text-muted; margin-top: 2px; }

/* ===== 底部操作栏 ===== */
.detail-bottom-bar {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 64px;
  background: $bg-card;
  border-top: 1px solid $divider;
  display: flex; align-items: center;
  padding: 0 12px;
  gap: 8px;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 30;
}
.bar-icon-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 52px;
  cursor: pointer;
}
.bar-icon-emoji { font-size: 20px; }
.bar-icon-label {
  font-size: 10px; color: $text-muted; margin-top: 2px;
  &--active { color: $brand; }
}
.bar-nav-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 44px;
  background: $brand;
  border-radius: 22px;
  cursor: pointer;
}
.bar-nav-text {
  font-size: 15px; font-weight: 600; color: #fff;
}
</style>
