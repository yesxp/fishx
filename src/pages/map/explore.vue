<template>
  <view class="page-explore">
    <!-- 全屏地图 -->
    <view class="map-fullscreen">
      <MapView
        ref="mapRef"
        :latitude="userLat"
        :longitude="userLng"
        :markers="mapMarkers"
        :show-traffic="showTraffic"
        :show-road-net="showRoadNet"
        @marker-tap="onMarkerTap"
      />
      
      <!-- 地图顶部浮层：搜索 + 图层 -->
      <view class="map-overlay-top">
        <view class="overlay-btn" @tap="showSearchPanel = true">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </view>
        <view class="overlay-btn" @tap="showLayerPanel = true">
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

      <!-- 搜索结果浮标 -->
      <view v-if="searchResultCount > 0" class="search-result-badge" @tap="showSearchPanel = true">
        <text class="badge-text">{{ searchResultCount }}个结果</text>
      </view>
    </view>

    <!-- ========== 搜索弹窗 ========== -->
    <view class="search-mask" v-if="showSearchPanel" @tap="closeSearch" />
    <view class="search-panel" :class="{ 'search-panel--show': showSearchPanel }">
      <!-- 搜索输入框 -->
      <view class="search-input-wrap">
        <view class="search-input-inner">
          <svg class="search-input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input 
            class="search-input" 
            v-model="searchKeyword" 
            placeholder="搜索钓点、渔具店、水域..." 
            confirm-type="search"
            :focus="showSearchPanel"
            @confirm="doSearch"
          />
          <view v-if="searchKeyword" class="search-input-clear" @tap="searchKeyword = ''; searchResults = []">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </view>
        </view>
        <text class="search-cancel" @tap="closeSearch">取消</text>
      </view>

      <!-- 热门搜索（无关键词时显示） -->
      <view v-if="!searchKeyword && searchResults.length === 0" class="search-hot">
        <text class="search-section-title">热门搜索</text>
        <view class="hot-tags">
          <view v-for="tag in hotTags" :key="tag" class="hot-tag" @tap="searchKeyword = tag; doSearch()">
            <text>{{ tag }}</text>
          </view>
        </view>
      </view>

      <!-- 搜索结果列表 -->
      <scroll-view v-if="searchResults.length > 0" scroll-y class="search-results">
        <view v-for="item in searchResults" :key="item.id" class="search-result-item" @tap="onSearchResultTap(item)">
          <view class="result-icon" :class="`result-icon--${item.source}`">
            <text v-if="item.source === 'local'" class="result-icon-text">{{ item.emoji }}</text>
            <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </view>
          <view class="result-info">
            <text class="result-name">{{ item.name }}</text>
            <text class="result-address">{{ item.address }}</text>
          </view>
          <view class="result-meta">
            <view class="result-source-tag" :class="`result-source-tag--${item.source}`">
              <text>{{ item.source === 'local' ? '本地' : 'POI' }}</text>
            </view>
            <text v-if="item.distance" class="result-distance">{{ item.distance }}</text>
          </view>
        </view>
      </scroll-view>

      <!-- 无结果 -->
      <view v-if="searchKeyword && searchResults.length === 0 && !searching" class="search-empty">
        <text class="search-empty-text">未找到相关结果</text>
      </view>
      <view v-if="searching" class="search-loading">
        <wd-loading />
      </view>
    </view>

    <!-- ========== 图层管理弹窗 ========== -->
    <view class="layer-mask" v-if="showLayerPanel" @tap="showLayerPanel = false" />
    <view class="layer-panel" :class="{ 'layer-panel--show': showLayerPanel }">
      <view class="layer-panel-header">
        <text class="layer-panel-title">图层管理</text>
        <view class="layer-panel-close" @tap="showLayerPanel = false">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </view>
      </view>

      <view class="layer-section">
        <text class="layer-section-title">底图图层</text>
        <view class="layer-grid">
          <view 
            v-for="item in baseLayers" 
            :key="item.id"
            class="layer-thumb"
            :class="{ 'layer-thumb--active': activeBaseLayer === item.id }"
            @tap="switchBaseLayer(item.id)"
          >
            <view class="layer-thumb-img" :class="`layer-thumb-img--${item.id}`">
              <view class="layer-thumb-svg" v-html="item.svg" />
            </view>
            <text class="layer-thumb-label">{{ item.label }}</text>
            <view v-if="activeBaseLayer === item.id" class="layer-thumb-check">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </view>
          </view>
        </view>
      </view>

      <view class="layer-section">
        <text class="layer-section-title">地图设置</text>
        <view class="layer-switch-list">
          <view class="layer-switch-item">
            <view class="layer-switch-left">
              <view class="layer-switch-icon layer-switch-icon--blue">🗺️</view>
              <text class="layer-switch-label">路网图层</text>
            </view>
            <switch :checked="showRoadNet" color="#5865F2" @change="showRoadNet = !showRoadNet" />
          </view>
          <view class="layer-switch-item">
            <view class="layer-switch-left">
              <view class="layer-switch-icon layer-switch-icon--green">🚗</view>
              <text class="layer-switch-label">实时路况</text>
            </view>
            <switch :checked="showTraffic" color="#5865F2" @change="showTraffic = !showTraffic" />
          </view>
          <view class="layer-switch-item">
            <view class="layer-switch-left">
              <view class="layer-switch-icon layer-switch-icon--red">🚫</view>
              <text class="layer-switch-label">禁渔区域</text>
            </view>
            <switch :checked="showNoFish" color="#5865F2" @change="showNoFish = !showNoFish" />
          </view>
        </view>
      </view>
    </view>

    <!-- ========== 底部可拉起面板 ========== -->
    <view 
      class="bottom-panel"
      :class="{ 'bottom-panel--expanded': panelExpanded }"
      @touchstart="onPanelTouchStart"
      @touchmove="onPanelTouchMove"
      @touchend="onPanelTouchEnd"
    >
      <view class="panel-handle" @tap="togglePanel">
        <view class="handle-bar" />
      </view>

      <!-- 统计栏 -->
      <view class="stats-row">
        <view 
          class="stat-item" 
          :class="{ 'stat-item--active': activeTab === 'catch' }"
          @tap="activeTab = 'catch'"
        >
          <text class="stat-label">渔获</text>
          <text class="stat-num">{{ stats.catches }}</text>
        </view>
        <view 
          class="stat-item"
          :class="{ 'stat-item--active': activeTab === 'spot' }"
          @tap="activeTab = 'spot'"
        >
          <text class="stat-label">钓点</text>
          <text class="stat-num">{{ stats.spots }}</text>
        </view>
        <view 
          class="stat-item"
          :class="{ 'stat-item--active': activeTab === 'shop' }"
          @tap="activeTab = 'shop'"
        >
          <text class="stat-label">渔具店</text>
          <text class="stat-num">{{ stats.shops }}</text>
        </view>
      </view>

      <!-- 鱼种筛选标签（仅钓点tab显示） -->
      <scroll-view v-if="activeTab === 'spot'" scroll-x class="fish-tags-scroll" :show-scrollbar="false">
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

      <!-- 渔获照片墙 -->
      <view v-if="activeTab === 'catch'" class="catch-grid">
        <view 
          v-for="item in catchGrid" 
          :key="item.id"
          class="catch-grid-item"
          @tap="onCatchTap(item)"
        >
          <image v-if="item.image" :src="item.image" mode="aspectFill" class="catch-grid-img" />
          <view v-else class="catch-grid-placeholder">
            <text class="catch-grid-emoji">{{ item.emoji }}</text>
          </view>
          <view class="catch-grid-info">
            <text class="catch-grid-fish">{{ item.fishName }}</text>
            <text class="catch-grid-user">{{ item.userName }}</text>
          </view>
        </view>
      </view>

      <!-- 钓点列表 -->
      <view v-if="activeTab === 'spot'" class="spot-list">
        <view v-for="spot in spots" :key="spot._id" class="spot-list-item" @tap="onSpotTap(spot)">
          <view class="spot-list-emoji">{{ spot.emoji }}</view>
          <view class="spot-list-info">
            <text class="spot-list-name">{{ spot.name }}</text>
            <text class="spot-list-addr">{{ spot.address }}</text>
          </view>
          <text class="spot-list-dist">{{ getDistance(spot) }}</text>
        </view>
      </view>

      <!-- 渔具店列表 -->
      <view v-if="activeTab === 'shop'" class="spot-list">
        <view v-for="shop in shopList" :key="shop.id" class="spot-list-item" @tap="onShopTap(shop)">
          <view class="spot-list-emoji">🏪</view>
          <view class="spot-list-info">
            <text class="spot-list-name">{{ shop.name }}</text>
            <text class="spot-list-addr">{{ shop.address }}</text>
          </view>
          <text class="spot-list-dist">{{ shop.distance }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSpotStore } from '@/stores/spot'
