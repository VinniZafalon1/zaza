<template>
  <IonPage>
    <AppHeader title="Login" />

    <IonContent class="login-page">

      <div class="login-container">

        <IonCard class="login-card">

          <IonCardContent>

            <LoginForm @login="handleLogin" />

            <IonButton
              expand="block"
              fill="outline"
              class="ion-margin-top"
              @click="router.push('/register')"
            >
              Criar Conta
            </IonButton>

            <IonButton
              expand="block"
              fill="clear"
              @click="router.push('/reset-password')"
            >
              Esqueceu a senha?
            </IonButton>

          </IonCardContent>

        </IonCard>

      </div>

    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import {
  IonPage,
  IonContent,
  IonButton,
  IonCard,
  IonCardContent
} from '@ionic/vue'

import AppHeader from '@/components/AppHeader.vue'
import LoginForm from '@/components/LoginForm.vue'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const handleLogin = (data: any) => {
  const success = login(data.email, data.senha)

  if (success) {
    router.replace('/tabs/album')
  } else {
    alert('Email ou senha inválidos')
  }
}
</script>