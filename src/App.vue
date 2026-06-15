<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'
import { provideEcharts } from 'uni-echarts/shared'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, MarkLineComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([LineChart, GridComponent, TooltipComponent, MarkLineComponent, CanvasRenderer])
provideEcharts(echarts)

onLaunch(() => {
  console.log('App Launch')
  const userStore = useUserStore()
  const isLoggedIn = userStore.checkLogin()
  // #ifdef H5
  if (!isLoggedIn) {
    userStore.setLoginInfo('dev_token', {
      id: 'dev_user',
      nickname: '开发者',
      avatar: ''
    })
  }
  // #endif
  // #ifdef MP-WEIXIN
  if (!isLoggedIn) {
    uni.navigateTo({ url: '/pages/login/index' })
  }
  // #endif
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style>
page {
  background-color: #F2F3F5;
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 28rpx;
  color: #060607;
  line-height: 1.4;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

/* 全局禁止水平滚动 */
uni-page-body {
  overflow-x: hidden;
  max-width: 100vw;
}

button::after {
  border: none;
}

button {
  border-radius: 9999px;
}
</style>
