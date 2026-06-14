<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'

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
}

button::after {
  border: none;
}

button {
  border-radius: 9999px;
}
</style>
