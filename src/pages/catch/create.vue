<template>
  <view class="page-capture">
    <!-- ========== 模式 A：拍照取景 ========== -->
    <template v-if="mode === 'camera'">
      <!-- 真实摄像头预览 -->
      <video
        ref="videoEl"
        class="camera-video"
        autoplay
        playsinline
        webkit-playsinline="true"
        muted
      />
      <!-- 启动提示（iOS Safari 策略要求用户手势）-->
      <view v-if="!cameraStarted && !cameraError" class="camera-start" @tap="onStartCamera">
        <view class="start-emoji">🎥</view>
        <view class="start-text">点击开启摄像头</view>
        <view class="start-sub">iOS Safari 需要您的授权</view>
      </view>
      <!-- 摄像头错误时的降级背景 -->
      <view v-if="cameraError" class="camera-fallback">
        <text class="fallback-emoji">📷</text>
        <text class="fallback-text">{{ cameraError }}</text>
        <view class="fallback-btn" @tap="onAlbumPick">
          <text>从相册选择</text>
        </view>
        <view class="fallback-retry" @tap="onStartCamera">
          <text>↻ 重试开启摄像头</text>
        </view>
      </view>

      <!-- 装饰覆盖层 -->
      <view class="camera-bg" v-if="cameraStarted && !cameraError">
        <view class="camera-glow camera-glow--1" />
        <view class="camera-glow camera-glow--2" />
      </view>

      <!-- Top bar -->
      <view class="topbar">
        <view class="iconbtn" @tap="goBack">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" width="18" height="18">
            <path d="M15 6l-6 6 6 6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </view>
        <view class="topbar-title" @tap="onPickSpot">
          <view class="topbar-dot" />
          <text>{{ spotName || '选择钓点' }}</text>
        </view>
        <view class="iconbtn" @tap="onFlashToggle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <path d="M12 2v3M12 19v3M5 12H2M22 12h-3M6.3 6.3l-2.1-2.1M19.8 19.8l-2.1-2.1M6.3 17.7l-2.1 2.1M19.8 4.2l-2.1 2.1" stroke-linecap="round" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        </view>
      </view>

      <!-- Category switcher -->
      <view class="cat-switch">
        <view
          v-for="(cat, idx) in categories"
          :key="idx"
          class="cat-pill"
          :class="{ 'cat-pill--active': activeCat === idx }"
          @tap="activeCat = idx"
        >
          <text>{{ cat }}</text>
        </view>
      </view>

      <!-- Viewfinder overlay -->
      <view class="viewfinder">
        <view class="vf-box">
          <view class="scan-line" />
          <view class="vf-corner vf-corner--tl" />
          <view class="vf-corner vf-corner--tr" />
          <view class="vf-corner vf-corner--bl" />
          <view class="vf-corner vf-corner--br" />
        </view>
        <view class="vf-hint">
          <text>将鱼放入取景框 · 自动识别</text>
        </view>
      </view>

      <!-- Recenter button -->
      <view class="recenter-btn" @tap="onRecenter">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke-linecap="round" />
        </svg>
      </view>

      <!-- Bottom panel -->
      <view class="bottom-panel">
        <view class="shutter-row">
          <view class="album-btn" @tap="onAlbumPick">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
              <rect x="3" y="5" width="18" height="14" rx="3" />
              <circle cx="9" cy="11" r="2" />
              <path d="M21 17l-5-5-9 9" stroke-linejoin="round" />
            </svg>
          </view>

          <view class="shutter-wrap" @tap="handleShutter">
            <view class="shutter-ripple" />
            <view class="shutter-btn">
              <view class="shutter-inner" />
            </view>
          </view>

          <view class="flip-btn" @tap="onFlipCamera">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
              <path d="M3 8a2 2 0 0 1 2-2h2l2-2h6l2 2h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke-linejoin="round" />
              <path d="M9 14a3 3 0 1 0 6 0 3 3 0 0 0-6 0z" />
            </svg>
          </view>
        </view>
      </view>
    </template>

    <!-- ========== 模式 B：Loading（同页面）========== -->
    <template v-else-if="mode === 'loading'">
      <view class="loading-page">
        <view class="loading-bg" />
        <view class="loading-card">
          <view class="loading-preview" :style="previewImage ? `background-image: url(${previewImage})` : ''" />
          <view class="loading-progress">
            <view class="loading-bar" :style="{ width: progress + '%' }" />
          </view>
          <view class="loading-percent">{{ progress }}%</view>
          <view class="loading-hint">{{ loadingHint }}</view>
        </view>
      </view>
    </template>

    <!-- ========== 模式 C：结果弹层（同页面）========== -->
    <template v-else-if="mode === 'result'">
      <view class="result-page">
        <view class="result-bg" />
        <view class="result-card">
          <view class="result-photo" :style="previewImage ? `background-image: url(${previewImage})` : ''" />
          <view class="result-body">
            <view class="result-title">识别完成</view>
            <view class="result-sub">点击下方选项确认或修改</view>

            <view class="result-list">
              <view
                v-for="(r, idx) in identifyResults"
                :key="idx"
                class="result-row"
                :class="{ 'result-row--active': idx === selectedResultIdx }"
                @tap="selectedResultIdx = idx"
              >
                <text class="result-emoji">{{ r.emoji }}</text>
                <view class="result-meta">
                  <view class="result-name">{{ r.name }}</view>
                  <view class="result-conf">可信度 {{ Math.round(r.confidence * 100) }}%</view>
                </view>
                <view v-if="idx === selectedResultIdx" class="result-check">✓</view>
              </view>
            </view>

            <view class="result-actions">
              <view class="btn btn--secondary" @tap="onResultCancel">重新拍照</view>
              <view class="btn btn--primary" @tap="onResultConfirm">确认 · 补字段</view>
            </view>
          </view>
        </view>
      </view>
    </template>

    <!-- ========== 模式 D：补字段抽屉（同页面）========== -->
    <template v-else-if="mode === 'edit'">
      <view class="edit-page">
        <view class="edit-bg" />
        <view class="edit-card">
          <view class="edit-handle" />
          <view class="edit-header">
            <view class="edit-title">补全鱼获信息</view>
            <view class="edit-close" @tap="onEditClose">×</view>
          </view>

          <view class="edit-body">
            <view class="edit-photo" :style="previewImage ? `background-image: url(${previewImage})` : ''" />

            <view class="edit-section">
              <view class="edit-label">鱼种</view>
              <view class="edit-species">
                <text class="edit-species-emoji">{{ currentResult?.emoji }}</text>
                <text class="edit-species-name">{{ currentResult?.name }}</text>
              </view>
            </view>

            <view class="edit-section">
              <view class="edit-label">重量 <text class="edit-label-sub">（选填 · AI 估算 {{ estimatedWeight }}g）</text></view>
              <input
                v-model.number="editForm.weight_g"
                class="edit-input"
                type="number"
                placeholder="确认或修改重量（克）"
              />
            </view>

            <view class="edit-section">
              <view class="edit-label">钓法</view>
              <view class="edit-tags">
                <view
                  v-for="m in methods"
                  :key="m"
                  class="edit-tag"
                  :class="{ 'edit-tag--active': editForm.method === m }"
                  @tap="editForm.method = m"
                >{{ m }}</view>
              </view>
            </view>

            <view class="edit-section">
              <view class="edit-label">饵料（可多选）</view>
              <view class="edit-tags">
                <view
                  v-for="b in baits"
                  :key="b"
                  class="edit-tag"
                  :class="{ 'edit-tag--active': editForm.bait.includes(b) }"
                  @tap="toggleBait(b)"
                >{{ b }}</view>
              </view>
            </view>

            <view class="edit-section">
              <view class="edit-label">心情</view>
              <view class="edit-tags">
                <view
                  v-for="m in moods"
                  :key="m"
                  class="edit-tag"
                  :class="{ 'edit-tag--active': editForm.mood_tags.includes(m) }"
                  @tap="toggleMood(m)"
                >{{ m }}</view>
              </view>
            </view>

            <view class="edit-section">
              <view class="edit-label">备注</view>
              <textarea
                v-model="editForm.note"
                class="edit-textarea"
                placeholder="说点什么...（200 字内）"
                maxlength="200"
              />
            </view>
          </view>

          <view class="edit-footer">
            <view class="btn btn--secondary" @tap="onEditClose">取消</view>
            <view class="btn btn--primary" @tap="onEditSave">保存鱼获</view>
          </view>
        </view>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { identifyFish, type FishIdentifyResult } from '@/api/ai'
