import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getSpotList, getSpotDetail, type Spot } from '@/api/spot'

export const useSpotStore = defineStore('spot', () => {
  const spotList = ref<Spot[]>([])
  const currentSpot = ref<Spot | null>(null)
  const loading = ref(false)

  // 加载钓点列表
  async function loadList(lat?: number, lng?: number) {
    loading.value = true
    
    const res = await getSpotList({ lat, lng })
    
    if (res.code === 0) {
      spotList.value = res.data
    }
    
    loading.value = false
  }

  // 加载钓点详情
  async function loadDetail(id: string) {
    loading.value = true
    
    const res = await getSpotDetail(id)
    
    if (res.code === 0) {
      currentSpot.value = res.data
    }
    
    loading.value = false
    return res.data
  }

  return {
    spotList,
    currentSpot,
    loading,
    loadList,
    loadDetail
  }
})