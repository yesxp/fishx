<template>
  <view class="page">
    <!-- 顶栏：广州·天河 + 搜索/通知 -->
    <view class="topnav">
      <view class="location">
        <view class="location-dot" />
        <text class="location-text">广州 · 天河</text>
        <svg viewBox="0 0 12 12" width="10" height="10" class="location-arrow">
          <path d="M3 4.5l3 3 3-3" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".5" />
        </svg>
      </view>
      <view class="topnav-icons">
        <view class="iconbtn" @tap="onSearch">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3-3" stroke-linecap="round" />
          </svg>
        </view>
        <view class="iconbtn" @tap="onNotify">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M3 12h3M18 12h3" stroke-linecap="round" />
          </svg>
        </view>
      </view>
    </view>

    <!-- 可滚动内容区 -->
    <scroll-view scroll-y class="scroll-content" :enhanced="true" :show-scrollbar="false">
      <!-- ① Hero 卡片 -->
      <view class="hero">
        <view class="hero-glow" />
        <view class="hero-top">
          <text class="hero-label">今日鱼情</text>
          <view class="hero-chip">
            <view class="hero-chip-pulse" />
            <text class="hero-chip-text">可去</text>
          </view>
        </view>
        <view class="hero-headline">
          <text class="hl">下午 2-5 点</text>
          <text>是最佳窗口期</text>
        </view>
        <text class="hero-sub">气压 1012 hPa 稳定，浅水区鲫鱼活跃</text>
        <view class="stats">
          <view class="stat">
            <view class="stat-v">
              <text>28</text>
              <text class="stat-unit">°C</text>
            </view>
            <text class="stat-l">气温</text>
          </view>
          <view class="stat">
            <view class="stat-v">
              <text>1012</text>
              <text class="stat-unit">hPa</text>
            </view>
            <text class="stat-l">气压</text>
          </view>
          <view class="stat">
            <view class="stat-v">
              <text>↘2</text>
              <text class="stat-unit">级</text>
            </view>
            <text class="stat-l">风力</text>
          </view>
          <view class="stat">
            <view class="stat-v">
              <text>涨</text>
              <text class="stat-unit">↑1.8</text>
            </view>
            <text class="stat-l">潮汐</text>
          </view>
        </view>
        <view class="tactic-row">
          <view class="tactic-label">
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="4" />
            </svg>
            <text class="tactic-label-text">推荐</text>
          </view>
          <view class="tactic-chip">
            <text>🎣 路亚 · 米诺</text>
          </view>
          <view class="tactic-chip tactic-chip--warn">
            <text>🌽 玉米 · 红虫</text>
          </view>
          <view class="tactic-chip">
            <text>⏰ 14-17 时段</text>
          </view>
        </view>
      </view>

      <!-- ② AI 鱼小渔 -->
      <view class="sec-h">
        <text class="sec-title">问 AI 鱼小渔</text>
      </view>
      <view class="ai-ask">
        <view class="ai-ask-glow" />
        <view class="ai-head">
          <view class="ai-tag">
            <svg viewBox="0 0 12 12" width="12" height="12" fill="currentColor">
              <path d="M6 0l1.5 4.5L12 6 7.5 7.5 6 12 4.5 7.5 0 6l4.5-1.5z" />
            </svg>
            <text class="ai-tag-text">鱼小渔</text>
          </view>
          <view class="ai-ctx">
            <view class="ai-ctx-dot" />
            <text class="ai-ctx-text">广州·天河 · 下午 · 气压 1012</text>
          </view>
        </view>
        <view class="ai-input">
          <text class="ai-input-icon">💬</text>
          <input
            class="ai-input-field"
            type="text"
            placeholder="下午这个气压，路亚翘嘴能爆护吗？"
            placeholder-class="ai-input-placeholder"
            :readonly="true"
          />
          <view class="send-btn" @tap="onAiSend">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 8h11M9 4l4 4-4 4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </view>
        </view>
        <view class="quickchips">
          <view class="quickchip" v-for="(q, i) in quickQuestions" :key="i" @tap="onQuickChip(q)">
            <text>{{ q }}</text>
          </view>
        </view>
      </view>

      <!-- ③ 我最近的钓获 -->
      <view class="sec-h">
        <text class="sec-title">我最近的钓获</text>
        <view class="sec-action" @tap="onViewAll">
          <text class="sec-action-text">查看全部</text>
          <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 3l4 3-4 3" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </view>
      </view>

      <!-- 主卡 -->
      <view class="catch-main">
        <view class="catch-thumb-lg">
          <text class="catch-thumb-emoji">🐟</text>
        </view>
        <view class="catch-info">
          <view class="catch-top">
            <text class="catch-name">{{ mainCatch.name }}</text>
            <text class="catch-time">· {{ mainCatch.time }}</text>
          </view>
          <text class="catch-meta">{{ mainCatch.spot }} · {{ mainCatch.method }}</text>
          <view class="catch-tags">
            <view class="catch-tag" v-for="(tag, i) in mainCatch.tags" :key="i" :class="{ 'catch-tag--mood': tag.type === 'mood' }">
              <text>{{ tag.text }}</text>
            </view>
          </view>
        </view>
        <view class="catch-wt">
          <text class="catch-wt-num">{{ mainCatch.weight }}</text>
          <text class="catch-wt-unit">g</text>
        </view>
      </view>

      <!-- 副卡 row -->
      <view class="catch-sub-row">
        <view class="catch-sub" v-for="(sub, i) in subCatches" :key="i">
          <view class="catch-thumb-sm" :class="'catch-thumb-sm--' + sub.color">
            <text class="catch-thumb-emoji-sm">{{ sub.emoji }}</text>
          </view>
          <view class="catch-sub-info">
            <view class="catch-sub-top">
              <text class="catch-sub-name">{{ sub.name }}</text>
              <view class="catch-sub-wt">
                <text>{{ sub.weight }}</text>
                <text class="catch-sub-wt-unit">{{ sub.unit }}</text>
              </view>
            </view>
            <text class="catch-sub-meta">{{ sub.meta }}</text>
          </view>
        </view>
      </view>

      <!-- ④ 鱼种图鉴入口 -->
      <view class="sec-h">
        <text class="sec-title">鱼种图鉴</text>
      </view>
      <view class="species-entry" @tap="onSpeciesEntry">
        <view class="species-icon">
          <text class="species-emoji">🐟</text>
        </view>
        <view class="species-body">
          <view class="species-title-row">
            <text class="species-title">已解锁 </text>
            <text class="species-count">5</text>
            <text class="species-title"> / 8 种</text>
          </view>
          <text class="species-sub">解锁鲫鱼/鲤鱼/草鱼/鲈鱼/翘嘴 · 还有 3 种待探索</text>
        </view>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#5865F2" stroke-width="2.4" class="species-arrow">
          <path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </view>

      <!-- 底部安全区 -->
      <view style="height: 120px" />
    </scroll-view>
  </view>
  <CenterFab />
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// ---- Quick questions ----
const quickQuestions = ref([
  '这个气压适合路亚吗？',
  '鲫鱼用什么饵稳？',
  '3 点去会不会空军？'
])

