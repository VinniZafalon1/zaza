<template>
  <IonList>
    <IonItem>
      <IonInput
        v-model="email"
        label="Email"
        type="email"
      />
    </IonItem>

    <IonItem>
      <IonInput
        v-model="senha"
        label="Senha"
        type="password"
      />
    </IonItem>

    <IonButton
      expand="block"
      class="ion-margin-top"
      @click="submit"
    >
      Entrar
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
const senha = ref('')

const emit = defineEmits(['login'])

const submit = () => {
  emit('login', {
    email: email.value,
    senha: senha.value
  })
}
</script>