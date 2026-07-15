<template><IonPage><AppHeader title="Estatísticas" /><IonContent class="ion-padding"><EstatisticasCard :stats="statistics" /><RankingCard :score="statistics.score" /><UltimasColetas :items="recentCollections" /></IonContent></IonPage></template>
<script setup lang="ts">
import { onIonViewWillEnter, IonContent, IonPage } from '@ionic/vue'
import AppHeader from '@/components/AppHeader.vue'
import EstatisticasCard from '@/components/EstatisticasCard.vue'
import RankingCard from '@/components/RankingCard.vue'
import UltimasColetas from '@/components/UltimasColetas.vue'
import { useAlbum } from '@/composables/useAlbum'
const { statistics, recentCollections, refreshDashboard } = useAlbum()
onIonViewWillEnter(refreshDashboard)
</script>
