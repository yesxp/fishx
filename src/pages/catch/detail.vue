<template>
  <view class="page">
    <!-- 顶栏 -->
    <view class="topbar">
      <view class="topbar-left" @tap="goBack">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4">
          <path d="M15 6l-6 6 6 6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </view>
      <text class="topbar-title">鱼获详情</text>
      <view class="topbar-right">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="19" cy="5" r="1.5" />
          <circle cx="5" cy="5" r="1.5" />
        </svg>
      </view>
    </view>

    <!-- 可滚动内容 -->
    <scroll-view scroll-y class="scroll-content" :enhanced="true" :show-scrollbar="false">

      <!-- 轮播图 -->
      <view class="carousel">
        <swiper
          class="carousel-swiper"
          :indicator-dots="false"
          :autoplay="false"
          :circular="false"
          @change="onSwiperChange"
        >
          <swiper-item v-for="(photo, idx) in photos" :key="idx">
            <view class="carousel-item">
              <view class="carousel-placeholder" :style="{ background: photo.bg }">
                <text class="carousel-emoji">{{ photo.emoji }}</text>
              </view>
            </view>
          </swiper-item>
        </swiper>
        <view class="carousel-overlay" />
        <view class="carousel-info">
          <text class="carousel-species">{{ detail.fishName }}</text>
          <text class="carousel-latin">{{ detail.latin }}</text>
        </view>
        <view class="carousel-dots">
          <view
            v-for="(photo, idx) in photos"
            :key="idx"
            class="carousel-dot"
            :class="{ 'carousel-dot--active': currentSlide === idx }"
          />
        </view>
      </view>

      <!-- 鱼种百科摘要卡 -->
      <view class="species-card">
        <view class="sp-head">
          <view class="sp-emoji">
            <text>{{ detail.fishEmoji }}</text>
          </view>
          <view class="sp-info">
            <text class="sp-name">{{ detail.fishName }}</text>
            <text class="sp-latin">{{ detail.latin }}</text>
          </view>
        </view>
        <view class="sp-chips">
          <view
            v-for="(chip, idx) in detail.chips"
            :key="idx"
            class="sp-chip"
            :class="{ 'sp-chip--green': idx === 0 }"
          >
            <text>{{ chip }}</text>
          </view>
        </view>
        <view class="sp-bio">
          <text class="sp-bio-title">为什么叫"{{ detail.fishName }}"？</text>
          <text class="sp-bio-text">{{ detail.bio }}</text>
          <view class="sp-link">
            <text class="sp-link-text">查看完整图鉴 →</text>
          </view>
        </view>
      </view>

      <!-- 基础信息卡 -->
      <view class="sec-h">
        <text class="sec-title">记录详情</text>
      </view>
      <view class="info-card">
        <view class="info-grid">
          <view class="info-cell" v-for="(item, idx) in infoGrid" :key="idx">
            <text class="info-emoji">{{ item.emoji }}</text>
            <text class="info-label">{{ item.label }}</text>
            <text class="info-value">{{ item.value }}</text>
          </view>
        </view>
      </view>

      <!-- 3 个 CTA 按钮 -->
      <view class="cta-grid">
        <view class="btn btn--primary" @tap="copyText()">
          <text class="btn-text btn-text--white">✨ 复制文案</text>
        </view>
        <view class="btn btn--secondary" @tap="onEdit">
          <text class="btn-text">📝 编辑</text>
        </view>
        <view class="btn btn--danger" @tap="onDelete">
          <text class="btn-text btn-text--red">🗑 删除</text>
        </view>
      </view>

      <!-- AI 文案打磨 · 5 种风格 -->
      <view class="sec-h">
        <text class="sec-title">AI 文案打磨 · 5 种风格</text>
      </view>
      <view class="ai-subtitle">
        <text>基于这条鱼获，AI 为你生成不同风格的分享文案</text>
      </view>

      <view
        v-for="(style, idx) in styles"
        :key="idx"
        class="copy-card"
        :class="'copy-card--' + style.key"
      >
        <view class="copy-card-head">
          <view class="copy-tag" :class="'copy-tag--' + style.key">
            <text>{{ style.emoji }} {{ style.name }}</text>
          </view>
        </view>
        <text class="copy-style">CATCH REPORT</text>
        <text class="copy-text">{{ style.text }}</text>
        <view class="copy-actions">
          <view class="copy-btn" @tap="copyStyleText(style)">
            <text class="copy-btn-text">📋 复制</text>
          </view>
        </view>
      </view>

      <!-- 重新生成按钮 -->
      <view class="regen-btn" @tap="onRegenerate">
        <text class="regen-btn-text">🔄 重新生成</text>
      </view>

      <!-- 底部安全区 -->
      <view class="safe-bottom" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { polishAllStyles, type CopywritingContext } from '@/api/llm'
