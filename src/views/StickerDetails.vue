<template>
  <IonPage><AppHeader title="Detalhes da figurinha" /><IonContent class="ion-padding" v-if="sticker">
    <IonCard><img :src="sticker.foto" class="photo" /><IonCardHeader><IonCardTitle>{{ sticker.nome }}</IonCardTitle><IonCardSubtitle>{{ sticker.selecao }} · {{ sticker.raridade }}</IonCardSubtitle></IonCardHeader>
      <IonCardContent><p v-if="sticker.coletada">Coletada em: {{ formatDate(sticker.collected_at) }}</p><p v-else>Esta figurinha ainda não foi coletada.</p>
        <IonButton expand="block" @click="toggleCollected(sticker.id)">{{ sticker.coletada ? 'Remover da coleção' : 'Coletar figurinha' }}</IonButton>
        <FavoriteButton :favorite="sticker.favorite" @toggle="toggleFavorite(sticker.id)" />
      </IonCardContent></IonCard>
  </IonContent></IonPage>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonPage } from '@ionic/vue'
import AppHeader from '@/components/AppHeader.vue'
import FavoriteButton from '@/components/FavoriteButton.vue'
import { useAlbum } from '@/composables/useAlbum'
const route = useRoute(); const { stickers, toggleCollected, toggleFavorite } = useAlbum()
const sticker = computed(() => stickers.value.find(item => item.id === Number(route.params.id)))
const formatDate = (date: string | null) => date ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date)) : ''
</script>
<style scoped>.photo{display:block;width:160px;height:160px;object-fit:cover;border-radius:50%;margin:20px auto}</style>
