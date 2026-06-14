<template>
  <view class="page">
    <view class="header">
      <view class="header-left">
        <button class="btn-cancel" @click="goBack">Cancel</button>
      </view>
      <text class="title">New Catch</text>
      <view class="header-right">
        <button class="btn-save" @click="handleSave" :disabled="saving">
          {{ saving ? 'Saving...' : 'Save' }}
        </button>
      </view>
    </view>

    <scroll-view scroll-y class="scroll-content">
      <!-- Photo section -->
      <view class="dc-card photo-section" @click="chooseImage">
        <image
          v-if="imagePath"
          :src="imagePath"
          class="photo-preview"
          mode="aspectFill"
        />
        <view v-else class="photo-placeholder">
          <svg class="photo-icon" viewBox="0 0 24 24" fill="none" stroke="#80848E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          <text class="photo-label">Add Photo</text>
        </view>
      </view>

      <!-- AI results -->
      <view class="dc-card identify-section" v-if="identifyResults.length > 0">
        <text class="card-title">AI Identification</text>
        <view class="identify-list">
          <view
            class="identify-item"
            v-for="(item, i) in identifyResults"
            :key="i"
            :class="{ selected: selectedFish === item.name }"
            @click="selectFish(item)"
          >
            <text class="fish-emoji">{{ item.emoji }}</text>
            <view class="fish-info">
              <text class="fish-name">{{ item.name }}</text>
              <view class="confidence-track">
                <view
                  class="confidence-fill"
                  :style="{
                    width: (item.confidence * 100) + '%',
                    background: item.confidence >= 0.7 ? '#23A55A' : '#F0B232'
                  }"
                ></view>
              </view>
              <text class="confidence-text">
                {{ Math.round(item.confidence * 100) }}%{{ item.confidence < 0.7 ? ' · Low confidence' : '' }}
              </text>
            </view>
            <view class="check-mark" v-if="selectedFish === item.name">
              <svg viewBox="0 0 24 24" fill="none" stroke="#5865F2" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </view>
          </view>
        </view>
      </view>

      <!-- Form -->
      <view class="dc-card form-section">
        <view class="form-group">
          <text class="form-label">Species</text>
          <input
            class="form-input"
            v-model="fishName"
            placeholder="Select or type species"
          />
        </view>

        <view class="form-group">
          <text class="form-label">Location</text>
          <input
            class="form-input"
            v-model="location"
            placeholder="Current location"
          />
        </view>

        <view class="form-row">
          <view class="form-group half">
            <text class="form-label">Weather</text>
            <input
              class="form-input"
              v-model="weather"
              placeholder="Auto"
            />
          </view>
          <view class="form-group half">
            <text class="form-label">Temperature</text>
            <input
              class="form-input"
              v-model="temperature"
              placeholder="Auto"
            />
          </view>
        </view>

        <view class="form-toggle">
          <text class="form-label">Private</text>
          <view class="toggle-wrap" @click="isPrivate = !isPrivate">
            <view class="toggle-track" :class="{ active: isPrivate }">
              <view class="toggle-thumb"></view>
            </view>
          </view>
        </view>
      </view>

      <view class="spacer"></view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCatchStore } from '@/stores/catch'
import { useWeatherStore } from '@/stores/weather'
import { identifyFish, type FishIdentifyResult } from '@/api/ai'

const catchStore = useCatchStore()
const weatherStore = useWeatherStore()

const imagePath = ref('')
const fishName = ref('')
const location = ref('')
const weather = ref('')
const temperature = ref('')
const isPrivate = ref(false)
const identifyResults = ref<FishIdentifyResult[]>([])
const selectedFish = ref('')
const saving = ref(false)

async function chooseImage() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['camera', 'album'],
    success: async (res) => {
      imagePath.value = res.tempFilePaths[0]
      uni.showLoading({ title: 'Identifying...' })
      const results = await identifyFish(imagePath.value)
      identifyResults.value = results
      uni.hideLoading()
      if (results.length > 0) {
        const best = results.reduce((a, b) => a.confidence > b.confidence ? a : b)
        selectFish(best)
      }
    }
  })
}

function selectFish(item: FishIdentifyResult) {
  selectedFish.value = item.name
  fishName.value = item.name
}

