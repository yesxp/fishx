<template>
  <view class="echarts-wrap" :style="containerStyle">
    <!-- #ifdef H5 -->
    <div ref="chartRef" style="width:100%;height:100%"></div>
    <!-- #endif -->
    <!-- #ifndef H5 -->
    <canvas :canvas-id="canvasId" :id="canvasId" style="width:100%;height:100%"></canvas>
    <!-- #endif -->
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick, computed } from 'vue'

const props = defineProps<{
  option: any
  width?: string
  height?: string
}>()

const chartRef = ref<HTMLElement>()
const canvasId = 'echarts_' + Math.random().toString(36).slice(2, 8)
let chartInstance: any = null
let echartsLib: any = null

const containerStyle = computed(() => {
  const s: Record<string, string> = {}
  if (props.width) s.width = props.width
  if (props.height) s.height = props.height
  return s
})

// #ifdef H5
onMounted(async () => {
  await nextTick()
  echartsLib = await import('echarts/core')
  const { LineChart } = await import('echarts/charts')
  const { GridComponent, TooltipComponent, LabelLayout } = await import('echarts/components')
  const { CanvasRenderer } = await import('echarts/renderers')
  echartsLib.use([LineChart, GridComponent, TooltipComponent, LabelLayout, CanvasRenderer])

  await nextTick()
  if (chartRef.value) {
    chartInstance = echartsLib.init(chartRef.value)
    if (props.option && Object.keys(props.option).length > 0) {
      chartInstance.setOption(props.option)
    }
  }
})

watch(() => props.option, (newOpt) => {
  if (chartInstance && newOpt && Object.keys(newOpt).length > 0) {
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
