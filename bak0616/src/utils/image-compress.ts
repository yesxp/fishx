// 图片压缩工具
// 将图片压缩到目标大小以下

export function compressImage(
  filePath: string,
  maxWidth: number = 1920,
  quality: number = 0.8,
  maxSizeKB: number = 500
): Promise<string> {
  return new Promise((resolve, reject) => {
    // #ifdef H5
    // H5 环境使用 Canvas 压缩
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let width = img.width
      let height = img.height
      
      if (width > maxWidth) {
        height = (maxWidth / width) * height
        width = maxWidth
      }
      
      canvas.width = width
      canvas.height = height
      
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)
      
      // 递归尝试不同质量
      function tryCompress(q: number) {
        const dataUrl = canvas.toDataURL('image/jpeg', q)
        const sizeKB = Math.round(dataUrl.length * 3 / 4 / 1024)
        
        if (sizeKB <= maxSizeKB || q <= 0.1) {
          resolve(dataUrl)
        } else {
          tryCompress(q - 0.1)
        }
      }
      
      tryCompress(quality)
    }
    img.onerror = reject
    img.src = filePath
    // #endif
    
    // #ifdef MP-WEIXIN
    // 小程序环境使用 uni.compressImage
    uni.compressImage({
      src: filePath,
      quality: Math.round(quality * 100),
      success: (res) => resolve(res.tempFilePath),
      fail: reject
    })
    // #endif
  })
}

// 获取图片信息
export function getImageInfo(filePath: string): Promise<{
  width: number
  height: number
  path: string
}> {
  return new Promise((resolve, reject) => {
    uni.getImageInfo({
      src: filePath,
      success: resolve,
      fail: reject
    })
  })
}