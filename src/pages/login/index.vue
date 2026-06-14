<template>
  <view class="page">
    <view class="logo-area">
      <view class="logo-icon">
        <text class="logo-emoji">🎣</text>
      </view>
      <text class="logo-title">鱼渔娱</text>
      <text class="logo-sub">Lightweight fishing tool for anglers</text>
    </view>

    <view class="auth-area">
      <!-- Tab switcher: Discord segmented control -->
      <view class="auth-tabs">
        <view
          class="tab"
          :class="{ active: loginType === 'wx' }"
          @click="loginType = 'wx'"
        >
          <text class="tab-text">WeChat</text>
        </view>
        <view
          class="tab"
          :class="{ active: loginType === 'phone' }"
          @click="loginType = 'phone'"
        >
          <text class="tab-text">Phone</text>
        </view>
      </view>

      <!-- WeChat login -->
      <view class="form-panel" v-if="loginType === 'wx'">
        <button class="wx-btn" @click="handleWxLogin">
          <text class="wx-icon">💬</text>
          <text class="wx-label">Continue with WeChat</text>
        </button>
        <text class="form-hint">By continuing, you agree to the Terms of Service and Privacy Policy</text>
      </view>

      <!-- Phone login -->
      <view class="form-panel" v-else>
        <view class="input-group">
          <text class="input-label">Phone</text>
          <input
            class="input-field"
            type="number"
            maxlength="11"
            v-model="phone"
            placeholder="Enter phone number"
          />
        </view>
        <view class="input-group">
          <text class="input-label">Code</text>
          <view class="code-row">
            <input
              class="input-field"
              type="number"
              maxlength="6"
              v-model="code"
              placeholder="Verification code"
            />
            <view
              class="code-btn"
              :class="{ disabled: countdown > 0 }"
              @click="handleSendCode"
            >
              <text>{{ countdown > 0 ? countdown + 's' : 'Send' }}</text>
            </view>
          </view>
        </view>
        <button class="login-btn" @click="handlePhoneLogin" :disabled="saving">
          {{ saving ? 'Signing in...' : 'Sign In' }}
        </button>
      </view>
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
const saving = ref(false)
let timer: any = null

async function handleWxLogin() {
  uni.showLoading({ title: 'Signing in...' })
  // #ifdef MP-WEIXIN
  try {
    const res = await new Promise((resolve, reject) => {
      uni.login({ provider: 'weixin', success: resolve, fail: reject })
    })
    const loginRes = await wxLogin((res as any).code)
    if (loginRes.code === 0) {
      userStore.setLoginInfo(loginRes.data.token, loginRes.data.userInfo)
      uni.hideLoading()
      uni.switchTab({ url: '/pages/index/index' })
    }
  } catch (e) {
    uni.hideLoading()
    uni.showToast({ title: 'Sign in failed', icon: 'none' })
  }
  // #endif
  // #ifdef H5
  setTimeout(() => {
    userStore.setLoginInfo('mock_token', {
      id: 'wx_mock',
      nickname: 'WeChat User',
      avatar: ''
    })
    uni.hideLoading()
    uni.switchTab({ url: '/pages/index/index' })
  }, 500)
  // #endif
}

async function handleSendCode() {
  if (countdown.value > 0) return
  if (!phone.value || phone.value.length !== 11) {
    uni.showToast({ title: 'Enter a valid phone', icon: 'none' })
    return
  }
  const res = await sendSmsCode(phone.value)
  if (res.code === 0) {
    uni.showToast({ title: 'Code sent', icon: 'success' })
    countdown.value = 60
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) clearInterval(timer)
    }, 1000)
  }
}

async function handlePhoneLogin() {
  if (!phone.value || phone.value.length !== 11) {
    uni.showToast({ title: 'Enter a valid phone', icon: 'none' })
    return
  }
  if (!code.value || code.value.length !== 6) {
    uni.showToast({ title: 'Enter 6-digit code', icon: 'none' })
    return
  }
  saving.value = true
  uni.showLoading({ title: 'Signing in...' })
  const res = await phoneLogin(phone.value, code.value)
  if (res.code === 0) {
    userStore.setLoginInfo(res.data.token, res.data.userInfo)
    uni.hideLoading()
    uni.switchTab({ url: '/pages/index/index' })
  } else {
    uni.hideLoading()
    uni.showToast({ title: 'Sign in failed', icon: 'none' })
  }
  saving.value = false
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #F2F3F5;
  display: flex;
  flex-direction: column;
  padding: 0 40rpx;
}

/* ===== Logo ===== */
.logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100rpx;
  margin-bottom: 80rpx;
}

.logo-icon {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  background: #E3E5E8;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
}

.logo-emoji {
  font-size: 64rpx;
}

.logo-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #060607;
  margin-bottom: 8rpx;
}

.logo-sub {
  font-size: 24rpx;
  color: #4E5058;
}

/* ===== Auth ===== */
.auth-area {
  flex: 1;
}

/* Tab switcher: Discord segmented control */
.auth-tabs {
  display: flex;
  background: #E3E5E8;
  border-radius: 8rpx;
  padding: 4rpx;
  margin-bottom: 48rpx;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 14rpx;
  border-radius: 6rpx;
  transition: all 0.15s;
}
.tab:active {
  background: rgba(0,0,0,0.04);
}
.tab.active {
  background: #FFFFFF;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
}

.tab-text {
  font-size: 26rpx;
  font-weight: 500;
  color: #4E5058;
}
.tab.active .tab-text {
  color: #060607;
  font-weight: 600;
}

/* Form panel */
.form-panel {
  padding: 0 8rpx;
}

/* WeChat button */
.wx-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  width: 100%;
  height: 88rpx;
  border-radius: 9999px;
  background: #23A55A;
  border: none;
  margin-bottom: 20rpx;
  transition: background 0.15s;
}
.wx-btn:active {
  background: #1d8a4c;
}

.wx-icon {
  font-size: 32rpx;
}

.wx-label {
  font-size: 28rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.form-hint {
  display: block;
  text-align: center;
  font-size: 20rpx;
  color: #80848E;
  line-height: 1.5;
}

/* Input groups */
.input-group {
  margin-bottom: 28rpx;
}

.input-label {
  display: block;
  font-size: 24rpx;
  font-weight: 500;
  color: #060607;
  margin-bottom: 10rpx;
}

.input-field {
  width: 100%;
  height: 80rpx;
  background: #E3E5E8;
  border: none;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #060607;
}

.input-field::placeholder {
  color: #80848E;
}

.code-row {
  display: flex;
  gap: 12rpx;
}

.code-row .input-field {
  flex: 1;
}

.code-btn {
  width: 200rpx;
  height: 80rpx;
  border-radius: 8rpx;
  background: rgba(88,101,242,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: 600;
  color: #5865F2;
  flex-shrink: 0;
  transition: background 0.15s;
}
.code-btn:active:not(.disabled) {
  background: rgba(88,101,242,0.16);
}
.code-btn.disabled {
  background: #E3E5E8;
  color: #80848E;
}

/* Login button */
.login-btn {
  width: 100%;
  height: 80rpx;
  border-radius: 9999px;
  background: #5865F2;
  color: #FFFFFF;
  font-size: 28rpx;
  font-weight: 600;
  border: none;
  margin-top: 12rpx;
  transition: background 0.15s;
}
.login-btn:active:not(:disabled) {
  background: #4752C4;
}
.login-btn:disabled {
  opacity: 0.5;
}
</style>