// ---- 鱼获 Mock 数据 ----
interface CatchTag {
  text: string
  type?: string
}

const mainCatch = reactive({
  name: '鲫鱼',
  time: '14:30',
  spot: '老王钓位',
  method: '台钓',
  weight: 320,
  tags: [
    { text: '☀️ 晴 28°' },
    { text: '📍 1.2km' },
    { text: '💬 状态不错', type: 'mood' }
  ] as CatchTag[]
})

interface SubCatch {
  name: string
  weight: string
  unit: string
  meta: string
  emoji: string
  color: string
}

const subCatches = ref<SubCatch[]>([
  {
    name: '鲤鱼',
    weight: '1.2',
    unit: 'kg',
    meta: '老王 · 台钓 · 11:20',
    emoji: '🐠',
    color: 'a1'
  },
  {
    name: '翘嘴',
    weight: '680',
    unit: 'g',
    meta: '千岛湖 · 路亚 · 昨天',
    emoji: '🎏',
    color: 'a2'
  }
])

// ---- Actions ----
function onSearch() {
  // TODO
}

function onNotify() {
  // TODO
}

function onAiSend() {
  // TODO: AI 发送
}

function onQuickChip(q: string) {
  // TODO: 快捷提问
}

function onViewAll() {
  // TODO: 查看全部鱼获
}

function onSpeciesEntry() {
  // TODO: 跳转鱼种图鉴
}
</script>

<style scoped lang="scss">
/* ====== Design Tokens (from HTML prototype) ====== */
:root {
  --b: #5865F2;
  --b2: #8B5CF6;
  --ink: #1C1C1E;
  --ink2: #3C3C43;
  --muted: #8E8E93;
  --good: #34C759;
  --gs: rgba(52, 199, 89, 0.12);
  --warn: #FF9500;
  --ws: rgba(255, 149, 0, 0.12);
  --border: rgba(60, 60, 67, 0.08);
  --divider: rgba(60, 60, 67, 0.06);
  --glass: rgba(255, 255, 255, 0.72);
  --rc: 24px;
  --rb: 14px;
  --sm: 0 2px 6px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.06);
}

