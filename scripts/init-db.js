/**
 * 腾讯云开发 - 数据库初始化脚本
 * 
 * 功能：
 * 1. 创建集合（spots, catches, reviews）
 * 2. 插入测试数据
 * 
 * 使用方法：
 *   node scripts/init-db.js
 */

const tcb = require('@cloudbase/node-sdk')
const path = require('path')
const fs = require('fs')

// 从 .env.local 读取配置
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local')
  if (!fs.existsSync(envPath)) {
    console.error('❌ 未找到 .env.local 文件')
    console.error('请创建 .env.local 文件，内容如下：')
    console.error('TCB_SECRET_ID=your_secret_id')
    console.error('TCB_SECRET_KEY=your_secret_key')
    console.error('TCB_ENV_ID=your_env_id')
    process.exit(1)
  }
  
  const content = fs.readFileSync(envPath, 'utf-8')
  const env = {}
  content.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key && value) {
      env[key.trim()] = value.trim()
    }
  })
  return env
}

const env = loadEnv()

// 配置
const config = {
  secretId: env.TCB_SECRET_ID,
  secretKey: env.TCB_SECRET_KEY,
  envId: env.TCB_ENV_ID,
}

// 初始化
const app = tcb.init(config)
const db = app.database()

// 要创建的集合
const collections = ['spots', 'catches', 'reviews']

// 测试钓点数据
const testSpots = [
  {
    name: '西湖钓点',
    type: 'lake',
    lat: 30.25,
    lng: 120.15,
    address: '浙江省杭州市西湖区西湖风景区',
    province: '浙江',
    city: '杭州',
    district: '西湖区',
    description: '风景优美，适合休闲垂钓',
    fish_types: ['鲫鱼', '鲤鱼', '草鱼'],
    images: [],
    tags: ['免费', '风景好'],
    emoji: '🏞️',
    rating: 4.8,
    review_count: 25,
    catch_count: 128,
    is_paid: false,
    is_pit: false,
    created_by: 'system',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    name: '老王钓场',
    type: 'pond',
    lat: 30.28,
    lng: 120.18,
    address: '浙江省杭州市余杭区良渚街道',
    province: '浙江',
    city: '杭州',
    district: '余杭区',
    description: '专业黑坑，鱼种丰富',
    fish_types: ['鲤鱼', '草鱼', '鲢鱼', '鳙鱼'],
    images: [],
    tags: ['收费', '黑坑'],
    emoji: '🐟',
    rating: 4.5,
    review_count: 18,
    catch_count: 89,
    is_paid: true,
    is_pit: true,
    created_by: 'system',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    name: '千岛湖大坝',
    type: 'wild',
    lat: 29.6,
    lng: 119.0,
    address: '浙江省杭州市淳安县千岛湖镇',
    province: '浙江',
    city: '杭州',
    district: '淳安县',
    description: '野钓胜地，大物频出',
    fish_types: ['鲤鱼', '草鱼', '青鱼', '翘嘴'],
    images: [],
    tags: ['免费', '野钓', '大物'],
    emoji: '⛰️',
    rating: 4.9,
    review_count: 42,
    catch_count: 203,
    is_paid: false,
    is_pit: false,
    created_by: 'system',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    name: '龙王塘',
    type: 'pond',
    lat: 30.32,
    lng: 120.22,
    address: '浙江省杭州市萧山区党湾镇',
    province: '浙江',
    city: '杭州',
    district: '萧山区',
    description: '老字号钓场，老板人好',
    fish_types: ['鲫鱼', '鲤鱼'],
    images: [],
    tags: ['收费', '黑坑', '老字号'],
    emoji: '🎣',
    rating: 4.2,
    review_count: 12,
    catch_count: 56,
    is_paid: true,
    is_pit: true,
    created_by: 'system',
    created_at: new Date(),
    updated_at: new Date(),
  },
]

async function initDatabase() {
  console.log('🐟 鱼渔娱 - 数据库初始化')
  console.log('========================\n')

  // 1. 创建集合
  console.log('📦 创建集合...')
  for (const collName of collections) {
    try {
      await db.createCollection(collName)
      console.log(`  ✅ ${collName} - 创建成功`)
    } catch (error) {
      if (error.message && error.message.includes('already exists')) {
        console.log(`  ⚠️  ${collName} - 已存在，跳过`)
      } else {
        console.log(`  ❌ ${collName} - 创建失败: ${error.message}`)
      }
    }
  }

  // 2. 插入测试数据
  console.log('\n📝 插入测试钓点数据...')
  try {
    const coll = db.collection('spots')
    
    // 先检查是否已有数据
    const existing = await coll.count()
    if (existing.total > 0) {
      console.log(`  ⚠️  spots 集合已有 ${existing.total} 条数据，跳过插入`)
    } else {
      for (const spot of testSpots) {
        await coll.add(spot)
        console.log(`  ✅ ${spot.name} - 插入成功`)
      }
      console.log(`  📊 共插入 ${testSpots.length} 条测试数据`)
    }
  } catch (error) {
    console.log(`  ❌ 插入失败: ${error.message}`)
  }

  console.log('\n🎉 初始化完成！')
  console.log('========================')
  console.log('\n下一步：')
  console.log('1. 访问 https://fishx.lxapp.com 查看钓点页面')
  console.log('2. 在云开发控制台查看数据')
}

// 执行
initDatabase().catch(console.error)