import { ALL_SPECIES } from '@/utils/fish-species-data'

// ---- 类型 ----
interface Photo {
  bg: string
  emoji: string
}

interface StyleItem {
  key: string
  emoji: string
  name: string
  text: string
}

interface InfoItem {
  emoji: string
  label: string
  value: string
}

// ---- 路由参数 ----
const detailId = ref('1')
const pages = getCurrentPages()
const currentPage = pages[pages.length - 1] as any
if (currentPage?.options?.id) {
  detailId.value = currentPage.options.id
}

// ---- 当前轮播索引 ----
const currentSlide = ref(0)

function onSwiperChange(e: any) {
  currentSlide.value = e.detail.current ?? 0
}

// ---- 轮播图 ----
const photos: Photo[] = [
  { bg: 'linear-gradient(135deg, #3D5A4A, #1A2A22)', emoji: '🐟' },
  { bg: 'linear-gradient(135deg, #2A4A6A, #0F2A4A)', emoji: '🐠' },
  { bg: 'linear-gradient(135deg, #5A3D4A, #2A1A22)', emoji: '🎣' },
]

// ---- 鱼种详情 ----
const detail = reactive({
  fishName: '鲫鱼',
  fishEmoji: '🐟',
  latin: 'Carassius auratus · 鲤科',
  chips: ['底层', '杂食', '易', '0.2-1.0kg', '春夏秋'],
  bio: '鲫鱼，中国最常见的淡水鱼之一，广布于江河湖库。因其肉质细嫩、适应性强，是钓友入门的首选鱼种。',
})

// ---- 基础信息网格 ----
const infoGrid: InfoItem[] = [
  { emoji: '🐟', label: '重量', value: '320g（AI 估算）' },
  { emoji: '🎯', label: '钓点', value: '老王钓位' },
  { emoji: '⏱', label: '时间', value: '今天 14:30' },
  { emoji: '🎣', label: '钓法', value: '台钓' },
  { emoji: '🪱', label: '饵料', value: '商品饵 + 蚯蚓' },
  { emoji: '💬', label: '心情', value: '得意' },
]

// ---- 5 风格文案（从 copywriting_seeds + LLM 润色）----
const STYLE_META: Record<string, { emoji: string; name: string }> = {
  proud: { emoji: '🏆', name: '得意' },
  modest: { emoji: '🙏', name: '谦虚' },
  funny: { emoji: '😂', name: '搞笑' },
  artistic: { emoji: '🎨', name: '文艺' },
  minimal: { emoji: '⚡', name: '简约' },
}

const styles = ref<StyleItem[]>([])
const regenerating = ref(false)

// 文案润色函数（mock + LLM 接口）
async function generateCopywriting() {
  regenerating.value = true
  try {
    // 1. 找鱼种
    const speciesName = detail.fishName
    const allSpecies = ALL_SPECIES
    const target = allSpecies.find(s => s.zh_name === speciesName)

    // 2. 构建上下文
    const ctx: CopywritingContext = {
      species_name: speciesName,
      weight_g: 320, // TODO: 从 infoGrid 提取
      spot_name: '老王钓位',
      method: '台钓',
    }

    // 3. 调 LLM 批量润色
    const polished = await polishAllStyles(ctx)

    // 4. 渲染
    styles.value = polished.map(p => ({
      key: p.style,
      emoji: STYLE_META[p.style]?.emoji || '✒️',
      name: STYLE_META[p.style]?.name || p.style,
      text: p.text,
    }))
  } finally {
    regenerating.value = false
  }
}

