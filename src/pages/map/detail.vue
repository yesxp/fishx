<template>
  <view class="page-detail">
    <!-- 顶部导航栏（白色，非沉浸式）-->
    <view class="nav-bar">
      <view class="nav-back" @tap="goBack">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#060607" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
      </view>
      <text class="nav-title">{{ spot?.name || '钓点详情' }}</text>
      <view class="nav-share" @tap="onShare">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#060607" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
      </view>
    </view>

    <scroll-view scroll-y class="detail-scroll" :enhanced="true" :show-scrollbar="false">
      <!-- 地图区域（静态图，秒加载） -->
      <view class="map-area" v-if="spot?.lat && spot?.lng">
        <image :src="staticMapUrl" mode="aspectFill" class="map-img" :show-menu-by-longpress="true" />
        <!-- 图层切换按钮 -->
        <view class="map-layer-btns">
          <view class="map-layer-btn" :class="{ 'map-layer-btn--active': mapLayer === 'road' }" @tap="mapLayer = 'road'">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#333" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/></svg>
            <text>路网</text>
          </view>
          <view class="map-layer-btn" :class="{ 'map-layer-btn--active': mapLayer === 'satellite' }" @tap="mapLayer = 'satellite'">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#333" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/></svg>
            <text>卫星</text>
          </view>
        </view>
        <view class="map-source">
          <text>数据来源: 天地图</text>
        </view>
      </view>

      <!-- 名称 + 标签行 -->
      <view class="name-section">
        <view class="name-row">
          <text class="spot-name">{{ spot?.name || '加载中...' }}</text>
          <view class="name-tags">
            <view class="name-tag" v-if="spot?.type"><text>{{ typeLabel(spot?.type) }}</text></view>
            <view class="name-tag name-tag--green" v-if="!spot?.is_paid"><text>免费</text></view>
            <view class="name-tag name-tag--yellow" v-if="spot?.is_pit"><text>黑坑</text></view>
          </view>
        </view>
      </view>

      <!-- 评分行 -->
      <view class="rating-row">
        <text class="rating-num">5.0</text>
        <view class="rating-stars">
          <svg v-for="i in 5" :key="i" viewBox="0 0 24 24" width="18" height="18" fill="#F0B232" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </view>
      </view>

      <!-- 地址卡片 -->
      <view class="addr-card">
        <view class="addr-left">
          <view class="addr-dist">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#5865F2" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <text class="addr-dist-text">距离 {{ getDistance() }}</text>
          </view>
          <text class="addr-text">{{ spot?.address || '' }}</text>
        </view>
        <view class="addr-map-icon" @tap="onNavigate">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none"><circle cx="12" cy="12" r="12" fill="#F0F1F3"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#5865F2"/><circle cx="12" cy="9" r="2.5" fill="#fff"/></svg>
        </view>
        <text class="addr-map-label" @tap="onNavigate">查看地图</text>
      </view>

      <!-- 最近渔获（横向大图） -->
      <view class="section">
        <scroll-view scroll-x class="recent-scroll" :show-scrollbar="false">
          <view class="recent-list">
            <view v-for="(p, i) in recentPhotos" :key="i" class="recent-item">
              <view class="recent-img" :style="{ background: p.bg }">
                <text class="recent-emoji">{{ p.emoji }}</text>
                <view class="recent-badge" v-if="i < 2"><text>最新</text></view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 会员横幅 -->
      <view class="member-banner">
        <view class="member-left">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="#F0B232" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
          <text class="member-text">{{ memberCount }} 位钓友常来 · 会员可看</text>
        </view>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#C4A35A" stroke-width="2" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>
      </view>

      <!-- 天气与鱼情 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">天气与鱼情</text>
          <text class="section-link" @tap="goWeather">查看7天预报 ></text>
        </view>
        <view class="weather-grid">
          <view class="weather-item">
            <text class="weather-label">温度</text>
            <text class="weather-val">{{ weatherData.temp }}</text>
          </view>
          <view class="weather-item">
            <text class="weather-label">天气</text>
            <text class="weather-val">{{ weatherData.desc }}</text>
          </view>
          <view class="weather-item">
            <text class="weather-label">风力</text>
            <text class="weather-val">{{ weatherData.wind }}</text>
          </view>
          <view class="weather-item">
            <text class="weather-label">气压</text>
            <text class="weather-val">{{ weatherData.pressure }}</text>
          </view>
        </view>
        <!-- 鱼口指数 -->
        <view class="fish-index-card">
          <view class="fish-index-header">
            <text class="fish-index-label">今日鱼口指数</text>
            <text class="fish-index-num">{{ fishIndexScore }}</text>
          </view>
          <view class="fish-bars">
            <view v-for="(v, i) in fishIndexData" :key="i" class="fish-bar-col">
              <view class="fish-bar" :style="{ height: (v / 100 * 50) + 'px', background: v > 60 ? '#F0B232' : v > 30 ? '#FFD78A' : '#F5E6C8' }" />
              <text v-if="i % 3 === 0" class="fish-bar-label">{{ String(i).padStart(2, '0') }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 最近这水域钓什么 -->
      <view class="section">
        <text class="section-title" style="margin-bottom:12px;">最近这水域钓什么</text>
        <scroll-view scroll-x class="filter-scroll" :show-scrollbar="false">
          <view class="filter-tabs">
            <view v-for="tab in filterTabs" :key="tab" class="filter-tab" :class="{ 'filter-tab--active': activeFilter === tab }" @tap="activeFilter = tab">
              <text>{{ tab }}</text>
            </view>
            <view class="filter-tab filter-tab--outline">
              <text>全部鱼种</text>
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
            </view>
          </view>
        </scroll-view>

        <!-- 渔获动态 Feed -->
        <view v-for="item in feedData" :key="item.id" class="feed-card">
          <view class="feed-header">
            <view class="feed-avatar" :style="{ background: item.avatarBg }">
              <text>{{ item.avatar }}</text>
            </view>
            <view class="feed-meta">
              <text class="feed-name">{{ item.name }}</text>
              <text class="feed-info">Lv.{{ item.level }} · {{ item.city }} · {{ item.daysAgo }}</text>
            </view>
          </view>
          <text class="feed-text">{{ item.text }}</text>
          <view class="feed-img" :style="{ background: item.imgBg }">
            <text class="feed-img-emoji">{{ item.imgEmoji }}</text>
          </view>
          <view class="feed-footer">
            <view class="feed-actions">
              <view class="feed-action">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#80848E" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                <text>{{ item.likes }}</text>
              </view>
              <view class="feed-action">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#80848E" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <text>{{ item.comments }}</text>
              </view>
            </view>
            <view class="feed-fish-tag">
              <text>{{ item.fishName }} {{ item.fishCount }}尾 {{ item.fishWeight }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 钓友评价 -->
      <view class="section">
        <text class="section-title" style="margin-bottom:12px;">钓友评价</text>
        <view class="review-empty">
          <view class="review-empty-icon">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#C4C8CE" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </view>
          <view class="review-empty-text">
            <text class="review-empty-title">还没人留下评价</text>
            <text class="review-empty-sub">当第一个分享鱼情的钓友</text>
          </view>
          <view class="review-write-btn" @tap="onWriteReview">
            <text>写评价</text>
          </view>
        </view>
      </view>

      <view style="height: 100px;" />
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="bar-icons">
        <view class="bar-icon-item" @tap="onCollect">
          <svg viewBox="0 0 24 24" width="22" height="22" :fill="collected ? '#F0B232' : 'none'" :stroke="collected ? '#F0B232' : '#4E5058'" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
          <text :class="{ 'bar-icon-text--active': collected }">收藏</text>
        </view>
        <view class="bar-icon-item" @tap="onWriteReview">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#4E5058" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <text>评价</text>
        </view>
        <view class="bar-icon-item" @tap="onShare">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#4E5058" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          <text>晒渔获</text>
        </view>
      </view>
      <view class="bar-nav-btn" @tap="onNavigate">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
        <text>导航前往</text>
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
const mapLayer = ref('road')
const activeFilter = ref('最新发布')

const filterTabs = ['最新发布', '最多点赞', '只看大物']
const memberCount = ref(3)

// 静态地图
const staticMapUrl = computed(() => {
  if (!spot.value?.lat || !spot.value?.lng) return ''
  return `https://restapi.amap.com/v3/staticmap?location=${spot.value.lng},${spot.value.lat}&zoom=15&size=600*300&markers=mid,0xFF0000,A:${spot.value.lng},${spot.value.lat}&key=7720afe7008d2bf80f6608d8751f3652`
})

// 天气
const weatherData = ref({ temp: '33.5°C', desc: '晴', wind: '西南风 3级', pressure: '1003.6hPa' })

// 鱼口指数
const fishIndexScore = ref(71)
const fishIndexData = ref([30,45,60,75,80,85,70,55,40,65,80,90,85,75,60,50,55,70,85,90,80,65,45,35])

// 最近渔获大图
const recentPhotos = ref([
  { emoji: '🐟', bg: 'linear-gradient(135deg, #E8F5E9 0%, #81C784 100%)' },
  { emoji: '🐠', bg: 'linear-gradient(135deg, #E3F2FD 0%, #64B5F6 100%)' },
  { emoji: '🎣', bg: 'linear-gradient(135deg, #FFF3E0 0%, #FFB74D 100%)' },
  { emoji: '🐟', bg: 'linear-gradient(135deg, #FCE4EC 0%, #F48FB1 100%)' },
])

// 渔获动态 Feed
const feedData = ref([
  { id: '1', name: '66鱼', level: 1, city: '杭州市', daysAgo: '5天前', text: '就退潮一个小时，土鲮狂口', avatar: '🎣', avatarBg: '#E8F5E9', imgEmoji: '🐟', imgBg: 'linear-gradient(135deg, #D7CCC8 0%, #A1887F 100%)', likes: 24, comments: 1, fishName: '鲮鱼', fishCount: 1, fishWeight: '0.8公斤' },
  { id: '2', name: '钓友9458', level: 1, city: '杭州市', daysAgo: '39天前', text: '珠江，游轮停业后，有鲤鱼鲫鱼', avatar: '🐟', avatarBg: '#E3F2FD', imgEmoji: '🐟', imgBg: 'linear-gradient(135deg, #C8E6C9 0%, #66BB6A 100%)', likes: 33, comments: 1, fishName: '鲫鱼', fishCount: 1, fishWeight: '0.5公斤' },
  { id: '3', name: '钓友9458', level: 1, city: '杭州市', daysAgo: '39天前', text: '珠江有鱼', avatar: '🐟', avatarBg: '#E3F2FD', imgEmoji: '🐠', imgBg: 'linear-gradient(135deg, #FFE0B2 0%, #FFB74D 100%)', likes: 37, comments: 1, fishName: '鲤鱼', fishCount: 1, fishWeight: '0.6公斤' },
  { id: '4', name: '钓友9458', level: 1, city: '杭州市', daysAgo: '48天前', text: '琶醍附近的江边，鲫鱼多', avatar: '🐟', avatarBg: '#E3F2FD', imgEmoji: '🐟', imgBg: 'linear-gradient(135deg, #BBDEFB 0%, #42A5F5 100%)', likes: 17, comments: 1, fishName: '鲫鱼', fishCount: 1, fishWeight: '0.15公斤' },
  { id: '5', name: '星际青蛙', level: 1, city: '杭州市', daysAgo: '55天前', text: '', avatar: '🐸', avatarBg: '#F3E5F5', imgEmoji: '🐟', imgBg: 'linear-gradient(135deg, #B2EBF2 0%, #4DD0E1 100%)', likes: 23, comments: 2, fishName: '鲤鱼', fishCount: 1, fishWeight: '0.6公斤' },
])

const userLat = ref(30.25)
const userLng = ref(120.15)

onLoad((options) => {
  loadDetail(options?.id || 'mock_1')
})

async function loadDetail(id: string) {
  const data = await spotStore.loadDetail(id)
  spot.value = data
}

function typeLabel(type?: string): string {
  const map: Record<string, string> = { lake: '湖泊', river: '河流', pond: '黑坑', wild: '野钓', sea: '海钓' }
  return map[type || ''] || type || ''
}

function getDistance(): string {
  if (!spot.value?.lat || !spot.value?.lng) return '...'
  const meters = calculateDistance(userLat.value, userLng.value, spot.value.lat, spot.value.lng)
  return formatDistance(meters)
}

function goBack() { uni.navigateBack() }

function goWeather() { uni.switchTab({ url: '/pages/weather/index' }) }

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

function onCollect() {
  collected.value = !collected.value
  uni.showToast({ title: collected.value ? '已收藏 ❤️' : '取消收藏', icon: 'none' })
}

function onShare() {
  uni.showToast({ title: '分享功能开发中', icon: 'none' })
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
  background: $bg-page;
  display: flex;
  flex-direction: column;
}

/* ===== 顶部导航栏 ===== */
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  padding-top: calc(env(safe-area-inset-top) + 12px);
  background: $bg-card;
  border-bottom: 1px solid $divider;
  flex-shrink: 0;
  z-index: 10;
}
.nav-back, .nav-share {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
}
.nav-title {
  font-size: 16px;
  font-weight: 700;
  color: $text-primary;
  flex: 1;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-scroll {
  flex: 1;
  overflow: hidden;
}

/* ===== 地图区域 ===== */
.map-area {
  width: 100%;
  height: 220px;
  position: relative;
  overflow: hidden;
}
.map-img {
  width: 100%;
  height: 100%;
}
.map-layer-btns {
  position: absolute;
  top: 12px; right: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.map-layer-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: rgba(255,255,255,0.9);
  border-radius: 16px;
  font-size: 12px;
  color: $text-secondary;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  cursor: pointer;

  &--active {
    background: $brand;
    color: #fff;
    svg { stroke: #fff; }
  }
}
.map-source {
  position: absolute;
  bottom: 4px; left: 8px;
  font-size: 10px;
  color: rgba(255,255,255,0.7);
}

/* ===== 名称区域 ===== */
.name-section {
  padding: 16px 16px 8px;
  background: $bg-card;
}
.name-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.spot-name {
  font-size: 20px;
  font-weight: 700;
  color: $text-primary;
}
.name-tags {
  display: flex;
  gap: 6px;
}
.name-tag {
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  background: rgba($brand, 0.1);
  color: $brand;

  &--green { background: rgba(#23A559, 0.1); color: #23A559; }
  &--yellow { background: rgba(#F0B232, 0.1); color: #F0B232; }
}

/* ===== 评分行 ===== */
.rating-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px 12px;
  background: $bg-card;
}
.rating-num {
  font-size: 18px;
  font-weight: 700;
  color: $text-primary;
}
.rating-stars {
  display: flex;
  gap: 2px;
}

/* ===== 地址卡片 ===== */
.addr-card {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px 16px;
  padding: 14px 16px;
  background: #E8F5E9;
  border-radius: 12px;
}
.addr-left { flex: 1; }
.addr-dist {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
}
.addr-dist-text {
  font-size: 13px;
  color: $brand;
  font-weight: 600;
}
.addr-text {
  font-size: 13px;
  color: $text-secondary;
  display: block;
}
.addr-map-icon {
  flex-shrink: 0;
  cursor: pointer;
}
.addr-map-label {
  font-size: 12px;
  color: $text-muted;
  position: absolute;
  right: 16px;
  margin-top: 2px;
}

/* ===== 最近渔获横滚 ===== */
.section { padding: 16px; }
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.section-title {
  font-size: 17px;
  font-weight: 700;
  color: $text-primary;
}
.section-link {
  font-size: 13px;
  color: $text-muted;
}

.recent-scroll { white-space: nowrap; }
.recent-list {
  display: flex;
  gap: 10px;
}
.recent-item { flex-shrink: 0; }
.recent-img {
  width: 140px;
  height: 140px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.recent-emoji { font-size: 48px; }
.recent-badge {
  position: absolute;
  top: 8px; left: 8px;
  padding: 2px 8px;
  background: $brand;
  border-radius: 4px;
  font-size: 11px;
  color: #fff;
  font-weight: 600;
}

/* ===== 会员横幅 ===== */
.member-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 16px 12px;
  padding: 12px 16px;
  background: #FFF8E1;
  border-radius: 12px;
}
.member-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.member-text {
  font-size: 14px;
  color: #8D6E3F;
  font-weight: 600;
}

/* ===== 天气 ===== */
.weather-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}
.weather-item {
  text-align: center;
}
.weather-label {
  font-size: 12px;
  color: $text-muted;
  display: block;
  margin-bottom: 4px;
}
.weather-val {
  font-size: 14px;
  font-weight: 600;
  color: $text-primary;
  display: block;
}

/* 鱼口指数 */
.fish-index-card {
  background: #F0F8F0;
  border-radius: 12px;
  padding: 12px 16px;
}
.fish-index-header {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;
}
.fish-index-label {
  font-size: 13px;
  color: $text-secondary;
}
.fish-index-num {
  font-size: 22px;
  font-weight: 700;
  color: #23A559;
}
.fish-bars {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 65px;
}
.fish-bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.fish-bar {
  width: 100%;
  border-radius: 2px 2px 0 0;
  min-height: 4px;
}
.fish-bar-label {
  font-size: 9px;
  color: $text-muted;
}

/* ===== 筛选 Tab ===== */
.filter-scroll { white-space: nowrap; margin-bottom: 16px; }
.filter-tabs {
  display: flex;
  gap: 8px;
}
.filter-tab {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  color: $text-secondary;
  background: $bg-page;
  flex-shrink: 0;
  cursor: pointer;

  &--active {
    background: $brand;
    color: #fff;
    font-weight: 600;
  }
  &--outline {
    background: transparent;
    border: 1px solid $divider;
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

/* ===== Feed 卡片 ===== */
.feed-card {
  background: $bg-card;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid $divider;
}
.feed-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.feed-avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}
.feed-meta { flex: 1; }
.feed-name {
  font-size: 15px;
  font-weight: 600;
  color: $text-primary;
  display: block;
}
.feed-info {
  font-size: 12px;
  color: $text-muted;
  display: block;
  margin-top: 2px;
}
.feed-text {
  font-size: 14px;
  color: $text-primary;
  line-height: 1.5;
  display: block;
  margin-bottom: 10px;
}
.feed-img {
  width: 100%;
  aspect-ratio: 4/3;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}
.feed-img-emoji { font-size: 48px; }
.feed-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.feed-actions {
  display: flex;
  gap: 16px;
}
.feed-action {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: $text-muted;
}
.feed-fish-tag {
  font-size: 12px;
  color: $brand;
  font-weight: 600;
}

/* ===== 评价空状态 ===== */
.review-empty {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: $bg-card;
  border-radius: 12px;
  border: 1px solid $divider;
}
.review-empty-icon {
  width: 44px; height: 44px;
  background: $bg-page;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.review-empty-text { flex: 1; }
.review-empty-title {
  font-size: 14px;
  font-weight: 600;
  color: $text-primary;
  display: block;
}
.review-empty-sub {
  font-size: 12px;
  color: $text-muted;
  display: block;
  margin-top: 2px;
}
.review-write-btn {
  padding: 8px 16px;
  background: $brand;
  border-radius: 20px;
  font-size: 13px;
  color: #fff;
  font-weight: 600;
  flex-shrink: 0;
  cursor: pointer;
}

/* ===== 底部操作栏 ===== */
.bottom-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  padding-bottom: calc(env(safe-area-inset-bottom) + 10px);
  background: $bg-card;
  border-top: 1px solid $divider;
  flex-shrink: 0;
  z-index: 10;
}
.bar-icons {
  display: flex;
  gap: 16px;
}
.bar-icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  font-size: 11px;
  color: $text-secondary;
}
.bar-icon-text--active { color: #F0B232; }
.bar-nav-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 0;
  background: $brand;
  border-radius: 24px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
}
</style>
