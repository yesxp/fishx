// 互动相关 API（点赞/评论）

export interface Comment {
  id: string
  userId: string
  nickname: string
  avatar: string
  content: string
  time: string
}

// 点赞
export async function toggleLike(catchId: string, userId: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: {
          liked: Math.random() > 0.5,
          count: Math.floor(Math.random() * 100) + 10
        }
      })
    }, 200)
  })
}

// 获取评论列表
export async function getComments(catchId: string) {
  // 模拟数据
  const mockComments: Comment[] = [
    {
      id: '1',
      userId: 'user1',
      nickname: '钓鱼老王',
      avatar: '🎣',
      content: '大丰收啊！在哪里钓的？',
      time: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: '2',
      userId: 'user2',
      nickname: '鱼乐无穷',
      avatar: '🐠',
      content: '厉害了，这条鲫鱼真大！',
      time: new Date(Date.now() - 3600000).toISOString()
    },
  ]
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: mockComments
      })
    }, 300)
  })
}

// 发表评论
export async function addComment(catchId: string, content: string, userId: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: {
          id: 'comment_' + Date.now(),
          userId,
          nickname: '我',
          avatar: '🎣',
          content,
          time: new Date().toISOString()
        }
      })
    }, 300)
  })
}

// 删除评论
export async function deleteComment(commentId: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 0, message: '删除成功' })
    }, 200)
  })
}