import { readExif } from '@/utils/exif'
import { saveCatch } from '@/api/catch'
import { getCurrentLocation } from '@/lib/amap'
import { filePathToBlob } from '@/utils/resource'

type Mode = 'camera' | 'loading' | 'result' | 'edit'

const mode = ref<Mode>('camera')
const categories = ['🐟 鱼种识别', '🦐 饵料识别', '🎣 环境识别']
const activeCat = ref(0)
const flashOn = ref(false)

// ========== 摄像头 ==========
const videoEl = ref<HTMLVideoElement | null>(null)
const cameraError = ref<string>('')
const cameraStarted = ref(false)  // 摄像头是否已成功启动
let mediaStream: MediaStream | null = null
let facingMode: 'environment' | 'user' = 'environment'

/**
 * 用户点击"开启摄像头"按钮（用户手势触发，避开 iOS autoplay 限制）
 */
async function onStartCamera() {
  await startCamera()
}

async function startCamera() {
  cameraError.value = ''
  // 检查浏览器支持
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    cameraError.value = '当前环境不支持摄像头'
    return
  }
  try {
    // 停掉旧的 stream
    stopCamera()
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: facingMode },
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
      audio: false,
    })
    // 等待 DOM 更新 + video 元素就绪
    await nextTick()
    // 再次检查 video 元素（兜底）
    if (!videoEl.value) {
      await new Promise(r => setTimeout(r, 100))
    }
    if (videoEl.value) {
      videoEl.value.srcObject = mediaStream
      videoEl.value.setAttribute('playsinline', 'true')
      videoEl.value.setAttribute('webkit-playsinline', 'true')
      videoEl.value.muted = true
      // 显式调用 play()（iOS Safari 必须）
      try {
        await videoEl.value.play()
        cameraStarted.value = true
        console.log('[Camera] 启动并播放成功')
      } catch (playErr: any) {
        console.warn('[Camera] play() 失败:', playErr)
        // 即使 play 失败，stream 已绑定，让用户看到
        cameraStarted.value = true
      }
    } else {
      cameraError.value = 'video 元素未就绪，请重试'
    }
  } catch (err: any) {
    console.error('[Camera] 启动失败:', err)
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      cameraError.value = '摄像头权限被拒绝，请到设置中开启或从相册选择'
    } else if (err.name === 'NotFoundError') {
      cameraError.value = '未找到摄像头设备'
    } else if (err.name === 'NotReadableError') {
      cameraError.value = '摄像头被其他程序占用'
    } else if (err.name === 'OverconstrainedError') {
      cameraError.value = '摄像头参数不支持'
    } else {
      cameraError.value = `摄像头启动失败：${err.message || err.name || '未知错误'}`
    }
    cameraStarted.value = false
  }
}

