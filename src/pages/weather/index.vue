<template>
  <view class="page">
    <view class="topbar">
      <view class="topbar-inner">
        <text class="brand-name">天时</text>
      </view>
      <text class="topbar-sub">Fishing Forecast · Shanghai</text>
    </view>

    <scroll-view scroll-y class="scroll-content">
      <!-- Hero: big score -->
      <view class="dc-card hero-card">
        <text class="hero-score" :style="{ color: indexResult.levelColor }">{{ indexResult.score }}</text>
        <text class="hero-label">Fishing Index</text>
        <view class="hero-badge" :style="{ background: indexResult.levelColor + '18', color: indexResult.levelColor }">
          {{ indexResult.suggestion }}
        </view>
      </view>

      <!-- Weather data list -->
      <view class="dc-card weather-list">
        <view class="list-row" :class="{'has-divider': true}">
          <view class="list-dot" style="background: #F0B232;"></view>
          <text class="list-label">Temperature</text>
          <text class="list-value">{{ weatherNow?.temp || '--' }}°</text>
        </view>
        <view class="list-row" :class="{'has-divider': true}">
          <view class="list-dot" style="background: #5865F2;"></view>
          <text class="list-label">Humidity</text>
          <text class="list-value">{{ weatherNow?.humidity || '--' }}%</text>
        </view>
        <view class="list-row" :class="{'has-divider': true}">
          <view class="list-dot" style="background: #23A55A;"></view>
          <text class="list-label">Pressure</text>
          <text class="list-value">{{ weatherNow?.pressure || '--' }} hPa</text>
        </view>
        <view class="list-row" :class="{'has-divider': true}">
          <view class="list-dot" style="background: #EB459E;"></view>
          <text class="list-label">Condition</text>
          <text class="list-value">{{ weatherNow?.text || '--' }}</text>
        </view>
        <view class="list-row">
          <view class="list-dot" style="background: #F23F43;"></view>
          <text class="list-label">Wind</text>
          <text class="list-value">{{ weatherNow?.windScale || '--' }}级 {{ weatherNow?.windDir || '' }}</text>
        </view>
      </view>

      <!-- Pressure chart -->
      <view class="dc-card chart-card">
        <text class="card-title">Pressure Trend</text>
        <view class="chart-wrap">
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
            <text class="cl">12h ago</text>
            <text class="cl">Now</text>
            <text class="cl">12h later</text>
          </view>
        </view>
      </view>

      <!-- Best time slots -->
      <view class="dc-card">
        <text class="card-title">Best Times</text>
        <view class="slot-list">
          <view class="slot-row" v-for="item in bestTimes" :key="item.time">
            <view class="slot-dot" :class="item.level"></view>
            <text class="slot-time">{{ item.time }}</text>
            <text class="slot-level">{{ item.level === 'good' ? 'Prime' : item.level === 'ok' ? 'Good' : 'Poor' }}</text>
            <text class="slot-score" :style="{ color: item.score >= 80 ? '#23A55A' : item.score >= 50 ? '#F0B232' : '#F23F43' }">{{ item.score }}</text>
          </view>
        </view>
      </view>

      <!-- Hourly -->
      <view class="dc-card chart-card">
        <text class="card-title">Hourly Bite Forecast</text>
        <view class="hourly-scroll">
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

      <view class="spacer"></view>
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
.page {
  min-height: 100vh;
  background: #F2F3F5;
  display: flex;
  flex-direction: column;
}

/* ===== Top Bar ===== */
.topbar {
  background: #FFFFFF;
  padding: 16rpx 24rpx 16rpx;
  border-bottom: 2rpx solid rgba(79,84,92,0.12);
}

.topbar-inner {
  display: flex;
  align-items: center;
}

.brand-name {
  font-size: 32rpx;
  font-weight: 700;
  color: #313338;
}

.topbar-sub {
  font-size: 22rpx;
  color: #5C5E66;
  margin-top: 4rpx;
  display: block;
}

.scroll-content {
  flex: 1;
  padding: 16rpx 20rpx;
}

/* ===== Discord Card ===== */
.dc-card {
  background: #FFFFFF;
  border-radius: 8rpx;
  margin-bottom: 12rpx;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
}

/* ===== Hero ===== */
.hero-card {
  text-align: center;
  padding: 36rpx 20rpx;
}

.hero-score {
  font-size: 140rpx;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.hero-label {
  font-size: 22rpx;
  color: #80848E;
  margin: 8rpx 0 20rpx;
  display: block;
}

.hero-badge {
  display: inline-block;
  padding: 6rpx 24rpx;
  border-radius: 22rpx;
  font-size: 24rpx;
  font-weight: 600;
}

/* ===== Weather list ===== */
.weather-list {
  padding: 6rpx 0;
}

.list-row {
  display: flex;
  align-items: center;
  padding: 14rpx 20rpx;
}

.list-row.has-divider {
  border-bottom: 1rpx solid rgba(79,84,92,0.08);
}

.list-dot {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.list-label {
  flex: 1;
  font-size: 28rpx;
  color: #313338;
  font-weight: 500;
}

.list-value {
  font-size: 28rpx;
  color: #80848E;
  font-variant-numeric: tabular-nums;
  font-weight: 500;
}

/* ===== Chart ===== */
.card-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #313338;
  margin-bottom: 20rpx;
  display: block;
}

.chart-card {
  padding: 20rpx;
}

.chart-wrap {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.chart {
  display: flex;
  align-items: flex-end;
  gap: 4rpx;
  height: 140rpx;
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

.cl {
  font-size: 20rpx;
  color: #80848E;
}

/* ===== Slot list ===== */
.slot-list {
  padding: 8rpx 20rpx 16rpx;
}

.slot-row {
  display: flex;
  align-items: center;
  padding: 12rpx 0;
  border-bottom: 1rpx solid rgba(79,84,92,0.06);
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

/* ===== Hourly ===== */
.hourly-scroll {
  display: flex;
  gap: 6rpx;
  overflow-x: auto;
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

.spacer {
  height: 40rpx;
}
</style>
