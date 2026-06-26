// 鱼种数据（从 fish-species-seed.sql 提取）
// 开发期：硬编码在 storage 初始化
// 生产期：从 TCB MongoDB 加载

import { speciesStore } from '@/utils/storage'

export interface SpeciesData {
  id: string
  zh_name: string
  emoji: string
  common_names: string[]
  scientific_name: string
  family: string
  difficulty: '易' | '中' | '难'
  water_layer: '上' | '中' | '下' | '中上' | '中下' | '底层'
  feeding: '杂食' | '肉食' | '草食'
  season: string[]
  weight_range: string
  distribution: string
  subtitle: string
  description: string
  one_fish_one_name: string
  fun_facts: string
  taste: string
  tactics: string
  copywriting_seeds: Record<string, string[]>
  related_species: string[]
}

export const ALL_SPECIES: SpeciesData[] = [
  {
    id: 'sp-001',
    zh_name: '鲫鱼',
    emoji: '🐟',
    common_names: ['鲫瓜子', '河鲫', '月鲫'],
    scientific_name: 'Carassius auratus',
    family: '鲤科',
    difficulty: '易',
    water_layer: '底层',
    feeding: '杂食',
    season: ['春', '夏', '秋', '冬'],
    weight_range: '0.2-1.0kg',
    distribution: '全国淡水水域',
    subtitle: '为什么北方钓友管它叫"鲫瓜子"？',
    description: '我国最常见、分布最广的淡水鱼之一。适应力极强，号称"淡水小强"。群居、杂食偏植物，从南到北四季可钓。',
    one_fish_one_name: '因体侧扁、背隆起、形似瓜子而得名"鲫瓜子"。古书写作"鲒鱼"（鳞大而少）。南方俗称"河鲫"、"月鲫"。',
    fun_facts: '🌿 耐低氧极强，新手第一条鱼多是它\n🍃 冬季其他鱼不咬钩时它仍咬\n🎣 "鲫鱼"是钓鱼的入门老师',
    taste: '"春吃鲫夏吃鲤"。春季最肥美，炖汤奶白鲜甜，传统食疗圣品。刺多但肉嫩。',
    tactics: '台钓万能组合：商品饵+蚯蚓双钩，一荤一素。夏秋早晚最佳；冬季红虫/蚯蚓深水钓底。',
    copywriting_seeds: {
      proud: ['今日大丰收！鲫鱼上钩，钓王就是我！', '手感来了挡不住，鲫鱼乖乖入护！'],
      modest: ['运气不错，遇到一条鲫鱼，新手报到~', '新人第一鱼，感谢前辈指点！'],
      funny: ['鲫鱼：你拽我干嘛？我在水里多自由！', '我和鲫鱼的对视：它眼里是恐惧，我眼里是午饭。'],
      artistic: ['暮色四合，一竿独钓，鲫鱼跃出水面。', '静水留痕，钓鱼人的浪漫。'],
      minimal: ['鲫一尾。', '获。'],
    },
    related_species: ['sp-002', 'sp-003', 'sp-008'],
  },
  {
    id: 'sp-002',
    zh_name: '鲤鱼',
    emoji: '🐠',
    common_names: ['鲤子', '拐子', '红尾'],
    scientific_name: 'Cyprinus carpio',
    family: '鲤科',
    difficulty: '中',
    water_layer: '底层',
    feeding: '杂食',
    season: ['春', '夏', '秋'],
    weight_range: '0.5-5.0kg',
    distribution: '全国淡水水域',
    subtitle: '为什么老一辈说"鲤鱼跃龙门"是好兆头？',
    description: '我国养殖最早、最广泛的淡水鱼之一。力气大、劲头足，溜鱼时手感爆棚。杂食偏腥香，底层觅食，警惕性高。',
    one_fish_one_name: '古称"鳣"，因鳞片大而得名"鲤"。"鲤"通"利"，民间视为吉祥鱼。北方叫"拐子"，南方称"红尾"。',
    fun_facts: '🐉 跳龙门传说主角\n🧠 记忆里强，钓过的塘难再钓\n💪 力气大，3 斤的鲤能拉断线',
    taste: '"夏吃鲤"夏季肥美，红烧糖醋皆可。刺少肉紧，做鱼丸上选。',
    tactics: '重窝守钓：玉米+红薯+商品饵打大窝。子线长，钓钝抓死口。',
    copywriting_seeds: {
      proud: ['鲤鱼王来了！3 斤的力气，差点拉下水！', '大力士在手，天下我有！'],
      modest: ['新手钓到一条大鲤，溜了 10 分钟才上岸。', '运气的眷顾。'],
      funny: ['鲤鱼：你干嘛！我可是要跳龙门的！', '我和鲤鱼拔河 3 分钟，它认输了。'],
      artistic: ['水下舞者，金鳞闪烁，跃出水面一瞬定格永恒。', '力量与美的交织。'],
      minimal: ['鲤。', '大力出奇迹。'],
    },
    related_species: ['sp-001', 'sp-003', 'sp-008'],
  },
  {
    id: 'sp-003',
    zh_name: '草鱼',
    emoji: '🐡',
    common_names: ['草鲩', '白鲩', '厚子'],
    scientific_name: 'Ctenopharyngodon idella',
    family: '鲤科',
    difficulty: '中',
    water_layer: '中下层',
    feeding: '草食',
    season: ['夏', '秋'],
    weight_range: '1.0-10.0kg',
    distribution: '全国主要水系',
    subtitle: '为什么草鱼是钓鱼人最期待的"大物"？',
    description: '典型的草食性鱼，体型大、力量足。中下层活动，夏季最活跃。喜食水草、芦苇、嫩叶。',
    one_fish_one_name: '因主食水草而得名"草鱼"。广东称"鲩"（音混），北方叫"白鲩"。古书"鰀"即此鱼。',
    fun_facts: '🌿 一天能吃自身体重 30% 的草\n💨 受惊会跃出水面 1 米多\n🎣 5 斤以上大草是很多钓友的"毕业鱼"',
    taste: '肉厚刺少，清蒸最佳。水煮鱼、酸菜鱼常用鱼。',
    tactics: '打草窝：岸边割嫩草捆成把投入钓点。浮钓/半水钓，玉米/麦粒/商品饵。',
    copywriting_seeds: {
      proud: ['草鱼大物！8 斤的冲刺，肾上腺素爆表！', '巨物上岸，今天圆满了！'],
      modest: ['偶遇大物，幸运之神眷顾。', '学习路上又进一步。'],
      funny: ['草鱼：你不就想钓我吗？我来了！', '5 分钟的拉锯战，我的手还在抖。'],
      artistic: ['水中骏马，奔腾而出。', '力量与优雅并存。'],
      minimal: ['草。', '大物。'],
    },
    related_species: ['sp-001', 'sp-002', 'sp-008'],
  },
  {
    id: 'sp-004',
    zh_name: '鲈鱼',
    emoji: '🎏',
    common_names: ['鲈子', '花鲈', '七星鲈'],
    scientific_name: 'Lateolabrax japonicus',
    family: '鮨科',
    difficulty: '中',
    water_layer: '中上层',
    feeding: '肉食',
    season: ['春', '秋', '冬'],
    weight_range: '0.5-3.0kg',
    distribution: '沿海及河口',
    subtitle: '为什么路亚人都梦想钓到一条大鲈？',
    description: '路亚对象鱼之王。凶猛肉食性，攻击拟饵瞬间刺激无比。分海鲈（咸水）和淡水鲈（加州鲈）。',
    one_fish_one_name: '范仲淹"江上往来人，但爱鲈鱼美"千古传诵。晋代张翰因思鲈鱼弃官，"莼鲈之思"成典故。',
    fun_facts: '⚔️ 攻击瞬间可爆发 10 倍体重拉力\n🎯 视觉捕食，对拟饵动作极敏感\n🌊 咸淡水两栖',
    taste: '清蒸最佳，肉质鲜嫩。江南名菜"松鼠鳜鱼"近亲。',
    tactics: '路亚：米诺/波趴/VIB 早晚窗口期岸边搜索。警惕障碍区。',
    copywriting_seeds: {
      proud: ['路亚之王！鲈鱼爆钓，手感炸裂！', '这一口，值了！'],
      modest: ['学习路亚半年，第一条鲈。', '感谢钓友指点。'],
      funny: ['鲈鱼：你这塑料鱼骗我？上当！', '我假装是条鱼，它假装咬了一口。'],
      artistic: ['海风轻拂，水面涟漪，鲈鱼破水而出。', '战斗瞬间的完美定格。'],
      minimal: ['🎣', '获。'],
    },
    related_species: ['sp-005', 'sp-007'],
  },
  {
    id: 'sp-005',
    zh_name: '翘嘴',
    emoji: '🐟',
    common_names: ['翘嘴鲌', '白鱼', '翘壳'],
    scientific_name: 'Culter alburnus',
    family: '鲤科',
    difficulty: '中',
    water_layer: '中上层',
    feeding: '肉食',
    season: ['夏', '秋'],
    weight_range: '0.3-2.0kg',
    distribution: '全国主要水系',
    subtitle: '为什么翘嘴被称为"淡水中的飞鱼"？',
    description: '路亚热门对象鱼。体型侧扁，嘴部上翘，故名。群居、巡游水面捕食小鱼虾。',
    one_fish_one_name: '因下颌短、上颌长，形成"翘嘴"特征。湖南叫"翘壳"，东北叫"白鱼"。古书"鱮"即此鱼。',
    fun_facts: '💨 跃出水面能力强，可跳 1 米多\n🌅 晨昏窗口期最活跃\n⚔️ 米诺/亮片是它的克星',
    taste: '肉细刺多，煎炸最佳。湖南名菜"翘嘴鱼火锅"。',
    tactics: '路亚：亮片/米诺水面系早晚窗口期。铁板竿快抽收线。',
    copywriting_seeds: {
      proud: ['翘嘴爆钓！连续 5 尾，爽到飞起！', '我的饵它抢着咬！'],
      modest: ['新手第一次路亚，遇到了爆口窗口。', '感谢前辈带路。'],
      funny: ['翘嘴：你这亮片好闪！我咬！', '我和翘嘴的 30 分钟：它跑我追，它追我跑。'],
      artistic: ['晨曦中银光一闪，翘嘴破水而出。', '自然之舞，力量之美。'],
      minimal: ['翘。', '连竿。'],
    },
    related_species: ['sp-002', 'sp-003', 'sp-004'],
  },
  {
    id: 'sp-006',
    zh_name: '罗非',
    emoji: '🐠',
    common_names: ['非洲鲫', '福寿鱼', '越南鱼'],
    scientific_name: 'Oreochromis mossambicus',
    family: '丽鱼科',
    difficulty: '易',
    water_layer: '中下层',
    feeding: '杂食',
    season: ['夏', '秋'],
    weight_range: '0.2-1.5kg',
    distribution: '南方水域为主',
    subtitle: '为什么南方水库里罗非这么多？',
    description: '外来物种，原产非洲。南方水库泛滥，繁殖力极强。耐热不耐寒，10°C 以下死亡。',
    one_fish_one_name: '原产非洲莫桑比克，1956 年引入广东。因形似鲫鱼而称"非洲鲫"，后改名"罗非"（罗 = 越南，非 = 非洲）。',
    fun_facts: '🌡️ 怕冷，南方专属\n🐟 母鱼口孵小鱼\n🚫 北方水域少见',
    taste: '肉质粗但鲜美，红烧或做鱼丸。刺少适合老人小孩。',
    tactics: '商品饵/蚯蚓/玉米皆可。南方水库爆钓对象，警惕小罗非闹窝。',
    copywriting_seeds: {
      proud: ['罗非爆护！20 尾入护，今天伙食解决！', '南方的鱼，就是这么容易上钩！'],
      modest: ['新手友好鱼种，南方钓友入门首选。', '小罗非也有大快乐。'],
      funny: ['罗非：你以为你是鲫鱼？我可不是！', '我钓的不是鱼，是南方夏天的记忆。'],
      artistic: ['热带风情，碧水蓝天，罗非逐浪。', '南方的夏天味道。'],
      minimal: ['罗非。', '南。'],
    },
    related_species: ['sp-001', 'sp-007'],
  },
  {
    id: 'sp-007',
    zh_name: '鲶鱼',
    emoji: '🐡',
    common_names: ['鲶拐', '土鲶', '胡子鱼'],
    scientific_name: 'Silurus asotus',
    family: '鲶科',
    difficulty: '中',
    water_layer: '底层',
    feeding: '肉食',
    season: ['春', '夏', '秋'],
    weight_range: '0.5-5.0kg',
    distribution: '全国主要水系',
    subtitle: '为什么鲶鱼被叫"水中老虎"？',
    description: '凶猛底栖肉食鱼。嘴大、须长（味觉器官），夜行性，喜食腐肉和小鱼。',
    one_fish_one_name: '因口周有须如猫须而名"鲶"（一说因黏滑得名）。广东叫"塘虱"，东北叫"怀头"。',
    fun_facts: '🌙 夜行性，白天藏在深水\n🧔 8 根胡须是味觉器官\n💀 大口吞食，钩入喉难摘',
    taste: '肉质细嫩无刺，红烧或炖汤。广州"塘虱煲仔饭"是名小吃。',
    tactics: '夜钓最佳：鸡肝/蚯蚓/小鱼块。沉底钓，耐心等。',
    copywriting_seeds: {
      proud: ['大鲶上岸！3 斤的水中老虎！', '夜钓之王，舍我其谁！'],
      modest: ['夜钓偶遇，惊喜连连。', '大物可遇不可求。'],
      funny: ['鲶鱼：谁在扰我清梦？', '我和鲶鱼的拔河：它赢了 5 分钟。'],
      artistic: ['夜色深沉，鲶鱼破水而出。', '暗夜中的精灵。'],
      minimal: ['鲶。', '夜获。'],
    },
    related_species: ['sp-004', 'sp-006'],
  },
  {
    id: 'sp-008',
    zh_name: '鳊鱼',
    emoji: '🎏',
    common_names: ['长春鳊', '鳊花', '武昌鱼'],
    scientific_name: 'Parabramis pekinensis',
    family: '鲤科',
    difficulty: '易',
    water_layer: '中下层',
    feeding: '杂食',
    season: ['春', '夏', '秋'],
    weight_range: '0.3-2.0kg',
    distribution: '全国主要水系',
    subtitle: '为什么"武昌鱼"能写进毛主席的诗里？',
    description: '因毛主席"才饮长沙水，又食武昌鱼"而名满天下。中下层群居鱼，杂食偏植物。',
    one_fish_one_name: '古称"鳊"（《诗经》"其鱼鲂鳊"）。鄂州樊口产的最有名，称"武昌鱼"（樊口古属武昌）。',
    fun_facts: '🏛️ 毛主席诗词加持\n🐟 群居，钓到一条往往连竿\n🌿 食草为主，警惕小杂鱼闹窝',
    taste: '"清蒸武昌鱼"是湖北名菜，肉细嫩、刺少。',
    tactics: '商品饵/麦粒/玉米守钓。浮钓半水，警惕小杂鱼。',
    copywriting_seeds: {
      proud: ['武昌鱼！连竿 3 尾，主席也爱这口！', '群居的快乐，懂的都懂！'],
      modest: ['偶遇武昌鱼群，小确幸。', '群鱼之美。'],
      funny: ['武昌鱼：主席都夸我！', '我和武昌鱼的不解之缘。'],
      artistic: ['江南水乡，碧波荡漾，鳊鱼成群。', '诗意栖息。'],
      minimal: ['鳊。', '群。'],
    },
    related_species: ['sp-001', 'sp-002', 'sp-003'],
  },
]

/**
 * 初始化鱼种数据到 storage（开发期只执行一次）
 */
export function initSpeciesData() {
  const existing = speciesStore.list()
  if (existing.length === 0) {
    speciesStore.setAll(ALL_SPECIES)
  }
}

/**
 * 通过 ID 获取鱼种
 */
export function getSpeciesById(id: string): SpeciesData | null {
  // 优先从 storage 读取
  const fromStorage = speciesStore.get(id)
  if (fromStorage) return fromStorage as SpeciesData
  // fallback 到硬编码
  return ALL_SPECIES.find(s => s.id === id) || null
}

/**
 * 通过同科查找相关鱼种
 */
export function getRelatedByFamily(species: SpeciesData): SpeciesData[] {
  return ALL_SPECIES
    .filter(s => s.family === species.family && s.id !== species.id)
    .slice(0, 4)
}

/**
 * 通过 related_species 字段查找
 */
export function getRelatedByField(species: SpeciesData): SpeciesData[] {
  return species.related_species
    .map(id => getSpeciesById(id))
    .filter((s): s is SpeciesData => s !== null)
}
