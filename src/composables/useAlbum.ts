import { computed, ref } from 'vue'
import { stickersData } from '@/data/stickers'
import { useAuth } from './useAuth'
import { carregarAlbum, listarUltimasColetas, obterEstatisticas, salvarFavorita, salvarFigurinha } from '@/services/database'

const stickers = ref(stickersData.map(sticker => ({ ...sticker, favorite: false, collected_at: null as string | null })))
const search = ref('')
const filter = ref('all')
const statistics = ref({ total: 0, collected: 0, missing: 0, rareCollected: 0, shinyCollected: 0, percentage: 0, score: 0 })
const recentCollections = ref<any[]>([])

export function useAlbum() {
  const { currentUser } = useAuth()

  const refreshDashboard = async () => {
    if (!currentUser.value) return
    statistics.value = await obterEstatisticas(currentUser.value.email)
    recentCollections.value = await listarUltimasColetas(currentUser.value.email)
  }

  const loadAlbum = async () => {
    if (!currentUser.value) return
    const album = await carregarAlbum(currentUser.value.email)
    stickers.value.forEach(sticker => {
      const saved = album.find((item: any) => item.stickerId === sticker.id)
      sticker.coletada = !!saved?.coletada
      sticker.favorite = !!saved?.favorite
      sticker.collected_at = saved?.collected_at || null
    })
    await refreshDashboard()
  }

  const toggleCollected = async (id: number) => {
    const sticker = stickers.value.find(item => item.id === id)
    if (!sticker || !currentUser.value) return
    sticker.coletada = !sticker.coletada
    sticker.collected_at = sticker.coletada ? new Date().toISOString() : null
    await salvarFigurinha(currentUser.value.email, id, sticker.coletada)
    await refreshDashboard()
  }

  const toggleFavorite = async (id: number) => {
    const sticker = stickers.value.find(item => item.id === id)
    if (!sticker || !currentUser.value) return
    sticker.favorite = !sticker.favorite
    await salvarFavorita(currentUser.value.email, id, sticker.favorite)
  }

  const resetAlbum = () => {
    stickers.value.forEach(sticker => { sticker.coletada = false; sticker.favorite = false; sticker.collected_at = null })
    search.value = ''
    filter.value = 'all'
  }

  const filteredStickers = computed(() => stickers.value.filter(sticker => {
    const matchingSearch = !search.value || sticker.nome.toLowerCase().includes(search.value.toLowerCase()) || sticker.selecao.toLowerCase().includes(search.value.toLowerCase())
    const matchingFilter = filter.value === 'all' || (filter.value === 'collected' && sticker.coletada) || (filter.value === 'pending' && !sticker.coletada) || (filter.value === 'favorites' && sticker.favorite)
    return matchingSearch && matchingFilter
  }))

  return { stickers, search, filter, statistics, recentCollections, filteredStickers, toggleCollected, toggleFavorite, resetAlbum, loadAlbum, refreshDashboard }
}
