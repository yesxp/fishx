/**
 * 高德地图工具模块
 * 
 * 功能：
 * 1. 定位（获取用户位置）
 * 2. 逆地理编码（坐标 → 地址）
 * 3. 地理编码（地址 → 坐标）
 * 4. 距离计算
 */

// 高德地图 Key（Web端）
const AMAP_KEY = '7720afe7008d2bf80f6608d8751f3652'
const AMAP_SECURITY_CODE = '89153ac2b2781babcecfb82482c4b9fc'

// 初始化安全配置
function initAMap() {
  // @ts-ignore
  window._AMapSecurityConfig = {
    securityJsCode: AMAP_SECURITY_CODE,
  }
}

// 加载高德地图 JS API
let amapLoaded = false
let amapLoadPromise: Promise<void> | null = null

function loadAMapSDK(): Promise<void> {
  if (amapLoaded) return Promise.resolve()
  if (amapLoadPromise) return amapLoadPromise
  
  amapLoadPromise = new Promise((resolve, reject) => {
    // 安全配置已在 index.html 中设置
    if (typeof window !== 'undefined' && (window as any).AMap) {
      amapLoaded = true
      console.log('[AMap] SDK 已加载')
      resolve()
      return
    }
    
    // 创建 script 标签
    const script = document.createElement('script')
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}&plugin=AMap.Geolocation,AMap.Geocoder`
    script.onload = () => {
      amapLoaded = true
      console.log('[AMap] SDK 加载成功')
      resolve()
    }
    script.onerror = () => {
      console.error('[AMap] SDK 加载失败')
      reject(new Error('高德地图 SDK 加载失败'))
    }
    document.head.appendChild(script)
  })
  
  return amapLoadPromise
}

// 定位结果接口
export interface LocationResult {
  latitude: number
  longitude: number
  address?: string
  province?: string
  city?: string
  district?: string
  street?: string
}

/**
 * 获取用户位置
 * @param highAccuracy 是否高精度定位
 */
export async function getLocation(highAccuracy = true): Promise<LocationResult> {
  try {
    // 先尝试 uni.getLocation（小程序/App）
    const res = await new Promise<any>((resolve, reject) => {
      uni.getLocation({
        type: 'gcj02',
        highAccuracy,
        success: resolve,
        fail: reject,
      })
    })
    
    return {
      latitude: res.latitude,
      longitude: res.longitude,
      address: res.address,
      province: res.province,
      city: res.city,
      district: res.district,
    }
  } catch (error) {
    console.warn('[AMap] uni.getLocation 失败，尝试 H5 定位:', error)
    
    // H5 降级：使用高德定位
    return h5GetLocation()
  }
}

/**
 * H5 端定位（使用高德 SDK）
 */
async function h5GetLocation(): Promise<LocationResult> {
  await loadAMapSDK()
  
  return new Promise((resolve, reject) => {
    // @ts-ignore
    const geolocation = new AMap.Geolocation({
      enableHighAccuracy: true,
      timeout: 10000,
      buttonPosition: 'RB',
      showCircle: true,
      showMarker: true,
    })
    
    geolocation.getCurrentPosition((status: string, result: any) => {
      if (status === 'complete') {
        console.log('[AMap] 定位成功:', result)
        // 高德定位结果字段
        const addr = result.addressComponent || {}
        resolve({
          latitude: result.position?.lat || 30.25,
          longitude: result.position?.lng || 120.15,
          address: result.formattedAddress || [addr.province, addr.city, addr.district, addr.street].filter(Boolean).join(''),
          province: addr.province || '',
          city: addr.city || '',
          district: addr.district || '',
          street: addr.street || '',
        })
      } else {
        console.error('[AMap] 定位失败:', result)
        // 降级到杭州默认位置
        resolve(getDefaultLocation())
      }
    })
  })
}

/**
 * 逆地理编码（坐标 → 地址）
 */
export async function getAddress(lng: number, lat: number): Promise<string> {
  try {
    // 先尝试 uni.reverseGeocode
    const res = await new Promise<any>((resolve, reject) => {
      // uni-app 没有 reverseGeocode，使用高德
      reject(new Error('not supported'))
    })
    return res
  } catch {
    // 使用高德 SDK
    await loadAMapSDK()
    
    return new Promise((resolve) => {
      // @ts-ignore
      const geocoder = new AMap.Geocoder()
      
      geocoder.getAddress([lng, lat], (status: string, result: any) => {
        if (status === 'complete' && result.regeocode) {
          resolve(result.regeocode.formattedAddress)
        } else {
          resolve('未知地址')
        }
      })
    })
  }
}

/**
 * 地理编码（地址 → 坐标）
 */
export async function getCoordinates(address: string): Promise<{ lng: number; lat: number } | null> {
  await loadAMapSDK()
  
  return new Promise((resolve) => {
    // @ts-ignore
    const geocoder = new AMap.Geocoder()
    
    geocoder.getLocation(address, (status: string, result: any) => {
      if (status === 'complete' && result.geocodes?.length) {
        const geocode = result.geocodes[0]
        resolve({
          lng: geocode.location.lng,
          lat: geocode.location.lat,
        })
      } else {
        resolve(null)
      }
    })
  })
}

/**
 * 计算两点距离（米）
 */
export function calculateDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371000 // 地球半径（米）
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * 格式化距离
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`
  }
  return `${(meters / 1000).toFixed(1)}km`
}

/**
 * 默认位置（杭州）
 */
export function getDefaultLocation(): LocationResult {
  return {
    latitude: 30.25,
    longitude: 120.15,
    address: '浙江省杭州市',
    province: '浙江',
    city: '杭州',
    district: '西湖区',
  }
}

function toRad(deg: number): number {
  return deg * Math.PI / 180
}

export default {
  getLocation,
  getAddress,
  getCoordinates,
  calculateDistance,
  formatDistance,
  getDefaultLocation,
  loadAMapSDK,
}
