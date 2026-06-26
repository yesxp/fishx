<template>
  <view class="page">
    <!-- Hero Header Section -->
    <view class="hero-header">
      <!-- Top Nav -->
      <view class="topnav">
        <text class="topnav-title">我的</text>
        <view class="top-actions">
          <view class="iconbtn" @tap="goSettings">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke-linejoin="round" />
            </svg>
          </view>
        </view>
      </view>

      <!-- User Info -->
      <view class="user">
        <view class="avatar">
          <text class="avatar-text">{{ mockUser.avatar }}</text>
          <view class="avatar-status" />
        </view>
        <view class="user-info">
          <view class="user-name-row">
            <text class="user-name">{{ mockUser.name }}</text>
            <view class="level-badge">
              <svg viewBox="0 0 12 12" width="10" height="10" fill="currentColor">
                <path d="M6 0l1.5 4L12 5l-3.5 3L10 12 6 9.5 2 12l1.5-4L0 5l4.5-1z" />
              </svg>
              <text class="level-text">{{ mockUser.level }} {{ mockUser.levelName }}</text>
            </view>
          </view>
          <text class="user-desc">{{ mockUser.bio }}</text>
        </view>
      </view>

      <!-- Stats Card -->
      <view class="stats-card">
        <view class="stat-item">
          <view class="stat-value">
            <text>{{ mockStats.totalCatches }}</text>
            <text class="stat-unit">尾</text>
          </view>
          <text class="stat-label">总鱼获</text>
        </view>
        <view class="stat-item">
          <view class="stat-value">
            <text>{{ mockStats.totalWeight }}</text>
          </view>
          <text class="stat-label">总重量</text>
        </view>
        <view class="stat-item">
          <view class="stat-value">
            <text>{{ mockStats.speciesUnlocked }}</text>
          </view>
          <text class="stat-label">鱼种解锁</text>
        </view>
        <view class="stat-item">
          <view class="stat-value">
            <text>{{ mockStats.streakDays }}</text>
            <text class="stat-unit">天</text>
          </view>
          <text class="stat-label">连续钓鱼</text>
        </view>
      </view>
    </view>

    <!-- Scrollable Content -->
    <scroll-view scroll-y class="scroll-content" :enhanced="true" :show-scrollbar="false">
      <!-- Tools Grid (2x2) -->
      <view class="sec-header">
        <text class="sec-title">实用工具</text>
      </view>
      <view class="tools-grid">
        <view
          v-for="(tool, i) in mockTools"
          :key="i"
          class="tool-card"
          @tap="onToolTap(tool)"
        >
          <view class="tool-icon" :class="'tool-icon--' + (i + 1)">
            <text class="tool-emoji">{{ tool.emoji }}</text>
          </view>
          <text class="tool-name">{{ tool.name }}</text>
          <text class="tool-desc">{{ tool.desc }}</text>
        </view>
      </view>

      <!-- Data Sharing Section -->
      <view class="sec-header">
        <text class="sec-title">数据共享</text>
      </view>
      <view class="share-card">
        <view class="share-icon">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#5865F2" stroke-width="2">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" stroke-linecap="round" stroke-linejoin="round" />
            <polyline points="16 6 12 2 8 6" stroke-linecap="round" stroke-linejoin="round" />
            <line x1="12" y1="2" x2="12" y2="15" stroke-linecap="round" />
          </svg>
        </view>
        <view class="share-body">
          <text class="share-title">导出鱼获数据</text>
          <text class="share-desc">备份到云端，随时随地查看</text>
        </view>
        <view class="share-btn" @tap="onExportData">
          <text class="share-btn-text">导出数据</text>
        </view>
      </view>

      <!-- Timeline Section -->
      <view class="sec-header">
        <text class="sec-title">近期活动</text>
      </view>
      <view class="timeline">
        <template v-for="(group, gIdx) in timelineGroups" :key="gIdx">
          <!-- 月份分组标题 -->
          <view class="timeline-group-header">
            <text class="timeline-group-title">{{ group.month }}</text>
            <view class="timeline-group-line" />
            <text class="timeline-group-count">{{ group.items.length }} 条</text>
          </view>
          <!-- 该月的时间线项 -->
          <view
            v-for="(item, i) in group.items"
            :key="`${gIdx}-${i}`"
            class="timeline-item"
          >
            <view class="timeline-dot" :class="{ 'timeline-dot--active': gIdx === 0 && i === 0 }" />
            <view class="timeline-content">
              <text class="timeline-time">{{ item.time }}</text>
              <text class="timeline-text">{{ item.text }}</text>
            </view>
          </view>
        </template>
      </view>

      <!-- Bottom Safe Area -->
      <view style="height: 120px" />
    </scroll-view>
  </view>
  <CenterFab />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getLocalCatches } from '@/api/catch'
