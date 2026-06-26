// 存储抽象层
// 开发期：SQLite (sql.js) + IndexedDB Blob
// 生产期：可热替换为 TCB MongoDB + 云存储

import { initDatabase, query, exec, queryOne, persist } from './sqlite'
import { initSchema } from './sqlite-init'

let initialized = false

/**
 * 应用启动时初始化（确保数据库就绪）
 */
export async function bootstrap(): Promise<void> {
  if (initialized) return
  await initDatabase()
  initSchema()
  initialized = true
  console.log('[Storage] 启动完成')
}

// ========== 业务封装（SQLite 实现）==========

export const catchStore = {
  /**
   * 列出所有鱼获（按时间倒序）
   */
  list() {
    return query<any>('SELECT * FROM catches ORDER BY caught_at DESC')
  },

  /**
   * 按 ID 获取
   */
  get(id: string) {
    return queryOne<any>('SELECT * FROM catches WHERE id = ?', [id])
  },

  /**
   * 按鱼种分组统计
   */
  statsBySpecies() {
    return query<any>(
      `SELECT species_id, species_name, species_emoji,
              COUNT(*) as count, MAX(weight_g) as best_weight
       FROM catches
       GROUP BY species_id
       ORDER BY count DESC`
    )
  },

  /**
   * 保存（新插入）
   */
  save(record: any) {
    exec(
      `INSERT INTO catches (
        id, user_id, species_id, species_name, species_emoji, species_confidence,
        photo_urls, primary_photo_index, weight_estimated_g, weight_g, weight_confirmed,
        spot_geo_lat, spot_geo_lng, spot_name, weather, method, bait, mood_tags, note,
        caught_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        record.id,
        record.user_id || 'dev_user',
        record.species_id || null,
        record.species_name,
        record.species_emoji,
        record.species_confidence || 0,
        JSON.stringify(record.photo_urls || []),
        record.primary_photo_index || 0,
        record.weight_estimated_g || 0,
        record.weight_g || null,
        record.weight_confirmed ? 1 : 0,
        record.spot_geo_lat,
        record.spot_geo_lng,
        record.spot_name || '',
        record.weather ? JSON.stringify(record.weather) : null,
        record.method || '',
        JSON.stringify(record.bait || []),
        JSON.stringify(record.mood_tags || []),
        record.note || '',
        record.caught_at || new Date().toISOString(),
      ]
    )
    return record
  },

  /**
   * 删除
   */
  remove(id: string) {
    exec('DELETE FROM catches WHERE id = ?', [id])
  },

  /**
   * 按月分组
   */
  groupByMonth() {
    const all = this.list()
    const groupMap = new Map<string, any[]>()
    all.forEach(c => {
      const d = new Date(c.caught_at)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (!groupMap.has(key)) groupMap.set(key, [])
      groupMap.get(key)!.push(c)
    })
    return Array.from(groupMap.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([month, items]) => ({ month, items }))
  },
}

export const speciesStore = {
  list() {
    return query<any>('SELECT * FROM fish_species ORDER BY id')
  },

  get(id: string) {
    return queryOne<any>('SELECT * FROM fish_species WHERE id = ?', [id])
  },

  getByName(name: string) {
    return queryOne<any>('SELECT * FROM fish_species WHERE zh_name = ?', [name])
  },

  related(species: any) {
    if (!species.related_species) return []
    const ids: string[] = JSON.parse(species.related_species)
    if (ids.length === 0) return []
    const placeholders = ids.map(() => '?').join(',')
    return query<any>(
      `SELECT * FROM fish_species WHERE id IN (${placeholders})`,
      ids
    )
  },
}

export const userStore = {
  get() {
    return {
      id: 'dev_user',
      nickname: '开发者',
      avatar: '',
    }
  },
  set(_user: any) {
    // 暂不持久化用户（开发期固定 dev_user）
  },
}