import { getLocation, calculateDistance, formatDistance, getDefaultLocation } from '@/lib/amap'
import MapView from '@/components/MapView.vue'

const spotStore = useSpotStore()
const mapRef = ref<InstanceType<typeof MapView>>()

// ===== 用户位置 =====
const userLat = ref(30.25)
const userLng = ref(120.15)

// ===== 底部面板 =====
const panelExpanded = ref(false)
let touchStartY = 0

// ===== 搜索 =====
const showSearchPanel = ref(false)
const searchKeyword = ref('')
const searchResults = ref<any[]>([])
const searchResultCount = ref(0)
const searching = ref(false)
const hotTags = ['钓场', '渔具店', '水库', '黑坑', '路亚', '野钓点']

// ===== 图层管理 =====
const showLayerPanel = ref(false)
const activeBaseLayer = ref('normal')
const showRoadNet = ref(false)
const showTraffic = ref(false)
const showNoFish = ref(true)

const baseLayers = [
  { 
    id: 'normal', label: '标准地图',
    svg: `<svg viewBox="0 0 48 48" width="32" height="32" fill="none" stroke="#4A90D9" stroke-width="2"><rect x="6" y="6" width="36" height="36" rx="4" fill="#E8F0FE"/><path d="M6 20h36M6 34h36M20 6v36M34 6v36" stroke="#C6DCF7" stroke-width="1.5"/><circle cx="14" cy="14" r="3" fill="#4A90D9" stroke="none"/><circle cx="30" cy="28" r="2" fill="#4A90D9" stroke="none"/></svg>`,
  },
  { 
    id: 'satellite', label: '卫星地图',
    svg: `<svg viewBox="0 0 48 48" width="32" height="32" fill="none"><rect x="6" y="6" width="36" height="36" rx="4" fill="#1A2332"/><circle cx="16" cy="16" r="6" fill="#2D5A3D"/><circle cx="30" cy="22" r="5" fill="#3D7A5D"/><circle cx="20" cy="32" r="4" fill="#2D5A3D"/></svg>`,
  },
  { 
    id: 'satellite-road', label: '卫星路网',
    svg: `<svg viewBox="0 0 48 48" width="32" height="32" fill="none"><rect x="6" y="6" width="36" height="36" rx="4" fill="#1A2332"/><circle cx="16" cy="16" r="6" fill="#2D5A3D"/><circle cx="30" cy="22" r="5" fill="#3D7A5D"/><path d="M6 20h36M20 6v36" stroke="#FFD700" stroke-width="1.5" stroke-dasharray="4 2"/></svg>`,
  },
  { 
    id: 'dark', label: '夜间模式',
    svg: `<svg viewBox="0 0 48 48" width="32" height="32" fill="none"><rect x="6" y="6" width="36" height="36" rx="4" fill="#0C0C1D"/><path d="M6 20h36M6 34h36M20 6v36M34 6v36" stroke="#1E2A3A" stroke-width="1.5"/><circle cx="14" cy="14" r="3" fill="#5865F2"/><circle cx="30" cy="28" r="2" fill="#5865F2"/></svg>`,
  },
]

