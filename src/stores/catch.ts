import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCatchList, createCatch, deleteCatch, type CatchRecord } from '@/api/catch'

export const useCatchStore = defineStore('catch', () => {
  const catchList = ref<CatchRecord[]>([])
  const loading = ref(false)
  const page = ref(1)
  const total = ref(0)

  // 加载渔获列表
  async function loadList(reset = false) {
    if (loading.value) return
    
    if (reset) {
      page.value = 1
      catchList.value = []
    }
    
    loading.value = true
    
    const res = await getCatchList({
      page: page.value,
      pageSize: 10
    })
    
    if (res.code === 0) {
      if (reset) {
        catchList.value = res.data.list
      } else {
        catchList.value.push(...res.data.list)
      }
      total.value = res.data.total
      page.value++
    }
    
    loading.value = false
  }

  // 创建渔获
  async function addCatch(data: Partial<CatchRecord>) {
    const res = await createCatch(data)
    if (res.code === 0) {
      // 刷新列表
      await loadList(true)
      return res.data
    }
    return null
  }

  // 删除渔获
  async function removeCatch(id: string) {
    const res = await deleteCatch(id)
    if (res.code === 0) {
      catchList.value = catchList.value.filter(c => c.id !== id)
      return true
    }
    return false
  }

  return {
    catchList,
    loading,
    total,
    loadList,
    addCatch,
    removeCatch
  }
})