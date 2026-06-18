<template>
  <view class="page-explore">
    <!-- 全屏地图 -->
    <view class="map-fullscreen">
      <MapView
        :latitude="userLat"
        :longitude="userLng"
        :markers="mapMarkers"
        @marker-tap="onMarkerTap"
      />
      
      <!-- 地图顶部浮层：搜索 + 图层 -->
      <view class="map-overlay-top">
        <view class="overlay-btn" @tap="onSearch">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </view>
        <view class="overlay-btn" @tap="onLayerToggle">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        </view>
      </view>

      <!-- 返回按钮 -->
      <view class="map-overlay-back" @tap="goBack">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
      </view>

      <!-- 定位按钮 -->
      <view class="map-overlay-locate" @tap="reLocate">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#5865F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4m-10-10h4m12 0h4"/></svg>
      </view>
    </view>

    <!-- 底部可拉起面板 -->
    <view 
      class="bottom-panel"
      :class="{ 'bottom-panel--expanded': panelExpanded }"
      @touchstart="onPanelTouchStart"
      @touchmove="onPanelTouchMove"
      @touchend="onPanelTouchEnd"
    >
      <!-- 拖拽条 -->
      <view class="panel-handle" @tap="togglePanel">
        <view class="handle-bar" />
      </view>

      <!-- 统计栏 -->
      <view class="stats-row">
        <view 
          class="stat-item" 
          :class="{ 'stat-item--active': activeTab === 'water' }"
          @tap="activeTab = 'water'"
        >
          <text class="stat-num">{{ stats.water }}</text>
          <text class="stat-label">水域</text>
        </view>
        <view 
          class="stat-item"
          :class="{ 'stat-item--active': activeTab === 'spot' }"
          @tap="activeTab = 'spot'"
        >
          <text class="stat-num">{{ stats.spots }}</text>
          <text class="stat-label">钓点</text>
        </view>
        <view 
          class="stat-item"
          :class="{ 'stat-item--active': activeTab === 'catch' }"
          @tap="activeTab = 'catch'"
        >
          <text class="stat-num">{{ stats.catches }}</text>
          <text class="stat-label">渔获</text>
        </view>
      </view>

      <!-- 鱼种筛选标签 -->
      <scroll-view scroll-x class="fish-tags-scroll" :show-scrollbar="false">
        <view class="fish-tags-inner">
          <view 
            v-for="(tag, i) in fishTags" 
            :key="i"
            class="fish-tag"
            :class="{ 'fish-tag--active': activeFishTag === i }"
            @tap="activeFishTag = i"
          >
            <text>{{ tag }}</text>
          </view>
        </view>
      </scroll-view>

      <!-- 渔获照片墙（3列网格） -->
      <view class="catch-grid">
        <view 
          v-for="item in catchGrid" 
          :key="item.id"
          class="catch-grid-item"
          @tap="onCatchTap(item)"
        >
          <image 
            v-if="item.image" 
            :src="item.image" 
            mode="aspectFill" 
            class="catch-grid-img"
          />
          <view v-else class="catch-grid-placeholder">
            <text class="catch-grid-emoji">{{ item.emoji }}</text>
          </view>
          <view class="catch-grid-info">
            <text class="catch-grid-fish">{{ item.fishName }}</text>
            <text class="catch-grid-user">{{ item.userName }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSpotStore } from '@/stores/spot'
import { getLocation, getDefaultLocation } from '@/lib/amap'
import MapView from '@/components/MapView.vue'

const spotStore = useSpotStore()

// 用户位置
const userLat = ref(30.25)
const userLng = ref(120.15)

// 底部面板
const panelExpanded = ref(false)
let touchStartY = 0

// 统计数据
const activeTab = ref<'water' | 'spot' | 'catch'>('spot')
const stats = ref({
  water: 64,
  spots: 34,
  catches: 132,
})

// 鱼种标签
const fishTags = ['全部', '鲤鱼', '鲫鱼', '草鱼', '黑坑', '野钓', '路亚', '海钓']
const activeFishTag = ref(0)

// 钓点列表
const spots = computed(() => spotStore.spotList)

// 地图标记
const mapMarkers = computed(() => {
  return spots.value.map(spot => ({
    id: spot._id || '',
    name: spot.name,
    latitude: spot.lat,
    longitude: spot.lng,
    emoji: spot.emoji,
  }))
})

// 渔获照片墙 Mock 数据
const catchGrid = ref([
  { id: '1', fishName: '3.2斤 鲫鱼', userName: '李钓友', emoji: '🐟', image: '' },
  { id: '2', fishName: '5.6斤 草鱼', userName: '张大师', emoji: '🐠', image: '' },
  { id: '3', fishName: '2.1斤 鲤鱼', userName: '老王', emoji: '🐟', image: '' },
  { id: '4', fishName: '8.3斤 青鱼', userName: '钓鱼郎', emoji: '🎣', image: '' },
  { id: '5', fishName: '1.5斤 鲫鱼', userName: '新手小白', emoji: '🐟', image: '' },
  { id: '6', fishName: '4.2斤 鲈鱼', userName: '路亚达人', emoji: '🐠', image: '' },
])

