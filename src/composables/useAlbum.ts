import { ref, computed } from 'vue'
import { stickersData } from '../data/stickers'
import { useAuth } from './useAuth'
import {
  salvarFigurinha,
  carregarAlbum,
  listarAlbum
} from '../services/database'

const stickers = ref([...stickersData])

const search = ref('')
const filter = ref('all')

export function useAlbum() {

  const { currentUser } = useAuth()

const toggleCollected = async (id: number) => {


  const sticker = stickers.value.find(
    s => s.id === id
  )

    if (!sticker) {
  alert("Sticker não encontrado")
  return
}

if (!currentUser.value) {
  alert("Usuário nulo")
  return
}


    sticker.coletada = !sticker.coletada

    await salvarFigurinha(
      currentUser.value.email, // troque para email se necessário
      sticker.id,
      sticker.coletada
    )
    const dados = await listarAlbum()
alert(JSON.stringify(dados))
  }

  const loadAlbum = async () => {
    if (!currentUser.value) return

    const album = await carregarAlbum(
      currentUser.value.email // troque para email se necessário
    )

    stickers.value.forEach(sticker => {
      const salvo = album.find(
        (a: any) => a.stickerId === sticker.id
      )

      sticker.coletada = salvo
        ? !!salvo.coletada
        : false
    })
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
          s.nome.toLowerCase().includes(search.value.toLowerCase()) ||
          s.selecao.toLowerCase().includes(search.value.toLowerCase())
      )
    }

    if (filter.value === 'collected') {
      result = result.filter(s => s.coletada)
    }

    if (filter.value === 'pending') {
      result = result.filter(s => !s.coletada)
    }

    return result
  })

  const total = computed(() => stickers.value.length)

  const collected = computed(
    () => stickers.value.filter(
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
    resetAlbum,
    loadAlbum
  }
}