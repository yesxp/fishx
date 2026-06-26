// 存储抽象层
// 开发期：LocalStorage
// 生产期：可替换为 SQLite (sql.js) / TCB MongoDB / IndexedDB

const STORAGE_PREFIX = 'fishx_'

export interface StorageAdapter {
  get<T = any>(key: string): T | null
  set(key: string, value: any): void
  remove(key: string): void
  clear(): void
  list(prefix?: string): string[]
}

/**
 * LocalStorage 适配器（开发期）
 */
export const localStorageAdapter: StorageAdapter = {
  get<T = any>(key: string): T | null {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },
  set(key: string, value: any): void {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
  },
  remove(key: string): void {
    localStorage.removeItem(STORAGE_PREFIX + key)
  },
  clear(): void {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(STORAGE_PREFIX))
    keys.forEach(k => localStorage.removeItem(k))
  },
  list(prefix?: string): string[] {
    const pre = STORAGE_PREFIX + (prefix || '')
    return Object.keys(localStorage)
      .filter(k => k.startsWith(pre))
      .map(k => k.slice(STORAGE_PREFIX.length))
  },
}

// 当前使用的 adapter（可热替换）
let currentAdapter: StorageAdapter = localStorageAdapter

export function setStorageAdapter(adapter: StorageAdapter) {
  currentAdapter = adapter
}

export function getStorageAdapter(): StorageAdapter {
  return currentAdapter
}

// ========== 业务封装 ==========

export const catchStore = {
  list() {
    return currentAdapter.get<any[]>('catches') || []
  },
  save(record: any) {
    const list = currentAdapter.get<any[]>('catches') || []
    list.unshift(record)
    currentAdapter.set('catches', list)
    return record
  },
  get(id: string) {
    return this.list().find((c: any) => c.id === id) || null
  },
  remove(id: string) {
    const list = this.list().filter((c: any) => c.id !== id)
    currentAdapter.set('catches', list)
  },
}

export const speciesStore = {
  list() {
    return currentAdapter.get<any[]>('species') || []
  },
  get(id: string) {
    return this.list().find((s: any) => s.id === id) || null
  },
  setAll(list: any[]) {
    currentAdapter.set('species', list)
  },
}

export const userStore = {
  get() {
    return currentAdapter.get<any>('user') || {
      id: 'dev_user',
      nickname: '开发者',
      avatar: '',
    }
  },
  set(user: any) {
    currentAdapter.set('user', user)
  },
}