// 页面加载时生成一次
onMounted(() => {
  generateCopywriting()
})

// ---- 操作 ----
function goBack() {
  uni.navigateBack()
}

function copyText() {
  const defaultText = styles[0]?.text ?? ''
  uni.setClipboardData({
    data: defaultText,
    success() {
      uni.showToast({ title: '已复制', icon: 'success' })
    },
  })
}

function copyStyleText(style: StyleItem) {
  uni.setClipboardData({
    data: style.text,
    success() {
      uni.showToast({ title: '已复制', icon: 'success' })
    },
  })
}

function onEdit() {
  uni.showToast({ title: '编辑功能开发中', icon: 'none' })
}

function onDelete() {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这条鱼获记录吗？此操作不可撤销。',
    confirmText: '删除',
    confirmColor: '#FF3B30',
    success(res) {
      if (res.confirm) {
        uni.showToast({ title: '已删除', icon: 'success' })
        setTimeout(() => {
          uni.navigateBack()
        }, 1200)
      }
    },
  })
}

function onRegenerate() {
  generateCopywriting()
}
</script>

<style scoped lang="scss">
/* ====== Design Tokens ====== */
// Note: --b/--b2 etc. not used directly in <style>, using raw values for uni-app compat

/* ====== Page ====== */
.page {
  min-height: 100vh;
  background: #F2F3F7;
  font-family: -apple-system, "PingFang SC", sans-serif;
  color: #1C1C1E;
  position: relative;
  overflow: hidden;
}

/* ====== Top Bar ====== */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 54px 20px 12px;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(60, 60, 67, 0.06);
}

.topbar-left {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1C1C1E;
}

.topbar-title {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.topbar-right {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(60, 60, 67, 0.08);
  color: #1C1C1E;
}

/* ====== Scroll ====== */
.scroll-content {
  height: calc(100vh - 96px);
  padding: 0 0;
}

/* ====== Carousel ====== */
.carousel {
  position: relative;
  width: 100%;
  height: 340px;
  background: #000;
}

.carousel-swiper {
  width: 100%;
  height: 340px;
}

.carousel-item {
  width: 100%;
  height: 340px;
}

.carousel-placeholder {
  width: 100%;
  height: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-emoji {
  font-size: 64px;
  opacity: 0.5;
}

.carousel-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.55));
  pointer-events: none;
}

.carousel-info {
  position: absolute;
  bottom: 32px;
  left: 16px;
  right: 16px;
}

.carousel-species {
  font-size: 28px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
  display: block;
}

.carousel-latin {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 2px;
  display: block;
  font-style: italic;
}

.carousel-dots {
  position: absolute;
  bottom: 14px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 6px;
}

.carousel-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
}

.carousel-dot--active {
  background: #fff;
  width: 18px;
  border-radius: 3px;
}