// ===== 统计 & Tab =====
const activeTab = ref<'catch' | 'spot' | 'shop'>('spot')
const stats = ref({
  catches: 132,
  spots: 34,
  shops: 18,
})

// ===== 鱼种标签 =====
const fishTags = ['全部', '鲤鱼', '鲫鱼', '草鱼', '黑坑', '野钓', '路亚', '海钓']
const activeFishTag = ref(0)

// ===== 钓点列表 =====
const spots = computed(() => spotStore.spotList)

// ===== 地图标记 =====
const mapMarkers = computed(() => {
  return spots.value.map(spot => ({
    id: spot._id || '',
    name: spot.name,
    latitude: spot.lat,
    longitude: spot.lng,
    emoji: spot.emoji,
  }))
})

// ===== 渔具店 Mock =====
const shopList = ref([
  { id: 'shop_1', name: '西湖渔具', address: '杭州市西湖区龙井路88号', lat: 30.252, lng: 120.152, distance: '0.8km' },
  { id: 'shop_2', name: '老李钓具', address: '杭州市西湖区灵隐路56号', lat: 30.260, lng: 120.148, distance: '1.2km' },
  { id: 'shop_3', name: '千岛湖钓具大全', address: '杭州市淳安县千岛湖镇', lat: 29.602, lng: 119.002, distance: '68km' },
  { id: 'shop_4', name: '路亚之家', address: '杭州市滨江区江南大道128号', lat: 30.208, lng: 120.205, distance: '3.5km' },
  { id: 'shop_5', name: '渔乐圈钓具', address: '杭州市萧山区市心路200号', lat: 30.175, lng: 120.265, distance: '8.1km' },
  { id: 'shop_6', name: '化氏钓具旗舰店', address: '杭州市余杭区临平街道', lat: 30.418, lng: 120.301, distance: '15km' },
])

