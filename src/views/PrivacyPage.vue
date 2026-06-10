<template>
  <IonPage>
    <AppHeader title="Política de Privacidade" />

    <IonContent class="ion-padding">

      <IonCard class="about-card">

        <IonCardHeader>
          <IonCardTitle>
            Política de Privacidade
          </IonCardTitle>
        </IonCardHeader>

        <IonCardContent>

          <p>
            O aplicativo Álbum de Figurinhas da Copa respeita a privacidade dos usuários.
          </p>

          <p>
            Nenhuma informação pessoal é enviada para servidores externos.
          </p>

          <p>
            Os dados de cadastro são utilizados apenas para simulação do sistema de autenticação.
          </p>

          <p>
            As informações permanecem apenas em memória local durante a execução da aplicação.
          </p>

          <p>
            Não são utilizados cookies, rastreadores ou ferramentas de coleta de dados.
          </p>

          <p>
            Em caso de dúvidas, entre em contato com os desenvolvedores do projeto.
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