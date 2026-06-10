<template>
  <IonList>
    <IonItem>
      <IonInput
        v-model="email"
        label="Email"
        type="email"
      />
    </IonItem>

    <IonButton
      expand="block"
      class="ion-margin-top"
      @click="submit"
    >
      Enviar Recuperação
    </IonButton>
  </IonList>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import {
  IonList,
  IonItem,
  IonInput,
  IonButton
} from '@ionic/vue'

const email = ref('')

const emit = defineEmits(['reset'])

const submit = () => {
  emit('reset', email.value)
}
</script>