<template>
  <view class="map-container">
    <div :id="mapId" class="map-element" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps<{
  latitude: number
  longitude: number
  markers?: Array<{
    id: string
    name: string
    latitude: number
    longitude: number
    emoji: string
  }>
}>()

const emit = defineEmits<{
  markerTap: [id: string]
}>()

const mapId = ref(`map_${Date.now()}`)
let map: any = null

// 加载高德 SDK
async function loadSDK(): Promise<void> {
  // @ts-ignore
  if (window.AMap) return
  
  return new Promise((resolve, reject) => {
    // @ts-ignore
    window._AMapSecurityConfig = {
      securityJsCode: '89153ac2b2781babcecfb82482c4b9fc',
    }
    
    const script = document.createElement('script')
    script.src = 'https://webapi.amap.com/maps?v=2.0&key=7720afe7008d2bf80f6608d8751f3652&plugin=AMap.Scale,AMap.ToolBar'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('AMap SDK load failed'))
    document.head.appendChild(script)
  })
}

// 初始化地图
async function initMap() {
  await loadSDK()
  
  // @ts-ignore
  map = new AMap.Map(mapId.value, {
    zoom: 13,
    center: [props.longitude, props.latitude],
    resizeEnable: true,
    touchZoom: true,
    scrollWheel: true,
    viewMode: '2D',
  })
  
  // 添加定位标记（蓝色圆点）
  // @ts-ignore
  const userMarker = new AMap.Marker({
    position: [props.longitude, props.latitude],
    content: `<div style="
      width: 16px; height: 16px;
      background: #5865F2;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    "></div>`,
    offset: new AMap.Pixel(-8, -8),
  })
  map.add(userMarker)
  
  // 添加钓点标记
  if (props.markers?.length) {
    addMarkers(props.markers)
  }
}

// 添加钓点标记
function addMarkers(markers: any[]) {
  markers.forEach(marker => {
    // @ts-ignore
    const amapMarker = new AMap.Marker({
      position: [marker.longitude, marker.latitude],
      content: `<div style="
        font-size: 20px;
        text-align: center;
        line-height: 1;
        filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));
      ">${marker.emoji}</div>`,
      offset: new AMap.Pixel(-12, -12),
      title: marker.name,
    })
    
    // 点击事件
    amapMarker.on('click', () => {
      emit('markerTap', marker.id)
    })
    
    map.add(amapMarker)
  })
}

// 监听 markers 变化
watch(() => props.markers, (newMarkers) => {
  if (map && newMarkers) {
    // 清除旧标记（保留用户标记）
    const allMarkers = map.getAllOverlays('marker')
    allMarkers.forEach((m: any, i: number) => {
      if (i > 0) map.remove(m) // 保留第一个（用户标记）
    })
    addMarkers(newMarkers)
  }
}, { deep: true })

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (map) {
    map.destroy()
    map = null
  }
})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
}

.map-element {
  width: 100%;
  height: 100%;
}
</style>
