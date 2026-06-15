<template>
  <UniEcharts
    :option="option"
    :custom-style="customStyle"
  />
</template>

<script setup lang="ts">
import UniEcharts from 'uni-echarts'

defineProps<{
  option: any
  customStyle?: string
}>()
</script>