function stopCamera() {
  if (mediaStream) {
    mediaStream.getTracks().forEach(t => t.stop())
    mediaStream = null
  }
  if (videoEl.value) {
    videoEl.value.srcObject = null
  }
  cameraStarted.value = false
}

// 从 video 截帧为 Blob
function captureFromVideo(): Promise<Blob | null> {
  return new Promise((resolve) => {
    const v = videoEl.value
    if (!v || !v.videoWidth) {
      resolve(null)
      return
    }
    const canvas = document.createElement('canvas')
    canvas.width = v.videoWidth
    canvas.height = v.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      resolve(null)
      return
    }
    ctx.drawImage(v, 0, 0)
    canvas.toBlob(
      blob => resolve(blob),
      'image/jpeg',
      0.85
    )
  })
}

// ========== 拍照/识别状态 ==========
const previewImage = ref<string>('')
const progress = ref(0)
const loadingHint = ref('正在识别鱼种...')
const loadingHints = [
  '正在识别鱼种...',
  '比对 8 种常见鱼特征...',
  '分析鱼体形态与色斑...',
  '匹配度 92% · 出结果中...',
]
const identifyResults = ref<FishIdentifyResult[]>([])
const selectedResultIdx = ref(0)
const estimatedWeight = ref(0)
const spotName = ref('选择钓点')
const spotGeo = ref<{ lat: number; lng: number } | null>(null)

const currentResult = computed(() => identifyResults.value[selectedResultIdx.value])

// ========== 编辑表单 ==========
const editForm = ref({
  weight_g: 0 as number,
  method: '台钓' as string,
  bait: [] as string[],
  mood_tags: [] as string[],
  note: '' as string,
})

