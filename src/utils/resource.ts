// 资源存储（IndexedDB Blob）
// 开发期：本地"upload 目录"（IndexedDB）
// 生产期：可热替换为 TCB 云存储

const DB_NAME = 'fishx_resources'
const DB_VERSION = 1
const STORE_NAME = 'blobs'

let dbPromise: Promise<IDBDatabase> | null = null

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
  return dbPromise
}

export interface ResourceMeta {
  id: string
  type: 'image' | 'video' | 'audio' | 'other'
  mime: string
  size: number
  createdAt: string
}

/**
 * 上传资源（存 IndexedDB Blob）
 * @returns resource_id
 */
export async function upload(blob: Blob, type: ResourceMeta['type'] = 'image'): Promise<string> {
  const db = await openDB()
  const id = `res_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const meta: ResourceMeta = {
    id,
    type,
    mime: blob.type,
    size: blob.size,
    createdAt: new Date().toISOString(),
  }
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    // 存 { blob, meta } 对象
    store.put({ blob, meta }, id)
    tx.oncomplete = () => resolve(id)
    tx.onerror = () => reject(tx.error)
  })
}

/**
 * 获取 Blob
 */
export async function getBlob(id: string): Promise<Blob | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const req = store.get(id)
    req.onsuccess = () => {
      const data = req.result
      resolve(data ? (data.blob as Blob) : null)
    }
    req.onerror = () => reject(req.error)
  })
}

/**
 * 获取资源元信息
 */
export async function getMeta(id: string): Promise<ResourceMeta | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const req = store.get(id)
    req.onsuccess = () => {
      const data = req.result
      resolve(data ? (data.meta as ResourceMeta) : null)
    }
    req.onerror = () => reject(req.error)
  })
}

/**
 * 获取 ObjectURL（用于 <img src>）
 * 注意：调用方负责 URL.revokeObjectURL
 */
export async function getObjectURL(id: string): Promise<string | null> {
  const blob = await getBlob(id)
  if (!blob) return null
  return URL.createObjectURL(blob)
}

/**
 * 删除资源
 */
export async function remove(id: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    store.delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

/**
 * 批量删除
 */
export async function removeMany(ids: string[]): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    ids.forEach(id => store.delete(id))
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

/**
 * 列出所有资源 ID（用于搬迁）
 */
export async function listAll(): Promise<string[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const req = store.getAllKeys()
    req.onsuccess = () => resolve(req.result as string[])
    req.onerror = () => reject(req.error)
  })
}

/**
 * 估算总占用（字节）
 */
export async function estimateSize(): Promise<number> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const req = store.getAll()
    req.onsuccess = () => {
      const items = req.result as Array<{ blob: Blob }>
      const total = items.reduce((sum, item) => sum + (item.blob?.size || 0), 0)
      resolve(total)
    }
    req.onerror = () => reject(req.error)
  })
}

/**
 * 工具：把 file path / temp file 转为 Blob
 */
export async function filePathToBlob(filePath: string): Promise<Blob> {
  // H5 环境
  if (filePath.startsWith('blob:') || filePath.startsWith('data:')) {
    const res = await fetch(filePath)
    return res.blob()
  }
  // #ifdef H5
  // 从 URL 抓取图片
  const res = await fetch(filePath)
  return res.blob()
  // #endif

  // #ifdef MP-WEIXIN
  // 小程序：需要先读取文件
  return new Promise((resolve, reject) => {
    uni.getFileSystemManager().readFile({
      filePath,
      success: (res) => {
        // res.data 是 ArrayBuffer
        resolve(new Blob([res.data as ArrayBuffer]))
      },
      fail: reject,
    })
  })
  // #endif
}
