<template>
  <view class="container">
    <view class="header">
      <view class="header-row">
        <text class="header-title">天时</text>
      </view>
      <text class="header-sub">上海 · 钓鱼指数</text>
    </view>

    <scroll-view scroll-y class="content">
      <!-- 大字指数 -->
      <view class="card hero-card">
        <text class="hero-score" :style="{ color: indexResult.levelColor }">{{ indexResult.score }}</text>
        <text class="hero-label">今日钓鱼指数</text>
        <view class="hero-badge" :style="{ background: indexResult.levelColor + '18', color: indexResult.levelColor }">
          {{ indexResult.suggestion }}
        </view>
      </view>

      <!-- 天气数据 -->
      <view class="card data-card">
        <view class="data-row">
          <view class="data-dot" style="background: #F0B232;"></view>
          <text class="data-label">气温</text>
          <text class="data-value">{{ weatherNow?.temp || '--' }}°</text>
        </view>
        <view class="data-sep"></view>
        <view class="data-row">
          <view class="data-dot" style="background: #5865F2;"></view>
          <text class="data-label">湿度</text>
          <text class="data-value">{{ weatherNow?.humidity || '--' }}%</text>
        </view>
        <view class="data-sep"></view>
        <view class="data-row">
          <view class="data-dot" style="background: #23A55A;"></view>
          <text class="data-label">气压</text>
          <text class="data-value">{{ weatherNow?.pressure || '--' }} hPa</text>
        </view>
        <view class="data-sep"></view>
        <view class="data-row">
          <view class="data-dot" style="background: #EB459E;"></view>
          <text class="data-label">天气</text>
          <text class="data-value">{{ weatherNow?.text || '--' }}</text>
        </view>
        <view class="data-sep"></view>
        <view class="data-row">
          <view class="data-dot" style="background: #F23F43;"></view>
          <text class="data-label">风力</text>
          <text class="data-value">{{ weatherNow?.windScale || '--' }}级 {{ weatherNow?.windDir || '' }}</text>
        </view>
      </view>

      <!-- 气压趋势 -->
      <view class="card chart-card">
        <text class="card-title">气压趋势</text>
        <view class="chart">
          <view
            class="bar"
            v-for="(item, i) in pressureData"
            :key="i"
            :style="{
              height: item.percent + '%',
              background: i === 12 ? '#5865F2' : (item.value > 1005 ? '#23A55A' : '#E3E5E8')
            }"
          ></view>
        </view>
        <view class="chart-labels">
          <text class="chart-label">12h前</text>
          <text class="chart-label">现在</text>
          <text class="chart-label">12h后</text>
        </view>
      </view>

      <!-- 最佳出钓时段 -->
      <view class="card">
        <text class="card-title">最佳出钓时段</text>
        <view class="slot-list">
          <view class="slot-row" v-for="item in bestTimes" :key="item.time">
            <view class="slot-dot" :class="item.level"></view>
            <text class="slot-time">{{ item.time }}</text>
            <text class="slot-level">{{ item.level === 'good' ? '黄金时段' : item.level === 'ok' ? '可以出钓' : '不建议' }}</text>
            <text class="slot-score" :style="{ color: item.score >= 80 ? '#23A55A' : item.score >= 50 ? '#F0B232' : '#F23F43' }">{{ item.score }}</text>
          </view>
        </view>
      </view>

      <!-- 逐小时鱼口 -->
      <view class="card chart-card">
        <text class="card-title">逐小时鱼口</text>
        <view class="hourly-chart">
          <view
            class="hourly-item"
            v-for="(item, i) in hourly"
            :key="i"
            v-if="i < 12"
          >
            <text class="hourly-temp">{{ item.temp }}°</text>
            <view class="hourly-bar-wrap">
              <view
                class="hourly-bar"
                :style="{
                  height: (Number(item.pressure) - 980) / 50 * 100 + '%',
                  background: Number(item.pressure) > 1005 ? '#23A55A' : '#F0B232'
                }"
              ></view>
            </view>
            <text class="hourly-time">{{ getHour(item.fxTime) }}</text>
          </view>
        </view>
      </view>

      <view style="height: 40rpx;"></view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useWeatherStore } from '@/stores/weather'