const mockUser = {
  avatar: '🎣',
  name: '钓鱼人',
  level: 'Lv.3',
  levelName: '钓鱼达人',
  bio: '专注淡水钓 365 天',
}

const mockStats = {
  totalCatches: 23,
  totalWeight: '15.6kg',
  speciesUnlocked: '5/8',
  streakDays: 7,
}

interface ToolItem {
  emoji: string
  name: string
  desc: string
}

const mockTools: ToolItem[] = [
  { emoji: '📊', name: '战报', desc: '本周钓鱼数据' },
  { emoji: '✍️', name: '文案', desc: 'AI 文案工具' },
  { emoji: '📅', name: '年报', desc: '年度钓鱼报告' },
  { emoji: '📖', name: '图鉴', desc: '鱼种百科' },
]

interface TimelineItem {
  time: string
  text: string
  date: Date
}

interface TimelineGroup {
  month: string
  items: TimelineItem[]
}

// ---- 鱼获 → 时间线（按月分组） ----
const timelineGroups = computed<TimelineGroup[]>(() => {
  // 1. 从 storage 读取鱼获
  const catches = getLocalCatches()

  // 2. 转换为时间线条目
  const items: TimelineItem[] = catches.map((c: any) => {
    const d = new Date(c.caught_at || c.created_at)
    return {
      time: formatTime(d),
      text: `钓到${c.species_name} ${c.weight_g ? (c.weight_g / 500).toFixed(1) + '斤' : ''}`,
      date: d,
    }
  })

  // 3. 加上 mock 数据（开发期丰富展示）
  const mockDates = [
    { d: new Date(2026, 5, 25, 14, 30), text: '钓到翘嘴 680g' }, // 6月
    { d: new Date(2026, 5, 20, 9, 15), text: '解锁新鱼种：翘嘴' },
    { d: new Date(2026, 4, 28, 16, 40), text: '钓到草鱼 2.3kg' }, // 5月
    { d: new Date(2026, 4, 10, 11, 0), text: '完成首次破百钓' },
    { d: new Date(2026, 3, 15, 8, 30), text: '钓到鲫鱼 280g' }, // 4月
  ]
  mockDates.forEach(m => {
    items.push({ time: formatTime(m.d), text: m.text, date: m.d })
  })

  // 4. 按月份分组
  const groupMap = new Map<string, TimelineItem[]>()
  items.sort((a, b) => b.date.getTime() - a.date.getTime()) // 倒序
  items.forEach(item => {
    const key = `${item.date.getFullYear()}年${item.date.getMonth() + 1}月`
    if (!groupMap.has(key)) groupMap.set(key, [])
    groupMap.get(key)!.push(item)
  })

  // 5. 转数组
  return Array.from(groupMap.entries()).map(([month, items]) => ({ month, items }))
})

