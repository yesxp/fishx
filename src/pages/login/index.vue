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
        <wd-input
          v-model="phone"
          type="number"
          placeholder="请输入手机号"
          prefix-icon="phone"
          maxlength="11"
          class="phone-input"
        />
        <view class="code-row">
          <wd-input
            v-model="smsCode"
            type="number"
            placeholder="验证码"
            maxlength="6"
            class="code-input"
          />
          <wd-button
            size="small"
            type="primary"
            plain
            :disabled="countdown > 0"
            @click="onSendCode"
            class="code-btn"
          >
            {{ countdown > 0 ? countdown + 's' : '获取验证码' }}
          </wd-button>
        </view>
        <wd-button
          type="primary"
          block
          :disabled="!canLogin"
          @click="onPhoneLogin"
          class="login-btn"
        >
          登录
        </wd-button>
      </view>

      <!-- Divider -->
      <wd-divider>其他方式</wd-divider>

      <!-- Third-party Login -->
      <view class="third-party">
        <wd-button block plain @click="onWechatLogin" class="tp-btn">
          💚 微信登录
        </wd-button>
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

.phone-input {
  margin-bottom: 12px;
}

.code-row {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.code-input {
  flex: 1;
}

.code-btn {
  flex-shrink: 0;
}

.login-btn {
  margin-top: 8px;
}

/* Divider */


/* Third-party */
.third-party {
  margin-top: 16px;
}

.tp-btn {
  font-size: 14px;
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
