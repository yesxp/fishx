<template>
  <view class="page">
    <!-- 沉浸式头图 -->
    <view class="hero">
      <view class="statusbar">
        <text class="sb-time">9:41</text>
        <view class="sb-right">
          <text class="sb-icon">📶</text>
          <text class="sb-icon">🔋</text>
        </view>
      </view>
      <view class="topbar-hero">
        <view class="topbar-circle" @tap="goBack">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" stroke-width="2.4">
            <path d="M15 6l-6 6 6 6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </view>
        <view class="topbar-actions">
          <view class="topbar-circle">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" stroke-width="2">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#fff" stroke="none" />
            </svg>
          </view>
          <view class="topbar-circle">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" stroke-width="2">
              <circle cx="12" cy="5" r="1.5" fill="#fff" stroke="none" />
              <circle cx="19" cy="5" r="1.5" fill="#fff" stroke="none" />
              <circle cx="5" cy="5" r="1.5" fill="#fff" stroke="none" />
            </svg>
          </view>
        </view>
      </view>
      <view class="hero-body">
        <view class="unlock-badge">
          <text class="unlock-icon">✅</text>
          <text class="unlock-text">已解锁</text>
        </view>
        <text class="hero-emoji">{{ species.emoji }}</text>
      </view>
    </view>

    <!-- 可滚动内容 -->
    <scroll-view scroll-y class="scroll-content" :enhanced="true" :show-scrollbar="false">
      <view class="body">
        <!-- 鱼种名 + 标签 -->
        <view class="season-row">
          <text class="season-emoji">{{ species.emoji }}</text>
          <text class="season-text">{{ species.season.join('·') }} · 旺季</text>
        </view>
        <text class="species-name">{{ species.zh_name }}</text>
        <text class="species-sub">{{ species.subtitle }}</text>
        <view class="meta-chips">
          <view class="m-chip m-chip--easy">
            <text>{{ species.difficulty }}</text>
          </view>
          <view class="m-chip m-chip--blue">
            <text>{{ species.water_layer }}</text>
          </view>
          <view class="m-chip m-chip--orange">
            <text>{{ species.feeding }}</text>
          </view>
          <view class="m-chip m-chip--neutral">
            <text>{{ species.weight_range }}</text>
          </view>
          <view class="m-chip m-chip--neutral">
            <text>{{ species.season.join('') }}</text>
          </view>
        </view>

        <!-- 简介 -->
        <view class="sec">
          <view class="sec-header">
            <text class="sec-emoji">🐟</text>
            <text class="sec-title">鱼种简介</text>
          </view>
          <text class="sec-body">{{ species.description }}</text>
        </view>

        <!-- 一鱼一名 -->
        <view class="sec">
          <view class="sec-header">
            <text class="sec-emoji">💬</text>
            <text class="sec-title">一鱼一名</text>
          </view>
          <text class="sec-body">{{ species.one_fish_one_name }}</text>
        </view>

        <!-- 趣闻 -->
        <view class="sec">
          <view class="sec-header">
            <text class="sec-emoji">💡</text>
            <text class="sec-title">钓鱼趣闻</text>
          </view>
          <view class="fun-fact">
            <text class="fun-fact-text">{{ species.fun_facts }}</text>
          </view>
        </view>

        <!-- 钓法 -->
        <view class="sec">
          <view class="sec-header">
            <text class="sec-emoji">🎣</text>
            <text class="sec-title">钓法技巧</text>
          </view>
          <view class="tactics-grid">
            <view class="tactic-card">
              <text class="tactic-label">饵料</text>
              <text class="tactic-value">商品饵+蚯蚓</text>
            </view>
            <view class="tactic-card">
              <text class="tactic-label">钓法</text>
              <text class="tactic-value">台钓万能</text>
            </view>
            <view class="tactic-card">
              <text class="tactic-label">时间</text>
              <text class="tactic-value">夏秋早晚</text>
            </view>
            <view class="tactic-card">
              <text class="tactic-label">冬钓</text>
              <text class="tactic-value">红虫深水</text>
            </view>
          </view>
        </view>

        <!-- 食用价值 -->
        <view class="sec">
          <view class="sec-header">
            <text class="sec-emoji">🍲</text>
            <text class="sec-title">食用价值</text>
          </view>
          <text class="sec-body">{{ species.taste }}</text>
        </view>

        <!-- 小百科 -->
        <view class="sec">
          <view class="sec-header">
            <text class="sec-emoji">📖</text>
            <text class="sec-title">鱼种小百科</text>
          </view>
          <view class="encyclopedia-card">
            <view class="ency-row">
              <text class="ency-label">学名</text>
              <text class="ency-value">{{ species.scientific_name }}</text>
            </view>
            <view class="ency-divider" />
            <view class="ency-row">
              <text class="ency-label">科属</text>
              <text class="ency-value">{{ species.family }}</text>
            </view>
            <view class="ency-divider" />
            <view class="ency-row">
              <text class="ency-label">分布</text>
              <text class="ency-value">{{ species.distribution }}</text>
            </view>
            <view class="ency-divider" />
            <view class="ency-row">
              <text class="ency-label">季节</text>
              <text class="ency-value">{{ species.season.join('、') }}</text>
            </view>
            <view class="ency-divider" />
            <view class="ency-row">
              <text class="ency-label">水层</text>
              <text class="ency-value">{{ species.water_layer }}</text>
            </view>
          </view>
        </view>

        <!-- 同科鱼推荐 -->
        <view class="sec">
          <view class="sec-header">
            <text class="sec-emoji">🐠</text>
            <text class="sec-title">同科鱼推荐</text>
          </view>
          <scroll-view scroll-x class="related-scroll" :show-scrollbar="false">
            <view class="related-row">
              <view
                v-for="(fish, idx) in relatedFish"
                :key="idx"
                class="related-card"
              >
                <text class="related-emoji">{{ fish.emoji }}</text>
                <text class="related-name">{{ fish.name }}</text>
                <text class="related-meta">{{ fish.family }}</text>
              </view>
            </view>
          </scroll-view>
        </view>

        <!-- 底部安全区 -->
        <view class="safe-bottom" />
      </view>
    </scroll-view>

    <!-- 底部 CTA 固定栏 -->
    <view class="cta-bar">
      <view class="cta-btn cta-btn--secondary" @tap="onMyRecord">
        <text class="cta-btn-text">📋 我的战绩</text>
      </view>
      <view class="cta-btn cta-btn--primary" @tap="onGenerate">
        <text class="cta-btn-text cta-btn-text--white">✨ 用此鱼种生成文案</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// ---- 类型 ----
