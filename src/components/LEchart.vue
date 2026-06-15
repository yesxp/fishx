<template>
  <view class="echarts-wrap" :style="{ width: width, height: height }">
    <l-echart ref="chartRef" @finished="onFinished" />
  </view>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'

const props = defineProps<{
  option: any
  width?: string
  height?: string
}>()

const chartRef = ref<any>(null)
let chartInstance: any = null
let echartsLib: any = null

async function onFinished() {
  if (!chartRef.value) return
  // #ifdef H5
  echartsLib = await import('echarts')
  // #endif
  // #ifdef MP-WEIXIN
  echartsLib = require('../../uni_modules/lime-echart/static/echarts.min')
  // #endif
  // #ifndef H5 || MP-WEIXIN
  echartsLib = await import('echarts')
  // #endif

  chartInstance = await chartRef.value.init(echartsLib)
  if (chartInstance && props.option) {
    chartInstance.setOption(props.option)
  }
}

watch(() => props.option, (newOpt) => {
  if (chartInstance && newOpt) {
    chartInstance.setOption(newOpt, true)
  }
}, { deep: true })

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})
</script>

<style scoped>
.echarts-wrap {
  overflow: hidden;
}
</style>
