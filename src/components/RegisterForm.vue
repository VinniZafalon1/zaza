<template>
  <IonList>
    <IonItem>
      <IonInput
        v-model="nome"
        label="Nome Completo"
      />
    </IonItem>

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
      Cadastrar
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

const nome = ref('')
const email = ref('')
const senha = ref('')

const emit = defineEmits(['register'])

const submit = () => {
  emit('register', {
    nome: nome.value,
    email: email.value,
    senha: senha.value
  })
}
</script>