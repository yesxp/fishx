// EXIF 读取工具
// 自动从图片提取 GPS 坐标、拍摄时间

export interface ExifData {
  lat?: number
  lng?: number
  dateTime?: string
  make?: string
  model?: string
}

export async function readExif(filePath: string): Promise<ExifData> {
  // #ifdef H5
  // H5 环境使用 exifr 库（轻量、纯前端）
  try {
    const exifr = (await import('exifr')).default
    const data = await exifr.parse(filePath, { gps: true, pick: ['latitude', 'longitude', 'DateTimeOriginal', 'Make', 'Model'] })
    if (!data) return {}
    return {
      lat: data.latitude,
      lng: data.longitude,
      dateTime: data.DateTimeOriginal ? new Date(data.DateTimeOriginal).toISOString() : undefined,
      make: data.Make,
      model: data.Model,
    }
  } catch (e) {
    return {}
  }
  // #endif

  // #ifdef MP-WEIXIN
  // 小程序使用 getImageInfo + 手动解析 EXIF
  return new Promise((resolve) => {
    uni.getImageInfo({
      src: filePath,
      success: (res) => {
        // 微信小程序 EXIF 信息在 orientation 中
        // 完整的 EXIF GPS 解析需要原生插件
        resolve({
          dateTime: undefined, // 小程序不直接暴露 DateTimeOriginal
        })
      },
      fail: () => resolve({}),
    })
  })
  // #endif
}