/* ====== Species Card ====== */
.species-card {
  background: linear-gradient(140deg, #fff 0%, #F4F2FF 100%);
  border-radius: var(--rc-md);
  padding: 16px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  box-shadow: var(--sm-purple);
  margin: -30px 16px 0;
  position: relative;
  z-index: 3;
}

.sp-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.sp-emoji {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #5865F2, #8B5CF6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  box-shadow: 0 4px 10px rgba(88, 101, 242, 0.2);
  flex-shrink: 0;
}

.sp-info {
  flex: 1;
  min-width: 0;
}

.sp-name {
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.01em;
  display: block;
}

.sp-latin {
  font-size: 11px;
  color: #8E8E93;
  font-style: italic;
  margin-top: 2px;
  display: block;
}

.sp-chips {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.sp-chip {
  padding: 3px 8px;
  border-radius: var(--rc-chip);
  font-size: 10px;
  font-weight: 600;
  background: rgba(88, 101, 242, 0.1);
  color: #5865F2;
}

.sp-chip--green {
  background: rgba(52, 199, 89, 0.12);
  color: #1B7F3A;
}

/* ====== Bio Section ====== */
.sp-bio {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(60, 60, 67, 0.06);
}

.sp-bio-title {
  font-size: 13px;
  font-weight: 700;
  color: #8B5CF6;
  display: block;
  margin-bottom: 4px;
}

.sp-bio-text {
  font-size: 13px;
  color: #3C3C43;
  line-height: 1.6;
  display: block;
}

.sp-link {
  margin-top: 10px;
}

.sp-link-text {
  font-size: 12px;
  font-weight: 600;
  color: #5865F2;
}

/* ====== Section Header ====== */
.sec-h {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 10px;
}

.sec-title {
  font-size: 13px;
  color: #8E8E93;
  font-weight: 700;
  letter-spacing: 0.04em;
}

/* ====== Info Card ====== */
.info-card {
  background: #fff;
  border-radius: var(--rc-md);
  padding: 16px;
  border: 1px solid rgba(60, 60, 67, 0.08);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.03);
  margin: 0 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}

.info-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.info-emoji {
  font-size: 22px;
}

.info-label {
  font-size: 11px;
  color: #8E8E93;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.info-value {
  font-size: 13px;
  font-weight: 700;
  color: #1C1C1E;
  text-align: center;
}

/* ====== CTA Grid ====== */
.cta-grid {
  display: grid;
  grid-template-columns: 1fr 1.4fr 1.4fr;
  gap: 8px;
  margin: 18px 16px 0;
}

.btn {
  padding: 12px 14px;
  border-radius: var(--rb);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;
}

.btn--primary {
  background: linear-gradient(135deg, #5865F2, #8B5CF6);
  box-shadow: 0 4px 14px rgba(88, 101, 242, 0.3);
}

.btn--secondary {
  background: #fff;
  border: 1px solid rgba(60, 60, 67, 0.08);
}

.btn--danger {
  background: #fff;
  border: 1px solid rgba(255, 59, 48, 0.25);
}

.btn-text {
  font-size: 13px;
  font-weight: 600;
  color: #3C3C43;
}

.btn-text--white {
  color: #fff;
}

.btn-text--red {
  color: #FF3B30;
}

/* ====== AI Copy Styles Section ====== */
.ai-subtitle {
  padding: 0 20px 10px;
  font-size: 12px;
  color: #8E8E93;
  line-height: 1.5;
}

.copy-card {
  background: #fff;
  border-radius: var(--rc-md);
  border: 1px solid rgba(60, 60, 67, 0.08);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.03);
  padding: 14px;
  margin: 0 16px 10px;
  position: relative;
  overflow: hidden;
}

.copy-card-head {
  margin-bottom: 8px;
}

.copy-tag {
  display: inline-flex;
  padding: 3px 8px;
  border-radius: var(--rc-chip);
  font-size: 10px;
  font-weight: 700;
}

.copy-tag--proud {
  background: rgba(255, 215, 0, 0.15);
  color: #9A7B00;
}

.copy-tag--modest {
  background: rgba(52, 199, 89, 0.12);
  color: #1B7F3A;
}

.copy-tag--artistic {
  background: rgba(139, 92, 246, 0.12);
  color: #8B5CF6;
}

.copy-tag--funny {
  background: rgba(255, 149, 0, 0.14);
  color: #9A5500;
}

.copy-tag--minimal {
  background: rgba(60, 60, 67, 0.08);
  color: #3C3C43;
}

.copy-style {
  font-size: 10px;
  color: #8E8E93;
  font-weight: 700;
  letter-spacing: 0.04em;
  display: block;
  margin-bottom: 6px;
}

.copy-text {
  font-size: 14px;
  color: #1C1C1E;
  line-height: 1.5;
}

.copy-actions {
  display: flex;
  gap: 6px;
  margin-top: 10px;
  justify-content: flex-end;
}

.copy-btn {
  padding: 6px 12px;
  border-radius: var(--rc-chip);
  background: rgba(88, 101, 242, 0.08);
  display: inline-flex;
  align-items: center;
}

.copy-btn-text {
  font-size: 11px;
  font-weight: 600;
  color: #5865F2;
}

/* ====== Regenerate Button ====== */
.regen-btn {
  margin: 4px 16px 0;
  padding: 14px;
  border-radius: var(--rb);
  background: rgba(88, 101, 242, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

.regen-btn-text {
  font-size: 13px;
  font-weight: 600;
  color: #5865F2;
}

/* ====== Safe Bottom ====== */
.safe-bottom {
  height: 34px;
}
</style>
