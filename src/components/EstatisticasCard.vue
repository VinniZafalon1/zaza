<template>
  <IonCard>
    <IonCardHeader><IonCardTitle>Progresso do álbum</IonCardTitle></IonCardHeader>
    <IonCardContent>
      <div class="metrics"><IonBadge color="primary">{{ stats.total }} cadastradas</IonBadge><IonBadge color="success">{{ stats.collected }} coletadas</IonBadge><IonBadge color="medium">{{ stats.missing }} faltantes</IonBadge></div>
      <IonProgressBar :value="stats.percentage / 100" color="success" class="ion-margin-vertical" />
      <strong>{{ stats.percentage }}% concluído</strong>
      <div class="metrics ion-margin-top"><IonBadge color="secondary">{{ stats.rareCollected }} raras</IonBadge><IonBadge color="warning">{{ stats.shinyCollected }} brilhantes</IonBadge></div>
    </IonCardContent>
  </IonCard>
</template>
<script setup lang="ts">
import { IonBadge, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonProgressBar } from '@ionic/vue'
defineProps<{ stats: { total: number; collected: number; missing: number; rareCollected: number; shinyCollected: number; percentage: number } }>()
</script>
<style scoped>.metrics{display:flex;gap:8px;flex-wrap:wrap}</style>