// ===== 渔获照片墙 =====
const catchGrid = ref([
  { id: '1', fishName: '3.2斤 鲫鱼', userName: '李钓友', emoji: '🐟', image: '' },
  { id: '2', fishName: '5.6斤 草鱼', userName: '张大师', emoji: '🐠', image: '' },
  { id: '3', fishName: '2.1斤 鲤鱼', userName: '老王', emoji: '🐟', image: '' },
  { id: '4', fishName: '8.3斤 青鱼', userName: '钓鱼郎', emoji: '🎣', image: '' },
  { id: '5', fishName: '1.5斤 鲫鱼', userName: '新手小白', emoji: '🐟', image: '' },
  { id: '6', fishName: '4.2斤 鲈鱼', userName: '路亚达人', emoji: '🐠', image: '' },
])

// ===== 初始化 =====
onMounted(async () => {
  await initLocation()
  await spotStore.loadList()
})

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

function reLocate() { initLocation() }
function goBack() { uni.navigateBack() }

// ===== 搜索功能 =====
function closeSearch() {
  showSearchPanel.value = false
  searchKeyword.value = ''
  searchResults.value = []
  searchResultCount.value = 0
}

async function doSearch() {
  const kw = searchKeyword.value.trim()
  if (!kw) return
  
  searching.value = true
  searchResults.value = []
  
  // 1. 搜本地库
  const localResults = searchLocal(kw)
  
  // 2. 搜高德 POI（水域 + 钓场 + 渔具店）
  const poiResults = await searchPOI(kw)
  
  searchResults.value = [...localResults, ...poiResults]
  searchResultCount.value = searchResults.value.length
  searching.value = false
}

// 搜本地数据库
function searchLocal(kw: string): any[] {
  const results: any[] = []
  
  // 搜钓点
  spots.value.forEach(spot => {
    if (spot.name.includes(kw) || spot.address.includes(kw) || spot.fish_types?.some((f: string) => f.includes(kw))) {
      results.push({
        id: spot._id,
        name: spot.name,
        address: spot.address,
        lat: spot.lat,
        lng: spot.lng,
        emoji: spot.emoji,
        source: 'local',
        type: 'spot',
        distance: getDistance(spot),
      })
    }
  })
  
  // 搜渔具店
  shopList.value.forEach(shop => {
    if (shop.name.includes(kw) || shop.address.includes(kw)) {
      results.push({
        id: shop.id,
        name: shop.name,
        address: shop.address,
        lat: shop.lat,
        lng: shop.lng,
        emoji: '🏪',
        source: 'local',
        type: 'shop',
        distance: shop.distance,
      })
    }
  })
  
  return results
}

