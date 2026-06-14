<template>
  <view class="container">
    <view class="header">
      <view class="header-left">
        <button class="btn-back" @click="goBack">←</button>
        <text class="title">记录渔获</text>
      </view>
      <view class="header-right">
        <button class="btn-save" @click="handleSave" :disabled="saving">
          {{ saving ? '保存中...' : '保存' }}
        </button>
      </view>
    </view>
    
    <scroll-view scroll-y class="content">
      <!-- 图片区域 -->
      <view class="photo-section" @click="chooseImage">
        <image 
          v-if="imagePath" 
          :src="imagePath" 
          class="photo-preview"
          mode="aspectFill"
        />
        <view v-else class="photo-placeholder">
          <text class="photo-icon">📷</text>
          <text class="photo-text">拍照或选择图片</text>
        </view>
      </view>
      
      <!-- AI 识别结果 -->
      <view class="identify-section" v-if="identifyResults.length > 0">
        <view class="section-title">
          <text class="title-icon">🤖</text>
          <text>AI 识别结果</text>
        </view>
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
              <view class="confidence-bar">
                <view 
                  class="confidence-fill" 
                  :style="{ 
                    width: (item.confidence * 100) + '%',
                    background: item.confidence >= 0.7 ? '#4CAF50' : '#FFC107'
                  }"
                ></view>
              </view>
              <text class="confidence-text">
                {{ Math.round(item.confidence * 100) }}%
                {{ item.confidence < 0.7 ? ' - 置信度较低，请确认' : '' }}
              </text>
            </view>
            <text class="check-icon" v-if="selectedFish === item.name">✓</text>
          </view>
        </view>
      </view>
      
      <!-- 表单 -->
      <view class="form-section">
        <view class="form-item">
          <text class="form-label">鱼种</text>
          <input 
            class="form-input" 
            v-model="fishName" 
            placeholder="点击上方选择或手动输入"
          />
        </view>
        
        <view class="form-item">
          <text class="form-label">钓点</text>
          <input 
            class="form-input" 
            v-model="location" 
            placeholder="当前位置"
          />
        </view>
        
        <view class="form-row">
          <view class="form-item half">
            <text class="form-label">天气</text>
            <input 
              class="form-input" 
              v-model="weather" 
              placeholder="自动获取"
            />
          </view>
          <view class="form-item half">
            <text class="form-label">温度</text>
            <input 
              class="form-input" 
              v-model="temperature" 
              placeholder="自动获取"
            />
          </view>
        </view>
        
        <view class="form-item switch-item">
          <text class="form-label">仅自己可见</text>
          <switch 
            :checked="isPrivate" 
            @change="isPrivate = $event.detail.value"
            color="#2196F3"
          />
        </view>
      </view>
      
      <!-- 底部安全区 -->
      <view style="height: 40rpx;"></view>
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

// 选择图片
async function chooseImage() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['camera', 'album'],
    success: async (res) => {
      imagePath.value = res.tempFilePaths[0]
      
      // AI 识别
      uni.showLoading({ title: '识别中...' })
      const results = await identifyFish(imagePath.value)
      identifyResults.value = results
      uni.hideLoading()
      
      // 自动选择置信度最高的
      if (results.length > 0) {
        const best = results.reduce((a, b) => a.confidence > b.confidence ? a : b)
        selectFish(best)
      }
    }
  })
}

// 选择鱼种
function selectFish(item: FishIdentifyResult) {
  selectedFish.value = item.name
  fishName.value = item.name
}

// 返回
function goBack() {
  uni.navigateBack()
}

