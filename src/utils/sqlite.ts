// SQLite 适配器（基于 sql.js）
// 开发期：本地 SQLite 库（序列化为 base64 存 LocalStorage）
// 生产期：可热替换为 TCB MongoDB（通过 setStorageAdapter）

import initSqlJs, { type Database, type SqlJsStatic } from 'sql.js'
// @ts-ignore - sql.js 的 wasm 文件由 vite 静态资源处理
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url'

let SQL: SqlJsStatic | null = null
let db: Database | null = null

const DB_STORAGE_KEY = 'fishx_sqlite_db_base64'
const SCHEMA_VERSION_KEY = 'fishx_schema_version'
const CURRENT_SCHEMA_VERSION = '1.0'

/**
 * 初始化 sql.js 引擎
 */
async function loadSqlJs(): Promise<SqlJsStatic> {
  if (SQL) return SQL
  SQL = await initSqlJs({
    locateFile: () => wasmUrl,
  })
  return SQL
}

/**
 * 初始化数据库（首次启动执行 schema + 种子）
 */
export async function initDatabase(): Promise<Database> {
  if (db) return db

  const sql = await loadSqlJs()

  // 1. 尝试从 LocalStorage 恢复
  const saved = localStorage.getItem(DB_STORAGE_KEY)
  if (saved) {
    try {
      const binary = base64ToUint8Array(saved)
      db = new sql.Database(binary)
      console.log('[SQLite] 从 LocalStorage 恢复成功')
      return db
    } catch (e) {
      console.warn('[SQLite] 恢复失败，重新创建:', e)
    }
  }

  // 2. 新建空库
  db = new sql.Database()
  console.log('[SQLite] 新建空数据库')
  return db
}

/**
 * 持久化到 LocalStorage（序列化为 base64）
 */
export function persist(): void {
  if (!db) return
  const binary = db.export()
  const base64 = uint8ArrayToBase64(binary)
  try {
    localStorage.setItem(DB_STORAGE_KEY, base64)
    localStorage.setItem(SCHEMA_VERSION_KEY, CURRENT_SCHEMA_VERSION)
  } catch (e) {
    console.error('[SQLite] 持久化失败（可能超出 LocalStorage 容量）:', e)
  }
}

/**
 * 执行 SQL（无返回结果）
 */
export function exec(sql: string, params: any[] = []): void {
  if (!db) throw new Error('数据库未初始化，请先调用 initDatabase()')
  const stmt = db.prepare(sql)
  stmt.bind(params)
  stmt.step()
  stmt.free()
  persist()
}

/**
 * 查询（返回所有行）
 */
export function query<T = any>(sql: string, params: any[] = []): T[] {
  if (!db) throw new Error('数据库未初始化，请先调用 initDatabase()')
  const stmt = db.prepare(sql)
  stmt.bind(params)
  const rows: T[] = []
  while (stmt.step()) {
    rows.push(stmt.getAsObject() as T)
  }
  stmt.free()
  return rows
}

/**
 * 查询单行
 */
export function queryOne<T = any>(sql: string, params: any[] = []): T | null {
  const rows = query<T>(sql, params)
  return rows[0] || null
}

/**
 * 获取 db 实例（用于复杂操作）
 */
export function getDb(): Database {
  if (!db) throw new Error('数据库未初始化')
  return db
}

/**
 * 清空数据库（调试用）
 */
export function resetDatabase(): void {
  localStorage.removeItem(DB_STORAGE_KEY)
  localStorage.removeItem(SCHEMA_VERSION_KEY)
  if (db) {
    db.close()
    db = null
  }
  console.log('[SQLite] 数据库已重置')
}

// ========== 工具函数 ==========

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = ''
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64)
  const len = binary.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

// ========== 类型定义 ==========

export interface CatchRow {
  id: string
  user_id: string
  species_id: string | null
  species_name: string
  species_emoji: string
  species_confidence: number
  photo_urls: string  // JSON 数组
  primary_photo_index: number
  weight_estimated_g: number
  weight_g: number | null
  weight_confirmed: 0 | 1
  spot_geo_lat: number
  spot_geo_lng: number
  spot_name: string
  method: string
  bait: string  // JSON 数组
  mood_tags: string  // JSON 数组
  note: string
  caught_at: string
  created_at: string
  updated_at: string
}

export interface SpeciesRow {
  id: string
  zh_name: string
  emoji: string
  common_names: string
  scientific_name: string
  family: string
  difficulty: string
  water_layer: string
  feeding: string
  season: string
  weight_range: string
  distribution: string
  subtitle: string
  description: string
  one_fish_one_name: string
  fun_facts: string
  taste: string
  tactics: string
  copywriting_seeds: string
  related_species: string
  illustration_url: string | null
  created_at: string
  updated_at: string
}
