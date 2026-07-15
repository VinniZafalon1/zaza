<template>
  <IonPage>
    <AppHeader title="Cadastro" />

    <IonContent class="ion-padding">
      <RegisterForm
        @register="handleRegister"
      />

      <IonButton
        expand="block"
        fill="outline"
        class="ion-margin-top"
        @click="router.push('/')"
      >
        Voltar para Login
      </IonButton>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import RegisterForm from '@/components/RegisterForm.vue'
import AppHeader from '@/components/AppHeader.vue'
import { useAuth } from '@/composables/useAuth'

import {
  IonPage,
  IonContent,
  IonButton
} from '@ionic/vue'

const router = useRouter()
const { register } = useAuth()

const handleRegister = async (data: any) => {
  if (data.senha.length < 6) {
    alert('A senha precisa ter pelo menos 6 caracteres')
    return
  }

const success = await register(
  data.nome,
  data.email,
  data.senha
)

if (!success) {
  alert('Este email já está cadastrado')
  return
}

alert('Cadastro realizado!')

router.push('/')
}
</script>
