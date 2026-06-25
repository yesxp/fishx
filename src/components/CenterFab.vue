<template>
  <view class="fab-wrap" @tap="onTap">
    <view class="fab-ring"></view>
    <view class="fab-ring d"></view>
    <view class="fab">
      <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2.4">
        <path d="M5 8h3l1.5-2h9L20 8h3a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" stroke-linejoin="round"/>
        <circle cx="14" cy="14" r="4.5"/>
      </svg>
    </view>
  </view>
</template>

<script setup>
const emit = defineEmits(['tap'])

const onTap = () => {
  emit('tap')
  uni.navigateTo({ url: '/pages/catch/create' })
}
</script>

<style scoped>
.fab-wrap {
  position: fixed;
  left: 50%;
  bottom: calc(env(safe-area-inset-bottom, 0px) + 16px);
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 99;
}
.fab {
  pointer-events: auto;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5865F2, #8B5CF6);
  box-shadow: 0 8px 24px rgba(88, 101, 242, 0.35);
  display: grid;
  place-items: center;
  color: #fff;
  position: relative;
}
.fab svg {
  width: 28px;
  height: 28px;
}
.fab::before {
  content: "";
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(139, 92, 246, 0.3), transparent 70%);
  z-index: -1;
}
.fab-ring {
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  border: 1.5px solid rgba(88, 101, 242, 0.3);
  animation: ripple 2.4s infinite;
}
.fab-ring.d {
  animation-delay: 1.2s;
}
@keyframes ripple {
  0% { transform: scale(0.92); opacity: 0.8; }
  100% { transform: scale(1.5); opacity: 0; }
}
</style>