<template>
  <view class="page-loading">
    <!-- Dark backdrop with radial glow -->
    <view class="loading-backdrop">
      <view class="loading-glow" />
    </view>

    <!-- User photo placeholder -->
    <view class="user-photo">
      <text class="user-photo-text">📷 拍摄的照片</text>
    </view>

    <!-- Loading block -->
    <view class="loading-block">
      <!-- Percentage -->
      <view class="loading-pct">
        <text class="pct-num">{{ progress }}</text>
        <text class="pct-unit">%</text>
      </view>

      <!-- Progress bar -->
      <view class="loading-bar">
        <view class="loading-bar-fill" :style="{ width: progress + '%' }" />
        <view class="loading-bar-shimmer" />
      </view>

      <!-- Warm tip with decorative lines -->
      <view class="loading-quote">
        <view class="quote-line" />
        <text class="quote-text">{{ tips[currentTip] }}</text>
        <view class="quote-line" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// ── Warm tips ──
const tips = [
  '别急，鱼也有自己的节奏 🐟',
  'AI 正在识别中...',
  '马上就好 🎣',
  '钓大鱼需要耐心 😌',
]
const currentTip = ref(0)

// ── Progress ──
const progress = ref(0)

let progressTimer: ReturnType<typeof setInterval> | null = null
let tipTimer: ReturnType<typeof setInterval> | null = null
let backTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  // Tip rotation every 4 seconds
  tipTimer = setInterval(() => {
    currentTip.value = (currentTip.value + 1) % tips.length
  }, 4000)

  // Mock progress: random 1-5 per 100ms, cap at 95
  progressTimer = setInterval(() => {
    const inc = Math.floor(Math.random() * 5) + 1
    progress.value = Math.min(progress.value + inc, 95)

    if (progress.value >= 95 && progressTimer) {
      clearInterval(progressTimer)
      progressTimer = null
      // Stay at 95% for 1 second then go back
      backTimer = setTimeout(() => {
        uni.navigateBack({ delta: 1 })
      }, 1000)
    }
  }, 100)
})

onUnmounted(() => {
  if (progressTimer) clearInterval(progressTimer)
  if (tipTimer) clearInterval(tipTimer)
  if (backTimer) clearTimeout(backTimer)
})
</script>

<style scoped lang="scss">
/* ── Page ── */
.page-loading {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 200rpx;
  background: #000;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC',
    'Helvetica Neue', sans-serif;
  color: #fff;
}

/* ── Backdrop ── */
.loading-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.loading-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 50% 35%,
    rgba(88, 101, 242, 0.12) 0%,
    rgba(139, 92, 246, 0.06) 30%,
    transparent 60%
  );
  pointer-events: none;
}

/* ── User photo placeholder ── */
.user-photo {
  position: relative;
  z-index: 2;
  width: 560rpx;
  height: 400rpx;
  border-radius: 36rpx;
  background: linear-gradient(135deg, #3d5a4a, #1a2a22);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.4);
  overflow: hidden;
  margin-bottom: 60rpx;
}

.user-photo::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 50% 50%,
    rgba(255, 220, 160, 0.2) 0%,
    transparent 50%
  );
}

.user-photo-text {
  position: relative;
  z-index: 1;
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.4);
}

/* ── Loading block ── */
.loading-block {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 560rpx;
  width: 100%;
}

/* ── Percentage ── */
.loading-pct {
  display: flex;
  align-items: baseline;
  justify-content: center;
}

.pct-num {
  font-size: 76rpx;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.pct-unit {
  font-size: 36rpx;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 600;
  margin-left: 4rpx;
}

/* ── Progress bar ── */
.loading-bar {
  position: relative;
  height: 12rpx;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 200rpx;
  margin-top: 28rpx;
  overflow: hidden;
}

.loading-bar-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: linear-gradient(90deg, #5865f2, #8b5cf6);
  border-radius: 200rpx;
  transition: width 0.12s linear;
}

.loading-bar-shimmer {
  position: absolute;
  inset: 0;
  border-radius: 200rpx;
  overflow: hidden;
}

.loading-bar-shimmer::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 38%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  border-radius: 200rpx;
  animation: shimmer 1.6s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    left: -38%;
  }
  100% {
    left: 100%;
  }
}

/* ── Warm quote ── */
.loading-quote {
  margin-top: 48rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
}

.quote-line {
  width: 48rpx;
  height: 4rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4rpx;
}

.quote-text {
  font-size: 30rpx;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
  line-height: 1.5;
}
</style>
