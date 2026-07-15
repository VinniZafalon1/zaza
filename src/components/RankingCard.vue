<template>
  <IonCard>
    <IonCardHeader><IonCardTitle>Ranking de colecionador</IonCardTitle></IonCardHeader>
    <IonCardContent>
      <IonBadge color="warning">{{ level }}</IonBadge><p>{{ score }} pontos</p>
      <IonProgressBar :value="progress" color="warning" />
      <small>{{ nextText }}</small>
    </IonCardContent>
  </IonCard>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { IonBadge, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonProgressBar } from '@ionic/vue'
const props = defineProps<{ score: number }>()
const level = computed(() => props.score > 500 ? 'Diamante' : props.score > 250 ? 'Ouro' : props.score > 100 ? 'Prata' : 'Bronze')
const threshold = computed(() => props.score <= 100 ? 101 : props.score <= 250 ? 251 : props.score <= 500 ? 501 : 501)
const previous = computed(() => props.score <= 100 ? 0 : props.score <= 250 ? 101 : props.score <= 500 ? 251 : 501)
const progress = computed(() => level.value === 'Diamante' ? 1 : Math.min(1, (props.score - previous.value) / (threshold.value - previous.value)))
const nextText = computed(() => level.value === 'Diamante' ? 'Nível máximo alcançado' : `${threshold.value - props.score} pontos para o próximo nível`)
</script>
