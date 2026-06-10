import { ref, computed } from 'vue'
import { stickersData } from '../data/stickers'

const stickers = ref([...stickersData])

const search = ref('')
const filter = ref('all')

export function useAlbum() {
  const toggleCollected = (id: number) => {
    const sticker = stickers.value.find(
      s => s.id === id
    )

    if (sticker) {
      sticker.coletada = !sticker.coletada
    }
  }

  const resetAlbum = () => {
    stickers.value.forEach(sticker => {
      sticker.coletada = false
    })

    search.value = ''
    filter.value = 'all'
  }

  const filteredStickers = computed(() => {
    let result = [...stickers.value]

    if (search.value) {
      result = result.filter(
        s =>
          s.nome
            .toLowerCase()
            .includes(search.value.toLowerCase()) ||
          s.selecao
            .toLowerCase()
            .includes(search.value.toLowerCase())
      )
    }

    if (filter.value === 'collected') {
      result = result.filter(
        s => s.coletada
      )
    }

    if (filter.value === 'pending') {
      result = result.filter(
        s => !s.coletada
      )
    }

    return result
  })

  const total = computed(
    () => stickers.value.length
  )

  const collected = computed(
    () =>
      stickers.value.filter(
        s => s.coletada
      ).length
  )

  return {
    stickers,
    search,
    filter,
    total,
    collected,
    filteredStickers,
    toggleCollected,
    resetAlbum
  }
}