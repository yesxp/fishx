<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'

onLaunch(() => {
  console.log('App Launch')
  
  // 检查登录状态
  const userStore = useUserStore()
  const isLoggedIn = userStore.checkLogin()
  
  // 如果未登录，跳转到登录页
  if (!isLoggedIn) {
    // H5 模式下自动登录（开发用）
    // #ifdef H5
    userStore.setLoginInfo('dev_token', {
      id: 'dev_user',
      nickname: '开发者',
      avatar: ''
    })
    // #endif
    
    // #ifdef MP-WEIXIN
    uni.navigateTo({ url: '/pages/login/index' })
    // #endif
  }
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
  background-color: #F8FAFE;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', sans-serif;
}
</style>