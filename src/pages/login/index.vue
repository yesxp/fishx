<template>
  <view class="login-page">
    <!-- 顶部 Logo -->
    <view class="logo-section">
      <view class="logo-circle">
        <text class="logo-emoji">🎣</text>
      </view>
      <text class="app-name">鱼渔娱</text>
      <text class="app-slogan">钓鱼人的一站式轻量工具</text>
    </view>
    
    <!-- 登录方式切换 -->
    <view class="login-tabs">
      <view 
        class="tab-item" 
        :class="{ active: loginType === 'wx' }"
        @click="loginType = 'wx'"
      >
        <text>微信登录</text>
      </view>
      <view 
        class="tab-item" 
        :class="{ active: loginType === 'phone' }"
        @click="loginType = 'phone'"
      >
        <text>手机号登录</text>
      </view>
    </view>
    
    <!-- 微信登录 -->
    <view class="login-form" v-if="loginType === 'wx'">
      <button class="wx-btn" @click="handleWxLogin">
        <text class="wx-icon">💬</text>
        <text class="wx-text">微信授权登录</text>
      </button>
      <text class="wx-hint">点击即表示同意《用户协议》和《隐私政策》</text>
    </view>
    
    <!-- 手机号登录 -->
    <view class="login-form" v-else>
      <view class="input-group">
        <text class="input-label">手机号</text>
        <input 
          class="input-field" 
          type="number" 
          maxlength="11"
          v-model="phone" 
          placeholder="请输入手机号"
        />
      </view>
      <view class="input-group">
        <text class="input-label">验证码</text>
        <view class="code-row">
          <input 
            class="input-field" 
            type="number" 
            maxlength="6"
            v-model="code" 
            placeholder="请输入验证码"
          />
          <view 
            class="code-btn" 
            :class="{ disabled: countdown > 0 }"
            @click="handleSendCode"
          >
            <text>{{ countdown > 0 ? countdown + 's' : '获取验证码' }}</text>
          </view>
        </view>
      </view>
      <button class="login-btn" @click="handlePhoneLogin">
        登录
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { wxLogin, sendSmsCode, phoneLogin } from '@/api/user'

const userStore = useUserStore()
const loginType = ref<'wx' | 'phone'>('wx')
const phone = ref('')
const code = ref('')
const countdown = ref(0)
let timer: any = null

// 微信登录
async function handleWxLogin() {
  uni.showLoading({ title: '登录中...' })
  
  // #ifdef MP-WEIXIN
  try {
    const res = await new Promise((resolve, reject) => {
      uni.login({
        provider: 'weixin',
        success: resolve,
        fail: reject
      })
    })
    const loginRes = await wxLogin((res as any).code)
    if (loginRes.code === 0) {
      userStore.setLoginInfo(loginRes.data.token, loginRes.data.userInfo)
      uni.hideLoading()
      uni.switchTab({ url: '/pages/index/index' })
    }
  } catch (e) {
    uni.hideLoading()
    uni.showToast({ title: '登录失败', icon: 'none' })
  }
  // #endif
  
  // #ifdef H5
  // H5 模拟登录
  setTimeout(() => {
    userStore.setLoginInfo('mock_token', {
      id: 'wx_mock',
      nickname: '微信用户',
      avatar: ''
    })
    uni.hideLoading()
    uni.switchTab({ url: '/pages/index/index' })
  }, 500)
  // #endif
}

// 发送验证码
async function handleSendCode() {
  if (countdown.value > 0) return
  if (!phone.value || phone.value.length !== 11) {
    uni.showToast({ title: '请输入正确手机号', icon: 'none' })
    return
  }
  
  const res = await sendSmsCode(phone.value)
  if (res.code === 0) {
    uni.showToast({ title: '验证码已发送', icon: 'success' })
    countdown.value = 60
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  }
}

// 手机号登录
async function handlePhoneLogin() {
  if (!phone.value || phone.value.length !== 11) {
    uni.showToast({ title: '请输入正确手机号', icon: 'none' })
    return
  }
  if (!code.value || code.value.length !== 6) {
    uni.showToast({ title: '请输入6位验证码', icon: 'none' })
    return
  }
  
  uni.showLoading({ title: '登录中...' })
  const res = await phoneLogin(phone.value, code.value)
  
  if (res.code === 0) {
    userStore.setLoginInfo(res.data.token, res.data.userInfo)
    uni.hideLoading()
    uni.switchTab({ url: '/pages/index/index' })
  } else {
    uni.hideLoading()
    uni.showToast({ title: '登录失败', icon: 'none' })
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #EBF5FF 0%, #F0F9FF 50%, #F8FAFE 100%);
  padding: 0 40rpx;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 120rpx;
  margin-bottom: 80rpx;
}

.logo-circle {
  width: 160rpx;
  height: 160rpx;
  border-radius: 40rpx;
  background: linear-gradient(135deg, #2196F3, #00BCD4);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 16rpx 48rpx rgba(33,150,243,.3);
  margin-bottom: 24rpx;
}

.logo-emoji {
  font-size: 72rpx;
}

.app-name {
  font-size: 44rpx;
  font-weight: 700;
  color: #1A2B4A;
  margin-bottom: 8rpx;
}

.app-slogan {
  font-size: 26rpx;
  color: #6B7A99;
}

.login-tabs {
  display: flex;
  background: #F1F5F9;
  border-radius: 16rpx;
  padding: 6rpx;
  margin-bottom: 48rpx;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 20rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #6B7A99;
  transition: all .2s;
}

.tab-item.active {
  background: rgba(255,255,255,0.72);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  color: #1A2B4A;
  font-weight: 600;
  box-shadow: 0 8px 32px rgba(0,0,0,0.06);
}

.login-form {
  padding: 0 20rpx;
}

.wx-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  width: 100%;
  height: 96rpx;
  background: #07C160;
  border-radius: 16rpx;
  border: none;
  margin-bottom: 24rpx;
}

.wx-icon {
  font-size: 36rpx;
}

.wx-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.wx-hint {
  display: block;
  text-align: center;
  font-size: 22rpx;
  color: #6B7A99;
  line-height: 1.6;
}

.input-group {
  margin-bottom: 32rpx;
}

.input-label {
  display: block;
  font-size: 26rpx;
  font-weight: 500;
  color: #1A2B4A;
  margin-bottom: 12rpx;
}

.input-field {
  width: 100%;
  height: 96rpx;
  background: rgba(255,255,255,0.72);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.5);
  border-radius: 16rpx;
  padding: 0 24rpx;
  font-size: 30rpx;
  color: #1A2B4A;
}

.code-row {
  display: flex;
  gap: 16rpx;
}

.code-row .input-field {
  flex: 1;
}

.code-btn {
  width: 200rpx;
  height: 96rpx;
  background: #E3F2FD;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  color: #2196F3;
  font-weight: 500;
  flex-shrink: 0;
}

.code-btn.disabled {
  background: #F1F5F9;
  color: #94A3B8;
}

.login-btn {
  width: 100%;
  height: 96rpx;
  background: linear-gradient(135deg, #2196F3, #00BCD4);
  border-radius: 16rpx;
  border: none;
  font-size: 32rpx;
  font-weight: 600;
  color: #FFFFFF;
  margin-top: 16rpx;
}

.login-btn:active {
  opacity: .85;
}
</style>