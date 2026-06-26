<template>
  <view class="page">
    <!-- 顶栏 -->
    <view class="topbar">
      <view class="topbar-left" @tap="goBack">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4">
          <path d="M15 6l-6 6 6 6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </view>
      <text class="topbar-title">我的鱼获</text>
      <view class="topbar-right">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3-3" stroke-linecap="round" />
        </svg>
      </view>
    </view>

    <!-- 可滚动内容 -->
    <scroll-view scroll-y class="scroll-content" :enhanced="true" :show-scrollbar="false">
      <!-- 筛选器 -->
      <scroll-view scroll-x class="filter-row" :enhanced="true" :show-scrollbar="false">
        <view
          v-for="(f, i) in filters"
          :key="i"
          class="filter-pill"
          :class="{ 'filter-pill--active': activeFilter === i }"
          @tap="activeFilter = i"
        >
          <text>{{ f.label }}</text>
        </view>
      </scroll-view>

      <!-- 按月分组列表 -->
      <view v-for="(group, gi) in groupedCatches" :key="gi">
        <!-- 月份标题 -->
        <view class="month-h">
          <text class="month-h-m">{{ group.month }}</text>
          <text class="month-h-s">{{ group.summary }}</text>
        </view>

        <!-- 鱼获卡片 -->
        <view
          v-for="(item, ci) in group.items"
          :key="ci"
          class="catch-row"
          @tap="goDetail(item.id)"
        >
          <view class="catch-thumb" :class="'catch-thumb--' + item.thumbClass">
            <text class="catch-thumb-emoji">{{ item.emoji }}</text>
          </view>
          <view class="catch-body">
            <view class="catch-name">
              <text>{{ item.species }}</text>
              <view class="badge" :class="'badge--' + item.badgeType">
                <text>{{ item.badge }}</text>
              </view>
            </view>
            <view class="catch-meta">
              <text>{{ item.time }}</text>
              <text class="meta-sep">·</text>
              <text>{{ item.spot }}</text>
              <template v-if="item.layer">
                <text class="meta-sep">·</text>
                <view class="meta-tag">
                  <text>{{ item.layer }}</text>
                </view>
              </template>
            </view>
          </view>
          <view class="catch-weight">
            <text class="catch-weight-num">{{ item.weightNum }}</text>
            <text class="catch-weight-unit">{{ item.weightUnit }}</text>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="filteredCatches.length === 0" class="empty">
        <text class="empty-emoji">🐟</text>
        <text class="empty-title">还没有钓获</text>
        <text class="empty-sub">去记录你的第一条鱼获吧～</text>
      </view>

      <!-- 底部安全区 -->
      <view style="height: 120px" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// ---- 类型 ----
interface CatchItem {
  id: string
  species: string
  emoji: string
  weightNum: string
  weightUnit: string
  spot: string
  method: string
  time: string
  month: string
  thumbClass: string
  badge: string
  badgeType: string
  layer?: string
}

interface MonthGroup {
  month: string
  summary: string
  items: CatchItem[]
}

interface Filter {
  label: string
  species?: string
}

// ---- 筛选器 ----
const activeFilter = ref(0)

const filters: Filter[] = [
  { label: '全部 14' },
  { label: '🐟 鲫鱼 6', species: '鲫鱼' },
  { label: '🐠 鲤鱼 3', species: '鲤鱼' },
  { label: '🎏 翘嘴 2', species: '翘嘴' },
  { label: '🐟 鲶鱼 1', species: '鲶鱼' },
  { label: '🌾 路亚 4', species: '路亚' },
  { label: '🎣 台钓 10', species: '台钓' },
]

