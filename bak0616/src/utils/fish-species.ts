// 常见淡水鱼种列表（Top 20）

export interface FishSpecies {
  id: string
  name: string
  emoji: string
  category: string
}

export const FISH_SPECIES: FishSpecies[] = [
  { id: 'crucian', name: '鲫鱼', emoji: '🐟', category: '淡水' },
  { id: 'carp', name: '鲤鱼', emoji: '🐠', category: '淡水' },
  { id: 'grass', name: '草鱼', emoji: '🐟', category: '淡水' },
  { id: 'silver', name: '鲢鱼', emoji: '🐟', category: '淡水' },
  { id: 'bighead', name: '鳙鱼', emoji: '🐟', category: '淡水' },
  { id: 'bass', name: '鲈鱼', emoji: '🐠', category: '淡水' },
  { id: 'snakehead', name: '黑鱼', emoji: '🐡', category: '淡水' },
  { id: 'catfish', name: '鲶鱼', emoji: '🐟', category: '淡水' },
  { id: 'tilapia', name: '罗非鱼', emoji: '🐠', category: '淡水' },
  { id: 'mandarin', name: '鳜鱼', emoji: '🐠', category: '淡水' },
  { id: 'asp', name: '翘嘴', emoji: '🐟', category: '淡水' },
  { id: 'tench', name: '鲮鱼', emoji: '🐟', category: '淡水' },
  { id: 'bream', name: '鳊鱼', emoji: '🐟', category: '淡水' },
  { id: 'eel', name: '黄鳝', emoji: '🐍', category: '淡水' },
  { id: 'loach', name: '泥鳅', emoji: '🐛', category: '淡水' },
  { id: 'trout', name: '鳟鱼', emoji: '🐠', category: '淡水' },
  { id: 'pike', name: '狗鱼', emoji: '🐠', category: '淡水' },
  { id: 'white', name: '白条', emoji: '🐟', category: '淡水' },
  { id: 'red', name: '红尾', emoji: '🐟', category: '淡水' },
  { id: 'other', name: '其他', emoji: '🎣', category: '其他' },
]

// 根据名称查找鱼种
export function findFishByName(name: string): FishSpecies | undefined {
  return FISH_SPECIES.find(f => f.name === name || name.includes(f.name))
}

// 根据 ID 查找鱼种
export function findFishById(id: string): FishSpecies | undefined {
  return FISH_SPECIES.find(f => f.id === id)
}