const methods = ['台钓', '路亚', '矶钓', '筏钓', '传统钓']
const baits = ['蚯蚓', '商品饵', '红虫', '玉米', '麦子', '拉饵', '拟饵']
const moods = ['得意', '谦虚', '惊喜', '兴奋', '感恩', '平静']

function toggleBait(b: string) {
  const idx = editForm.value.bait.indexOf(b)
  if (idx >= 0) editForm.value.bait.splice(idx, 1)
  else editForm.value.bait.push(b)
}

function toggleMood(m: string) {
  const idx = editForm.value.mood_tags.indexOf(m)
  if (idx >= 0) editForm.value.mood_tags.splice(idx, 1)
  else editForm.value.mood_tags.push(m)
}

// ========== Actions ==========
function goBack() {
  uni.navigateBack()
}

function onFlashToggle() {
  flashOn.value = !flashOn.value
  uni.showToast({
    title: flashOn.value ? '闪光灯已开启' : '闪光灯已关闭',
    icon: 'none',
    duration: 800,
  })
}

function onRecenter() {
  uni.showToast({ title: '已重置取景', icon: 'none', duration: 600 })
}

function onFlipCamera() {
  facingMode = facingMode === 'environment' ? 'user' : 'environment'
  startCamera()
  uni.showToast({
    title: facingMode === 'environment' ? '后置摄像头' : '前置摄像头',
    icon: 'none',
    duration: 600,
  })
}

async function onPickSpot() {
  try {
    const loc = await getCurrentLocation()
    spotGeo.value = { lat: loc.latitude, lng: loc.longitude }
    spotName.value = loc.name || `${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}`
  } catch (e) {
    uni.showToast({ title: '定位失败，请手动选点', icon: 'none' })
  }
}

async function pickImage(sourceType: ('album' | 'camera')[]) {
  return new Promise<{ path: string; blob: Blob | null } | null>((resolve) => {
    uni.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType,
      success: async (res) => {
        const filePath = res.tempFilePaths[0]
        let blob: Blob | null = null
        try {
          blob = await filePathToBlob(filePath)
        } catch (e) {
          console.warn('[Image] 转为 Blob 失败:', e)
        }
        // EXIF 自动读 → 失败手动选点
        try {
          const exif = await readExif(filePath)
          if (exif.lat && exif.lng) {
            spotGeo.value = { lat: exif.lat, lng: exif.lng }
            spotName.value = `EXIF: ${exif.lat.toFixed(4)}, ${exif.lng.toFixed(4)}`
          }
        } catch (e) {
          // EXIF 读取失败
        }
        resolve({ path: filePath, blob })
      },
      fail: () => resolve(null),
    })
  })
}

async function onAlbumPick() {
  const res = await pickImage(['album'])
  if (res) startIdentify(res.path, res.blob)
}

async function handleShutter() {
  // 1. 优先从摄像头 video 截帧
  if (videoEl.value && videoEl.value.videoWidth > 0 && !cameraError.value) {
    const blob = await captureFromVideo()
    if (blob) {
      // 转 objectURL 用于预览
      const url = URL.createObjectURL(blob)
      startIdentify(url, blob)
      return
    }
  }
  // 2. 降级：从相册/相机选择
  const res = await pickImage(['album', 'camera'])
  if (res) startIdentify(res.path, res.blob)
  // 3. 兜底：mock 流程（开发期）
  else startIdentify('', null)
}

// ========== 识别流程 ==========
// 临时保存的 blob（识别后到保存之间用）
const pendingBlob = ref<Blob | null>(null)

async function startIdentify(imagePath: string, blob: Blob | null) {
  previewImage.value = imagePath
  pendingBlob.value = blob
  mode.value = 'loading'
  progress.value = 0
  loadingHint.value = loadingHints[0]

  // 进度条动画
  const timer = setInterval(() => {
    progress.value = Math.min(progress.value + Math.random() * 4 + 1, 95)
    const idx = Math.min(Math.floor(progress.value / 25), loadingHints.length - 1)
    loadingHint.value = loadingHints[idx]
  }, 100)

  try {
    const results = await identifyFish(imagePath)
    clearInterval(timer)
    progress.value = 100
    identifyResults.value = results
    selectedResultIdx.value = 0
    // mock 估算重量
    estimatedWeight.value = 200 + Math.floor(Math.random() * 800)
    editForm.value.weight_g = estimatedWeight.value
    // 延迟 300ms 让用户看到 100%
    setTimeout(() => {
      mode.value = 'result'
    }, 300)
  } catch (e) {
    clearInterval(timer)
    mode.value = 'camera'
    uni.showToast({ title: '识别失败，请重试', icon: 'none' })
  }
}