// 搜高德 POI
async function searchPOI(kw: string): Promise<any[]> {
  try {
    const map = mapRef.value?.getMap()
    if (!map) return []
    
    return new Promise((resolve) => {
      // @ts-ignore
      AMap.plugin('AMap.PlaceSearch', () => {
        // @ts-ignore
        const placeSearch = new AMap.PlaceSearch({
          pageSize: 10,
          pageIndex: 1,
          city: '',
          citylimit: false,
          map: map,
          autoFitView: false,
        })
        
        placeSearch.search(kw, (status: string, result: any) => {
          if (status === 'complete' && result?.poiList?.pois) {
            const pois = result.poiList.pois.map((poi: any) => ({
              id: poi.id,
              name: poi.name,
              address: poi.address || poi.cityname || '',
              lat: poi.location?.lat,
              lng: poi.location?.lng,
              emoji: '📍',
              source: 'poi',
              type: 'poi',
              distance: poi.distance ? formatDistance(poi.distance) : '',
              typeName: poi.type || '',
            }))
            // 清除 PlaceSearch 自动添加的标记
            map.clearMap()
            resolve(pois)
          } else {
            resolve([])
          }
        })
      })
    })
  } catch {
    return []
  }
}

function onSearchResultTap(item: any) {
  // 移动地图中心到该点
  const map = mapRef.value?.getMap()
  if (map && item.lat && item.lng) {
    // @ts-ignore
    map.setCenter([item.lng, item.lat])
    // @ts-ignore
    map.setZoom(15)
  }
  
  // 如果是本地钓点，跳转详情
  if (item.source === 'local' && item.type === 'spot') {
    uni.navigateTo({ url: `/pages/map/detail?id=${item.id}` })
  }
}

// ===== 底部面板 =====
function togglePanel() { panelExpanded.value = !panelExpanded.value }
function onPanelTouchStart(e: TouchEvent) { touchStartY = e.touches[0].clientY }
function onPanelTouchMove() {}
function onPanelTouchEnd(e: TouchEvent) {
  const deltaY = e.changedTouches[0].clientY - touchStartY
  if (deltaY < -30) panelExpanded.value = true
  if (deltaY > 30) panelExpanded.value = false
}

// ===== 图层切换 =====
function switchBaseLayer(id: string) {
  activeBaseLayer.value = id
  const map = mapRef.value?.getMap()
  if (!map) return
  map.clearMap()
  switch (id) {
    case 'normal':
      // @ts-ignore
      map.setLayers([])
      // @ts-ignore
      map.setMapStyle('amap://styles/normal')
      break
    case 'satellite':
      // @ts-ignore
      map.setLayers([new AMap.TileLayer.Satellite()])
      break
    case 'satellite-road':
      // @ts-ignore
      map.setLayers([new AMap.TileLayer.Satellite(), new AMap.TileLayer.RoadNet()])
      break
    case 'dark':
      // @ts-ignore
      map.setMapStyle('amap://styles/dark')
      break
  }
}

// ===== 其他 =====
function getDistance(spot: any): string {
  if (!spot.lat || !spot.lng) return '...'
  const meters = calculateDistance(userLat.value, userLng.value, spot.lat, spot.lng)
  return formatDistance(meters)
}

function onMarkerTap(id: string) {
  uni.navigateTo({ url: `/pages/map/detail?id=${id}` })
}

function onCatchTap(item: any) {
  uni.showToast({ title: `${item.fishName} 详情开发中`, icon: 'none' })
}

function onSpotTap(spot: any) {
  uni.navigateTo({ url: `/pages/map/detail?id=${spot._id}` })
}

function onShopTap(shop: any) {
  uni.showToast({ title: `${shop.name} 详情开发中`, icon: 'none' })
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
  top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: 1;
}

/* ===== 地图浮层按钮 ===== */
.map-overlay-top {
  position: absolute;
  top: 50px; left: 60px; right: 16px;
  display: flex;
  justify-content: space-between;
  z-index: 10;
  pointer-events: none;
  > view { pointer-events: auto; }
}

.map-overlay-back {
  position: absolute;
  top: 50px; left: 16px;
  width: 40px; height: 40px;
  background: $bg-card;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 100;
  pointer-events: auto;
  cursor: pointer;
}

.overlay-btn {
  width: 40px; height: 40px;
  background: $bg-card;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  cursor: pointer;
}

