<template>
  <IonPage>
    <AppHeader title="Coletadas" />

    <IonContent class="ion-padding">
      <StickerList
        :stickers="collectedOnly"
        @toggle="toggleCollected"
        @favorite="toggleFavorite"
      />
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import AppHeader from '@/components/AppHeader.vue'
import StickerList from '@/components/StickerList.vue'
import { useAlbum } from '@/composables/useAlbum'

import {
  IonPage,
  IonContent
} from '@ionic/vue'

const {
  stickers,
  toggleCollected,
  toggleFavorite
} = useAlbum()

const collectedOnly = computed(() =>
  stickers.value.filter(
    s => s.coletada
  )
)
</script>
