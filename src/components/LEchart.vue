<template>
  <view class="echarts-wrap" :style="{ width: width, height: height }">
    <!-- #ifdef H5 -->
    <div ref="chartRef" :style="{ width: '100%', height: '100%' }"></div>
    <!-- #endif -->
    <!-- #ifndef H5 -->
    <canvas :canvas-id="canvasId" :id="canvasId" :style="{ width: '100%', height: '100%' }"></canvas>
    <!-- #endif -->
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

const props = defineProps<{
  option: any
  width?: string
  height?: string
}>()

const chartRef = ref<HTMLElement>()
const canvasId = 'echarts_' + Math.random().toString(36).slice(2, 8)
let chartInstance: any = null

// #ifdef H5
let echarts: any = null

onMounted(async () => {
  echarts = await import('echarts')
  await nextTick()
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value)
    chartInstance.setOption(props.option)
  }
})

watch(() => props.option, (newOpt) => {
  if (chartInstance) {
    chartInstance.setOption(newOpt, true)
  }
}, { deep: true })

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})
// #endif
</script>

<style scoped>
.echarts-wrap {
  overflow: hidden;
}
</style>
