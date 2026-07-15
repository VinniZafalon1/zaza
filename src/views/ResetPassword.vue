<template>
  <IonPage>
    <AppHeader title="Recuperar Senha" />

    <IonContent class="ion-padding">
      <ResetPasswordForm
        @reset="handleReset"
      />
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import ResetPasswordForm from '@/components/ResetPasswordForm.vue'
import { useAuth } from '@/composables/useAuth'

import {
  IonPage,
  IonContent
} from '@ionic/vue'

const { resetPassword } = useAuth()

const handleReset = async (email: string) => {
  const exists = await resetPassword(email)

  if (exists) {
    alert('Email de recuperação enviado!')
  } else {
    alert('Email não encontrado')
  }
}
</script>
