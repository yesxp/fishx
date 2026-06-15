<template>
  <view class="page-weather">
    <!-- Header -->
    <view class="header">
      <view class="header-top">
        <view class="header-logo">
          <view class="logo-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg></view>
          <view>
            <text class="header-title">天时</text>
            <text class="header-subtitle">天气·潮汐</text>
          </view>
        </view>
        <view class="header-actions">
          <view class="header-btn">
            <text class="icon-text">🔍</text>
          </view>
          <view class="header-btn">
            <text class="icon-text">🔔</text>
          </view>
        </view>
      </view>
    </view>

    <!-- Content -->
    <scroll-view scroll-y class="content" :enhanced="true" :show-scrollbar="false" :style="{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }">
      <!-- Hero -->
      <view class="hero">
        <view class="hero-top">
          <view>
            <text class="hero-city">杭州 · 西湖区</text>
            <view class="hero-score-row">
              <text class="hero-score">82</text>
              <text class="hero-score-unit">分</text>
            </view>
            <text class="hero-label">适宜出钓</text>
          </view>
          <text class="hero-icon">🌤️</text>
        </view>
        <view class="hero-grid">
          <view class="hero-item">
            <text class="hero-item-label">温度</text>
            <text class="hero-item-value">26°</text>
          </view>
          <view class="hero-item">
            <text class="hero-item-label">体感</text>
            <text class="hero-item-value">24°</text>
          </view>
          <view class="hero-item">
            <text class="hero-item-label">气压</text>
            <text class="hero-item-value">1013</text>
          </view>
          <view class="hero-item">
            <text class="hero-item-label">风力</text>
            <text class="hero-item-value">东风3</text>
          </view>
        </view>
      </view>

      <!-- 24h Hourly Forecast -->
      <view class="card">
        <view class="card-title-row">
          <text class="card-title">逐小时预报</text>
          <view class="badge badge--ok"><text class="badge-text">鱼口活跃</text></view>
        </view>
        <view class="hourly-header">
          <text class="hourly-sub">气压变化</text>
          <view class="hourly-header-right">
            <text class="hourly-sun">☀️ 05:41</text>
            <text class="hourly-moon">🌙 19:14</text>
          </view>
        </view>
        <!-- Chart Placeholder (SVG) -->
        <view class="hourly-chart">
          <view class="chart-placeholder">
            <text class="chart-label">📈 24h 温度曲线</text>
          </view>
        </view>
        <!-- Meta rows -->
        <view class="hourly-meta">
          <view class="hourly-meta-row">
            <text class="hourly-meta-label">空气</text>
            <view class="hourly-meta-blocks">
              <view class="hourly-meta-block l1" />
              <view class="hourly-meta-block l2" />
              <view class="hourly-meta-block l3" />
              <view class="hourly-meta-block l2" />
              <view class="hourly-meta-block l1" />
              <view class="hourly-meta-block l1" />
              <view class="hourly-meta-block l2" />
              <view class="hourly-meta-block l1" />
            </view>
            <text class="hourly-meta-val ok">24</text>
          </view>
          <view class="hourly-meta-row">
            <text class="hourly-meta-label">风力</text>
            <view class="hourly-meta-blocks">
              <view class="hourly-meta-block w1" />
              <view class="hourly-meta-block w2" />
              <view class="hourly-meta-block w3" />
              <view class="hourly-meta-block w2" />
              <view class="hourly-meta-block w1" />
              <view class="hourly-meta-block w1" />
              <view class="hourly-meta-block w2" />
              <view class="hourly-meta-block w1" />
            </view>
            <text class="hourly-meta-val brand">1-2级</text>
          </view>
        </view>
        <view class="hourly-time-axis">
          <text>今天</text>
          <text>04:00</text>
          <text>08:00</text>
          <text>12:00</text>
          <text>16:00</text>
          <text>20:00</text>
        </view>
      </view>

      <!-- Pressure -->
      <view class="card">
        <text class="card-title">气压变化</text>
        <view class="pressure-v">
          <view class="pressure-col" v-for="p in pressureData" :key="p.time">
            <text class="pressure-val">{{ p.val }}</text>
            <view class="pressure-bar" :style="{ height: p.height + '%', background: p.color }" />
            <text class="pressure-time">{{ p.time }}</text>
          </view>
        </view>
        <text class="pressure-hint">📈 气压稳定偏高（1013±3），鱼类呼吸代谢活跃</text>
      </view>

      <!-- 15-day -->
      <view class="card">
        <view class="card-title-row">
          <text class="card-title">15天预报</text>
        </view>
        <view class="fifteen-legend">
          <view class="legend-item">
            <view class="legend-dot hot" />
            <text class="legend-text">高温</text>
          </view>
          <view class="legend-item">
            <view class="legend-dot cold" />
            <text class="legend-text">低温</text>
          </view>
          <text class="legend-label">宜钓指数</text>
          <view class="legend-gradient" />
        </view>
        <!-- Chart placeholder -->
        <view class="fifteen-chart">
          <view class="chart-placeholder">
            <text class="chart-label">📈 15天温度趋势</text>
          </view>
        </view>
        <!-- 15 day rows -->
        <view class="fifteen-rows">
          <view
            v-for="day in fifteenDays"
            :key="day.date"
            class="fifteen-row"
            :class="{ 'fifteen-row--past': day.past }"
          >
            <text class="f-row-day">{{ day.label }}</text>
            <text class="f-row-date">{{ day.date }}</text>
            <text class="f-row-weather">{{ day.weather }}</text>
            <text class="f-row-icon">{{ day.icon }}</text>
            <text class="f-row-temp"><text class="f-row-temp-hi">{{ day.high }}°</text> / {{ day.low }}°</text>
            <text class="f-row-wind">{{ day.wind }}</text>
            <view class="f-row-badge" :class="day.badgeClass">
              <text class="f-row-badge-text">{{ day.score }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Tide -->
      <view class="card">
        <view class="card-title-row">
          <text class="card-title">潮汐曲线</text>
          <view class="badge badge--ok"><text class="badge-text">涨潮中</text></view>
        </view>
        <view class="tide-chart">
          <view class="chart-placeholder">
            <text class="chart-label">🌊 潮汐曲线</text>
          </view>
        </view>
        <view class="tide-info">
          <view class="tide-info-item">
            <text class="tide-info-label">🌊 满潮</text>
            <text class="tide-info-time">06:42</text>
            <text class="tide-info-val">+1.8m</text>
          </view>
          <view class="tide-info-item">
            <text class="tide-info-label">🌊 干潮</text>
            <text class="tide-info-time">12:15</text>
            <text class="tide-info-val">+0.3m</text>
          </view>
          <view class="tide-info-item">
            <text class="tide-info-label">🌊 满潮</text>
            <text class="tide-info-time">18:56</text>
            <text class="tide-info-val">+1.6m</text>
          </view>
        </view>
        <view class="tide-phases">
          <view class="tide-phase-tag tide-phase-tag--spring">大潮</view>
          <view class="tide-phase-tag tide-phase-tag--rising">涨潮中</view>
          <view class="tide-phase-tag tide-phase-tag--flood">活讯</view>
          <view class="tide-phase-tag tide-phase-tag--info">潮差 1.5m</view>
        </view>
        <view class="tide-lunar">
          <text class="tide-lunar-icon">🌒</text>
          <view class="tide-lunar-text">
            <text class="tide-lunar-bold">农历五月十九</text>
            <text>新月后第4天，进入大潮期。活讯期间鱼口活跃，建议涨潮至满潮时段作钓。</text>
          </view>
        </view>
      </view>

      <!-- Fish Predictions -->
      <view class="card">
        <text class="card-title">鱼口预测</text>
        <FishBadge
          v-for="fish in fishPredictions"
          :key="fish.name"
          :name="fish.name"
          :variant="fish.variant"
          size="md"
        />
        <view v-for="fish in fishPredictions" :key="fish.name + '_row'" class="fish-row">
          <text class="fish-name">{{ fish.name }}</text>
          <view class="fish-badge" :class="'fish-badge--' + fish.variant">
            <text class="fish-badge-text">{{ fish.status }}</text>
          </view>
          <text class="fish-trend">{{ fish.trend }}</text>
        </view>
      </view>

      <!-- Tips -->
      <view class="card">
        <text class="card-title">钓法建议</text>
        <view class="tip">
          <view class="tip-icon tip-icon--b">🎣</view>
          <text class="tip-text">鲫鱼开口积极，建议活饵（蚯蚓/红虫），小钩细线灵敏度高。</text>
        </view>
        <view class="tip">
          <view class="tip-icon tip-icon--g">🐟</view>
          <text class="tip-text">鲤鱼底层活动频繁，玉米打窝+商品饵挂钩，等口为主。</text>
        </view>
        <view class="tip">
          <view class="tip-icon tip-icon--o">🌊</view>
          <text class="tip-text">当前涨潮中，满潮前后1小时是黄金窗口，近岸作钓效果好。</text>
        </view>
      </view>

      <view style="height: 120rpx;" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import FishBadge from '@/components/FishBadge.vue'

const pressureData = [
  { val: '1010', time: '06', height: 60, color: '#5865F2' },
  { val: '1011', time: '09', height: 68, color: '#5865F2' },
  { val: '1013', time: '12', height: 78, color: '#23A559' },
  { val: '1015', time: '15', height: 85, color: '#23A559' },
  { val: '1014', time: '18', height: 82, color: '#23A559' },
  { val: '1012', time: '21', height: 72, color: '#5865F2' },
]

const fifteenDays = [
  { label: '昨天', date: '6/12', weather: '多云', icon: '⛅', high: 27, low: 20, wind: '西南风2级', score: 72, badgeClass: 'b-mid', past: true },
  { label: '今天', date: '6/13', weather: '晴', icon: '🌤️', high: 27, low: 20, wind: '东风3级', score: 82, badgeClass: 'b-ok', past: false },
  { label: '周六', date: '6/14', weather: '晴', icon: '☀️', high: 29, low: 21, wind: '东南风2级', score: 85, badgeClass: 'b-ok', past: false },
  { label: '周日', date: '6/15', weather: '多云', icon: '⛅', high: 28, low: 22, wind: '南风2级', score: 78, badgeClass: 'b-ok', past: false },
  { label: '周一', date: '6/16', weather: '中雨', icon: '🌧️', high: 24, low: 19, wind: '南风2级', score: 45, badgeClass: 'b-low', past: false },
  { label: '周二', date: '6/17', weather: '小雨', icon: '🌧️', high: 22, low: 18, wind: '东南风2级', score: 38, badgeClass: 'b-low', past: false },
  { label: '周三', date: '6/18', weather: '小雨', icon: '🌧️', high: 25, low: 19, wind: '东南风3级', score: 68, badgeClass: 'b-mid', past: false },
  { label: '周四', date: '6/19', weather: '晴', icon: '🌤️', high: 27, low: 20, wind: '东风3级', score: 80, badgeClass: 'b-ok', past: false },
  { label: '周五', date: '6/20', weather: '晴', icon: '☀️', high: 30, low: 22, wind: '南风2级', score: 83, badgeClass: 'b-ok', past: false },
  { label: '周六', date: '6/21', weather: '晴', icon: '🌤️', high: 31, low: 23, wind: '东南风3级', score: 86, badgeClass: 'b-ok', past: false },
]

const fishPredictions = [
  { name: '鲫鱼', status: '开口积极', variant: 'open' as const, trend: '↑' },
  { name: '鲤鱼', status: '正常', variant: 'normal' as const, trend: '→' },
  { name: '草鱼', status: '鱼口较慢', variant: 'slow' as const, trend: '↓' },
  { name: '鲢鳙', status: '鱼口较慢', variant: 'slow' as const, trend: '↓' },
]
</script>

<style scoped lang="scss">
$bg-page: #F2F3F5;
$bg-card: #FFFFFF;
$brand: #5865F2;
$divider: #E3E5E8;
$text-primary: #060607;
$text-secondary: #4E5058;
$text-muted: #80848E;
$tag-bg: #F2F3F5;
$success: #23A559;
$warning: #F0B232;
$danger: #F23F43;

.page-weather { overflow-x: hidden;
  min-height: 100vh;
  background: $bg-page;
}

/* Header */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: $bg-card;
  border-bottom: 1px solid $divider;
  padding: 12px 16px;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: $brand;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.header-title {
  font-size: 18px;
  font-weight: 700;
  color: $text-primary;
  display: block;
  line-height: 1.2;
}

.header-subtitle {
  font-size: 12px;
  color: $text-muted;
  display: block;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.header-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: $tag-bg;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-text {
  font-size: 16px;
}

/* Content */
.content { overflow-x: hidden;
  padding: 12px;
  height: calc(100vh - 60px);
}

/* Hero */
.hero {
  background: linear-gradient(135deg, #5865F2, #7B68EE);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 12px;
  color: #fff;
}

.hero-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.hero-city {
  font-size: 13px;
  opacity: 0.8;
}

.hero-score-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.hero-score {
  font-size: 56px;
  font-weight: 700;
  line-height: 1;
}

.hero-score-unit {
  font-size: 20px;
  font-weight: 400;
  opacity: 0.7;
}

.hero-label {
  font-size: 14px;
  opacity: 0.9;
  margin-top: 2px;
  display: block;
}

.hero-icon {
  font-size: 44px;
}

.hero-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.hero-item {
  background: rgba(255,255,255,0.15);
  border-radius: 10px;
  padding: 8px;
  text-align: center;
}

.hero-item-label {
  font-size: 10px;
  opacity: 0.7;
  display: block;
}

.hero-item-value {
  font-size: 15px;
  font-weight: 600;
  margin-top: 1px;
  display: block;
}

/* Card */
.card {
  background: $bg-card;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid $divider;
}

.card-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 12px;
}

.card-title-row .card-title {
  margin-bottom: 0;
}

.badge {
  padding: 2px 8px;
  border-radius: 100px;
  font-weight: 500;
}

.badge--ok {
  background: rgba($success, 0.1);
}

.badge-text {
  font-size: 11px;
  color: $success;
}

/* Hourly */
.hourly-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.hourly-sub {
  font-size: 12px;
  color: $text-muted;
}

.hourly-header-right {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: $text-muted;
}

.hourly-sun, .hourly-moon {
  font-size: 12px;
}

.hourly-chart {
  height: 200px;
  background: linear-gradient(180deg, rgba(88,101,242,0.02) 0%, rgba(88,101,242,0.06) 100%);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-label {
  font-size: 14px;
  color: $text-muted;
}

.hourly-meta {
  margin-bottom: 8px;
}

.hourly-meta-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.hourly-meta-label {
  font-size: 11px;
  color: $text-muted;
  width: 28px;
  flex-shrink: 0;
}

.hourly-meta-blocks {
  display: flex;
  gap: 2px;
  flex: 1;
}

.hourly-meta-block {
  flex: 1;
  height: 16px;
  border-radius: 2px;
}

.l1 { background: rgba($success, 0.25); }
.l2 { background: rgba($success, 0.45); }
.l3 { background: rgba($success, 0.7); }
.w1 { background: rgba($brand, 0.2); }
.w2 { background: rgba($brand, 0.4); }
.w3 { background: rgba($brand, 0.6); }

.hourly-meta-val {
  font-size: 10px;
  margin-left: 4px;
  &.ok { color: $success; }
  &.brand { color: $brand; }
}

.hourly-time-axis {
  display: flex;
  justify-content: space-between;
  padding: 0 4px;

  text {
    font-size: 10px;
    color: $text-muted;
  }
}

/* Pressure */
.pressure-v {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 120px;
  padding: 0 4px;
}

.pressure-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.pressure-bar {
  width: 100%;
  border-radius: 4px 4px 0 0;
  min-height: 4px;
}

.pressure-val {
  font-size: 10px;
  font-weight: 600;
  color: $text-secondary;
}

.pressure-time {
  font-size: 10px;
  color: $text-muted;
}

.pressure-hint {
  font-size: 11px;
  color: $text-muted;
  margin-top: 8px;
  text-align: center;
}

/* 15-day */
.fifteen-legend {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 11px;
  color: $text-muted;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legend-dot.hot { background: $danger; }
.legend-dot.cold { background: $brand; }

.legend-text {
  font-size: 11px;
  color: $text-muted;
}

.legend-label {
  font-size: 11px;
  color: $text-muted;
}

.legend-gradient {
  width: 60px;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(90deg, $success, $brand, $warning, $danger);
}

.fifteen-chart {
  height: 220px;
  margin-bottom: 4px;
  background: $bg-page;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fifteen-rows {
  display: flex;
  flex-direction: column;
}

.fifteen-row {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid $divider;
  gap: 6px;

  &:last-child { border-bottom: none; }
}

.fifteen-row--past {
  opacity: 0.5;
}

.f-row-day {
  font-size: 12px;
  font-weight: 500;
  width: 32px;
  flex-shrink: 0;
  color: $text-primary;
}

.f-row-date {
  font-size: 10px;
  color: $text-muted;
  width: 32px;
  flex-shrink: 0;
}

.f-row-weather {
  font-size: 11px;
  color: $text-secondary;
  width: 32px;
  flex-shrink: 0;
}

.f-row-icon {
  font-size: 18px;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}

.f-row-temp {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: $text-secondary;
}

.f-row-temp-hi {
  color: $text-primary;
  font-weight: 600;
}

.f-row-wind {
  font-size: 10px;
  color: $text-muted;
  width: 48px;
  flex-shrink: 0;
  text-align: center;
}

.f-row-badge {
  width: 36px;
  height: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.b-ok { background: $success; }
  &.b-mid { background: $brand; }
  &.b-low { background: $text-muted; }
}

.f-row-badge-text {
  font-size: 10px;
  font-weight: 600;
  color: #fff;
}

/* Tide */
.tide-chart {
  height: 160px;
  margin: 12px 0 8px;
  background: linear-gradient(180deg, rgba(88,101,242,0.03) 0%, rgba(88,101,242,0.08) 100%);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tide-info {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.tide-info-item {
  flex: 1;
  background: $tag-bg;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
}

.tide-info-label {
  font-size: 10px;
  color: $text-muted;
  margin-bottom: 3px;
  display: block;
}

.tide-info-time {
  font-size: 16px;
  font-weight: 700;
  display: block;
}

.tide-info-val {
  font-size: 11px;
  color: $text-muted;
  margin-top: 1px;
  display: block;
}

.tide-phases {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.tide-phase-tag {
  padding: 4px 10px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 500;
}

.tide-phase-tag--spring {
  background: rgba($brand, 0.1);
  color: $brand;
}

.tide-phase-tag--rising {
  background: rgba($success, 0.1);
  color: $success;
}

.tide-phase-tag--flood {
  background: rgba($brand, 0.1);
  color: $brand;
}

.tide-phase-tag--info {
  background: rgba($brand, 0.06);
  color: $brand;
}

.tide-lunar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background: $tag-bg;
  border-radius: 10px;
}

.tide-lunar-icon {
  font-size: 28px;
}

.tide-lunar-text {
  font-size: 12px;
  color: $text-secondary;
  line-height: 1.5;
}

.tide-lunar-bold {
  font-weight: 700;
  color: $text-primary;
}

/* Fish rows */
.fish-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid $divider;

  &:last-child { border-bottom: none; }
}

.fish-name {
  font-size: 14px;
  font-weight: 500;
  width: 48px;
}

.fish-badge {
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 500;

  &--open {
    background: rgba($success, 0.1);
    color: $success;
  }

  &--normal {
    background: rgba($brand, 0.1);
    color: $brand;
  }

  &--slow {
    background: rgba(128, 132, 142, 0.1);
    color: $text-muted;
  }
}

.fish-badge-text {
  font-size: 12px;
  font-weight: 500;
}

.fish-trend {
  margin-left: auto;
  font-size: 16px;
  color: $text-muted;
}

/* Tips */
.tip {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid $divider;

  &:last-child { border-bottom: none; }
}

.tip-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.tip-icon--b { background: rgba($brand, 0.1); }
.tip-icon--g { background: rgba($success, 0.1); }
.tip-icon--o { background: rgba($warning, 0.1); }

.tip-text {
  font-size: 13px;
  color: $text-secondary;
  line-height: 1.5;
}
</style>
