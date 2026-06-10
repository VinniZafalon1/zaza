<template>
  <IonPage>
    <AppHeader title="Sobre" />

    <IonContent class="ion-padding">

      <IonCard class="about-card">

        <IonCardHeader>
          <IonCardTitle>
            Álbum de Figurinhas da Copa
          </IonCardTitle>
        </IonCardHeader>

        <IonCardContent>

          <p>
            Aplicativo desenvolvido em Vue 3 + Ionic Framework.
          </p>

          <h3>Versão</h3>
          <p>1.0.0</p>

          <IonButton
            expand="block"
            @click="router.push('/terms')"
          >
            Termo de Uso
          </IonButton>

          <IonButton
            expand="block"
            @click="router.push('/privacy')"
          >
            Política de Privacidade
          </IonButton>

        </IonCardContent>

      </IonCard>

    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import AppHeader from '@/components/AppHeader.vue'

import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton
} from '@ionic/vue'

const router = useRouter()
</script>