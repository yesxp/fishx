<template>
  <UniEcharts
    :option="option"
    :custom-style="containerStyle"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import UniEcharts from 'uni-echarts'

const props = defineProps<{
  option: any
  width?: string
  height?: string
  customStyle?: string
}>()

const containerStyle = computed(() => {
  const s: Record<string, string> = {}
  if (props.width) s.width = props.width
  if (props.height) s.height = props.height
  if (props.customStyle) {
    // parse inline style string
    props.customStyle.split(';').forEach(rule => {
      const [k, v] = rule.split(':').map((s: string) => s.trim())
      if (k && v) s[k] = v
    })
  }
  return s
})
</script>