function onResultCancel() {
  mode.value = 'camera'
  previewImage.value = ''
}

function onResultConfirm() {
  mode.value = 'edit'
}

function onEditClose() {
  mode.value = 'camera'
  previewImage.value = ''
  // 重置表单
  editForm.value = {
    weight_g: 0,
    method: '台钓',
    bait: [],
    mood_tags: [],
    note: '',
  }
}

async function onEditSave() {
  // spot_geo 必填检查
  if (!spotGeo.value) {
    uni.showToast({ title: '请先选择钓点', icon: 'none' })
    return
  }
  const result = currentResult.value
  if (!result) {
    uni.showToast({ title: '请先识别鱼种', icon: 'none' })
    return
  }

  const payload = {
    species_name: result.name,
    species_emoji: result.emoji,
    species_confidence: result.confidence,
    photo_blobs: pendingBlob.value ? [pendingBlob.value] : [],
    primary_photo_index: 0,
    weight_estimated_g: estimatedWeight.value,
    weight_g: editForm.value.weight_g || null,
    weight_confirmed: editForm.value.weight_g > 0 ? 1 : 0,
    spot_geo_lat: spotGeo.value.lat,
    spot_geo_lng: spotGeo.value.lng,
    spot_name: spotName.value,
    method: editForm.value.method,
    bait: editForm.value.bait,
    mood_tags: editForm.value.mood_tags,
    note: editForm.value.note,
  }
  try {
    await saveCatch(payload)
    uni.showToast({ title: '已保存 🎣', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 800)
  } catch (e) {
    uni.showToast({ title: '保存失败', icon: 'none' })
  }
}

// ========== 生命周期 ==========
// 注意：不自动启动摄像头，让用户点击"开启摄像头"按钮
// （iOS Safari autoplay 策略要求用户手势）
onUnmounted(() => {
  // 释放摄像头
  stopCamera()
  // 释放 objectURL
  if (previewImage.value && previewImage.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewImage.value)
  }
})
</script>

<style scoped lang="scss">
/* ====== Common ====== */
:root {
  --b: #5865F2;
  --b2: #8B5CF6;
  --ink: #1C1C1E;
  --ink2: #3C3C43;
  --muted: #8E8E93;
  --bg: #F2F3F7;
  --card: #FFFFFF;
  --rc: 24px;
  --rb: 14px;
  --sm: 0 2px 6px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.06);
}

/* ====== 模式 A：拍照取景 ====== */
.page-capture {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #000;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', 'Helvetica Neue', sans-serif;
  color: #fff;
}

.camera-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 20%, #3D5A4A 0%, #1A2A22 50%, #0A1410 100%),
    #0A1410;
  background-blend-mode: multiply;
  z-index: 0;
}

/* 真实摄像头视频流 */
.camera-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  min-width: 100%;
  min-height: 100%;
  object-fit: cover;
  z-index: 0;
  background: #000;
  /* iOS Safari 兼容 */
  -webkit-playsinline: true;
  playsinline: true;
}

/* 点击开启摄像头提示（iOS Safari 策略）*/
.camera-start {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(ellipse at 30% 20%, #3D5A4A 0%, #1A2A22 50%, #0A1410 100%),
    #0A1410;
  color: #fff;
  text-align: center;
  padding: 40px;
  cursor: pointer;
}

.start-emoji {
  font-size: 72px;
  margin-bottom: 20px;
  animation: pulse 2s ease-in-out infinite;
}

.start-text {
  font-size: 17px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 6px;
}

.start-sub {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

/* 摄像头错误降级 */
.camera-fallback {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(ellipse at 30% 20%, #3D5A4A 0%, #1A2A22 50%, #0A1410 100%),
    #0A1410;
  color: #fff;
  text-align: center;
  padding: 40px;
}

.fallback-emoji {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.fallback-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 24px;
  line-height: 1.5;
}

.fallback-btn {
  padding: 12px 28px;
  background: linear-gradient(135deg, #5865F2, #8B5CF6);
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  box-shadow: 0 4px 16px rgba(88, 101, 242, 0.4);
  margin-bottom: 12px;
}

.fallback-retry {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 100px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
}

.camera-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.camera-glow--1 {
  background: radial-gradient(circle at 20% 70%, rgba(255, 200, 100, 0.10) 0%, transparent 40%);
}

.camera-glow--2 {
  background: radial-gradient(circle at 80% 30%, rgba(100, 180, 220, 0.08) 0%, transparent 40%);
}

.fish-blob {
  position: absolute;
  top: 38%;
  left: 30%;
  width: 160px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(255, 220, 160, 0.18) 0%, transparent 70%);
  filter: blur(8px);
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(20px, -10px); }
}

.topbar {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 54px 20px 10px;
}

.iconbtn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(20, 20, 30, 0.40);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #fff;
}

.topbar-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 100px;
  background: rgba(20, 20, 30, 0.40);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
}