// ---- Mock 数据 ----
const mockCatches: CatchItem[] = [
  { id: '1', species: '鲫鱼', emoji: '🐟', weightNum: '320', weightUnit: 'g', spot: '老王钓位', method: '台钓', time: '今天 14:30', month: '2026 年 6 月', thumbClass: 'default', badge: '台钓', badgeType: 'good', layer: '底层' },
  { id: '2', species: '鲤鱼', emoji: '🐠', weightNum: '1.2', weightUnit: 'kg', spot: '老王钓位', method: '台钓', time: '今天 11:20', month: '2026 年 6 月', thumbClass: 'a1', badge: '台钓', badgeType: 'good', layer: '底层' },
  { id: '3', species: '翘嘴', emoji: '🎏', weightNum: '680', weightUnit: 'g', spot: '千岛湖', method: '路亚', time: '昨天 16:40', month: '2026 年 6 月', thumbClass: 'a2', badge: '路亚', badgeType: 'orange', layer: '中上层' },
  { id: '4', species: '草鱼', emoji: '🐡', weightNum: '2.4', weightUnit: 'kg', spot: '富春江', method: '台钓', time: '6/21 06:15', month: '2026 年 6 月', thumbClass: 'a3', badge: '台钓', badgeType: 'good', layer: '中下层' },
  { id: '5', species: '鲶鱼', emoji: '🐟', weightNum: '1.8', weightUnit: 'kg', spot: '湘江', method: '夜钓', time: '6/19 22:30', month: '2026 年 6 月', thumbClass: 'a4', badge: '夜钓', badgeType: 'good', layer: '底层' },
  { id: '6', species: '鲫鱼', emoji: '🐟', weightNum: '250', weightUnit: 'g', spot: '千岛湖', method: '台钓', time: '6/15 15:30', month: '2026 年 6 月', thumbClass: 'default', badge: '台钓', badgeType: 'good', layer: '底层' },
  { id: '7', species: '翘嘴', emoji: '🎏', weightNum: '520', weightUnit: 'g', spot: '富春江', method: '路亚', time: '6/10 17:00', month: '2026 年 6 月', thumbClass: 'a2', badge: '路亚', badgeType: 'orange', layer: '中上层' },
  { id: '8', species: '鲤鱼', emoji: '🐠', weightNum: '0.9', weightUnit: 'kg', spot: '西湖支流', method: '台钓', time: '6/08 14:00', month: '2026 年 6 月', thumbClass: 'a1', badge: '台钓', badgeType: 'good' },
  { id: '9', species: '鲫鱼', emoji: '🐟', weightNum: '280', weightUnit: 'g', spot: '西湖支流', method: '台钓', time: '5/28 14:00', month: '2026 年 5 月', thumbClass: 'default', badge: '台钓', badgeType: 'good' },
  { id: '10', species: '鲤鱼', emoji: '🐠', weightNum: '0.8', weightUnit: 'kg', spot: '老王钓位', method: '台钓', time: '5/22 16:20', month: '2026 年 5 月', thumbClass: 'a1', badge: '台钓', badgeType: 'good' },
  { id: '11', species: '翘嘴', emoji: '🎏', weightNum: '520', weightUnit: 'g', spot: '千岛湖', method: '路亚', time: '5/15 17:30', month: '2026 年 5 月', thumbClass: 'a2', badge: '路亚', badgeType: 'orange' },
  { id: '12', species: '鲫鱼', emoji: '🐟', weightNum: '310', weightUnit: 'g', spot: '湘江', method: '台钓', time: '4/30 10:00', month: '2026 年 4 月', thumbClass: 'default', badge: '台钓', badgeType: 'good' },
]

// ---- 筛选逻辑 ----
const filteredCatches = computed(() => {
  const f = filters[activeFilter.value]
  if (!f.species) return mockCatches
  // "路亚" and "台钓" filter by method; others by species
  if (f.species === '路亚') return mockCatches.filter((c) => c.method === '路亚')
  if (f.species === '台钓') return mockCatches.filter((c) => c.method === '台钓')
  return mockCatches.filter((c) => c.species === f.species)
})

// ---- 按月分组 ----
const groupedCatches = computed<MonthGroup[]>(() => {
  const map = new Map<string, CatchItem[]>()
  for (const item of filteredCatches.value) {
    const arr = map.get(item.month) || []
    arr.push(item)
    map.set(item.month, arr)
  }
  const result: MonthGroup[] = []
  for (const [month, items] of map) {
    result.push({
      month,
      summary: `本月 ${items.length} 条记录`,
      items,
    })
  }
  return result
})

// ---- 跳转 ----
function goBack() {
  uni.navigateBack()
}

function goDetail(id: string) {
  uni.navigateTo({ url: `/pages/catch/detail?id=${id}` })
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
  --warn: #FF9500;
  --ws: rgba(255, 149, 0, 0.12);
  --border: rgba(60, 60, 67, 0.08);
  --glass: rgba(255, 255, 255, 0.72);
  --rb: 14px;
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

/* ====== Top Bar ====== */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 54px var(--gap-5) var(--gap-3);
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(60, 60, 67, 0.06);
}