function formatTime(d: Date): string {
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const day = 24 * 60 * 60 * 1000
  if (diff < day) {
    return `今天 ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
  }
  if (diff < 2 * day) {
    return `昨天 ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
  }
  if (diff < 7 * day) {
    return `${Math.floor(diff / day)} 天前`
  }
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

// ---- Actions ----
function goSettings() {
  uni.showToast({ title: '设置页面开发中...', icon: 'none' })
}

function onToolTap(tool: ToolItem) {
  uni.showToast({ title: `${tool.name}功能开发中...`, icon: 'none' })
}

function onExportData() {
  uni.showToast({ title: '导出数据开发中...', icon: 'none' })
}
</script>

<style scoped lang="scss">
/* ====== Design Tokens ====== */
:root {
  --b: #5865F2;
  --b2: #8B5CF6;
  --ink: #1C1C1E;
  --ink2: #3C3C43;
  --muted: #8E8E93;
  --good: #34C759;
  --gs: rgba(52, 199, 89, 0.12);
  --border: rgba(60, 60, 67, 0.08);
  --divider: rgba(60, 60, 67, 0.06);
  --glass: rgba(255, 255, 255, 0.72);
  --sm: 0 1px 2px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.03);
}

/* ====== Page ====== */
.page {
  min-height: 100vh;
  background: #F2F3F7;
  font-family: var(--font);
  color: #1C1C1E;
  position: relative;
  overflow: hidden;
}

/* ====== Hero Header ====== */
.hero-header {
  position: relative;
  padding: 0 0 24px;
  background: linear-gradient(180deg, #E8EAFF 0%, #F2F3F7 100%);
  overflow: hidden;
}

.hero-header::before {
  content: "";
  position: absolute;
  top: -60px;
  right: -60px;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(139, 92, 246, 0.3), transparent 70%);
  pointer-events: none;
}

.hero-header::after {
  content: "";
  position: absolute;
  top: 60px;
  left: -40px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(88, 101, 242, 0.2), transparent 70%);
  pointer-events: none;
}

/* ====== Top Nav ====== */
.topnav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 54px var(--gap-5) 14px;
  position: relative;
  z-index: 2;
}

.topnav-title {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.top-actions {
  display: flex;
  gap: 8px;
}

.iconbtn {
  width: 36px;
  height: 44px;
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

/* ====== User Info ====== */
.user {
  padding: var(--gap-2) var(--gap-5)0;
  display: flex;
  align-items: center;
  gap: 14px;
  position: relative;
  z-index: 2;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5865F2, #8B5CF6);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(88, 101, 242, 0.3);
  border: 3px solid #fff;
  position: relative;
  flex-shrink: 0;
}

.avatar-text {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
}

.avatar-status {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 18px;
  height: 44px;
  border-radius: 50%;
  background: #34C759;
  border: 3px solid #fff;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.user-name {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.level-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px var(--gap-2);
  border-radius: var(--rc-chip);
  font-size: 11px;
  font-weight: 700;
  color: #7A4F00;
  background: linear-gradient(135deg, #FFE082, #FFB020);
}

.level-text {
  font-size: 11px;
  font-weight: 700;
  color: #7A4F00;
}

.user-desc {
  font-size: 12px;
  color: #8E8E93;
  margin-top: var(--gap-1);
  line-height: 1.4;
}

/* ====== Stats Card ====== */
.stats-card {
  margin: var(--gap-4) var(--gap-4)0;
  background: #fff;
  border-radius: 24px;
  padding: 18px;
  border: 1px solid rgba(60, 60, 67, 0.08);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.03);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  position: relative;
}

.stat-item {
  text-align: center;
  position: relative;
}

.stat-item + .stat-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 10%;
  bottom: 10%;
  width: 1px;
  background: rgba(60, 60, 67, 0.06);
}

.stat-value {
  font-size: 22px;
  font-weight: 800;
  color: #1C1C1E;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.stat-unit {
  font-size: 11px;
  color: #8E8E93;
  font-weight: 500;
  margin-left: 2px;
}

.stat-label {
  font-size: 11px;
  color: #8E8E93;
  margin-top: 2px;
  font-weight: 500;
  letter-spacing: 0.04em;
}

/* ====== Scrollable Content ====== */
.scroll-content {
  height: calc(100vh - 280px);
  padding: 0 16px;
}

/* ====== Section Header ====== */
.sec-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px var(--gap-1) 10px;
}

