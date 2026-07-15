<template>
  <IonCard class="sticker-card">

    <img
      :src="sticker.foto"
      class="sticker-image"
    />

    <IonCardHeader>

      <FavoriteButton :favorite="sticker.favorite" @toggle="$emit('favorite', sticker.id)" />

      <IonCardTitle>
        {{ sticker.nome }}
      </IonCardTitle>

      <IonCardSubtitle>
        {{ sticker.selecao }}
      </IonCardSubtitle>

    </IonCardHeader>

    <IonCardContent>

      <IonBadge
        :color="raridadeColor"
        class="ion-margin-end"
      >
        {{ sticker.raridade }}
      </IonBadge>

      <IonBadge
        :color="
          sticker.coletada
            ? 'success'
            : 'medium'
        "
      >
        {{
          sticker.coletada
            ? 'Coletada'
            : 'Pendente'
        }}
      </IonBadge>

<IonButton
  expand="block"
  class="ion-margin-top"
  @click="$emit('toggle', sticker.id)"
>
  {{
    sticker.coletada
      ? 'Remover'
      : 'Coletar'
  }}
</IonButton>

<IonButton fill="outline" expand="block" :router-link="`/tabs/sticker/${sticker.id}`">
  Ver detalhes
</IonButton>

    </IonCardContent>

  </IonCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import FavoriteButton from './FavoriteButton.vue'
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge,
  IonButton
} from '@ionic/vue'

const props = defineProps<{
  sticker: any
}>()

defineEmits(['toggle', 'favorite'])

const raridadeColor = computed(() => {
  switch (props.sticker.raridade) {
    case 'Brilhante':
      return 'warning'

    case 'Rara':
      return 'secondary'

    default:
      return 'success'
  }
})
</script>

<style scoped>
.sticker-card {
  text-align: center;
}

.sticker-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  margin: 16px auto;
  display: block;
}
</style>
