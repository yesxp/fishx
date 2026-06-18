// 云函数：获取钓点列表
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { type, city, page = 1, pageSize = 20 } = event
  
  try {
    let query = db.collection('spots')
    
    // 类型筛选
    if (type && type !== '全部') {
      query = query.where({ type })
    }
    
    // 城市筛选
    if (city) {
      query = query.where({ city })
    }
    
    // 分页
    const skip = (page - 1) * pageSize
    const result = await query
      .orderBy('created_at', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get()
    
    return {
      code: 0,
      data: result.data,
      total: result.total
    }
  } catch (error) {
    return {
      code: -1,
      message: error.message
    }
  }
}
