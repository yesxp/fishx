import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { UniEcharts } from 'uni-echarts/vite'

export default defineConfig({
  plugins: [
    UniEcharts(),
    uni(),
  ],
})
