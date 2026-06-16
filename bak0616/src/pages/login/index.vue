<template>
  <view class="page-login">
    <!-- Logo & Branding -->
    <view class="login-brand">
      <view class="login-logo">
        <text class="login-logo-text">🐟</text>
      </view>
      <text class="login-title">鱼渔娱</text>
      <text class="login-subtitle">钓鱼人的一站式轻量工具</text>
    </view>

    <!-- Login Methods -->
    <view class="login-form">
      <!-- Phone Login -->
      <view class="login-section">
        <view class="input-group">
          <view class="phone-prefix">
            <text class="prefix-text">+86</text>
          </view>
          <input
            v-model="phone"
            type="number"
            class="phone-input"
            placeholder="请输入手机号"
            maxlength="11"
          />
        </view>
        <view class="code-row">
          <input
            v-model="smsCode"
            type="number"
            class="code-input"
            placeholder="验证码"
            maxlength="6"
          />
          <view
            class="code-btn"
            :class="{ 'code-btn--disabled': countdown > 0 }"
            @tap="onSendCode"
          >
            <text class="code-btn-text">{{ countdown > 0 ? `${countdown}s` : '获取验证码' }}</text>
          </view>
        </view>
        <view
          class="login-btn"
          :class="{ 'login-btn--disabled': !canLogin }"
          @tap="onPhoneLogin"
        >
          <text class="login-btn-text">登录</text>
        </view>
      </view>

      <!-- Divider -->
      <view class="divider">
        <view class="divider-line" />
        <text class="divider-text">其他方式</text>
        <view class="divider-line" />
      </view>

      <!-- Third-party Login -->
      <view class="third-party">
        <view class="tp-btn" @tap="onWechatLogin">
          <text class="tp-icon">💚</text>
          <text class="tp-text">微信登录</text>
        </view>
      </view>
    </view>

    <!-- Agreement -->
    <view class="agreement">
      <view class="agree-check" :class="{ 'agree-check--on': agreed }" @tap="agreed = !agreed">
        <view v-if="agreed" class="check-icon">
          <text class="check-mark">✓</text>
        </view>
      </view>
      <text class="agree-text">
        登录即同意
        <text class="agree-link">《用户协议》</text>
        和
        <text class="agree-link">《隐私政策》</text>
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { wxLogin, sendSmsCode, phoneLogin } from '@/api/user'

const userStore = useUserStore()

const phone = ref('')
const smsCode = ref('')
const agreed = ref(false)
const countdown = ref(0)
const logging = ref(false)

const canLogin = computed(() => {
  return phone.value.length === 11 && smsCode.value.length >= 4 && agreed.value && !logging.value
})

let timer: any = null

function onSendCode() {
  if (countdown.value > 0) return
  if (phone.value.length !== 11) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }

  sendSmsCode(phone.value).then((res: any) => {
    if (res.code === 0) {
      uni.showToast({ title: '验证码已发送', icon: 'none' })
      countdown.value = 60
      timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    }
  })
}

async function onPhoneLogin() {
  if (!canLogin.value) return
  logging.value = true

  try {
    const res = await phoneLogin(phone.value, smsCode.value)
    if (res.code === 0) {
      userStore.setLoginInfo(res.data.token, res.data.userInfo)
      uni.showToast({ title: '登录成功', icon: 'success' })
      setTimeout(() => {
        uni.switchTab({ url: '/pages/index/index' })
      }, 1500)
    }
  } catch (e) {
    uni.showToast({ title: '登录失败', icon: 'none' })
  }

  logging.value = false
}

async function onWechatLogin() {
  // #ifdef MP-WEIXIN
  uni.login({
    provider: 'weixin',
    success: async (loginRes) => {
      const res = await wxLogin(loginRes.code)
      if (res.code === 0) {
        userStore.setLoginInfo(res.data.token, res.data.userInfo)
        uni.switchTab({ url: '/pages/index/index' })
      }
    }
  })
  // #endif

  // #ifdef H5
  // H5 开发模式自动登录
  const res = await wxLogin('dev_code')
  if (res.code === 0) {
    userStore.setLoginInfo(res.data.token, res.data.userInfo)
    uni.showToast({ title: '登录成功', icon: 'success' })
    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' })
    }, 1500)
  }
  // #endif
}
</script>

<style scoped lang="scss">
$bg-page: #F2F3F5;
$bg-card: #FFFFFF;
$brand: #5865F2;
$divider: #E3E5E8;
$text-primary: #060607;
$text-secondary: #4E5058;
$text-muted: #80848E;
$tag-bg: #F2F3F5;

.page-login {
  min-height: 100vh;
  background: $bg-page;
  display: flex;
  flex-direction: column;
  padding: 0 24px;
}

/* Brand */
.login-brand {
  text-align: center;
  padding-top: 80px;
  margin-bottom: 48px;
}

.login-logo {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: $brand;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.login-logo-text {
  font-size: 40px;
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  color: $text-primary;
  display: block;
  margin-bottom: 6px;
}

.login-subtitle {
  font-size: 14px;
  color: $text-muted;
}

/* Form */
.login-form {
  background: $bg-card;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid $divider;
}

.login-section {
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  align-items: center;
  background: $tag-bg;
  border-radius: 10px;
  padding: 0 12px;
  margin-bottom: 12px;
}

.phone-prefix {
  padding-right: 10px;
  border-right: 1px solid $divider;
  margin-right: 10px;
}

.prefix-text {
  font-size: 14px;
  font-weight: 600;
  color: $text-primary;
}

.phone-input {
  flex: 1;
  height: 44px;
  font-size: 14px;
  color: $text-primary;
}

.code-row {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.code-input {
  flex: 1;
  height: 44px;
  background: $tag-bg;
  border-radius: 10px;
  padding: 0 12px;
  font-size: 14px;
  color: $text-primary;
}

.code-btn {
  padding: 0 16px;
  height: 44px;
  border-radius: 10px;
  background: rgba($brand, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.code-btn--disabled {
  opacity: 0.5;
}

.code-btn-text {
  font-size: 13px;
  font-weight: 500;
  color: $brand;
  white-space: nowrap;
}

.login-btn {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  background: $brand;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.login-btn--disabled {
  opacity: 0.5;
}

.login-btn-text {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: $divider;
}

.divider-text {
  font-size: 12px;
  color: $text-muted;
  flex-shrink: 0;
}

/* Third-party */
.third-party {
  display: flex;
  justify-content: center;
}

.tp-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 24px;
  border-radius: 12px;
  background: $tag-bg;
  cursor: pointer;
}

.tp-icon {
  font-size: 28px;
}

.tp-text {
  font-size: 12px;
  color: $text-secondary;
}

/* Agreement */
.agreement {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 32px;
  padding-bottom: 40px;
}

.agree-check {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1.5px solid $divider;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s;
}

.agree-check--on {
  background: $brand;
  border-color: $brand;
}

.check-mark {
  font-size: 10px;
  color: #fff;
  font-weight: 700;
}

.agree-text {
  font-size: 12px;
  color: $text-muted;
}

.agree-link {
  color: $brand;
}
</style>