.topbar-left {
  width: 36px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1C1C1E;
}

.topbar-title {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
  flex: 1;
}

.topbar-right {
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

/* ====== Scroll ====== */
.scroll-content {
  height: calc(100vh - 96px);
  padding: 0 16px;
}

/* ====== Filter ====== */
.filter-row {
  white-space: nowrap;
  padding: 10px var(--gap-1) var(--gap-1);
}

.filter-pill {
  display: inline-flex;
  padding: 7px 14px;
  border-radius: var(--rc-chip);
  font-size: 12px;
  font-weight: 600;
  background: rgba(60, 60, 67, 0.06);
  color: #3C3C43;
  margin-right: var(--gap-2);
  flex-shrink: 0;
}

.filter-pill--active {
  background: linear-gradient(135deg, #5865F2, #8B5CF6);
  color: #fff;
  box-shadow: 0 2px 8px rgba(88, 101, 242, 0.25);
}

/* ====== Month Header ====== */
.month-h {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px var(--gap-1) 10px;
}

.month-h-m {
  font-size: 13px;
  font-weight: 700;
  color: #3C3C43;
  letter-spacing: -0.01em;
}

.month-h-s {
  font-size: 11px;
  color: #8E8E93;
  font-weight: 500;
}

/* ====== Catch Card ====== */
.catch-row {
  background: #fff;
  border: 1px solid rgba(60, 60, 67, 0.08);
  border-radius: var(--rc-md);
  padding: var(--gap-3);
  display: flex;
  gap: 12px;
  align-items: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.03);
  margin-bottom: var(--gap-2);
}

.catch-thumb {
  width: 54px;
  height: 54px;
  border-radius: var(--rb);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(88, 101, 242, 0.2);
}

.catch-thumb--default {
  background: linear-gradient(135deg, #A8C0E0, #5865F2);
}

.catch-thumb--a1 {
  background: linear-gradient(135deg, #FFE082, #FFB020);
}

.catch-thumb--a2 {
  background: linear-gradient(135deg, #A5D6A7, #34C759);
}

.catch-thumb--a3 {
  background: linear-gradient(135deg, #FFB6C1, #FF6B6B);
}

.catch-thumb--a4 {
  background: linear-gradient(135deg, #B19CD9, #8B5CF6);
}

.catch-thumb-emoji {
  font-size: 24px;
  color: #fff;
}

.catch-body {
  flex: 1;
  min-width: 0;
}

.catch-name {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 700;
}

.badge {
  font-size: 9px;
  padding: 2px 6px;
  border-radius: 5px;
  font-weight: 700;
}

.badge--good {
  background: rgba(52, 199, 89, 0.12);
  color: #1B7F3A;
}

.badge--orange {
  background: rgba(255, 149, 0, 0.12);
  color: #9A5500;
}

.catch-meta {
  display: flex;
  gap: 5px;
  align-items: center;
  flex-wrap: wrap;
  font-size: 11px;
  color: #8E8E93;
  margin-top: 3px;
}

.meta-sep {
  color: #C7C7CC;
}

.meta-tag {
  background: rgba(88, 101, 242, 0.08);
  padding: 1px 6px;
  border-radius: 5px;
  color: #5865F2;
  font-weight: 600;
}

.catch-weight {
  flex-shrink: 0;
  text-align: right;
}

.catch-weight-num {
  font-size: 14px;
  font-weight: 800;
  color: #5865F2;
  letter-spacing: -0.01em;
}

.catch-weight-unit {
  font-size: 10px;
  color: #8E8E93;
  font-weight: 500;
  margin-left: 1px;
}

/* ====== Empty ====== */
.empty {
  text-align: center;
  padding: 60px var(--gap-5);
  color: #8E8E93;
}

.empty-emoji {
  font-size: 48px;
  opacity: 0.5;
  display: block;
  margin-bottom: var(--gap-3);
}

.empty-title {
  font-size: 15px;
  font-weight: 700;
  color: #3C3C43;
  display: block;
  margin-bottom: var(--gap-1);
}

.empty-sub {
  font-size: 12px;
  line-height: 1.5;
  display: block;
}
</style>