interface SpeciesData {
  id: string
  zh_name: string
  emoji: string
  scientific_name: string
  family: string
  difficulty: string
  water_layer: string
  feeding: string
  season: string[]
  weight_range: string
  distribution: string
  subtitle: string
  description: string
  one_fish_one_name: string
  fun_facts: string
  taste: string
  tactics: string
  related_species: string[]
}

interface RelatedFish {
  name: string
  emoji: string
  family: string
}

// ---- Mock 数据 ----
const species = ref<SpeciesData>({
  id: 'sp-001',
  zh_name: '鲫鱼',
  emoji: '🐟',
  scientific_name: 'Carassius auratus',
  family: '鲤科 Cyprinidae · 鲫属 Carassius',
  difficulty: '易',
  water_layer: '底层',
  feeding: '杂食',
  season: ['春', '夏', '秋', '冬'],
  weight_range: '0.2-1.0kg',
  distribution: '全国淡水水域',
  subtitle: '为什么北方钓友管它叫"鲫瓜子"？',
  description: '我国最常见、分布最广的淡水鱼之一。适应力极强，号称"淡水小强"。群居、杂食偏植物，从南到北四季可钓。',
  one_fish_one_name: '因体侧扁、背隆起、形似瓜子而得名"鲫瓜子"。古书写作"鲒鱼"（鳞大而少）。南方俗称"河鲫"、"月鲫"。',
  fun_facts: '🌿 耐低氧极强，新手第一条鱼多是它\n🍃 冬季其他鱼不咬钩时它仍咬\n🎣 "鲫鱼"是钓鱼的入门老师',
  taste: '"春吃鲫夏吃鲤"。春季最肥美，炖汤奶白鲜甜，传统食疗圣品。刺多但肉嫩。',
  tactics: '台钓万能组合：商品饵+蚯蚓双钩，一荤一素。夏秋早晚最佳；冬季红虫/蚯蚓深水钓底。',
  related_species: ['sp-002', 'sp-003', 'sp-008'],
})

// ---- 同科鱼 mock ----
const relatedFish = ref<RelatedFish[]>([
  { name: '鲤鱼', emoji: '🐠', family: '鲤科' },
  { name: '草鱼', emoji: '🐡', family: '鲤科' },
  { name: '鳊鱼', emoji: '🐟', family: '鲤科' },
  { name: '翘嘴', emoji: '🎏', family: '鲤科' },
])

// ---- 操作 ----
function goBack() {
  uni.navigateBack()
}

function onMyRecord() {
  uni.showToast({ title: '战绩功能开发中', icon: 'none' })
}

function onGenerate() {
  uni.showToast({ title: 'AI 文案生成中...', icon: 'none', duration: 2000 })
}
</script>

<style scoped lang="scss">
/* ====== Design Tokens ====== */
$blue: #5865F2;
$purple: #8B5CF6;
$ink: #1C1C1E;
$ink2: #3C3C43;
$muted: #8E8E93;
$good: #34C759;
$gs: rgba(52, 199, 89, 0.12);
$warn: #FF9500;
$ws: rgba(255, 149, 0, 0.12);
$border: rgba(60, 60, 67, 0.08);
$divider: rgba(60, 60, 67, 0.06);
$rb: 14px;
$sm: 0 2px 6px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.06);

/* ====== Page ====== */
.page {
  height: 100vh;
  background: #F2F3F7;
  font-family: -apple-system, 'PingFang SC', sans-serif;
  color: $ink;
  position: relative;
  overflow: hidden;
  letter-spacing: -0.01em;
}