const weatherStore = useWeatherStore()
const { weatherNow, indexResult, hourly, bestTimes } = storeToRefs(weatherStore)

const pressureData = computed(() => {
  const data = []
  const base = Number(weatherNow?.pressure || 1009)
  for (let i = 0; i < 24; i++) {
    const value = base + Math.round((Math.random() - 0.5) * 20)
    data.push({
      value,
      percent: Math.min(100, Math.max(20, (value - 980) / 50 * 100))
    })
  }
  return data
})

function getHour(time: string) {
  const h = new Date(time).getHours()
  return h + ':00'
}

onMounted(() => {
  weatherStore.loadWeather()
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #F2F3F5;
}

.header {
  background: #FFFFFF;
  padding: 20rpx 24rpx 16rpx;
  border-bottom: 1px solid rgba(79,84,92,0.12);
}

.header-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #313338;
}

.header-sub {
  font-size: 24rpx;
  color: #5C5E66;
  margin-top: 4rpx;
}

.content {
  flex: 1;
  padding: 16rpx 20rpx;
}

/* === 卡片 === */
.card {
  background: #FFFFFF;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 12rpx;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
}

/* === 指数 === */
.hero-card {
  text-align: center;
  padding: 32rpx 20rpx;
}

.hero-score {
  font-size: 140rpx;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.hero-label {
  font-size: 24rpx;
  color: #80848E;
  margin: 8rpx 0 16rpx;
  display: block;
}

.hero-badge {
  display: inline-block;
  padding: 8rpx 24rpx;
  border-radius: 100px;
  font-size: 26rpx;
  font-weight: 600;
}

/* === 数据列表 === */
.data-card {
  padding: 8rpx 20rpx;
}

.data-row {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
}

.data-dot {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.data-label {
  flex: 1;
  font-size: 28rpx;
  color: #313338;
  font-weight: 500;
}

.data-value {
  font-size: 28rpx;
  color: #80848E;
  font-variant-numeric: tabular-nums;
}

.data-sep {
  height: 1px;
  background: rgba(79,84,92,0.08);
}

/* === 图表 === */
.card-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #313338;
  margin-bottom: 16rpx;
}

.chart {
  display: flex;
  align-items: flex-end;
  gap: 4rpx;
  height: 140rpx;
  margin-bottom: 8rpx;
}

.bar {
  flex: 1;
  border-radius: 3rpx 3rpx 0 0;
  transition: height 0.5s ease;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
}

.chart-label {
  font-size: 20rpx;
  color: #80848E;
}

/* === 时间段 === */
.slot-list {
  margin-top: 8rpx;
}

.slot-row {
  display: flex;
  align-items: center;
  padding: 14rpx 0;
  border-bottom: 1px solid rgba(79,84,92,0.06);
}
.slot-row:last-child {
  border-bottom: none;
}

.slot-dot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
  margin-right: 16rpx;
  flex-shrink: 0;
}
.slot-dot.good { background: #23A55A; }
.slot-dot.ok { background: #F0B232; }
.slot-dot.bad { background: #F23F43; }

.slot-time {
  font-size: 28rpx;
  font-weight: 500;
  color: #313338;
  margin-right: 16rpx;
}

.slot-level {
  flex: 1;
  font-size: 24rpx;
  color: #80848E;
}

.slot-score {
  font-size: 28rpx;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

/* === 逐小时 === */
.hourly-chart {
  display: flex;
  gap: 6rpx;
  overflow-x: auto;
  padding-bottom: 4rpx;
}

.hourly-item {
  flex-shrink: 0;
  width: 56rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;
}

.hourly-temp {
  font-size: 20rpx;
  color: #313338;
  font-weight: 500;
}

.hourly-bar-wrap {
  width: 20rpx;
  height: 100rpx;
  background: #F2F3F5;
  border-radius: 3rpx;
  display: flex;
  align-items: flex-end;
}

.hourly-bar {
  width: 100%;
  border-radius: 3rpx 3rpx 0 0;
  transition: height 0.5s ease;
}

.hourly-time {
  font-size: 18rpx;
  color: #80848E;
}
</style>