.map-overlay-locate {
  position: absolute;
  bottom: 240px; right: 16px;
  width: 40px; height: 40px;
  background: $bg-card;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 10;
  cursor: pointer;
}

.search-result-badge {
  position: absolute;
  bottom: 200px; left: 50%;
  transform: translateX(-50%);
  background: $brand;
  padding: 6px 16px;
  border-radius: 20px;
  z-index: 10;
  cursor: pointer;
}
.badge-text {
  font-size: 13px;
  color: #fff;
  font-weight: 600;
}

/* ===== 搜索弹窗 ===== */
.search-mask {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  z-index: 999;
}

.search-panel {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 100vh;
  background: $bg-card;
  z-index: 1000;
  transform: translateY(-100%);
  transition: transform 0.25s ease;

  &--show { transform: translateY(0); }
}

.search-input-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 56px 16px 12px;
  border-bottom: 1px solid $divider;
}

.search-input-inner {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  background: $bg-page;
  border-radius: 10px;
  padding: 10px 12px;
}

.search-input-icon { flex-shrink: 0; }

.search-input {
  flex: 1;
  font-size: 15px;
  color: $text-primary;
}

.search-input-clear {
  flex-shrink: 0;
  cursor: pointer;
  padding: 2px;
}

.search-cancel {
  flex-shrink: 0;
  font-size: 15px;
  color: $brand;
  cursor: pointer;
  padding: 4px;
}

/* 热门搜索 */
.search-hot {
  padding: 20px 16px;
}

.search-section-title {
  font-size: 14px;
  font-weight: 600;
  color: $text-muted;
  margin-bottom: 12px;
  display: block;
}

.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hot-tag {
  padding: 8px 16px;
  background: $bg-page;
  border-radius: 20px;
  font-size: 13px;
  color: $text-secondary;
  cursor: pointer;
}

/* 搜索结果 */
.search-results {
  max-height: calc(100vh - 120px);
  padding: 8px 0;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid $bg-page;
  cursor: pointer;

  &:active { background: $bg-page; }
}

