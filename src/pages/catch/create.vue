<template>
  <view class="page-capture">
    <!-- Camera background -->
    <view class="camera-bg">
      <view class="camera-glow camera-glow--1" />
      <view class="camera-glow camera-glow--2" />
      <view class="fish-blob" />
    </view>

    <!-- Top bar -->
    <view class="topbar">
      <view class="iconbtn" @tap="goBack">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" width="18" height="18">
          <path d="M15 6l-6 6 6 6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </view>
      <view class="topbar-title">
        <view class="topbar-dot" />
        <text>GPS · 西湖支流</text>
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
        <!-- Corner brackets via view elements -->
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
      <!-- Shutter row -->
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
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const categories = ['🐟 鱼种识别', '🦐 饵料识别', '🎣 环境识别']
const activeCat = ref(0)
const flashOn = ref(false)

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

function onAlbumPick() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album'],
    success: (res) => {
      uni.navigateTo({
        url: '/pages/capture/index?from=create',
      })
    },
  })
}

function onFlipCamera() {
  uni.showToast({ title: '切换摄像头', icon: 'none', duration: 800 })
}

async function handleShutter() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      uni.navigateTo({
        url: '/pages/capture/index?from=create',
      })
    },
    fail: () => {
      // User cancelled or chooseImage not supported — fallback mock
      uni.navigateTo({
        url: '/pages/capture/index?from=create',
      })
    },
  })
}
</script>

<style scoped lang="scss">
/* ====== Page ====== */
.page-capture {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', 'Helvetica Neue', sans-serif;
  color: #fff;
}

/* ====== Camera background ====== */
.camera-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 20%, #3D5A4A 0%, #1A2A22 50%, #0A1410 100%),
    #0A1410;
  background-blend-mode: multiply;
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

/* Fish-like floating blob */
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

/* ====== Top Bar ====== */
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

/* ====== Category Switcher ====== */
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

/* ====== Viewfinder ====== */
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

/* Corner brackets */
.vf-corner {
  position: absolute;
  width: 36px;
  height: 36px;
}

.vf-corner--tl {
  top: 0;
  left: 0;
  border-top: 3px solid #fff;
  border-left: 3px solid #fff;
  border-top-left-radius: 16px;
}

.vf-corner--tr {
  top: 0;
  right: 0;
  border-top: 3px solid #fff;
  border-right: 3px solid #fff;
  border-top-right-radius: 16px;
}

.vf-corner--bl {
  bottom: 0;
  left: 0;
  border-bottom: 3px solid #fff;
  border-left: 3px solid #fff;
  border-bottom-left-radius: 16px;
}

.vf-corner--br {
  bottom: 0;
  right: 0;
  border-bottom: 3px solid #fff;
  border-right: 3px solid #fff;
  border-bottom-right-radius: 16px;
}

/* Scanning line */
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

/* ====== Recenter Button ====== */
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

/* ====== Bottom Panel ====== */
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

/* Album button (left) */
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

/* Shutter button (center) */
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

/* Flip button (right) */
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
</style>