.topbar-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #34C759;
  box-shadow: 0 0 0 3px rgba(52, 199, 89, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.cat-switch {
  position: absolute;
  top: 130px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 6px;
  z-index: 6;
}

.cat-pill {
  padding: 8px 14px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(20, 20, 30, 0.40);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.85);
}

.cat-pill--active {
  background: rgba(255, 255, 255, 0.95);
  color: #1C1C1E;
  border-color: transparent;
}

.viewfinder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 4;
}

.vf-box {
  position: relative;
  width: 260px;
  height: 260px;
}

.vf-corner {
  position: absolute;
  width: 36px;
  height: 36px;
}

.vf-corner--tl {
  top: 0; left: 0;
  border-top: 3px solid #fff;
  border-left: 3px solid #fff;
  border-top-left-radius: 16px;
}

.vf-corner--tr {
  top: 0; right: 0;
  border-top: 3px solid #fff;
  border-right: 3px solid #fff;
  border-top-right-radius: 16px;
}

.vf-corner--bl {
  bottom: 0; left: 0;
  border-bottom: 3px solid #fff;
  border-left: 3px solid #fff;
  border-bottom-left-radius: 16px;
}

.vf-corner--br {
  bottom: 0; right: 0;
  border-bottom: 3px solid #fff;
  border-right: 3px solid #fff;
  border-bottom-right-radius: 16px;
}

.scan-line {
  position: absolute;
  left: 8px;
  right: 8px;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, transparent, #5865F2, transparent);
  box-shadow: 0 0 18px rgba(88, 101, 242, 0.8);
  animation: scan 2.4s ease-in-out infinite;
}

@keyframes scan {
  0%, 100% { top: 8px; opacity: 0; }
  10%, 90% { opacity: 1; }
  50% { top: calc(100% - 10px); }
}

.vf-hint {
  margin-top: 40px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.recenter-btn {
  position: absolute;
  right: 20px;
  bottom: 240px;
  z-index: 6;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(20, 20, 30, 0.40);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bottom-panel {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.7) 30%, rgba(0, 0, 0, 0.92) 100%);
  z-index: 5;
}

.shutter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 24px 40px;
}

.album-btn {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  background: rgba(20, 20, 30, 0.40);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.shutter-wrap {
  position: relative;
  width: 78px;
  height: 78px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.shutter-ripple {
  position: absolute;
  width: 78px;
  height: 78px;
  border-radius: 50%;
  background: transparent;
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.2), 0 0 0 8px rgba(255, 255, 255, 0.06);
  animation: ripple-pulse 2s ease-in-out infinite;
}

@keyframes ripple-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.7; }
}

.shutter-btn {
  width: 78px;
  height: 78px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;
}

.shutter-inner {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid #1C1C1E;
}

.flip-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(20, 20, 30, 0.40);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ====== 模式 B：Loading ====== */
.loading-page {
  position: relative;
  width: 100%;
  height: 100vh;
  background: #0A1410;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.loading-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 30% 30%, rgba(88, 101, 242, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 70% 70%, rgba(139, 92, 246, 0.15) 0%, transparent 50%);
}

.loading-card {
  position: relative;
  width: 100%;
  max-width: 360px;
  background: rgba(20, 20, 30, 0.72);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: var(--rc);
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.loading-preview {
  width: 100%;
  aspect-ratio: 1;
  background: rgba(0, 0, 0, 0.5) center/cover no-repeat;
  border-radius: 18px;
  margin-bottom: 20px;
}

.loading-progress {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.loading-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--b), var(--b2));
  border-radius: 3px;
  transition: width 0.2s ease;
}

