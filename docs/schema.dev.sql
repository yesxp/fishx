-- FishX SQLite Schema
-- 本地开发用，存于 docs/dev.sqlite
-- 未来 TCB 迁移到 MongoDB 集合（spots / catches / fish_species）

-- ============================================
-- 1. fish_species (鱼种百科)
-- ============================================
CREATE TABLE IF NOT EXISTS fish_species (
  id                    TEXT PRIMARY KEY,                    -- sp-001
  zh_name               TEXT NOT NULL,                       -- 鲫鱼
  emoji                 TEXT,                                -- 🐟
  common_names          TEXT,                                -- JSON: ["鲫瓜子","月鲫"]
  scientific_name       TEXT,                                -- Carassius auratus
  family                TEXT,                                -- 鲤科 Cyprinidae · 鲫属
  difficulty            TEXT,                                -- 易/中/难
  water_layer           TEXT,                                -- 底层
  feeding               TEXT,                                -- 杂食
  season                TEXT,                                -- JSON: ["春","夏","秋"]
  weight_range          TEXT,                                -- "0.2-1.0kg"
  distribution          TEXT,                                -- 全国淡水水域
  subtitle              TEXT,                                -- 钩子疑问句
  description           TEXT,                                -- 鱼种简介
  one_fish_one_name     TEXT,                                -- 名字由来
  fun_facts             TEXT,                                -- 钓鱼趣闻
  taste                 TEXT,                                -- 食用价值
  tactics               TEXT,                                -- 钓法技巧
  copywriting_seeds     TEXT,                                -- JSON: {得意:[], 谦虚:[], ...}
  illustration_url      TEXT,                                -- 标准照 URL（V1.1）
  related_species       TEXT,                                -- JSON: ["sp-002","sp-003"]
  created_at            TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at            TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_species_zh_name ON fish_species(zh_name);
CREATE INDEX idx_species_family ON fish_species(family);

-- ============================================
-- 2. catches (鱼获记录)
-- ============================================
CREATE TABLE IF NOT EXISTS catches (
  id                    TEXT PRIMARY KEY,
  user_id               TEXT NOT NULL,
  species_id            TEXT NOT NULL,

  -- 核心数据
  photo_urls            TEXT NOT NULL,                       -- JSON
  primary_photo_index   INTEGER NOT NULL DEFAULT 0,
  weight_estimated_g    INTEGER,
  weight_g              INTEGER,
  weight_confirmed      INTEGER NOT NULL DEFAULT 0,

  -- AI 识别
  species_confidence    REAL,
  species_candidates    TEXT,                                -- JSON
  species_corrected     INTEGER NOT NULL DEFAULT 0,

  -- 时间
  caught_at             TEXT NOT NULL,
  created_at            TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at            TEXT NOT NULL DEFAULT (datetime('now')),

  -- 环境
  spot_geo_lat          REAL,
  spot_geo_lng          REAL,
  spot_name             TEXT,
  spot_id               TEXT,
  weather               TEXT,                                -- JSON
  tide                  TEXT,                                -- JSON

  -- 钓法
  method                TEXT,
  bait                  TEXT,                                -- JSON
  rig                   TEXT,

  -- 心情
  mood_tags             TEXT,                                -- JSON
  note                  TEXT,

  -- 分享
  share_count           INTEGER NOT NULL DEFAULT 0,
  shared_at             TEXT,
  user_copywriting      TEXT,                                -- JSON

  FOREIGN KEY (species_id) REFERENCES fish_species(id)
);

CREATE INDEX idx_catches_user_species ON catches(user_id, species_id);
CREATE INDEX idx_catches_user_time    ON catches(user_id, caught_at DESC);
CREATE INDEX idx_catches_spot_geo     ON catches(spot_geo_lat, spot_geo_lng);
CREATE INDEX idx_catches_user_created ON catches(user_id, created_at DESC);

-- ============================================
-- 3. 视图：鱼获 + 鱼种摘要
-- ============================================
CREATE VIEW IF NOT EXISTS v_catches_with_species AS
SELECT
  c.*,
  s.zh_name      AS species_name,
  s.emoji        AS species_emoji,
  s.difficulty   AS species_difficulty,
  s.water_layer  AS species_water_layer,
  s.feeding      AS species_feeding,
  s.family       AS species_family,
  s.subtitle     AS species_subtitle
FROM catches c
LEFT JOIN fish_species s ON c.species_id = s.id;

-- ============================================
-- 4. 视图：鱼种解锁 + 战绩（运行时计算）
-- ============================================
CREATE VIEW IF NOT EXISTS v_species_user_stats AS
SELECT
  s.id              AS species_id,
  s.zh_name         AS species_name,
  s.emoji           AS species_emoji,
  s.family          AS species_family,
  c.user_id         AS user_id,
  COUNT(c.id)       AS catch_count,
  MAX(c.weight_g)   AS best_weight_g,
  MIN(c.caught_at)  AS first_caught_at,
  MAX(c.caught_at)  AS last_caught_at,
  CASE WHEN COUNT(c.id) > 0 THEN 1 ELSE 0 END AS is_unlocked
FROM fish_species s
LEFT JOIN catches c ON c.species_id = s.id
GROUP BY s.id, c.user_id;

-- ============================================
-- 5. spots (钓点 - V2 启用)
-- ============================================
-- 见 docs/DATABASE.md
