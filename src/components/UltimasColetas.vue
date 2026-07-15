<template>
  <IonList inset>
    <IonListHeader>Últimas coletas</IonListHeader>
    <IonItem v-for="sticker in items" :key="sticker.id">
      <IonLabel><h2>{{ sticker.nome }}</h2><p>{{ formatDate(sticker.collected_at) }}</p></IonLabel>
      <IonBadge :color="sticker.raridade === 'Brilhante' ? 'warning' : sticker.raridade === 'Rara' ? 'secondary' : 'success'">{{ sticker.raridade }}</IonBadge>
    </IonItem>
    <IonItem v-if="!items.length"><IonLabel>Nenhuma figurinha coletada ainda.</IonLabel></IonItem>
  </IonList>
</template>
<script setup lang="ts">
import { IonBadge, IonItem, IonLabel, IonList, IonListHeader } from '@ionic/vue'
defineProps<{ items: any[] }>()
const formatDate = (date: string) => date ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(date)) : ''
</script>