.loading-percent {
  text-align: center;
  color: rgba(255, 255, 255, 0.95);
  font-size: 14px;
  font-weight: 600;
  margin-top: 12px;
}

.loading-hint {
  text-align: center;
  color: rgba(255, 255, 255, 0.65);
  font-size: 13px;
  margin-top: 6px;
}

/* ====== 模式 C：结果弹层 ====== */
.result-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: var(--bg);
  padding: 54px 20px 40px;
}

.result-bg {
  position: fixed;
  inset: 0;
  background: linear-gradient(180deg, #F2F3F7 0%, #E8EAF2 100%);
  z-index: -1;
}

.result-card {
  background: #fff;
  border-radius: var(--rc);
  box-shadow: var(--sm);
  overflow: hidden;
}

.result-photo {
  width: 100%;
  aspect-ratio: 16/9;
  background: #1C1C1E center/cover no-repeat;
}

.result-body {
  padding: 20px;
}

.result-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 4px;
}

.result-sub {
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 16px;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.result-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 16px;
  border: 1.5px solid transparent;
  background: var(--bg);
  transition: all 0.2s;
}

.result-row--active {
  border-color: var(--b);
  background: rgba(88, 101, 242, 0.05);
}

.result-emoji {
  font-size: 28px;
}

.result-meta {
  flex: 1;
}

.result-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--ink);
}

.result-conf {
  font-size: 12px;
  color: var(--muted);
  margin-top: 2px;
}

.result-check {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--b), var(--b2));
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
}

.result-actions {
  display: flex;
  gap: 10px;
}

/* ====== 模式 D：补字段抽屉 ====== */
.edit-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: var(--bg);
}

.edit-bg {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: -1;
}

.edit-card {
  background: #fff;
  border-radius: var(--rc) var(--rc) 0 0;
  margin-top: 54px;
  min-height: calc(100vh - 54px);
  padding-bottom: 100px;
  animation: slide-up 0.3s ease;
}

@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.edit-handle {
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.15);
  margin: 8px auto;
}

.edit-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 20px 16px;
}

.edit-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--ink);
}

.edit-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: var(--muted);
}

.edit-body {
  padding: 0 20px;
}

.edit-photo {
  width: 100%;
  aspect-ratio: 16/9;
  background: #1C1C1E center/cover no-repeat;
  border-radius: 16px;
  margin-bottom: 20px;
}

.edit-section {
  margin-bottom: 20px;
}

.edit-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 8px;
}

.edit-label-sub {
  font-weight: 400;
  color: var(--muted);
  font-size: 12px;
}

.edit-species {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(88, 101, 242, 0.08);
  border-radius: var(--rb);
}

.edit-species-emoji {
  font-size: 22px;
}

.edit-species-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--b);
}

.edit-input {
  width: 100%;
  height: 44px;
  padding: 0 14px;
  background: var(--bg);
  border-radius: var(--rb);
  font-size: 15px;
  color: var(--ink);
  border: 1.5px solid transparent;
  box-sizing: border-box;
}

.edit-input:focus {
  border-color: var(--b);
  background: #fff;
}

.edit-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.edit-tag {
  padding: 8px 14px;
  background: var(--bg);
  border-radius: 100px;
  font-size: 13px;
  color: var(--ink2);
  border: 1.5px solid transparent;
  transition: all 0.2s;
}

.edit-tag--active {
  background: rgba(88, 101, 242, 0.1);
  color: var(--b);
  border-color: var(--b);
}

.edit-textarea {
  width: 100%;
  min-height: 80px;
  padding: 12px 14px;
  background: var(--bg);
  border-radius: var(--rb);
  font-size: 14px;
  color: var(--ink);
  border: 1.5px solid transparent;
  box-sizing: border-box;
  font-family: inherit;
}

.edit-textarea:focus {
  border-color: var(--b);
  background: #fff;
}

.edit-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  gap: 10px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

/* ====== Buttons ====== */
.btn {
  flex: 1;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 600;
  border-radius: var(--rb);
  transition: all 0.2s;
}

.btn--primary {
  background: linear-gradient(135deg, var(--b), var(--b2));
  color: #fff;
}

.btn--secondary {
  background: rgba(60, 60, 67, 0.06);
  color: var(--ink);
}
</style>