/* ====== Page ====== */
.page {
  min-height: 100vh;
  background: #F2F3F7;
  font-family: -apple-system, "PingFang SC", sans-serif;
  color: #1C1C1E;
  position: relative;
  overflow-x: hidden;
  width: 100%;
  box-sizing: border-box;
  max-width: 100vw;
}

/* ====== Top Nav ====== */
.topnav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 20px 14px;
}

.location {
  display: flex;
  align-items: center;
  gap: 6px;
}

.location-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #34C759;
  box-shadow: 0 0 0 4px rgba(52, 199, 89, 0.18);
}

.location-text {
  font-size: 14px;
  color: #3C3C43;
  font-weight: 600;
}

.location-arrow {
  color: #3C3C43;
}

.topnav-icons {
  display: flex;
  gap: 8px;
}

.iconbtn {
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

/* ====== Scrollable Content ====== */
.scroll-content {
  height: calc(100vh - 58px);
  padding: 0 16px;
  overflow-x: hidden;
}

/* ====== Section Headers ====== */
.sec-h {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 4px 10px;
}

.sec-title {
  font-size: 13px;
  color: #8E8E93;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.sec-action {
  display: flex;
  align-items: center;
  gap: 2px;
}

.sec-action-text {
  font-size: 12px;
  color: #5865F2;
  font-weight: 600;
}

/* ====== ① Hero Card ====== */
.hero {
  background: linear-gradient(140deg, #fff 0%, #F8F9FF 100%);
  border-radius: 24px;
  padding: 20px 22px 18px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(60, 60, 67, 0.08);
  position: relative;
  overflow: hidden;
  margin-top: 8px;
}

.hero-glow {
  position: absolute;
  top: -40%;
  right: -30%;
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(139, 92, 246, 0.18), transparent 70%);
  pointer-events: none;
}

.hero-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.hero-label {
  font-size: 12px;
  color: #8E8E93;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.hero-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 100px;
  background: var(--gs);
}

.hero-chip-pulse {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #34C759;
  animation: pulse-ring 2s infinite;
}

.hero-chip-text {
  font-size: 11px;
  font-weight: 700;
  color: #1B7F3A;
}

@keyframes pulse-ring {
  0% { box-shadow: 0 0 0 0 rgba(52, 199, 89, 0.6); }
  70%, 100% { box-shadow: 0 0 0 8px rgba(52, 199, 89, 0); }
}

.hero-headline {
  font-size: 22px;
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: -0.02em;
  position: relative;
  margin: 14px 0 6px;
}

.hl {
  background: linear-gradient(135deg, #5865F2, #8B5CF6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-sub {
  font-size: 13px;
  color: #8E8E93;
  line-height: 1.5;
  position: relative;
}

/* Stats Grid */
.stats {
  display: flex;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid rgba(60, 60, 67, 0.06);
  position: relative;
}

.stat {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.stat-v {
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.stat-unit {
  font-size: 10px;
  color: #8E8E93;
  font-weight: 500;
}

.stat-l {
  font-size: 10px;
  color: #8E8E93;
  margin-top: 2px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* Tactic Row */
.tactic-row {
  display: flex;
  gap: 5px;
  margin-top: 14px;
  padding: 8px 10px;
  background: rgba(88, 101, 242, 0.05);
  border-radius: 12px;
  align-items: center;
  position: relative;
}

.tactic-label {
  display: flex;
  align-items: center;
  gap: 3px;
  flex-shrink: 0;
  color: #5865F2;
}

.tactic-label-text {
  font-size: 10px;
  font-weight: 700;
  color: #5865F2;
}

.tactic-chip {
  padding: 4px 8px;
  border-radius: 100px;
  font-size: 10.5px;
  font-weight: 600;
  background: #fff;
  color: #3C3C43;
  border: 1px solid rgba(60, 60, 67, 0.08);
  white-space: nowrap;
  flex-shrink: 0;
}

.tactic-chip--warn {
  background: var(--ws);
  color: #9A5500;
  border-color: rgba(255, 149, 0, 0.2);
}

/* ====== ② AI 鱼小渔 ====== */
.ai-ask {
  background: linear-gradient(135deg, rgba(88, 101, 242, 0.1) 0%, rgba(139, 92, 246, 0.12) 100%);
  border: 1.5px dashed rgba(88, 101, 242, 0.5);
  border-radius: 24px;
  padding: 16px;
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.1);
  position: relative;
  overflow: hidden;
}

.ai-ask-glow {
  position: absolute;
  top: -50px;
  right: -50px;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(139, 92, 246, 0.25), transparent 70%);
  pointer-events: none;
}

.ai-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  position: relative;
}

.ai-tag {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 100px;
  border: 1px dashed rgba(88, 101, 242, 0.45);
  background: linear-gradient(135deg, rgba(88, 101, 242, 0.06), rgba(139, 92, 246, 0.06));
}

.ai-tag-text {
  font-size: 11px;
  font-weight: 700;
  color: #5865F2;
}

.ai-ctx {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.5);
  padding: 3px 8px;
  border-radius: 100px;
}

.ai-ctx-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #34C759;
}

