<template>
  <IonButton fill="clear" :color="favorite ? 'warning' : 'medium'" :aria-label="favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'" @click="$emit('toggle')">
    <IonIcon :icon="favorite ? star : starOutline" />
  </IonButton>
</template>
<script setup lang="ts">
import { IonButton, IonIcon } from '@ionic/vue'
import { star, starOutline } from 'ionicons/icons'
defineProps<{ favorite: boolean }>()
defineEmits(['toggle'])
</script>
