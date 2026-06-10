<template>
  <IonPage>
    <AppHeader title="Perfil" />

    <IonContent class="ion-padding">

      <IonAvatar
        style="width:120px;height:120px;margin:auto;"
      >
        <img :src="profileImage" />
      </IonAvatar>

      <input
        type="file"
        accept="image/*"
        @change="handleImage"
        style="
          display:block;
          margin:20px auto;
        "
      />

      <IonCard class="profile-card">
        <IonCardHeader>
          <IonCardTitle>
            {{ currentUser?.nome }}
          </IonCardTitle>
        </IonCardHeader>

        <IonCardContent>
          {{ currentUser?.email }}
        </IonCardContent>
      </IonCard>

      <IonButton
        color="danger"
        expand="block"
        @click="handleLogout"
      >
        Sair
      </IonButton>

    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import AppHeader from '@/components/AppHeader.vue'
import { useAuth } from '@/composables/useAuth'
import { useAlbum } from '@/composables/useAlbum'

import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonAvatar,
  alertController
} from '@ionic/vue'

const router = useRouter()

const { currentUser, logout } = useAuth()
const { resetAlbum } = useAlbum()

const profileImage = ref(
  localStorage.getItem('profileImage') ||
  'https://i.pravatar.cc/300'
)

const handleImage = (event: Event) => {
  const target = event.target as HTMLInputElement

  if (!target.files?.length) return

  const file = target.files[0]

  const reader = new FileReader()

  reader.onload = () => {
    profileImage.value = reader.result as string

    localStorage.setItem(
      'profileImage',
      profileImage.value
    )
  }

  reader.readAsDataURL(file)
}

const handleLogout = async () => {
  const alert = await alertController.create({
    header: 'Sair',
    message: 'Deseja realmente sair?',
    buttons: [
      'Cancelar',
      {
        text: 'Sair',
        role: 'destructive',
        handler: () => {
          resetAlbum()
          logout()
          router.replace('/')
        }
      }
    ]
  })

  await alert.present()
}
</script>