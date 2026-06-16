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
/* ===== Wot UI 主题覆盖 — Discord Light Mode ===== */
page {
  --wot-color-primary: #5865F2;
  --wot-color-success: #23A559;
  --wot-color-warning: #F0B232;
  --wot-color-danger: #F23F43;
  /* Button */
  --wot-button-primary-bg: #5865F2;
  --wot-button-primary-color: #FFFFFF;
  --wot-button-border-radius: 9999px;
  /* Tag */
  --wot-tag-primary-bg: rgba(88,101,242,0.1);
  --wot-tag-primary-color: #5865F2;
  --wot-tag-success-bg: rgba(35,165,89,0.1);
  --wot-tag-success-color: #23A559;
  --wot-tag-danger-bg: rgba(242,63,67,0.1);
  --wot-tag-danger-color: #F23F43;
  --wot-tag-warning-bg: rgba(240,178,50,0.1);
  --wot-tag-warning-color: #F0B232;
  /* Cell */
  --wot-cell-bg: #FFFFFF;
  --wot-cell-border-color: #E3E5E8;
  /* Grid */
  --wot-grid-item-content-bg: transparent;
  /* Input */
  --wot-input-background: #F2F3F5;
  --wot-input-border-radius: 10px;
  /* Loading */
  --wot-loading-text-color: #80848E;
  /* Page */
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

/* 去掉 button 默认边框 */
button::after {
  border: none;
}

/* 隐藏原生 tabbar，用 Wot UI wd-tabbar 替代 */
uni-tabbar,
uni-tabbar-bottom {
  display: none !important;
}
</style>
