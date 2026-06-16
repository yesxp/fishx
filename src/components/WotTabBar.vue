<template>
  <wd-tabbar :model-value="current" fixed bordered placeholder safe-area-inset-bottom active-color="#5865F2" inactive-color="#80848E" @change="onChange">
    <wd-tabbar-item name="home" title="首页">
      <template #icon="{ active: isActive }">
        <view class="tab-icon">
          <svg v-if="!isActive" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 12C2 12 5 8 12 8C19 8 22 12 22 12C22 12 19 16 12 16C5 16 2 12 2 12Z"/>
            <circle cx="16" cy="12" r="1.5"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#5865F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 12C2 12 5 8 12 8C19 8 22 12 22 12C22 12 19 16 12 16C5 16 2 12 2 12Z"/>
            <circle cx="16" cy="12" r="1.5" fill="#5865F2"/>
          </svg>
        </view>
      </template>
    </wd-tabbar-item>
    <wd-tabbar-item name="weather" title="天时">
      <template #icon="{ active: isActive }">
        <view class="tab-icon">
          <svg v-if="!isActive" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#5865F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
          </svg>
        </view>
      </template>
    </wd-tabbar-item>
    <wd-tabbar-item name="map" title="钓点">
      <template #icon="{ active: isActive }">
        <view class="tab-icon">
          <svg v-if="!isActive" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#5865F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </view>
      </template>
    </wd-tabbar-item>
    <wd-tabbar-item name="mine" title="我的">
      <template #icon="{ active: isActive }">
        <view class="tab-icon">
          <svg v-if="!isActive" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#80848E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#5865F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </view>
      </template>
    </wd-tabbar-item>
  </wd-tabbar>
</template>

<script setup lang="ts">
const props = defineProps<{ current: string }>()

const tabPages: Record<string, string> = {
  home: '/pages/index/index',
  weather: '/pages/weather/index',
  map: '/pages/map/index',
  mine: '/pages/mine/index',
}

function onChange({ value }: { value: string | number }) {
  const url = tabPages[value as string]
  if (url && value !== props.current) {
    uni.switchTab({ url })
  }
}
</script>

<style scoped>
.tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
