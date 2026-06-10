<template>
  <IonPage>
    <AppHeader title="Termo de Uso" />

    <IonContent class="ion-padding">

      <IonCard class="about-card">

        <IonCardHeader>
          <IonCardTitle>
            Termo de Uso
          </IonCardTitle>
        </IonCardHeader>

        <IonCardContent>

          <p>
            Bem-vindo ao aplicativo Álbum de Figurinhas da Copa.
          </p>

          <p>
            Este aplicativo foi desenvolvido exclusivamente para fins acadêmicos e educacionais.
          </p>

          <p>
            O usuário concorda em utilizar a aplicação de forma adequada, respeitando suas funcionalidades e objetivos.
          </p>

          <p>
            Não há coleta de dados externos nem armazenamento permanente de informações.
          </p>

          <p>
            Todas as informações são mantidas apenas durante a utilização da aplicação.
          </p>

          <p>
            Versão 1.0.0
          </p>

          <IonButton
            expand="block"
            @click="router.back()"
          >
            Voltar
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