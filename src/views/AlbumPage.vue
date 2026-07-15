<template>
  <IonPage>
    <AppHeader title="Álbum" />

    <IonContent class="ion-padding">

      <div class="album-progress">
        <IonBadge color="success">
          {{ statistics.collected }}/{{ statistics.total }}
        </IonBadge>
      </div>

      <IonCard>
        <IonCardContent>
          <h2>Total: {{ statistics.total }}</h2>
          <h2>Coletadas: {{ statistics.collected }}</h2>
          <h2>Faltam: {{ statistics.missing }}</h2>
        </IonCardContent>
      </IonCard>

      <IonSearchbar
        v-model="search"
        placeholder="Pesquisar jogador ou seleção"
      />

      <IonSegment v-model="filter">

        <IonSegmentButton value="all">
          <IonLabel>Todas</IonLabel>
        </IonSegmentButton>

        <IonSegmentButton value="collected">
          <IonLabel>Coletadas</IonLabel>
        </IonSegmentButton>

        <IonSegmentButton value="pending">
        <IonLabel>Pendentes</IonLabel>
        </IonSegmentButton>

        <IonSegmentButton value="favorites">
          <IonLabel>Favoritas</IonLabel>
        </IonSegmentButton>

      </IonSegment>

      <StickerList
        :stickers="filteredStickers"
        @toggle="toggleCollected"
        @favorite="toggleFavorite"
      />

    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import StickerList from '@/components/StickerList.vue'
import { useAlbum } from '@/composables/useAlbum'

import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonBadge,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel
} from '@ionic/vue'

const album = useAlbum()

const {
  search,
  filter,
  statistics,
  filteredStickers,
  toggleFavorite
} = album

const toggleCollected = async (id: number) => {


  await album.toggleCollected(id)
}
</script>
