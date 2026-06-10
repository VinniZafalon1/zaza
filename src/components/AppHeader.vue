<template>
  <IonHeader>
    <IonToolbar>
      <IonTitle>
        {{ title }}
      </IonTitle>
    </IonToolbar>
  </IonHeader>
</template>

<script setup lang="ts">
import {
  IonHeader,
  IonToolbar,
  IonTitle
} from '@ionic/vue'

defineProps<{
  title: string
}>()
</script>