// 保存
async function handleSave() {
  if (!imagePath.value) {
    uni.showToast({ title: '请先拍照', icon: 'none' })
    return
  }
  
  if (!fishName.value) {
    uni.showToast({ title: '请选择鱼种', icon: 'none' })
    return
  }
  
  saving.value = true
  
  const data = {
    fishName: fishName.value,
    fishEmoji: identifyResults.value.find(f => f.name === fishName.value)?.emoji || '🐟',
    imagePath: imagePath.value,
    location: location.value || '未知钓点',
    weather: weather.value || '多云',
    temperature: temperature.value || '26°',
    isPrivate: isPrivate.value,
    userId: 'current_user'
  }
  
  const result = await catchStore.addCatch(data)
  
  saving.value = false
  
  if (result) {
    uni.showToast({ title: '保存成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } else {
    uni.showToast({ title: '保存失败', icon: 'none' })
  }
}

onMounted(() => {
  // 获取天气信息
  if (weatherStore.weatherNow) {
    weather.value = weatherStore.weatherNow.text
    temperature.value = weatherStore.weatherNow.temp + '°'
  }
  
  // 获取位置
  uni.getLocation({
    type: 'wgs84',
    success: (res) => {
      location.value = `${res.latitude.toFixed(4)}, ${res.longitude.toFixed(4)}`
    }
  })
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #EBF5FF 0%, #F0F9FF 50%, #F8FAFE 100%);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 32rpx;
  background: rgba(255,255,255,0.72);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.5);
  box-shadow: 0 4px 16px rgba(0,0,0,0.04);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.btn-back {
  width: 60rpx;
  height: 60rpx;
  border-radius: 16rpx;
  background: #F1F5F9;
  border: none;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  font-size: 34rpx;
  font-weight: 700;
  color: #1A2B4A;
}

.header-right {
  display: flex;
  align-items: center;
}

.btn-save {
  padding: 16rpx 32rpx;
  border-radius: 16rpx;
  background: linear-gradient(135deg, #2196F3, #00BCD4);
  color: #fff;
  font-size: 28rpx;
  font-weight: 600;
  border: none;
}

.btn-save:disabled {
  opacity: .5;
}

.content {
  flex: 1;
}

.photo-section {
  margin: 24rpx;
  height: 400rpx;
  border-radius: 20rpx;
  overflow: hidden;
  background: rgba(255,255,255,0.72);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.5);
  box-shadow: 0 8px 32px rgba(0,0,0,0.06);
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
  background: #F1F5F9;
}

.photo-icon {
  font-size: 64rpx;
  margin-bottom: 16rpx;
}

.photo-text {
  font-size: 28rpx;
  color: #6B7A99;
}

.identify-section {
  margin: 0 24rpx 24rpx;
  background: rgba(255,255,255,0.72);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 20rpx;
  padding: 24rpx;
  border: 1px solid rgba(255,255,255,0.5);
  box-shadow: 0 8px 32px rgba(0,0,0,0.06);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #1A2B4A;
  margin-bottom: 16rpx;
}

.title-icon {
  font-size: 28rpx;
}

.identify-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.identify-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx;
  border-radius: 12rpx;
  background: #F8FAFE;
  border: 2rpx solid transparent;
  transition: all .2s;
}

.identify-item.selected {
  border-color: #2196F3;
  background: #E3F2FD;
}

.fish-emoji {
  font-size: 40rpx;
}

.fish-info {
  flex: 1;
}

.fish-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #1A2B4A;
}

.confidence-bar {
  height: 8rpx;
  background: #E2E8F0;
  border-radius: 4rpx;
  margin: 8rpx 0;
  overflow: hidden;
}

.confidence-fill {
  height: 100%;
  border-radius: 4rpx;
  transition: width .3s ease;
}

.confidence-text {
  font-size: 20rpx;
  color: #6B7A99;
}

.check-icon {
  font-size: 28rpx;
  color: #2196F3;
  font-weight: 700;
}

.form-section {
  margin: 0 24rpx 24rpx;
  background: rgba(255,255,255,0.72);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 20rpx;
  padding: 24rpx;
  border: 1px solid rgba(255,255,255,0.5);
  box-shadow: 0 8px 32px rgba(0,0,0,0.06);
}

.form-item {
  margin-bottom: 20rpx;
}

.form-item:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 26rpx;
  font-weight: 500;
  color: #1A2B4A;
  margin-bottom: 8rpx;
}

.form-input {
  width: 100%;
  height: 80rpx;
  background: #F8FAFE;
  border: 2rpx solid #E2E8F0;
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #1A2B4A;
}

.form-row {
  display: flex;
  gap: 16rpx;
}

.form-item.half {
  flex: 1;
}

.switch-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.switch-item .form-label {
  margin-bottom: 0;
}
</style>