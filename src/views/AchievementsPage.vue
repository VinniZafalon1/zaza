<template>
  <IonPage>
    <AppHeader title="Conquistas" />

    <IonContent class="ion-padding achievements-page">
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Progresso das Conquistas</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonProgressBar :value="progress" />
          <p class="summary">
            {{ unlockedCount }} de {{ achievements.length }} conquistas desbloqueadas
          </p>
        </IonCardContent>
      </IonCard>

      <IonCard
        v-for="achievement in achievements"
        :key="achievement.id"
        :class="{ locked: !isUnlocked(achievement) }"
      >
        <IonCardHeader>
          <div class="achievement-header">
            <IonIcon
              :icon="iconFor(achievement.icone)"
              class="achievement-icon"
            />
            <div>
              <IonCardTitle>{{ achievement.nome }}</IonCardTitle>
              <IonBadge :color="isUnlocked(achievement) ? 'success' : 'medium'">
                {{ isUnlocked(achievement) ? 'Desbloqueada' : 'Bloqueada' }}
              </IonBadge>
            </div>
          </div>
        </IonCardHeader>

        <IonCardContent>
          <p>{{ achievement.descricao }}</p>
          <p
            v-if="isUnlocked(achievement) && achievement.data_desbloqueio"
            class="unlock-date"
          >
            Desbloqueada em {{ formatDate(achievement.data_desbloqueio) }}
          </p>
        </IonCardContent>
      </IonCard>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  IonBadge,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonPage,
  IonProgressBar,
  onIonViewWillEnter
} from '@ionic/vue'
import {
  albumsOutline,
  constructOutline,
  diamondOutline,
  flagOutline,
  footballOutline,
  medalOutline,
  ribbonOutline,
  searchOutline,
  sparklesOutline,
  trendingUpOutline,
  trophyOutline
} from 'ionicons/icons'
import AppHeader from '@/components/AppHeader.vue'
import { useAuth } from '@/composables/useAuth'
import { listarConquistas } from '@/services/database'

type Achievement = {
  id: string
  nome: string
  descricao: string
  icone: string
  desbloqueada: number | string
  data_desbloqueio: string | null
}

const achievements = ref<Achievement[]>([])
const { currentUser } = useAuth()

const isUnlocked = (achievement: Achievement) => Number(achievement.desbloqueada) === 1

const unlockedCount = computed(() => achievements.value.filter(isUnlocked).length)
const progress = computed(() => achievements.value.length ? unlockedCount.value / achievements.value.length : 0)

const icons: Record<string, string> = {
  albums: albumsOutline,
  construct: constructOutline,
  diamond: diamondOutline,
  flag: flagOutline,
  football: footballOutline,
  medal: medalOutline,
  ribbon: ribbonOutline,
  search: searchOutline,
  sparkles: sparklesOutline,
  'trending-up': trendingUpOutline,
  trophy: trophyOutline
}

const iconFor = (name: string) => icons[name] || trophyOutline

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))

const loadAchievements = async () => {
  if (!currentUser.value) return
  achievements.value = await listarConquistas(currentUser.value.email)
}

onIonViewWillEnter(loadAchievements)
</script>

<style scoped>
.achievements-page ion-card {
  border-radius: 8px;
}

.achievement-header {
  align-items: center;
  display: flex;
  gap: 12px;
}

.achievement-icon {
  background: var(--ion-color-primary);
  border-radius: 8px;
  color: white;
  flex: 0 0 auto;
  font-size: 26px;
  padding: 10px;
}

.locked {
  opacity: 0.68;
}

.locked .achievement-icon {
  background: var(--ion-color-medium);
}

.summary,
.unlock-date {
  color: var(--ion-color-medium);
  margin-bottom: 0;
}
</style>
