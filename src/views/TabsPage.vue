<template>
  <IonPage>

    <IonTabs>

      <IonRouterOutlet />

      <IonTabBar slot="bottom">

        <IonTabButton
          tab="album"
          href="/tabs/album"
        >
          <IonIcon :icon="bookOutline" />
          <IonLabel>Álbum</IonLabel>
        </IonTabButton>

        <IonTabButton
          tab="collected"
          href="/tabs/collected"
        >
          <IonIcon :icon="albumsOutline" />
          <IonLabel>Coletadas</IonLabel>
        </IonTabButton>

        <IonTabButton
          tab="profile"
          href="/tabs/profile"
        >
          <IonIcon :icon="personOutline" />
          <IonLabel>Perfil</IonLabel>
        </IonTabButton>

        <IonTabButton
          tab="about"
          href="/tabs/about"
        >
          <IonIcon :icon="informationCircleOutline" />
          <IonLabel>Sobre</IonLabel>
        </IonTabButton>

      </IonTabBar>

    </IonTabs>

  </IonPage>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel
} from '@ionic/vue'

import {
  bookOutline,
  albumsOutline,
  personOutline,
  informationCircleOutline
} from 'ionicons/icons'
</script>