/* ====== Hero ====== */
.hero {
  width: 100%;
  height: 380px;
  background: linear-gradient(140deg, #3a5a8c 0%, #1e3a5f 100%);
  position: relative;
  display: flex;
  flex-direction: column;
}

.statusbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 28px 0;
}

.sb-time {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
}

.sb-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.sb-icon {
  font-size: 12px;
  color: #fff;
}

.topbar-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 20px 14px;
}

.topbar-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.topbar-actions {
  display: flex;
  gap: 8px;
}

.hero-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.hero-emoji {
  font-size: 160px;
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.3));
}

.unlock-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(52, 199, 89, 0.95);
  color: #fff;
  padding: 5px 12px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 5px;
  backdrop-filter: blur(20px);
}

.unlock-icon {
  font-size: 11px;
}

.unlock-text {
  font-size: 11px;
  font-weight: 700;
  color: #fff;
}

/* ====== Scroll ====== */
.scroll-content {
  height: calc(100vh - 380px - 72px);
}

.body {
  padding: 18px 18px 0;
}

/* ====== Season Row ====== */
.season-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: $muted;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.season-emoji {
  font-size: 14px;
}

.season-text {
  font-size: 11px;
  color: $muted;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* ====== Species Name ====== */
.species-name {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-top: 6px;
  display: block;
}

.species-sub {
  font-size: 14px;
  color: $blue;
  font-weight: 600;
  margin-top: 4px;
  line-height: 1.4;
  display: block;
}

/* ====== Meta Chips ====== */
.meta-chips {
  display: flex;
  gap: 6px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.m-chip {
  padding: 6px 12px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
}

.m-chip--easy {
  background: $gs;
  color: #1B7F3A;
}

.m-chip--blue {
  background: rgba(88, 101, 242, 0.1);
  color: $blue;
}

.m-chip--orange {
  background: $ws;
  color: #9A5500;
}

.m-chip--neutral {
  background: rgba(60, 60, 67, 0.06);
  color: $ink2;
}

/* ====== Section ====== */
.sec {
  margin-top: 24px;
}

.sec-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.sec-emoji {
  font-size: 18px;
}

.sec-title {
  font-size: 14px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: $ink;
}

.sec-body {
  font-size: 13.5px;
  line-height: 1.7;
  color: $ink2;
}

/* ====== Fun Fact ====== */
.fun-fact {
  background: linear-gradient(135deg, rgba(255, 149, 0, 0.06) 0%, rgba(255, 107, 107, 0.04) 100%);
  border-left: 3px solid $warn;
  padding: 12px 14px;
  border-radius: 0 12px 12px 0;
  margin-top: 6px;
}

.fun-fact-text {
  font-size: 13px;
  line-height: 1.6;
  color: $ink2;
  white-space: pre-wrap;
}

/* ====== Tactics Grid ====== */
.tactics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 10px;
}

.tactic-card {
  background: #fff;
  border: 1px solid $border;
  border-radius: 14px;
  padding: 12px;
}

.tactic-label {
  font-size: 10px;
  color: $muted;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 4px;
  display: block;
}

.tactic-value {
  font-size: 13px;
  font-weight: 700;
  color: $ink;
  display: block;
}

/* ====== Encyclopedia ====== */
.encyclopedia-card {
  background: #fff;
  border: 1px solid $border;
  border-radius: 14px;
  padding: 14px 16px;
}

.ency-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
}

.ency-label {
  font-size: 12px;
  color: $muted;
  font-weight: 500;
  width: 50px;
  flex-shrink: 0;
}

.ency-value {
  font-size: 13px;
  color: $ink;
  font-weight: 500;
  flex: 1;
  text-align: right;
  font-style: italic;
}

.ency-divider {
  height: 1px;
  background: $divider;
}

/* ====== Related Fish ====== */
.related-scroll {
  white-space: nowrap;
  margin: 0 -18px;
  padding: 0 18px;
}

.related-row {
  display: flex;
  gap: 8px;
}

.related-card {
  flex: 0 0 130px;
  background: #fff;
  border: 1px solid $border;
  border-radius: 14px;
  padding: 10px;
  text-align: center;
}

.related-emoji {
  font-size: 32px;
  margin-bottom: 6px;
  display: block;
}

.related-name {
  font-size: 13px;
  font-weight: 700;
  display: block;
}

.related-meta {
  font-size: 10px;
  color: $muted;
  margin-top: 2px;
  display: block;
}

/* ====== Safe Bottom ====== */
.safe-bottom {
  height: 120px;
}

/* ====== CTA Bar ====== */
.cta-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px 28px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid $border;
  display: flex;
  gap: 8px;
}

.cta-btn {
  flex: 1;
  padding: 13px 16px;
  border-radius: $rb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cta-btn--secondary {
  background: rgba(60, 60, 67, 0.06);
}

.cta-btn--primary {
  background: linear-gradient(135deg, $blue, $purple);
  box-shadow: 0 4px 14px rgba(88, 101, 242, 0.3);
}

.cta-btn-text {
  font-size: 14px;
  font-weight: 600;
  color: $ink2;
}

.cta-btn-text--white {
  color: #fff;
}
</style>