.result-icon {
  width: 40px; height: 40px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;

  &--local { background: rgba($brand, 0.12); }
  &--poi { background: #E8F5E9; }
}

.result-icon-text { font-size: 20px; }

.result-info {
  flex: 1;
  min-width: 0;
}

.result-name {
  font-size: 15px;
  font-weight: 600;
  color: $text-primary;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-address {
  font-size: 12px;
  color: $text-muted;
  display: block;
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-meta {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.result-source-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;

  &--local {
    background: rgba($brand, 0.1);
    color: $brand;
  }
  &--poi {
    background: rgba(#23A559, 0.1);
    color: #23A559;
  }
}

.result-distance {
  font-size: 12px;
  color: $text-muted;
}

.search-empty {
  padding: 60px 0;
  text-align: center;
}
.search-empty-text {
  font-size: 14px;
  color: $text-muted;
}

.search-loading {
  padding: 40px 0;
  display: flex;
  justify-content: center;
}

/* ===== 图层管理弹窗 ===== */
.layer-mask {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  z-index: 999;
}

.layer-panel {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  background: $bg-card;
  border-radius: 16px 16px 0 0;
  z-index: 1000;
  max-height: 70vh;
  overflow-y: auto;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  &--show { transform: translateY(0); }
}

.layer-panel-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 20px 16px;
  border-bottom: 1px solid $divider;
}
.layer-panel-title { font-size: 18px; font-weight: 700; color: $text-primary; }
.layer-panel-close { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; }

.layer-section {
  padding: 16px 20px;
  border-bottom: 8px solid $bg-page;
}
.layer-section-title { font-size: 14px; font-weight: 600; color: $text-muted; margin-bottom: 12px; display: block; }

.layer-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }

.layer-thumb {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  cursor: pointer; position: relative;
  &--active {
    .layer-thumb-img { border-color: $brand; box-shadow: 0 0 0 2px rgba($brand, 0.2); }
    .layer-thumb-label { color: $brand; font-weight: 600; }
  }
}

.layer-thumb-img {
  width: 100%; aspect-ratio: 1;
  border-radius: 10px; border: 2px solid transparent;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
  &--normal { background: #E8F0FE; }
  &--satellite { background: #1A2332; }
  &--satellite-road { background: #1A2332; }
  &--dark { background: #0C0C1D; }
}
.layer-thumb-svg { display: flex; align-items: center; justify-content: center; }
.layer-thumb-label { font-size: 11px; color: $text-secondary; }
.layer-thumb-check {
  position: absolute; top: 4px; right: 4px;
  width: 20px; height: 20px;
  background: $brand; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}

.layer-switch-list { display: flex; flex-direction: column; gap: 4px; }
.layer-switch-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid $bg-page;
  &:last-child { border-bottom: none; }
}
.layer-switch-left { display: flex; align-items: center; gap: 12px; }
.layer-switch-icon {
  width: 36px; height: 36px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; font-size: 18px;
  &--blue { background: rgba($brand, 0.1); }
  &--green { background: rgba(#23A559, 0.1); }
  &--red { background: rgba(#ED4245, 0.1); }
}
.layer-switch-label { font-size: 15px; color: $text-primary; }

/* ===== 底部面板 ===== */
.bottom-panel {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 180px;
  background: $bg-card;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -2px 12px rgba(0,0,0,0.1);
  z-index: 20;
  transition: height 0.3s ease;
  overflow: hidden;
  &--expanded { height: 50vh; }
}

.panel-handle {
  display: flex; justify-content: center;
  padding: 10px 0 6px; cursor: pointer;
}
.handle-bar {
  width: 36px; height: 4px;
  background: #D1D5DB; border-radius: 2px;
}

/* ===== 统计栏 ===== */
.stats-row {
  display: flex; justify-content: center; gap: 40px;
  padding: 4px 16px 10px;
}
.stat-item {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  position: relative; cursor: pointer;
  &--active {
    .stat-label { color: $brand; }
    &::after {
      content: '';
      position: absolute; bottom: -4px;
      left: 25%; right: 25%; height: 3px;
      background: $brand; border-radius: 2px;
    }
  }
}
.stat-label { font-size: 15px; font-weight: 700; color: $text-primary; }
.stat-num { font-size: 13px; font-weight: 400; color: $text-muted; }

/* ===== 鱼种标签 ===== */
.fish-tags-scroll { white-space: nowrap; padding: 0 16px 10px; }
.fish-tags-inner { display: flex; gap: 8px; }
.fish-tag {
  flex-shrink: 0; padding: 6px 14px;
  border-radius: 16px; background: $bg-page;
  font-size: 13px; color: $text-secondary;
  cursor: pointer; transition: all 0.2s;
  &--active { background: rgba($brand, 0.12); color: $brand; font-weight: 600; }
}

/* ===== 钓点/渔具店列表 ===== */
.spot-list {
  padding: 0 12px;
  overflow-y: auto;
  max-height: calc(50vh - 100px);
}
.spot-list-item {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid $bg-page;
  cursor: pointer;
  &:last-child { border-bottom: none; }
}
.spot-list-emoji { font-size: 24px; flex-shrink: 0; }
.spot-list-info { flex: 1; min-width: 0; }
.spot-list-name { font-size: 14px; font-weight: 600; color: $text-primary; display: block; }
.spot-list-addr { font-size: 12px; color: $text-muted; display: block; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.spot-list-dist { font-size: 12px; color: $text-muted; flex-shrink: 0; }

/* ===== 渔获照片墙 ===== */
.catch-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;
  padding: 0 12px;
  overflow-y: auto;
  max-height: calc(50vh - 100px);
}
.catch-grid-item {
  border-radius: 8px; overflow: hidden;
  background: #F0F1F3; cursor: pointer; position: relative;
}
.catch-grid-img { width: 100%; aspect-ratio: 1; display: block; }
.catch-grid-placeholder {
  width: 100%; aspect-ratio: 1;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
}
.catch-grid-emoji { font-size: 28px; }
.catch-grid-info {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 4px 6px;
  background: linear-gradient(transparent, rgba(0,0,0,0.6));
}
.catch-grid-fish { font-size: 11px; font-weight: 600; color: #fff; display: block; }
.catch-grid-user { font-size: 10px; color: rgba(255,255,255,0.8); display: block; }
</style>
