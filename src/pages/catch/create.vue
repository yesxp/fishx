<template>
  <view class="page-create">
    <!-- Header -->
    <wd-navbar title="记录渔获" left-arrow bordered @click-left="goBack" custom-style="position: sticky; top: 0; z-index: 100;">
      <template #right>
        <wd-button type="primary" size="small" round @click="onSubmit">发布</wd-button>
      </template>
    </wd-navbar>

    <!-- Content -->
    <scroll-view scroll-y class="content" :enhanced="true" :show-scrollbar="false">
      <!-- Photo Area -->
      <view class="photo-section" @tap="onChoosePhoto">
        <view v-if="!imageUrl" class="photo-placeholder">
          <text class="photo-icon">📷</text>
          <text class="photo-text">点击拍照或选择图片</text>
        </view>
        <view v-else class="photo-preview">
          <image :src="imageUrl" mode="aspectFill" class="preview-img" />
          <view class="photo-remove" @tap.stop="removePhoto">
            <text class="remove-icon">✕</text>
          </view>
        </view>
      </view>

      <!-- Form -->
      <view class="form">
        <!-- Fish Species -->
        <view class="form-group">
          <text class="form-label">鱼种</text>
          <scroll-view scroll-x class="fish-scroll" :show-scrollbar="false">
            <view class="fish-list">
              <view
                v-for="fish in fishSpecies"
                :key="fish.id"
                class="fish-option"
                :class="{ 'fish-option--active': selectedFish === fish.id }"
                @tap="selectedFish = fish.id"
              >
                <text class="fish-emoji">{{ fish.emoji }}</text>
                <text class="fish-name">{{ fish.name }}</text>
              </view>
            </view>
          </scroll-view>
        </view>

        <!-- Weight -->
        <view class="form-group">
          <text class="form-label">重量</text>
          <view class="input-row">
            <wd-input v-model="weight" type="digit" placeholder="输入重量（斤）" />
            <text class="input-unit">斤</text>
          </view>
        </view>

        <!-- Location -->
        <view class="form-group">
          <text class="form-label">钓点</text>
          <view class="input-row">
            <wd-input v-model="location" placeholder="输入钓点名称" />
          </view>
        </view>

        <!-- Description -->
        <view class="form-group">
          <text class="form-label">描述</text>
          <wd-textarea v-model="description" placeholder="分享你的钓鱼心得..." maxlength="500" autosize />
        </view>

        <!-- Privacy -->
        <view class="form-group">
          <view class="toggle-row">
            <text class="form-label">仅自己可见</text>
            <wd-switch v-model="isPrivate" />
          </view>
        </view>
      </view>

      <view style="height: 120rpx;" />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCatchStore } from '@/stores/catch'
import { FISH_SPECIES } from '@/utils/fish-species'

const catchStore = useCatchStore()

const imageUrl = ref('')
const selectedFish = ref('crucian')
const weight = ref('')
const location = ref('')
const description = ref('')
const isPrivate = ref(false)
const submitting = ref(false)

const fishSpecies = FISH_SPECIES.slice(0, 10) // show first 10

function goBack() {
  uni.navigateBack()
}

function onChoosePhoto() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      imageUrl.value = res.tempFilePaths[0]
    }
  })
}

function removePhoto() {
  imageUrl.value = ''
}

async function onSubmit() {
  if (submitting.value) return
  if (!selectedFish.value) {
    uni.showToast({ title: '请选择鱼种', icon: 'none' })
    return
  }

  submitting.value = true

  const fish = FISH_SPECIES.find(f => f.id === selectedFish.value)

  const result = await catchStore.addCatch({
    fishName: fish?.name || '未知',
    fishEmoji: fish?.emoji || '🐟',
    imagePath: imageUrl.value,
    location: location.value,
    weather: '多云',
    temperature: '26°',
    isPrivate: isPrivate.value,
  })

  submitting.value = false

  if (result) {
    uni.showToast({ title: '发布成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } else {
    uni.showToast({ title: '发布失败', icon: 'none' })
  }
}
</script>

<style scoped lang="scss">
$bg-page: #F2F3F5;
$bg-card: #FFFFFF;
$brand: #5865F2;
$divider: #E3E5E8;
$text-primary: #060607;
$text-secondary: #4E5058;
$text-muted: #80848E;

.page-create {
  min-height: 100vh;
  background: $bg-page;
}



/* Content */
.content {
  padding: 12px;
  height: calc(100vh - 60px);
}

/* Photo Section */
.photo-section {
  margin-bottom: 16px;
}

.photo-placeholder {
  width: 100%;
  aspect-ratio: 4/3;
  background: $bg-card;
  border: 2px dashed $divider;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
}

.photo-icon {
  font-size: 48px;
}

.photo-text {
  font-size: 14px;
  color: $text-muted;
}

.photo-preview {
  width: 100%;
  aspect-ratio: 4/3;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.preview-img {
  width: 100%;
  height: 100%;
}

.photo-remove {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-icon {
  font-size: 14px;
  color: #fff;
}

/* Form */
.form {
  background: $bg-card;
  border-radius: 12px;
  border: 1px solid $divider;
  padding: 16px;
}

.form-group {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 8px;
  display: block;
}

.fish-scroll {
  white-space: nowrap;
}

.fish-list {
  display: flex;
  gap: 8px;
}

.fish-option {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-radius: 10px;
  background: #F2F3F5;
  cursor: pointer;
  transition: all 0.15s;
}

.fish-option--active {
  background: rgba($brand, 0.1);
  border: 1px solid $brand;
}

.fish-emoji {
  font-size: 24px;
}

.fish-name {
  font-size: 11px;
  color: $text-secondary;
}

.fish-option--active .fish-name {
  color: $brand;
  font-weight: 600;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 8px;
}



.input-unit {
  font-size: 14px;
  color: $text-muted;
}





.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}


</style>
