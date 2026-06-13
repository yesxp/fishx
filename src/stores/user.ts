import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const userInfo = ref<any>(null)
  const isLoggedIn = ref(false)

  // 设置登录信息
  function setLoginInfo(t: string, user: any) {
    token.value = t
    userInfo.value = user
    isLoggedIn.value = true
    uni.setStorageSync('token', t)
    uni.setStorageSync('userInfo', JSON.stringify(user))
  }

  // 检查登录状态
  function checkLogin() {
    const t = uni.getStorageSync('token')
    const u = uni.getStorageSync('userInfo')
    if (t) {
      token.value = t
      isLoggedIn.value = true
      if (u) {
        try {
          userInfo.value = JSON.parse(u)
        } catch (e) {
          userInfo.value = null
        }
      }
      return true
    }
    return false
  }

  // 退出登录
  function logout() {
    token.value = ''
    userInfo.value = null
    isLoggedIn.value = false
    uni.removeStorageSync('token')
    uni.removeStorageSync('userInfo')
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    setLoginInfo,
    checkLogin,
    logout
  }
})