// 初始化
onMounted(async () => {
  await initLocation()
  await spotStore.loadList()
})

// 定位
async function initLocation() {
  try {
    const location = await getLocation()
    userLat.value = location.latitude
    userLng.value = location.longitude
  } catch {
    const defaultLoc = getDefaultLocation()
    userLat.value = defaultLoc.latitude
    userLng.value = defaultLoc.longitude
  }
}

// 重新定位
function reLocate() {
  initLocation()
}

// 返回
function goBack() {
  uni.navigateBack()
}

// 搜索
function onSearch() {
  uni.showToast({ title: '搜索功能开发中', icon: 'none' })
}

// 图层切换
function onLayerToggle() {
  uni.showToast({ title: '图层切换开发中', icon: 'none' })
}

// 面板拖拽
function togglePanel() {
  panelExpanded.value = !panelExpanded.value
}

function onPanelTouchStart(e: TouchEvent) {
  touchStartY = e.touches[0].clientY
}

function onPanelTouchMove(_e: TouchEvent) {
  // 可扩展：实时拖拽效果
}

function onPanelTouchEnd(e: TouchEvent) {
  const deltaY = e.changedTouches[0].clientY - touchStartY
  if (deltaY < -30) panelExpanded.value = true
  if (deltaY > 30) panelExpanded.value = false
}

// 标记点击
function onMarkerTap(id: string) {
  uni.navigateTo({ url: `/pages/map/detail?id=${id}` })
}

// 渔获点击
function onCatchTap(item: any) {
  uni.showToast({ title: `${item.fishName} 详情开发中`, icon: 'none' })
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

.page-explore {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background: #e8eaed;
}

/* ===== 全屏地图 ===== */
.map-fullscreen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* ===== 地图浮层按钮 ===== */
.map-overlay-top {
  position: absolute;
  top: 50px;
  left: 60px;
  right: 16px;
  display: flex;
  justify-content: space-between;
  z-index: 10;
  pointer-events: none;

  > view {
    pointer-events: auto;
  }
}

.map-overlay-back {
  position: absolute;
  top: 50px;
  left: 16px;
  width: 40px;
  height: 40px;
  background: $bg-card;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
  cursor: pointer;
}

.overlay-btn {
  width: 40px;
  height: 40px;
  background: $bg-card;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}

.map-overlay-locate {
  position: absolute;
  bottom: 240px;
  right: 16px;
  width: 40px;
  height: 40px;
  background: $bg-card;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
  cursor: pointer;
}

/* ===== 底部面板 ===== */
.bottom-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 180px;
  background: $bg-card;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
  z-index: 20;
  transition: height 0.3s ease;
  overflow: hidden;

  &--expanded {
    height: 50vh;
  }
}

.panel-handle {
  display: flex;
  justify-content: center;
  padding: 10px 0 6px;
  cursor: pointer;
}

.handle-bar {
  width: 36px;
  height: 4px;
  background: #D1D5DB;
  border-radius: 2px;
}

/* ===== 统计栏 ===== */
.stats-row {
  display: flex;
  justify-content: center;
  gap: 40px;
  padding: 4px 16px 10px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  position: relative;
  cursor: pointer;

  &--active {
    .stat-num {
      color: $brand;
    }
    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 25%;
      right: 25%;
      height: 3px;
      background: $brand;
      border-radius: 2px;
    }
  }
}

.stat-num {
  font-size: 20px;
  font-weight: 700;
  color: $text-primary;
}

.stat-label {
  font-size: 12px;
  color: $text-muted;
}

/* ===== 鱼种标签 ===== */
.fish-tags-scroll {
  white-space: nowrap;
  padding: 0 16px 10px;
}

.fish-tags-inner {
  display: flex;
  gap: 8px;
}

.fish-tag {
  flex-shrink: 0;
  padding: 6px 14px;
  border-radius: 16px;
  background: $bg-page;
  font-size: 13px;
  color: $text-secondary;
  cursor: pointer;
  transition: all 0.2s;

  &--active {
    background: rgba($brand, 0.12);
    color: $brand;
    font-weight: 600;
  }
}

/* ===== 渔获照片墙 ===== */
.catch-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  padding: 0 12px;
  overflow-y: auto;
  max-height: calc(50vh - 140px);

  .bottom-panel:not(.bottom-panel--expanded) & {
    max-height: 50px;
    overflow: hidden;
  }
}

.catch-grid-item {
  border-radius: 8px;
  overflow: hidden;
  background: #F0F1F3;
  cursor: pointer;
  position: relative;
}

.catch-grid-img {
  width: 100%;
  aspect-ratio: 1;
  display: block;
}

.catch-grid-placeholder {
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
}

.catch-grid-emoji {
  font-size: 28px;
}

.catch-grid-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 4px 6px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
}

.catch-grid-fish {
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  display: block;
}

.catch-grid-user {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.8);
  display: block;
}
</style>