.ai-ctx-text {
  font-size: 11px;
  color: #8E8E93;
  font-weight: 500;
}

.ai-input {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border-radius: 14px;
  padding: 10px 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(60, 60, 67, 0.08);
  position: relative;
}

.ai-input-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.ai-input-field {
  flex: 1;
  font-size: 13px;
  background: transparent;
  border: 0;
  outline: 0;
}

.ai-input-placeholder {
  color: #8E8E93;
  font-size: 13px;
}

.send-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5865F2, #8B5CF6);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.quickchips {
  display: flex;
  gap: 6px;
  margin-top: 10px;
  flex-wrap: wrap;
  position: relative;
}

.quickchip {
  padding: 6px 10px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.7);
  color: #5865F2;
  border: 1px solid rgba(88, 101, 242, 0.25);
}

/* ====== ③ 鱼获卡片 ====== */
.catch-main {
  background: linear-gradient(140deg, #fff 0%, #F4F2FF 100%);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 18px;
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.1);
  padding: 14px 16px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  overflow: hidden;
}

.catch-thumb-lg {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  flex-shrink: 0;
  background: linear-gradient(135deg, #A8C0E0, #5865F2);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(88, 101, 242, 0.25);
}

.catch-thumb-emoji {
  font-size: 28px;
  color: #fff;
}

.catch-info {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.catch-top {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 2px;
}

.catch-name {
  font-size: 15px;
  font-weight: 700;
  line-height: 1.3;
}

.catch-time {
  font-size: 11px;
  color: #8E8E93;
  font-weight: 500;
}

.catch-meta {
  font-size: 11px;
  color: #8E8E93;
  margin-top: 2px;
}

.catch-tags {
  display: flex;
  gap: 5px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.catch-tag {
  padding: 3px 7px;
  border-radius: 100px;
  font-size: 10px;
  font-weight: 600;
  background: rgba(88, 101, 242, 0.06);
  color: #5865F2;
  display: flex;
  align-items: center;
  gap: 2px;
}

.catch-tag--mood {
  background: rgba(52, 199, 89, 0.10);
  color: #1B7F3A;
}

.catch-wt {
  flex-shrink: 0;
  align-self: flex-start;
}

.catch-wt-num {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: #1C1C1E;
}

.catch-wt-unit {
  font-size: 11px;
  color: #8E8E93;
  font-weight: 500;
  margin-left: 1px;
}

/* Sub cards */
.catch-sub-row {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  overflow: hidden;
}

.catch-sub {
  flex: 1;
  background: #fff;
  border: 1px solid rgba(60, 60, 67, 0.08);
  border-radius: 14px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.03);
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.catch-thumb-sm {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.catch-thumb-sm--a1 {
  background: linear-gradient(135deg, #FFE082, #FFB020);
}

.catch-thumb-sm--a2 {
  background: linear-gradient(135deg, #A5D6A7, #34C759);
}

.catch-thumb-emoji-sm {
  font-size: 18px;
  color: #fff;
}

.catch-sub-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.catch-sub-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 6px;
}

.catch-sub-name {
  font-size: 13px;
  font-weight: 700;
  line-height: 1.3;
}

.catch-sub-wt {
  font-size: 12px;
  color: #1C1C1E;
  font-weight: 800;
  flex-shrink: 0;
}

.catch-sub-wt-unit {
  font-size: 9px;
  color: #8E8E93;
  font-weight: 500;
  margin-left: 1px;
}

.catch-sub-meta {
  font-size: 10px;
  color: #8E8E93;
  font-weight: 500;
}

/* ====== ④ 鱼种图鉴入口 ====== */
.species-entry {
  background: linear-gradient(135deg, rgba(52, 199, 89, 0.08) 0%, rgba(88, 101, 242, 0.08) 100%);
  border: 1px solid rgba(60, 60, 67, 0.08);
  border-radius: 24px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.species-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, #5865F2, #8B5CF6);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(88, 101, 242, 0.3);
}

.species-emoji {
  font-size: 24px;
  color: #fff;
}

.species-body {
  flex: 1;
  position: relative;
}

.species-title-row {
  display: flex;
  align-items: baseline;
}

.species-title {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.01em;
}

.species-count {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: #5865F2;
}

.species-sub {
  font-size: 12px;
  color: #8E8E93;
  margin-top: 3px;
  line-height: 1.4;
}

.species-arrow {
  flex-shrink: 0;
  color: #5865F2;
}
</style>