.sec-title {
  font-size: 13px;
  color: #8E8E93;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* ====== Tools Grid ====== */
.tools-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.tool-card {
  background: #fff;
  border: 1px solid rgba(60, 60, 67, 0.08);
  border-radius: 20px;
  padding: var(--gap-4);
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.03);
}

.tool-card:active {
  transform: scale(0.97);
}

.tool-icon {
  width: 40px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.tool-icon--1 {
  background: linear-gradient(135deg, #FF6B6B, #FF3B5C);
}

.tool-icon--2 {
  background: linear-gradient(135deg, #5865F2, #8B5CF6);
}

.tool-icon--3 {
  background: linear-gradient(135deg, #FFB020, #FF8C00);
}

.tool-icon--4 {
  background: linear-gradient(135deg, #34C759, #1FA84A);
}

.tool-emoji {
  font-size: 20px;
  color: #fff;
}

.tool-name {
  font-size: 14px;
  font-weight: 700;
  color: #1C1C1E;
}

.tool-desc {
  font-size: 11px;
  color: #8E8E93;
  margin-top: 3px;
  line-height: 1.3;
}

/* ====== Share Card ====== */
.share-card {
  background: #fff;
  border: 1px solid rgba(60, 60, 67, 0.08);
  border-radius: 20px;
  padding: 14px var(--gap-4);
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.03);
}

.share-icon {
  width: 40px;
  height: 44px;
  border-radius: 10px;
  background: rgba(88, 101, 242, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.share-body {
  flex: 1;
  min-width: 0;
}

.share-title {
  font-size: 14px;
  font-weight: 700;
  color: #1C1C1E;
}

.share-desc {
  font-size: 11px;
  color: #8E8E93;
  margin-top: 2px;
  line-height: 1.4;
}

.share-btn {
  padding: var(--gap-2) var(--gap-4);
  border-radius: var(--rc-chip);
  background: linear-gradient(135deg, #5865F2, #8B5CF6);
  flex-shrink: 0;
}

.share-btn:active {
  opacity: 0.85;
}

.share-btn-text {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
}

/* ====== Timeline ====== */
.timeline {
  background: var(--card);
  border-radius: var(--rc);
  box-shadow: var(--sm);
  padding: var(--gap-5) var(--gap-5) var(--gap-5) 32px;
  position: relative;
}

.timeline-group-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: var(--gap-4)0 12px;
}

.timeline-group-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--b);
}

.timeline-group-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--b) 0%, transparent 100%);
  opacity: 0.2;
}

.timeline-group-count {
  font-size: 11px;
  color: var(--muted);
  background: var(--bg);
  padding: 2px var(--gap-2);
  border-radius: var(--rc-chip);
}

.timeline-group-header:first-child {
  margin-top: 0;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px0;
  position: relative;
}

.timeline-item + .timeline-item {
  border-top: 1px solid rgba(60, 60, 67, 0.04);
}

.timeline-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(88, 101, 242, 0.2);
  margin-top: 6px;
  flex-shrink: 0;
}

.timeline-dot--active {
  background: linear-gradient(135deg, var(--b), var(--b2));
  box-shadow: 0 0 0 3px rgba(88, 101, 242, 0.15);
}

.timeline-content {
  flex: 1;
  min-width: 0;
}

.timeline-time {
  font-size: 11px;
  color: var(--muted);
  display: block;
  margin-bottom: 2px;
}

.timeline-text {
  font-size: 14px;
  color: var(--ink);
  font-weight: 500;
  display: block;
  line-height: 1.4;
}
</style>
