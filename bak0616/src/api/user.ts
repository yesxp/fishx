// 用户相关 API

// 微信登录
export async function wxLogin(code: string) {
  // 模拟 API 调用
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: {
          token: 'mock_token_' + Date.now(),
          userInfo: {
            id: 'wx_' + Math.random().toString(36).substr(2, 9),
            nickname: '微信用户',
            avatar: '',
            phone: ''
          }
        }
      })
    }, 500)
  })
}

// 手机号验证码登录
export async function sendSmsCode(phone: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: '验证码已发送'
      })
    }, 300)
  })
}

export async function phoneLogin(phone: string, code: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: {
          token: 'mock_token_' + Date.now(),
          userInfo: {
            id: 'phone_' + Math.random().toString(36).substr(2, 9),
            nickname: '手机用户',
            avatar: '',
            phone: phone
          }
        }
      })
    }, 500)
  })
}