async function handleSave() {
  saving.value = true
  const data = {
    fishName: fishName.value || 'Unknown',
    fishEmoji: identifyResults.value.find(f => f.name === fishName.value)?.emoji || '🐟',
    imagePath: imagePath.value,
    location: location.value || 'Unknown',
    weather: weather.value || 'Cloudy',
    temperature: temperature.value || '26°',
    isPrivate: isPrivate.value,
    userId: 'current_user'
  }
  const result = await catchStore.addCatch(data)
  saving.value = false
  if (result) {
    uni.showToast({ title: 'Saved', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 1500)
  } else {
    uni.showToast({ title: 'Failed', icon: 'none' })
  }
}

function goBack() {
  uni.navigateBack()
}

onMounted(() => {
  if (weatherStore.weatherNow) {
    weather.value = weatherStore.weatherNow.text
    temperature.value = weatherStore.weatherNow.temp + '°'
  }
  uni.getLocation({
    type: 'wgs84',
    success: (res) => {
      location.value = `${res.latitude.toFixed(4)}, ${res.longitude.toFixed(4)}`
    }
  })
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #F2F3F5;
  display: flex;
  flex-direction: column;
}

/* ===== Header ===== */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 20rpx;
  background: #FFFFFF;
  border-bottom: 2rpx solid rgba(79,84,92,0.12);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
}

.btn-cancel {
  font-size: 28rpx;
  font-weight: 500;
  color: #5C5E66;
  background: transparent;
  border: none;
  padding: 0;
  height: auto;
  line-height: 1;
}
.btn-cancel:active {
  color: #313338;
}

.title {
  font-size: 32rpx;
  font-weight: 700;
  color: #313338;
}

.header-right {
  display: flex;
  align-items: center;
}

.btn-save {
  padding: 8rpx 24rpx;
  border-radius: 20rpx;
  background: #5865F2;
  color: #FFFFFF;
  font-size: 26rpx;
  font-weight: 500;
  border: none;
  height: auto;
  line-height: 1;
  transition: background 0.15s;
}
.btn-save:active:not(:disabled) {
  background: #4752C4;
}
.btn-save:disabled {
  opacity: 0.5;
}

/* ===== Scroll ===== */
.scroll-content {
  flex: 1;
}

/* ===== Discord Card ===== */
.dc-card {
  background: #FFFFFF;
  border-radius: 8rpx;
  margin: 12rpx 20rpx;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
}

/* ===== Photo ===== */
.photo-section {
  height: 360rpx;
  overflow: hidden;
  cursor: pointer;
}

.photo-preview {
  width: 100%;
  height: 100%;
}

.photo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  background: #F2F3F5;
}

.photo-icon {
  width: 56rpx;
  height: 56rpx;
  opacity: 0.6;
}

.photo-label {
  font-size: 26rpx;
  color: #80848E;
  font-weight: 500;
}

/* ===== AI section ===== */
.identify-section {
  padding: 20rpx;
}

.card-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #313338;
  margin-bottom: 16rpx;
  display: block;
}

.identify-list {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.identify-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 14rpx;
  border-radius: 8rpx;
  border: 2rpx solid transparent;
  transition: all 0.15s;
  cursor: pointer;
}
.identify-item:active {
  background: rgba(79,84,92,0.04);
}
.identify-item.selected {
  border-color: #5865F2;
  background: rgba(88,101,242,0.04);
}

.fish-emoji {
  font-size: 36rpx;
}

.fish-info {
  flex: 1;
}

.fish-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #313338;
}

.confidence-track {
  height: 6rpx;
  background: #E3E5E8;
  border-radius: 3rpx;
  margin: 8rpx 0;
  overflow: hidden;
}

.confidence-fill {
  height: 100%;
  border-radius: 3rpx;
  transition: width 0.3s ease;
}

.confidence-text {
  font-size: 20rpx;
  color: #80848E;
}

.check-mark {
  width: 24rpx;
  height: 24rpx;
  flex-shrink: 0;
}
.check-mark svg {
  width: 24rpx;
  height: 24rpx;
}

/* ===== Form ===== */
.form-section {
  padding: 20rpx;
}

.form-group {
  margin-bottom: 20rpx;
}
.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 24rpx;
  font-weight: 500;
  color: #5C5E66;
  margin-bottom: 8rpx;
}

.form-input {
  width: 100%;
  height: 72rpx;
  background: #F2F3F5;
  border: 2rpx solid transparent;
  border-radius: 8rpx;
  padding: 0 16rpx;
  font-size: 28rpx;
  color: #313338;
  transition: border-color 0.15s;
}
.form-input:focus {
  border-color: #5865F2;
}

.form-row {
  display: flex;
  gap: 16rpx;
}

.form-group.half {
  flex: 1;
}

/* Toggle */
.form-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8rpx 0 0;
}
.form-toggle .form-label {
  margin-bottom: 0;
}

.toggle-wrap {
  padding: 4rpx;
}

.toggle-track {
  width: 80rpx;
  height: 44rpx;
  border-radius: 22rpx;
  background: #E3E5E8;
  position: relative;
  transition: background 0.2s;
}
.toggle-track.active {
  background: #5865F2;
}

.toggle-thumb {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  background: #FFFFFF;
  box-shadow: 0 1px 2px rgba(0,0,0,0.15);
  position: absolute;
  top: 4rpx;
  left: 4rpx;
  transition: left 0.2s;
}
.toggle-track.active .toggle-thumb {
  left: 40rpx;
}

.spacer {
  height: 40rpx;
}
</style>
